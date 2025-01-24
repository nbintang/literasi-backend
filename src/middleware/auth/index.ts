import passport from "passport";
import { UserPayload } from "@/types";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = (strategy: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      strategy,
      { failWithError: true },
      (err: Error, user: UserPayload, info: any) => {
        if (err) return next(err);
        if (!user) {
          res.status(401).json({ success: false, message: info.message });
          return;
        }

        req.user = user;
        return next();
      }
    )(req, res, next);
  };
};

export const forAdminOnlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req.user as UserPayload).role !== "ADMIN") {
    res.status(403).json({ success: false, message: "Forbidden" });
    return;
  }
  next();
};
