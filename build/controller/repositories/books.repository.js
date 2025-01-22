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
            authorName: true,
            categories: {
                select: {
                    name: true,
                },
            },
            createdAt: true,
            updatedAt: true,
        },
    });
    const mutableBooks = await books.map((book) => ({
        ...book,
        categories: book.categories.map((category) => category.name).join(", "),
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
        include: {
            categories: { select: { name: true } },
        },
    });
    if (!book)
        return null;
    return {
        ...book,
        categories: book?.categories.map((category) => category.name).join(", "),
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
                    authorName: true,
                },
            },
        },
        take,
        skip,
    });
    const mutableCategoryBooks = await categoryBooks?.books.map((book) => ({
        ...book,
    }));
    return mutableCategoryBooks;
};
exports.findBooksByCategory = findBooksByCategory;
const createBook = async (userId, { title, description, image, price, content, stock, categories, authorName, }) => {
    if (!image)
        return null;
    const createdBook = await db_1.db.book.create({
        data: {
            title,
            description,
            image,
            price,
            stock,
            content,
            authorName,
            userId,
            categories: {
                connectOrCreate: categories.map((category) => ({
                    where: { name: category.toLowerCase() },
                    create: { name: category.toLowerCase() },
                })),
            },
        },
    });
    const book = await (0, exports.findBookById)(createdBook.id);
    if (!book)
        return null;
    return book;
};
exports.createBook = createBook;
const updateBook = async (userId, id, { title, description, image, price, content, stock, authorName, categories, }) => {
    const updatedBook = await db_1.db.book.update({
        where: { id },
        data: {
            title,
            description,
            image,
            price,
            stock,
            userId,
            content,
            authorName,
            categories: {
                connectOrCreate: categories.map((category) => ({
                    where: { name: category.toLowerCase() },
                    create: { name: category.toLowerCase() },
                })),
            },
        },
    });
    const book = await (0, exports.findBookById)(updatedBook.id);
    return book;
};
exports.updateBook = updateBook;
const deleteBooks = async (id) => {
    const existedBook = await (0, exports.findBookById)(id);
    if (!existedBook)
        return null;
    const deletedBook = await db_1.db.book.delete({ where: { id: existedBook.id } });
    return deletedBook;
};
exports.deleteBooks = deleteBooks;
const getBooksByIds = async (bookIds) => {
    const books = await db_1.db.book.findMany({
        where: {
            id: {
                in: bookIds || [],
            },
        },
        select: {
            id: true,
            price: true,
            stock: true,
            title: true,
        },
    });
    if (!books)
        return null;
    return books;
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