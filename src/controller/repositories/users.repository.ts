import { InputUserProps } from "@/types";
import { db } from "@/lib/db";

export const findUsers = async () =>
  await db.user.findMany({
    where: {
      profile: {
        role: "USER",
      },
    },
    select: {
      email: true,
      name: true,
      id: true,
      createdAt: true,
      updatedAt: true,
    },
  });

export const findUserById = async (id: string) => {
  const user = await db.user.findUniqueOrThrow({
    where: { id },
    select: {
      email: true,
      name: true,
      id: true,
      profile: {
        select: {
          image: true,
          role: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.profile?.image,
    role: user.profile?.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
export const createUser = async ({ email, password, name }: InputUserProps) => {
  const newUser = await db.user.create({
    data: { email, password, name },
  });
  const user = await findUserById(newUser.id);
  return user;
};

export const findUserByEmailWithProfile = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email, isVerified: true },
    include: { profile: { select: { image: true, role: true } } },
  });
  return user;
};

export const findEmailWithToken = async (email: string) =>
  await db.user.findUnique({ where: { email }, include: { token: true } });

export const updateUserVerifyStatus = async (id: string, isVerified: boolean) =>
  await db.user.update({
    where: { id },
    data: {
      isVerified,
      profile: {
        create: {
          role: "USER",
        },
      },
    },
  });
