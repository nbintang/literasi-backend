import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../repositories/users.repository";
import { signJwt } from "../../helper/sign-jwt";

export async function signUp(req: Request, res: Response) {
  const { email, password, name } = req.body;
  const hashPw = await bcrypt.hash(password, 10);
  const user = await createUser({ email, password: hashPw, name });
  res.status(201).json({ message: "User created", data: user });
}

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;
  const userExisted = await findUserByEmail(email);
  if (!userExisted) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const isPwValid = await bcrypt.compare(password, userExisted.password);
  if (!isPwValid) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }
  const token = await signJwt({ id: userExisted.id });
  res.status(200).json({ token });
}
