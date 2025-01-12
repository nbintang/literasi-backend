import { Request, Response } from "express";
import { findUserById, findUsers } from "../repositories/users.repository";
import { handleErrorResponse } from "../../helper/error-response";

export async function getUsers(req: Request, res: Response) {
  const users = await findUsers();
  res.status(200).json({ success: true, data: users });
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    const error = new Error("Invalid user id");
    return handleErrorResponse(res, error);
  }

  const user = await findUserById(Number(id));

  if (!user) {
    const error = new Error("User not found");
    return handleErrorResponse(res, error, 404);
  }

  res.status(200).json({ success: true, data: user });
}
