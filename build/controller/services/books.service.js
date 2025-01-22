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
const repositories_1 = require("../../controller/repositories");
const error_response_1 = require("../../helper/error-response");
const manage_cloudinary_img_1 = __importDefault(require("../../helper/manage-cloudinary-img"));
const cloudinary_build_url_1 = require("cloudinary-build-url");
async function getBooks(req, res) {
    const { page, pageSize } = req.query || {};
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;
    const skip = (pageNum - 1) * pageSizeNum;
    const { books, total } = await (0, repositories_1.findBooks)(pageSizeNum, skip);
    res.status(200).json({
        success: true,
        total,
        page: pageNum,
        data: books,
    });
}
async function getBookById(req, res, next) {
    try {
        const { id } = req.params;
        const book = await (0, repositories_1.findBookById)(id);
        if (!book)
            throw new error_response_1.CustomError("Book not found", 404);
        res.status(200).json({ success: true, data: book });
    }
    catch (error) {
        next(error);
    }
}
async function getBooksByCategory(req, res, next) {
    try {
        const name = req.params.name;
        const { page, pageSize } = req.query || {};
        const pageNum = Number(page) || 1;
        const pageSizeNum = Number(pageSize) || 10;
        const skip = (pageNum - 1) * pageSizeNum;
        const book = await (0, repositories_1.findBooksByCategory)({
            name,
            take: pageSizeNum,
            skip,
        });
        if (!book)
            throw new error_response_1.CustomError("Book not found", 404);
        res
            .status(200)
            .json({ success: true, page: pageNum, genre: name, data: book });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
async function postBooks(req, res, next) {
    try {
        const { title, description, authorName, categories, content, price, stock, } = req.body;
        const image = req.file;
        const userId = req.user.id;
        if (!image)
            throw new error_response_1.CustomError("No image provided", 404);
        const { public_id, secure_url } = await (0, manage_cloudinary_img_1.default)({
            buffer: image.buffer,
        });
        const book = await (0, repositories_1.createBook)(userId, {
            title,
            description,
            image: secure_url,
            authorName,
            categories,
            content,
            price: Number(price),
            stock: Number(stock),
        });
        res.status(200).json({ success: true, data: book });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
async function putBooks(req, res, next) {
    try {
        const { id } = req.params;
        const { title, description, authorName, categories, content, stock, price, } = req.body;
        const image = req.file;
        const userId = req.user.id;
        const existedBook = await (0, repositories_1.findBookById)(id);
        if (!existedBook)
            throw new error_response_1.CustomError("Book not found", 404);
        const existedImgPublicId = await (0, cloudinary_build_url_1.extractPublicId)(existedBook.image);
        if (!image || !authorName || !categories)
            throw new error_response_1.CustomError("Please provide all required fields", 404);
        const { secure_url } = await (0, manage_cloudinary_img_1.default)({
            buffer: image.buffer,
            public_id: existedImgPublicId,
        });
        const updatedBook = await (0, repositories_1.updateBook)(userId, id, {
            title,
            description,
            image: secure_url,
            authorName,
            categories,
            stock: Number(stock),
            content,
            price: Number(price),
        });
        res.status(200).json({ success: true, data: updatedBook });
    }
    catch (error) {
        console.error("Error updating book:", error);
        next(error);
    }
}
async function removeBook(req, res, next) {
    try {
        const { id } = req.params;
        const deletedBook = await (0, repositories_1.deleteBooks)(id);
        if (!deletedBook)
            throw new error_response_1.CustomError("Book not found", 404);
        res
            .status(200)
            .json({ success: true, message: "Book deleted successfully" });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=books.service.js.map