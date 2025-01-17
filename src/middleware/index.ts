import passport from "passport";
import { findUserById } from "../controller/repositories";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { SafeUserPayload } from "../types";

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (jwtPayload, done) => {
      try {
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

export const authMiddleware = passport.authenticate("jwt", { session: false });
