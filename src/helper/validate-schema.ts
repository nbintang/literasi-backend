import { NextFunction, Request, Response } from "express";
import * as z from "zod";

export function validateSchema(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          message: `${err.path.join(".")}: ${err.message}`,
        }));
        res.status(400).json({ success: false, messages: errorMessages });
      } else {
        res.status(500).json({ success: false, messages: error });
      }
    }
  };
}
