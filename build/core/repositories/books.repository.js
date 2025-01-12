"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookStock = exports.getBooksByIds = exports.deleteBooks = exports.updateBook = exports.createBook = exports.findBooksByCategory = exports.findBookById = exports.findBooks = void 0;
const db_1 = require("../../lib/db");
const findBooks = async (take, skip) => {
    const books = await db_1.db.book.findMany({
        take,
        skip,
        select: {
            id: true,
            title: true,
            image: true,
            description: true,
            price: true,
            stock: true,
            author: { select: { id: true, name: true } },
            category: { select: { id: true, name: true } },
            createdAt: true,
            updatedAt: true,
        },
    });
    const mutableBooks = await books.map((book) => ({
        ...book,
        author: book.author.name,
        category: book.category.name,
    }));
    return {
        total: await db_1.db.book.count(),
        books: mutableBooks,
    };
};
exports.findBooks = findBooks;
const findBookById = async (id) => {
    const book = await db_1.db.book.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            image: true,
            description: true,
            price: true,
            stock: true,
            content: true,
            author: { select: { id: true, name: true, bio: true, createdAt: true } },
            category: { select: { id: true, name: true } },
            createdAt: true,
            updatedAt: true,
        },
    });
    return {
        ...book,
        author: book?.author.name,
        category: book?.category.name,
    };
};
exports.findBookById = findBookById;
const findBooksByCategory = async ({ name, take, skip, }) => {
    const categoryBooks = await db_1.db.category.findFirst({
        where: { name },
        select: {
            id: true,
            name: true,
            books: {
                select: {
                    id: true,
                    title: true,
                    image: true,
                    description: true,
                    price: true,
                    author: { select: { id: true, name: true } },
                    createdAt: true,
                },
            },
        },
        take,
        skip,
    });
    const mutableCategoryBooks = await categoryBooks?.books.map((book) => ({
        ...book,
        author: book.author.name,
    }));
    return mutableCategoryBooks;
};
exports.findBooksByCategory = findBooksByCategory;
const createBook = async ({ title, description, image, price, content, stock, author, category, }) => {
    const createdBook = await db_1.db.book.create({
        data: {
            title,
            description,
            image,
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
    const book = await (0, exports.findBookById)(createdBook.id);
    return book;
};
exports.createBook = createBook;
const updateBook = async (id, { title, description, image, price, content, author, stock, category, }) => {
    const updatedBook = await db_1.db.book.update({
        where: { id },
        data: {
            title,
            description,
            stock,
            image,
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
    const book = await (0, exports.findBookById)(updatedBook.id);
    return book;
};
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