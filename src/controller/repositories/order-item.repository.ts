import { db } from "../../lib/db";

export const deleteOrderItemById = async (id: number) => {
  return await db.$transaction(async (tx) => {
      const orderItem = await tx.orderItem.findUnique({ where: { id } });

      await tx.book.update({
        where: { id: orderItem?.bookId },
        data: { stock: { increment: orderItem?.quantity } },
      });

      await tx.orderItem.delete({ where: { id } });

      return orderItem
  })
};

export const findOrderItemById = async (id: number) => {
  const orderItem = await db.orderItem.findUnique({
    where: { id },
    select: {
      id: true,
      orderId: true,
      bookId: true,
      quantity: true,
      order: { select: {  user: { select: { name: true, } } } },
      book: { select: { title: true, price: true, description: true } },
    },
  });

  return {
    id: orderItem?.id,
    orderId: orderItem?.orderId,
    bookId: orderItem?.bookId,
    quantity: orderItem?.quantity,
    user: orderItem?.order.user.name,
    book: orderItem?.book,
  };
};
