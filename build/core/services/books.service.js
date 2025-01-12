"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooks = getBooks;
exports.getBookById = getBookById;
exports.getBooksByCategory = getBooksByCategory;
exports.postBooks = postBooks;
exports.putBooks = putBooks;
exports.removeBook = removeBook;
const books_repository_1 = require("../repositories/books.repository");
const error_response_1 = require("../../helper/error-response");
const manage_cloudinary_img_1 = __importDefault(require("../../helper/manage-cloudinary-img"));
const cloudinary_build_url_1 = require("cloudinary-build-url");
async function getBooks(req, res) {
    const { page, pageSize } = req.query || {};
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;
    const skip = (pageNum - 1) * pageSizeNum;
    const { books, total } = await (0, books_repository_1.findBooks)(pageSizeNum, skip);
    res.status(200).json({
        success: true,
        total,
        page: pageNum,
        data: books,
    });
}
async function getBookById(req, res) {
    const { id } = req.params;
    const book = await (0, books_repository_1.findBookById)(Number(id));
    if (!book) {
        res.status(404).json({ success: false, message: "Book not found" });
        return;
    }
    res.status(200).json({ success: true, data: book });
}
async function getBooksByCategory(req, res) {
    try {
        const name = req.params.name;
        const { page, pageSize } = req.query || {};
        const pageNum = Number(page) || 1;
        const pageSizeNum = Number(pageSize) || 10;
        const skip = (pageNum - 1) * pageSizeNum;
        const book = await (0, books_repository_1.findBooksByCategory)({
            name,
            take: pageSizeNum,
            skip,
        });
        if (!book) {
            res.status(404).json({ success: false, message: "Book not found" });
            return;
        }
        res
            .status(200)
            .json({ success: true, page: pageNum, genre: name, data: book });
    }
    catch (error) {
        (0, error_response_1.handleErrorResponse)(res, error);
    }
}
async function postBooks(req, res) {
    try {
        const { title, description, author, category, content, price, stock, } = req.body;
        const image = req.file;
        if (!image) {
            const error = new Error("Image not found");
            return (0, error_response_1.handleErrorResponse)(res, error);
        }
        const { public_id, secure_url } = await (0, manage_cloudinary_img_1.default)({
            buffer: image.buffer,
        });
        const book = await (0, books_repository_1.createBook)({
            title,
            description,
            image: secure_url,
            author,
            category,
            content,
            price: Number(price),
            stock: Number(stock),
        });
        res.status(200).json({ success: true, data: book });
    }
    catch (error) {
        (0, error_response_1.handleErrorResponse)(res, error);
    }
}
async function putBooks(req, res) {
    try {
        const { id } = req.params;
        const { title, description, author, category, content, stock, price, } = req.body;
        const image = req.file;
        const existedBook = await (0, books_repository_1.findBookById)(Number(id));
        if (!existedBook) {
            return (0, error_response_1.handleErrorResponse)(res, new Error("Book not found"), 404);
        }
        const existedImgPublicId = await (0, cloudinary_build_url_1.extractPublicId)(existedBook.image);
        if (!image || !author || !category) {
            return (0, error_response_1.handleErrorResponse)(res, new Error("Missing required fields"), 400);
        }
        const { secure_url } = await (0, manage_cloudinary_img_1.default)({
            buffer: image.buffer,
            public_id: existedImgPublicId,
        });
        const updatedBook = await (0, books_repository_1.updateBook)(Number(id), {
            title,
            description,
            image: secure_url,
            author: author,
            category: category,
            stock: Number(stock),
            content,
            price: Number(price),
        });
        res.status(200).json({ success: true, data: updatedBook });
    }
    catch (error) {
        console.error("Error updating book:", error);
        return (0, error_response_1.handleErrorResponse)(res, error);
    }
}
async function removeBook(req, res) {
    const { id } = req.params;
    await (0, books_repository_1.deleteBooks)(Number(id));
    res.status(200).json({ success: true, message: "Book deleted successfully" });
}
//# sourceMappingURL=books.service.js.map