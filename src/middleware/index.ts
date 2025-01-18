import passport from "passport";
import { UserPayload } from "../types";
import { NextFunction, Request, Response } from "express";
import { handleErrorResponse } from "../helper/error-response";

const authMiddleware = (strategy: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      strategy,
      { failWithError: true },
      (err: Error, user: UserPayload, info: any) => {
        if (err) return next(err);
        if (!user) {
          return handleErrorResponse(res, new Error("Unauthorized"), 401);
        }
        req.user = user;
        return next();
      }
    )(req, res, next);
  };
};

export default authMiddleware;
