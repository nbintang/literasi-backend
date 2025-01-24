import { db } from "@/lib/db";
import { OrderProps } from "@/types/order";
import { Prisma } from "@prisma/client";

export const findOrderBookByUserId = async (orderedUserId: string) => {
  const order = await db.order.findMany({
    where: { orderedUserId: orderedUserId },
    select: {
      id: true,
      orderedUser:{
        select: {
          name: true,

        }
      },
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
    orderedBy: item.orderedUser.name,
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

const { sql } = Prisma;

export const createOrder = async ({
  items,
  orderedUserId,
  totalPrice,
}: {
  items: OrderProps[];
  orderedUserId: string;
  totalPrice: number;
}) => {
  return await db.$transaction(async (tx) => {
    // Decrease book stock
    await Promise.all(
      items.map(
        (item) =>
          tx.$executeRaw`
          UPDATE Book 
          SET stock = stock - ${item.quantity} 
          WHERE id = ${item.bookId}
        `
      )
    );

    const order = await tx.order.create({
      data: {
        orderedUserId,
        totalPrice,
      },
    })

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
  orderId: string;
  items: OrderProps[];
  orderedUserId: string;
  totalPrice: number;
}) => {
  return await db.$transaction(async (tx) => {
    const existingOrderItems = await tx.orderItem.findMany({
      where: { orderId },
    });

    const increaseStock = await Promise.all(
      existingOrderItems.map(
        (item) =>
          tx.$executeRaw`
            UPDATE Book 
            SET stock = stock + ${item.quantity} 
            WHERE id = ${item.bookId}
            `
      )
    );

    await tx.$executeRaw`DELETE FROM OrderItem WHERE orderId = ${orderId}`;

    await Promise.all(
      items.map(
        (item) =>
          tx.$executeRaw`
            UPDATE Book 
            SET stock = stock - ${item.quantity} 
            WHERE id = ${item.bookId}
            `
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
      orderItem.map(
        (item) =>
          tx.$executeRaw`
            UPDATE Book 
            SET stock = stock + ${item.quantity} 
            WHERE id = ${item.bookId}
            `
      )
    );
    await tx.$executeRaw`DELETE FROM OrderItem WHERE orderId = ${id}`;
    await tx.$executeRaw`DELETE FROM \`Order\` WHERE id = ${id}`;
  });
};

export const findOrderById = async (id: string) =>
  await db.order.findUnique({ where: { id }, include: { orderItems: true } });
