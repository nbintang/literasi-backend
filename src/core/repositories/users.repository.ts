import { db } from "../db";

export const findUsers = async () =>
  await db.user.findMany();
export const findUserById = async (id: number) =>
  await db.user.findUnique({ where: { id }, include: { orders: true } });
export const createUser = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) =>
  await db.user.create({
    data: { email, password, name },
    select: { email: true, name: true },
  });
export const findUserByEmail = async (email: string) =>
  await db.user.findUnique({ where: { email } });
