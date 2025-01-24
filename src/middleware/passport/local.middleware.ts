import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  createUser,
  findUserByEmailWithProfile,
  findUserById,
} from "@/controller/repositories";
import bcrypt from "bcrypt";
import { SafeUserPayload, UserPayload } from "@/types";
import { generateTokens } from "@/lib/jwt";
import { Application } from "express";


export const localConfigMiddleware  = (app: Application) => {
    
passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        const userExisted = await findUserByEmailWithProfile(email);
        if (  !userExisted) {
          return done(null, false, { message: "User not found" });
        }
        const isPwValid = await bcrypt.compare(password, userExisted.password);
        if (!isPwValid) {
          return done(null, false, { message: "Incorrect Password" });
        }

        if (!userExisted.isVerified) {
          return done(null, false, { message: "Please verify your email" });
        }
        const { accessToken, refreshToken } = await generateTokens({
          id: userExisted.id.toString(),
          role: userExisted?.profile?.role || "USER",
          isVerified: userExisted.isVerified,
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

      const safeUser: SafeUserPayload = {
        id: user.id,
        email: user.email,
        username: user.name,
        image: user.image || "",
        role: user.role || "USER",
      };

      done(null, safeUser);
    } catch (error) {
      done(error);
    }
  });



  app.use(passport.initialize());
  app.use(passport.session());
}