import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createUser, findUserByEmail, findUserById } from "../controller/repositories";
import bcrypt from "bcrypt";
import { SafeUserPayload, UserPayload } from "../types";
import { generateTokens } from "./jwt";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";

const initializeLocalPassport = () => {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        const userExisted = await findUserByEmail(email);
        if (!userExisted || !userExisted.profile) {
          return done(null, false, { message: "User not found" });
        }

        const isPwValid = await bcrypt.compare(password, userExisted.password);
        if (!isPwValid) {
          return done(null, false, { message: "Password is not valid" });
        }
        const { accessToken, refreshToken } = await generateTokens({
          id: userExisted.id.toString(),
          role: userExisted.profile.role!,
        });
        const filterUser = {
          id: userExisted.id,
          accessToken,
          refreshToken,
        };
        return done(null, filterUser);
      }
    )
  );
  passport.serializeUser((user: Express.User, done) => {
    done(null, (user as UserPayload).id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await findUserById(id);
      if (!user) return done(null, false);

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.name,
        image: user.image,
        role: user.role,
      } as SafeUserPayload;

      done(null, safeUser);
    } catch (error) {
      done(error);
    }
  });
};


passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (jwtPayload, done) => {
      try {
        if (!jwtPayload.id)
          return done(null, false, { message: "Unauthorized" });
        const user = await findUserById(jwtPayload.id);
        if (!user) return done(null, false, { message: "User not found" });
        const safeUser = {
          id: user.id,
          image: user.image,
          username: user.name,
          email: user.email,
        } as SafeUserPayload;

        return done(null, safeUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userExisted = await findUserByEmail(email);
      if (userExisted) {
        return done(null, false, { message: "User already exists" });
      }
      const hashPw = await bcrypt.hash(password, 10);
      const user = await createUser({
        email,
        password: hashPw,
        name: req.body.name,
      });
      if (!user) return done(null, false, { message: "Failed to create user" });
      const { accessToken, refreshToken } = await generateTokens({
        id: user.id.toString(),
        role: user.role!,
      });
      const filterUser = {
        id: user.id,
        accessToken,
        refreshToken,
      };
      return done(null, filterUser);
    }
  )
)

export default initializeLocalPassport;
