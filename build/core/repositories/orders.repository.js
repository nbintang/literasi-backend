"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.findOrderBookByUserId = void 0;
const db_1 = require("../../lib/db");
const findOrderBookByUserId = async (userId) => await db_1.db.order.findMany({
    where: { userId },
    include: {
        orderItems: {
            include: {
                book: true,
            },
        },
    },
});
exports.findOrderBookByUserId = findOrderBookByUserId;
const createOrder = async (userId, totalPrice, orderItems) => {
    return await db_1.db.order.create({
        data: {
            userId,
            totalPrice,
            orderItems: {
                create: orderItems,
            },
        },
    });
};
exports.createOrder = createOrder;
//# sourceMappingURL=orders.repository.js.map