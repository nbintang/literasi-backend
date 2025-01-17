import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserByEmail, findUserById } from "../controller/repositories";
import bcrypt from "bcrypt";
import { SafeUserPayload, UserPayload } from "../types";


const initializeLocalPassport = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const userExisted = await findUserByEmail(email);
          if (!userExisted || !userExisted.profile) {
            return done(null, false, { message: "User not found" });
          }

          const isPwValid = await bcrypt.compare(
            password,
            userExisted.password
          );
          if (!isPwValid) {
            return done(null, false, { message: "Password is not valid" });
          }
          const filterUser  = {
            id: userExisted.id,
            email: userExisted.email,
            username: userExisted.name,
            role: userExisted.profile.role,
          };
          return done(null, filterUser);
        } catch (error) {
          return done(error);
        }
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

export default initializeLocalPassport;
