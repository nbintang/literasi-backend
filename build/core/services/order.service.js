"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderByUserId = getOrderByUserId;
exports.postOrder = postOrder;
exports.patchOrder = patchOrder;
exports.removeOrder = removeOrder;
const orders_repository_1 = require("../repositories/orders.repository");
const error_response_1 = require("../../helper/error-response");
const books_repository_1 = require("../repositories/books.repository");
const count_price_1 = require("../../helper/count-price");
async function getOrderByUserId(req, res) {
    const userId = req.query.userId;
    if (!userId)
        return (0, error_response_1.handleErrorResponse)(res, new Error("User id not found"));
    const order = await (0, orders_repository_1.findOrderBookByUserId)(Number(userId));
    res.status(200).json({ success: true, data: order });
}
async function postOrder(req, res) {
    const items = req.body.items;
    if (!items || !Array.isArray(items)) {
        return (0, error_response_1.handleErrorResponse)(res, new Error("Invalid items"), 400);
    }
    const userId = req.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    try {
        const books = await (0, books_repository_1.getBooksByIds)(items.map((item) => item.bookId));
        if (books.length !== items.length) {
            throw new Error("Some books were not found");
        }
        const insufficientStock = await (0, count_price_1.countInsufficientStock)(items, books);
        if (insufficientStock) {
            throw new Error(`Insufficient stock for id:${insufficientStock.bookId}`);
        }
        const totalPrice = await (0, count_price_1.countTotalPrice)(items, books);
        const result = await (0, orders_repository_1.createOrder)({
            items,
            userId: Number(userId),
            totalPrice,
        });
        res
            .status(201)
            .json({ success: true, message: "Order created", data: result });
    }
    catch (error) {
        return (0, error_response_1.handleErrorResponse)(res, error);
    }
}
async function patchOrder(req, res) {
    const id = Number(req.params.id);
    const items = req.body.items;
    if (!items || !Array.isArray(items)) {
        return (0, error_response_1.handleErrorResponse)(res, new Error("Invalid items"), 400);
    }
    const userId = req.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    try {
        const books = await (0, books_repository_1.getBooksByIds)(items.map((item) => item.bookId));
        if (books.length !== items.length) {
            throw new Error("Some books were not found");
        }
        const insufficientStock = await (0, count_price_1.countInsufficientStock)(items, books);
        if (insufficientStock) {
            throw new Error(`Insufficient stock for id:${insufficientStock.bookId}`);
        }
        const totalPrice = await (0, count_price_1.countTotalPrice)(items, books);
        const result = await (0, orders_repository_1.updateOrderById)({
            id,
            items,
            userId: Number(userId),
            totalPrice,
        });
        res
            .status(201)
            .json({ success: true, message: "Order updated", data: result });
    }
    catch (error) {
        return (0, error_response_1.handleErrorResponse)(res, error);
    }
}
async function removeOrder(req, res) {
    const { id } = req.params;
    const existedOrder = await (0, orders_repository_1.findOrderById)(Number(id));
    if (!existedOrder) {
        return (0, error_response_1.handleErrorResponse)(res, new Error("Order not found"), 404);
    }
    await (0, orders_repository_1.deleteOrderById)(existedOrder.id);
    res.status(200).json({ success: true, message: "Order deleted" });
}
//# sourceMappingURL=order.service.js.map