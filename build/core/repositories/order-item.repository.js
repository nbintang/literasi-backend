"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrderItemById = exports.deleteOrderItemById = void 0;
const db_1 = require("../../lib/db");
const deleteOrderItemById = async (id) => {
    return await db_1.db.$transaction(async (tx) => {
        const orderItem = await tx.orderItem.findUnique({ where: { id } });
        await tx.book.update({
            where: { id: orderItem?.bookId },
            data: { stock: { increment: orderItem?.quantity } },
        });
        await tx.orderItem.delete({ where: { id } });
        return orderItem;
    });
};
exports.deleteOrderItemById = deleteOrderItemById;
const findOrderItemById = async (id) => {
    const orderItem = await db_1.db.orderItem.findUnique({
        where: { id },
        select: {
            id: true,
            orderId: true,
            bookId: true,
            quantity: true,
            order: { select: { user: { select: { name: true, } } } },
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
exports.findOrderItemById = findOrderItemById;
//# sourceMappingURL=order-item.repository.js.map