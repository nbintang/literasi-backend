"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderByUserProfileId = getOrderByUserProfileId;
exports.postOrder = postOrder;
exports.patchOrder = patchOrder;
exports.removeOrder = removeOrder;
const repositories_1 = require("../repositories");
const error_response_1 = require("../../helper/error-response");
const count_price_1 = require("../../helper/count-price");
async function getOrderByUserProfileId(req, res) {
    const userId = req.query.id;
    if (!userId)
        return (0, error_response_1.handleErrorResponse)(res, new Error("User id not found"));
    const order = await (0, repositories_1.findOrderBookByUserId)(userId);
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
        const books = await (0, repositories_1.getBooksByIds)(items.map((item) => item.bookId));
        if (books.length !== items.length) {
            throw new Error("Some books were not found");
        }
        const insufficientStock = await (0, count_price_1.countInsufficientStock)(items, books);
        if (insufficientStock) {
            throw new Error(`Insufficient stock for id:${insufficientStock.bookId}`);
        }
        const totalPrice = await (0, count_price_1.countTotalPrice)(items, books);
        const result = await (0, repositories_1.createOrder)({
            items,
            orderedUserId: userId,
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
    const orderId = req.params.id;
    const items = req.body.items;
    if (!items || !Array.isArray(items)) {
        return (0, error_response_1.handleErrorResponse)(res, new Error("Invalid items"), 400);
    }
    const userId = req.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }
    try {
        const books = await (0, repositories_1.getBooksByIds)(items.map((item) => item.bookId));
        if (books.length !== items.length) {
            throw new Error("Some books were not found");
        }
        const insufficientStock = await (0, count_price_1.countInsufficientStock)(items, books);
        if (insufficientStock) {
            throw new Error(`Insufficient stock for id:${insufficientStock.bookId}`);
        }
        const totalPrice = await (0, count_price_1.countTotalPrice)(items, books);
        const result = await (0, repositories_1.updateOrderById)({
            orderId,
            items,
            orderedUserId: userId,
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
    const orderId = req.params.id;
    const existedOrder = await (0, repositories_1.findOrderById)(orderId);
    if (!existedOrder) {
        return (0, error_response_1.handleErrorResponse)(res, new Error("Order not found"), 404);
    }
    await (0, repositories_1.deleteOrderById)(existedOrder.id);
    res.status(200).json({ success: true, message: "Order deleted" });
}
//# sourceMappingURL=order.service.js.map