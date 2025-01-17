import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { createUser, findUserByEmail } from "../repositories";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyToken,
} from "../../lib/jwt";
import { CustomJwtPayload, RequestWithToken } from "../../types";
import { handleErrorResponse } from "../../helper/error-response";
import authenticateUser from "../../helper/authenticate-user";

export async function signUp(req: Request, res: Response) {
  const { email, password, name } = req.body;
  const userExists = await findUserByEmail(email);
  if (userExists)
    return handleErrorResponse(res, new Error("User already exists"));
  try {
    const hashPw = await bcrypt.hash(password, 10);
    const user = await createUser({ email, password: hashPw, name });

    if (!user)
      return handleErrorResponse(res, new Error("Failed to create signup"));
    req.logIn(user, (err) => {
      if (err) {
        return handleErrorResponse(res, err);
      }
      res.status(200).json({
        success: true,
        message: "Welcome!...",
        user,
      });
    });
  } catch (error) {
    handleErrorResponse(res, error as Error);
  }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  const user = await authenticateUser(req, res);

  try {
    const { accessToken, refreshToken } = await generateTokens({
      id: user.id.toString(),
      role: user.role!,
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
