import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { createUser } from "../repositories";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../lib/jwt";
import { CustomJwtPayload, RequestWithToken } from "../../types";
import { handleErrorResponse } from "../../helper/error-response";
import passport from "passport";
import { User } from "@prisma/client";

export async function signUp(req: Request, res: Response) {
  const { email, password, name } = req.body;
  try {
    const hashPw = await bcrypt.hash(password, 10);
    const user = await createUser({ email, password: hashPw, name });
    res.status(201).json({ message: "User created", data: user });
  } catch (error) {
    handleErrorResponse(res, error as Error);
  }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", async (err: any, user: User, info: any) => {
    if (err) {
      const error = new Error(err.message);
      return handleErrorResponse(res, error,);
    }

    if (!user) {
      const error = new Error(info.message);
      return handleErrorResponse(res, error, 401);
    }

    try {
      const accessToken = await generateAccessToken({
        id: user.id.toString(),
        role: user.role,
      });

      const refreshToken = await generateRefreshToken({
        id: user.id.toString(),
        role: user.role,
      });

      if (accessToken && refreshToken) {
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
          maxAge: 24 * 60 * 60 * 1000,
        });
      }
      res.status(200).json({
        success: true,
        message: "Welcome!...",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      handleErrorResponse(res, error as Error);
    }
  })(req, res, next);
}

export async function refreshAccessToken(
  req: RequestWithToken,
  res: Response,
  next: NextFunction
) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    const error = new Error("Refresh token not found");
    return handleErrorResponse(res, error, 404);
  }

  try {
    const decode = (await verifyToken(refreshToken)) as CustomJwtPayload;

    const accessToken = await generateAccessToken({
      id: decode.id.toString(),
      role: decode.role,
    });

    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.clearCookie("refreshToken");
    return handleErrorResponse(res, error as Error, 401);
  }
}

export async function signOut(req: Request, res: Response) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    const error = new Error("Refresh token not found");
    return handleErrorResponse(res, error, 404);
  }
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Sign out successfully" });
}
