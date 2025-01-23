import { NextFunction, Request, Response } from "express";

export class PayloadError extends Error {
  public status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: PayloadError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) return next(err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}

