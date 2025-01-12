import { db } from "../../lib/db";
import { OrderProps } from "../../types/order";

export const findOrderBookByUserId = async (userId: number) => {
  const order = await db.order.findMany({
    where: { userId },
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
  userId,
  totalPrice,
}: {
  items: OrderProps[];
  userId: number;
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
        userId,
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
  id,
  items,
  userId,
  totalPrice,
}: {
  id: number;
  items: OrderProps[];
  userId: number;
  totalPrice: number;
}) => {
  return await db.$transaction(async (tx) => {
    const existingOrderItems = await tx.orderItem.findMany({
      where: { orderId: id },
    });

    await Promise.all(
      existingOrderItems.map((item) =>
        tx.book.update({
          where: { id: item.bookId },
          data: { stock: { increment: item.quantity } },
        })
      )
    );

    await tx.orderItem.deleteMany({ where: { orderId: id } });

    await Promise.all(
      items.map((item) =>
        tx.book.update({
          where: { id: item.bookId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    const order = await tx.order.update({
      where: { id },
      data: {
        userId,
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

export const deleteOrderById = async (id: number) => {
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

export const findOrderById = async (id: number) =>
  await db.order.findUnique({ where: { id }, include: { orderItems: true } });
