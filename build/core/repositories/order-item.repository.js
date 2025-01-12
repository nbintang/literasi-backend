"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrderItemById = exports.deleteOrderItemById = void 0;
const db_1 = require("../../lib/db");
const deleteOrderItemById = async (id) => {
    return await db_1.db.orderItem.delete({ where: { id } });
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
            order: { select: { user: { select: { id: true, name: true, } } } },
            book: { select: { title: true } },
        },
    });
    return {
        ...orderItem,
        book: orderItem?.book.title,
    };
};
exports.findOrderItemById = findOrderItemById;
//# sourceMappingURL=order-item.repository.js.map