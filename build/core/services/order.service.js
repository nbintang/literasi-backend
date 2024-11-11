"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderByUserId = getOrderByUserId;
exports.postOrder = postOrder;
const orders_repository_1 = require("../repositories/orders.repository");
const error_response_1 = require("../../helper/error-response");
const books_repository_1 = require("../repositories/books.repository");
async function getOrderByUserId(req, res) {
    const { id } = req.params;
    const order = await (0, orders_repository_1.findOrderBookByUserId)(Number(id));
    res.status(200).json({ success: true, data: order });
}
async function postOrder(req, res) {
    const items = req.body.items;
    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ message: "Invalid order items" });
    }
    try {
        const books = await (0, books_repository_1.getBooksByIds)(items.map((item) => item.bookId));
        const userId = req.id;
        if (books.length !== items.length) {
            throw new Error("Some books were not found");
        }
        const updateStockPromises = items.map((item) => {
            const book = books.find((b) => b.id === item.bookId);
            if (!book) {
                throw new Error(`Book with ID ${item.bookId} not found`);
            }
            if (book.stock < item.quantity) {
                throw new Error(`Not enough stock for book: ${book.title}`);
            }
            return (0, books_repository_1.updateBookStock)(book.id, item.quantity);
        });
        await Promise.all(updateStockPromises);
        const totalPrice = items.reduce((total, item) => {
            const book = books.find((b) => b.id === item.bookId);
            if (!book) {
                throw new Error(`Book with ID ${item.bookId} not found`);
            }
            return total + item.quantity * book.price.toNumber();
        }, 0);
        const order = await (0, orders_repository_1.createOrder)(Number(userId), totalPrice, items.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
        })));
        res.status(201).json({ success: true, data: order });
    }
    catch (error) {
        (0, error_response_1.handleErrorResponse)(res, error);
    }
}
//# sourceMappingURL=order.service.js.map