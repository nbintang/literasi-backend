import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import {
  createUser,
  findEmailWithToken,
  findUserByEmailWithProfile,
  updateUserVerifyStatus,
  createToken,
  deleteAllTokensByIdentifier,
  findTokenByIdentifier,
} from "@/controller/repositories";
import { generateAccessToken, verifyToken } from "@/lib/jwt";
import { CustomJwtPayload, RequestWithToken } from "@/types";
import { PayloadError } from "@/helper/error-response";
import { generateOtps } from "@/helper/otp";
import sendEmail from "@/lib/mail";

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const { email, password, name } = req.body;
  try {
    const userExists = await findUserByEmailWithProfile(email);
    if (userExists) throw new PayloadError("User already exists", 400);
    const hashPw = await bcrypt.hash(password, 10);
    const user = await createUser({ email, password: hashPw, name });
    if (!user) throw new PayloadError("Sign up failed", 500);
    const { otp, expiresAt } = generateOtps();
    const hashOtp = await bcrypt.hash(otp, 10);
    await createToken(hashOtp, user.id.toString(), expiresAt);

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Hi ${name},\n\nPlease verify your email by entering the following OTP: ${otp}\n\nBest regards,\nYour Team`,
    });
    res
      .status(200)
      .json({ success: true, message: "Please check your email to verify" });
  } catch (error) {
    next(error);
  }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if (!user) throw new PayloadError("Unauthorized", 401);
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
    if (!refreshToken) throw new PayloadError("Refresh token not found", 404);
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
    if (!refreshToken) throw new PayloadError("Refresh token not found", 404);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Sign out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmailToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, token } = req.body;
  try {
    const user = await findEmailWithToken(email);
    if (!user) throw new PayloadError("Sign up failed, Please to sign up first", 404);
    if (user.isVerified) throw new PayloadError("Email already verified", 400);

    const existedToken = await findTokenByIdentifier(user.email);
    if (!existedToken) throw new PayloadError("Token not found", 404);

    const isTokenExpired = existedToken.expiresAt < new Date();
    if (isTokenExpired) throw new PayloadError("Token expired", 400);

    const isTokenValid = await bcrypt.compare(token, existedToken.token);
    if (!isTokenValid) throw new PayloadError("Invalid token", 400);

    await updateUserVerifyStatus(user.id, isTokenValid);
    await deleteAllTokensByIdentifier(user.email);

    res.status(200).json({
      success: true,
      message: "Email verified successfully, Try to sign in",
    });
  } catch (error) {
    next(error);
  }
}

export async function resendEmailToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = req.body;
  try {
    const user = await findEmailWithToken(email);
    if (!user) throw new PayloadError("User not found", 404);
    if (user.isVerified) throw new PayloadError("Email already verified", 400);

    const { otp, expiresAt } = generateOtps();

    await deleteAllTokensByIdentifier(user.email);

    const hashOtp = await bcrypt.hash(otp, 10);
    await createToken(hashOtp, user.id.toString(), expiresAt);

    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      text: `Your verification code is ${otp}`,
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully, please check your email",
    });
  } catch (error) {
    next(error);
  }
}
