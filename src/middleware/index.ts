import passport from "passport";
import { findUserById } from "../controller/repositories";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (jwtPayload, done) => {
      try {
        const user = await findUserById(Number(jwtPayload.id));
        if (!user) return done(null, false, { message: "User not found" });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export const authMiddleware = passport.authenticate("jwt", { session: false });
