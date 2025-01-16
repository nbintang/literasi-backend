import { InputUserProps } from "../../types";
import { db } from "../../lib/db";

export const findUsers = async () =>
  await db.user.findMany({
    where: { role: "USER" },
    select: {
      email: true,
      name: true,
      id: true,
      createdAt: true,
      updatedAt: true,
    },
  });

export const findUserById = async (id: number) =>
  await db.user.findUnique({
    where: { id },
    select: {
      email: true,
      name: true,
      id: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

export const createUser = async ({ email, password, name }: InputUserProps) => {
  const newUser = await db.user.create({
    data: { email, password, name },
  });
  const user = await findUserById(newUser.id);
  return user;
};

export const findUserByEmail = async (email: string) =>
  await db.user.findUnique({ where: { email }, });
