import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { createUser, findUserByEmail } from "../repositories/users.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../lib/jwt";
import { CustomJwtPayload, RequestWithToken } from "../../types";
import { handleErrorResponse } from "../../helper/error-response";

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

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const userExisted = await findUserByEmail(email);
    if (!userExisted) {
      const error = new Error("User not found");
      return handleErrorResponse(res, error, 404);
    }
    const isPwValid = await bcrypt.compare(password, userExisted.password);
    if (!isPwValid) {
      const error = new Error("Invalid password");
      return handleErrorResponse(res, error, 401);
    }
    const id = userExisted.id.toString();
    const accessToken = await generateAccessToken({
      id,
      role: userExisted.role,
    });
    const refreshToken = await generateRefreshToken({
      id,
      role: userExisted.role,
    });
    res.cookie("refreshToken", refreshToken, {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });
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
    // Verify and decode the refresh token
    const decode = (await verifyToken(refreshToken)) as CustomJwtPayload;

    // Generate new access token
    const accessToken = await generateAccessToken({
      id: decode.id.toString(),
      role: decode.role,
    });

    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    // Clear the refresh token if invalid
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
  res.status(200).json({ message: "Sign out successfully" });
}
