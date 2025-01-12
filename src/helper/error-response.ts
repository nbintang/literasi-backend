import { Response } from "express";

export function handleErrorResponse(
  res: Response,
  error: Error,
  status?: number
) {
  res.status(status || 500).json({ success: false, message: error.message });
}
