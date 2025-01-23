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

export const findTokenByIdentifier = async (email: string) =>
  await db.verificationToken.findFirstOrThrow({
    where: {
      user: {
        email,
      },
    },
  });

export const deleteAllTokensByIdentifier = async (email: string) => {
  await db.verificationToken.deleteMany({
    where: {
      user: {
        email,
      },
    },
  })
}
