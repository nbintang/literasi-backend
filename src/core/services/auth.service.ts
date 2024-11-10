import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { createUser, findUserByEmail } from "../repositories/users.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../helper/jwt";
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
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isPwValid = await bcrypt.compare(password, userExisted.password);
    if (!isPwValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }
    const accessToken = await generateAccessToken({ id: userExisted.id.toString() });
    const refreshToken = await generateRefreshToken({ id: userExisted.toString()});
    res.cookie("refreshToken", refreshToken, {
      sameSite: "lax",
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json({ success: true, message: "Welcome!...", accessToken, refreshToken });
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
    res.status(401).json({ message: "Refresh token not found" });
    return;
  }

  try {
    const decode = (await verifyToken(refreshToken)) as CustomJwtPayload;
    const accessToken = await generateAccessToken({
      id: decode.id.toString(),
      time: "15s",
    });
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.clearCookie("refreshToken");
    handleErrorResponse(res, error as Error);
  }
}


export async function signOut (req: Request, res:Response) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token not found" });
    return;
  }
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Sign out successfully" });
}