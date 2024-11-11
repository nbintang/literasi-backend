"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookStock = exports.getBooksByIds = exports.deleteBooks = exports.updateBook = exports.createBook = exports.findBooksByCategory = exports.findBookById = exports.findBooks = void 0;
const db_1 = require("../../lib/db");
const findBooks = async () => await db_1.db.book.findMany();
exports.findBooks = findBooks;
const findBookById = async (id) => await db_1.db.book.findFirst({ where: { id } });
exports.findBookById = findBookById;
const findBooksByCategory = async (name, page) => await db_1.db.category.findFirst({
    where: { name },
    select: { id: true, name: true, books: true },
    take: 10,
    skip: (page - 1) * 10,
});
exports.findBooksByCategory = findBooksByCategory;
const createBook = async ({ title, description, imageUrl, price, content, stock, author, category, }) => {
    return await db_1.db.book.create({
        data: {
            title,
            description,
            imageUrl,
            price,
            stock,
            content,
            author: {
                connectOrCreate: {
                    where: { name: author },
                    create: { name: author },
                },
            },
            category: {
                connectOrCreate: {
                    where: { name: category },
                    create: { name: category },
                },
            },
        },
    });
};
exports.createBook = createBook;
const updateBook = async (id, { title, description, imageUrl, price, content, author, stock, category, }) => await db_1.db.book.update({
    where: { id },
    data: {
        title,
        description,
        stock,
        imageUrl,
        price,
        content,
        author: {
            connectOrCreate: {
                where: { name: author },
                create: { name: author },
            },
        },
        category: {
            connectOrCreate: {
                where: { name: category },
                create: { name: category },
            },
        },
    },
});
exports.updateBook = updateBook;
const deleteBooks = async (id) => await db_1.db.book.delete({ where: { id } });
exports.deleteBooks = deleteBooks;
const getBooksByIds = async (bookIds) => {
    return await db_1.db.book.findMany({
        where: {
            id: {
                in: bookIds,
            },
        },
        select: {
            id: true,
            price: true,
            stock: true,
            title: true,
        },
    });
};
exports.getBooksByIds = getBooksByIds;
const updateBookStock = async (bookId, quantity) => {
    return await db_1.db.book.update({
        where: { id: bookId },
        data: { stock: { decrement: quantity } },
    });
};
exports.updateBookStock = updateBookStock;
//# sourceMappingURL=books.repository.js.map