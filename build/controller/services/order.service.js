"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderByUserProfileId = getOrderByUserProfileId;
exports.postOrder = postOrder;
exports.patchOrder = patchOrder;
exports.removeOrder = removeOrder;
const repositories_1 = require("@/controller/repositories");
const error_response_1 = require("@/helper/error-response");
const count_price_1 = require("@/helper/count-price");
async function getOrderByUserProfileId(req, res, next) {
    try {
        const userId = req.query.id;
        if (!userId)
            throw new error_response_1.CustomError("User id not found", 404);
        const order = await (0, repositories_1.findOrderBookByUserId)(userId);
        res.status(200).json({ success: true, data: order });
    }
    catch (error) {
        next(error);
    }
}
async function postOrder(req, res, next) {
    const items = req.body.items;
    try {
        if (!items || !Array.isArray(items))
            throw new error_response_1.CustomError("Invalid items", 400);
        const userId = req.user.id;
        if (!userId)
            throw new error_response_1.CustomError("Unauthorized", 401);
        const bookIds = items.map((item) => item.bookId);
        const books = await (0, repositories_1.getBooksByIds)(bookIds);
        if (!books)
            throw new error_response_1.CustomError("Some books were not found", 404);
        if (books.length !== items.length)
            throw new error_response_1.CustomError("Some books were not found", 404);
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
        console.log(error);
        next(error);
    }
}
async function patchOrder(req, res, next) {
    const orderId = req.params.id;
    const items = req.body.items;
    try {
        if (!items || !Array.isArray(items))
            throw new error_response_1.CustomError("Invalid items", 400);
        const userId = req.user.id;
        if (!userId)
            throw new error_response_1.CustomError("Unauthorized", 401);
        const bookIds = items.map((item) => item.bookId);
        const books = await (0, repositories_1.getBooksByIds)(bookIds);
        if (!books)
            throw new error_response_1.CustomError("Some books were not found", 404);
        if (books.length !== items.length)
            throw new error_response_1.CustomError("Some books were not found", 404);
        const insufficientStock = await (0, count_price_1.countInsufficientStock)(items, books);
        if (insufficientStock)
            throw new error_response_1.CustomError(`Insufficient stock for id:${insufficientStock.bookId}`, 400);
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
        console.log(error);
        next(error);
    }
}
async function removeOrder(req, res, next) {
    try {
        const orderId = req.params.id;
        const existedOrder = await (0, repositories_1.findOrderById)(orderId);
        if (!existedOrder)
            throw new error_response_1.CustomError("Order not found", 404);
        await (0, repositories_1.deleteOrderById)(existedOrder.id);
        res.status(200).json({ success: true, message: "Order deleted" });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=order.service.js.map