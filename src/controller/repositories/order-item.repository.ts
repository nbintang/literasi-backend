import { db } from "@/lib/db";

export const deleteOrderItemById = async (id: string) => {
  return await db.$transaction(async (tx) => {
    const orderItem = await tx.orderItem.findUnique({ where: { id } });
    if (!orderItem) return null;
    await tx.$executeRaw`
    UPDATE Book 
    SET stock = stock + ${orderItem.quantity} 
    WHERE id = ${orderItem?.bookId}
    `;

    await tx.$executeRaw`DELETE FROM OrderItem WHERE id = ${id}`;

    return orderItem;
  });
};

export const findOrderItemById = async (id: string) => {
  const orderItem = await db.orderItem.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      orderId: true,
      bookId: true,
      quantity: true,
      order: {
        select: {
          orderedUser: {
            select: {
              name: true,
            },
          },
        },
      },
      book: { select: { title: true, price: true, description: true } },
    },
  });


  return {
    id: orderItem.id,
    orderId: orderItem.orderId,
    bookId: orderItem.bookId,
    quantity: orderItem.quantity,
    user: orderItem.order.orderedUser.name,
    book: orderItem.book,
  };
};
