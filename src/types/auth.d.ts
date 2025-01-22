import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      user?: SafeUserPayload | UserPayload; // Extend the Request type with the `user` property
    }
  }
}
export interface RequestWithToken extends Request {
  cookies: {
    refreshToken?: string;
  };
}

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
  isVerified?: boolean;
}
export interface UserPayload {
  id: string;
  email: string;
  username: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
}

export interface SafeUserPayload  {
  id: string;
  image?: string;
  email?: string;
  username?: string;
}
