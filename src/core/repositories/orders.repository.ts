import { db } from "../../lib/db";

export const findOrderBookByUserId = async (userId: number) =>
  await db.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          book: true,
        },
      },
    },
  });


export const createOrder = async (userId: number, totalPrice: number, orderItems: any) => {
  return await db.order.create({
    data: {
      userId,
      totalPrice,
      orderItems: {
        create: orderItems,
      },
    },
  });
};