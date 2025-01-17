import { db } from "../../lib/db";
import { OrderProps } from "../../types/order";

export const findOrderBookByUserId = async (orderedUserId: string) => {
  const order = await db.order.findMany({
    where: { orderedUserId: orderedUserId },
    select: {
      id: true,
      totalPrice: true,
      createdAt: true,
      _count: { select: { orderItems: true } },
      orderItems: {
        select: {
          id: true,
          orderId: true,
          bookId: true,
          quantity: true,
        },
      },
    },
  });

  return order.map((item) => ({
    id: item.id,
    totalPrice: item.totalPrice,
    createdAt: item.createdAt,
    count: item._count.orderItems,
    orderItems: item.orderItems.map((orderItem) => ({
      id: orderItem.id,
      orderId: orderItem.orderId,
      bookId: orderItem.bookId,
      quantity: orderItem.quantity,
    })),
  }));
};

export const createOrder = async ({
  items,
  orderedUserId,
  totalPrice,
}: {
  items: OrderProps[];
  orderedUserId: string,
  totalPrice: number;
}) => {
  return await db.$transaction(async (tx) => {
    await Promise.all(
      items.map((item) =>
        tx.book.update({
          where: { id: item.bookId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    const order = await tx.order.create({
      data: {
        orderedUserId,
        totalPrice,
      },
    });

    const orderItems = items.map((item) => ({
      orderId: order.id,
      bookId: item.bookId,
      quantity: item.quantity,
    }));

    await tx.orderItem.createMany({
      data: orderItems,
    });
    return order;
  });
};

export const updateOrderById = async ({
  orderId,
  items,
  orderedUserId,
  totalPrice,
}: {
  orderId: string
  items: OrderProps[];
  orderedUserId: string;
  totalPrice: number;
}) => {
  return await db.$transaction(async (tx) => {
    const existingOrderItems = await tx.orderItem.findMany({
      where: { orderId },
    });

    await Promise.all(
      existingOrderItems.map((item) =>
        tx.book.update({
          where: { id: item.bookId },
          data: { stock: { increment: item.quantity } },
        })
      )
    );

    await tx.orderItem.deleteMany({ where: { orderId} });

    await Promise.all(
      items.map((item) =>
        tx.book.update({
          where: { id: item.bookId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    const order = await tx.order.update({
      where: { id: orderId },
      data: {
        orderedUserId,
        totalPrice,
      },
    });

    const orderItems = items.map((item) => ({
      orderId: order.id,
      bookId: item.bookId,
      quantity: item.quantity,
    }));

    await tx.orderItem.createMany({
      data: orderItems,
    });
    return order;
  });
};

export const deleteOrderById = async (id: string) => {
  return await db.$transaction(async (tx) => {
    const orderItem = await tx.orderItem.findMany({ where: { orderId: id } });

    await Promise.all(
      orderItem.map((item) =>
        tx.book.update({
          where: { id: item.bookId },
          data: { stock: { increment: item.quantity } },
        })
      )
    );
    await tx.orderItem.deleteMany({ where: { orderId: id } });
    await tx.order.delete({ where: { id } });
  });
};

export const findOrderById = async (id: string) =>
  await db.order.findUnique({ where: { id }, include: { orderItems: true } });
