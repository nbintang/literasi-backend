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

export const findUserById = async (id: string) =>{
  const user =  await db.user.findUnique({
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
  if (!user) return null;

  // Return a clean response without the profile field
  return {
    email: user.email,
    name: user.name,
    id: user.id,
    image: user.profile?.image,
    role: user.profile?.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
export const createUser = async ({ email, password, name }: InputUserProps) => {
  const newUser = await db.user.create({
    data: { email, password, name },
  });
  const user = await findUserById(newUser.id);
  return user;
};

export const findUserByEmail = async (email: string) =>
  await db.user.findUnique({
    where: { email },
    include: { profile: { select: { image: true, role: true } } },
  });
