import { db } from "../../lib/db";

export const deleteOrderItemById = async (id: number) => {
  return await db.orderItem.delete({ where: { id } });
};

export const findOrderItemById = async (id: number) => {
  const orderItem = await db.orderItem.findUnique({
    where: { id },
    select: {
      id: true,
      orderId: true,
      bookId: true,
      quantity: true,
      order: { select: { user: { select: { id: true ,name: true, } } } },
      book: { select: { title: true } },
    },
  });

  return {
    ...orderItem,
    book: orderItem?.book.title,
  };
};
