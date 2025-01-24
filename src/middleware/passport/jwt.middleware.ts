import passport from "passport";
import {
  findUserById,
} from "@/controller/repositories";
import { SafeUserPayload, UserPayload } from "@/types";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";


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
        const safeUser: SafeUserPayload = {
          id: user.id,
          image: user.image || "",
          username: user.name,
          email: user.email,
          role: user.role || "USER",
        } ;

        return done(null, safeUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);
