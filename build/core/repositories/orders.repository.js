"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrderById = exports.deleteOrderById = exports.updateOrderById = exports.createOrder = exports.findOrderBookByUserId = void 0;
const db_1 = require("../../lib/db");
const findOrderBookByUserId = async (userId) => {
    const order = await db_1.db.order.findMany({
        where: { userId },
        select: {
            id: true,
            totalPrice: true,
            createdAt: true,
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
        totalQuantity: item.orderItems.reduce((total, item) => total + item.quantity, 0),
        ...item,
    }));
};
exports.findOrderBookByUserId = findOrderBookByUserId;
const createOrder = async ({ items, userId, totalPrice, }) => {
    return await db_1.db.$transaction(async (tx) => {
        await Promise.all(items.map((item) => tx.book.update({
            where: { id: item.bookId },
            data: { stock: { decrement: item.quantity } },
        })));
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
exports.createOrder = createOrder;
const updateOrderById = async ({ id, items, userId, totalPrice, }) => {
    return await db_1.db.$transaction(async (tx) => {
        const existingOrderItems = await tx.orderItem.findMany({
            where: { orderId: id },
        });
        await Promise.all(existingOrderItems.map((item) => tx.book.update({
            where: { id: item.bookId },
            data: { stock: { increment: item.quantity } },
        })));
        await tx.orderItem.deleteMany({ where: { orderId: id } });
        await Promise.all(items.map((item) => tx.book.update({
            where: { id: item.bookId },
            data: { stock: { decrement: item.quantity } },
        })));
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
exports.updateOrderById = updateOrderById;
const deleteOrderById = async (id) => {
    return await db_1.db.$transaction(async (tx) => {
        const orderItem = await tx.orderItem.findMany({ where: { orderId: id } });
        await Promise.all(orderItem.map((item) => tx.book.update({
            where: { id: item.bookId },
            data: { stock: { increment: item.quantity } },
        })));
        await tx.orderItem.deleteMany({ where: { orderId: id } });
        await tx.order.delete({ where: { id } });
    });
};
exports.deleteOrderById = deleteOrderById;
const findOrderById = async (id) => await db_1.db.order.findUnique({ where: { id }, include: { orderItems: true } });
exports.findOrderById = findOrderById;
//# sourceMappingURL=orders.repository.js.map