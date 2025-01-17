
import { Request, Response } from "express";
import passport from "passport";
import { UserPayload } from "../types";

export default async function authenticateUser(
  req: Request,
  res: Response
): Promise<UserPayload> {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "local",
      (err: Error, user: UserPayload, info: { message: string }) => {
        if (err) return reject(new Error(err.message));
        if (!user) return reject(new Error(info.message));
        resolve(user);
      }
    )(req, res);
  });
}

