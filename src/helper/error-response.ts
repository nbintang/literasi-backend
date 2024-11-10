import { Response } from "express";

export function handleErrorResponse(res: Response, error: Error) {
    res.status(500).json({ message: error.message });
  }