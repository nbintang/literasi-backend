import { Request, Response } from "express";
import { findUserById, findUsers } from "../repositories/users.repository";

export async function getUsers(req: Request, res: Response) {
  const users = await findUsers();
  res.status(200).json(users);
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  const user = await findUserById(Number(id));
  res.status(200).json({ success: true, data: user });
}

