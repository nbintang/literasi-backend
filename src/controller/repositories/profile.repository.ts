import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export async function findProfileByUserId(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      profile: {
        select: {
          image: true,
          role: true,
          fullname: true,
          bio: true,
        },
      },
      name: true,
      email: true,
    },
  });

  return {
      id: user?.id,
      name: user?.name,
      email: user?.email,
    ...user?.profile,
  };
}


export async function updateProfile(userId: string, data: Prisma.ProfileUpdateInput) {
    return await db.profile.update({
        where: { userId },
        data
    })
    
}