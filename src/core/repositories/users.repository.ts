import { InputUserProps } from "../../types";
import { db } from "../db";

export const findUsers = async () =>
  await db.user.findMany({ where: { role: "USER" } });

export const findUserById = async (id: number) =>
  await db.user.findUnique({ where: { id }, include: { orders: true } });

export const createUser = async ({ email, password, name }: InputUserProps) =>
  await db.user.create({
    data: { email, password, name },
    select: { email: true, name: true },
  });
  
export const findUserByEmail = async (email: string) =>
  await db.user.findUnique({ where: { email } });
