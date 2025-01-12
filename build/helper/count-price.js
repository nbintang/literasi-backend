"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countTotalPrice = countTotalPrice;
exports.countInsufficientStock = countInsufficientStock;
[];
async function countTotalPrice(items, books) {
    const totalPrice = items.reduce((total, item) => {
        const book = books.find((b) => b.id === item.bookId);
        return total + item.quantity * book.price.toNumber();
    }, 0);
    return totalPrice;
}
async function countInsufficientStock(items, books) {
    const insufficientStock = items.find((item) => {
        const book = books.find((b) => b.id === item.bookId);
        return !book || book.stock < item.quantity;
    });
    return insufficientStock;
}
//# sourceMappingURL=count-price.js.map