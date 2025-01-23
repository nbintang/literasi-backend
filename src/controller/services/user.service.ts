import { NextFunction, Request, Response } from "express";
import { findUserById, findUsers } from "@/controller/repositories";
import { PayloadError } from "@/helper/error-response";

export async function getUsers(req: Request, res: Response) {
  const users = await findUsers();
  res.status(200).json({ success: true, data: users });
}

export async function getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
try {
  const { id } = req.params;

  if (!id) throw new PayloadError("User id not found", 404);

  const user = await findUserById(id)
  if (!user) throw new PayloadError("User not found", 404);


  res.status(200).json({ success: true, data: user });
} catch (error) {
  next(error);
}
}
