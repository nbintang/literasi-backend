import { NextFunction, Request, Response } from "express";
import { handleErrorResponse } from "../helper/error-response";
import jwt from "jsonwebtoken";
import { CustomJwtPayload, RequestWithPayload } from "../types";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      (req as RequestWithPayload).id = (user as CustomJwtPayload).id;
      (req as RequestWithPayload).role = (user as CustomJwtPayload).role;
      next();
    });
  } catch (error) {
    handleErrorResponse(res, error as Error);
  }
}
