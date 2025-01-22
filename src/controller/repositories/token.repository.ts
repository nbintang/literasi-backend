import { db } from "@/lib/db";

export const createToken = async (
  token: string,
  userId: string,
  expiresAt: Date
) =>
  await db.verificationToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });


  export const findToken = async (token: string) => await db.verificationToken.findUnique({ where: { token } });