import { NextFunction, Request, Response } from "express";
import { handleErrorResponse } from "../helper/error-response";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../types";
interface RequestWithToken extends Request {
  id?: string;
}
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")!.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      (req as RequestWithToken).id = (user as CustomJwtPayload).id;

      next();
    });
  } catch (error) {
    handleErrorResponse(res, error as Error);
  }
}
