import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { createUser, findUserByEmail } from "@/controller/repositories";
import { generateAccessToken, verifyToken } from "@/lib/jwt";
import { CustomJwtPayload, RequestWithToken } from "@/types";
import { CustomError } from "@/helper/error-response";

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const { email, password, name } = req.body;
  const userExists = await findUserByEmail(email);
  try {
    if (userExists) throw new CustomError("User already exists", 400);
    const hashPw = await bcrypt.hash(password, 10);
    const user = await createUser({ email, password: hashPw, name });

    if (!user) throw new CustomError("User not created", 500);
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(200).json({
        success: true,
        message: "Welcome!...",
        user,
      });
    });
  } catch (error) {
    console.error("Error in 'signUp", error); // Log the error to check its details
    next(error);
  }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if (!user) throw new CustomError("Unauthorized", 401);
    if ("accessToken" in user && "refreshToken" in user) {
      const { accessToken, refreshToken } = user;

      if (accessToken && refreshToken) {
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
          success: true,
          message: "Welcome!...",
          accessToken,
          refreshToken,
        });
      }
    }
  } catch (error) {
    console.error("Error in 'signIn", error); // Log the error to check its details
    next(error);
  }
}

export async function refreshAccessToken(
  req: RequestWithToken,
  res: Response,
  next: NextFunction
) {
  const { refreshToken } = req.cookies;
  try {
    if (!refreshToken) throw new CustomError("Refresh token not found", 404);
    const decode = (await verifyToken(refreshToken)) as CustomJwtPayload;

    const accessToken = await generateAccessToken({
      id: decode.id.toString(),
      role: decode.role,
    });

    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    next(error);
  }
}

export async function signOut(req: Request, res: Response, next: NextFunction) {
try {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new CustomError("Refresh token not found", 404);
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Sign out successfully" });
} catch (error) {
  next(error)
}
}
