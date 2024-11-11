"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putBooks = exports.postBooks = void 0;
exports.getBooks = getBooks;
exports.getBookById = getBookById;
exports.getBooksByCategory = getBooksByCategory;
exports.removeBook = removeBook;
const books_repository_1 = require("../repositories/books.repository");
const error_response_1 = require("../../helper/error-response");
const upload_1 = __importDefault(require("../../lib/upload"));
const cld_1 = require("../../lib/cld");
const upload_to_cloudinary_1 = require("../../helper/upload-to-cloudinary");
async function getBooks(req, res) {
    const book = await (0, books_repository_1.findBooks)();
    res.status(200).json({ success: true, data: book });
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
        const { name } = req.params;
        const { page } = req.query || 1;
        const book = await (0, books_repository_1.findBooksByCategory)(name, Number(page));
        if (!book) {
            res.status(404).json({ success: false, message: "Book not found" });
            return;
        }
        res.status(200).json({ success: true, data: book });
    }
    catch (error) {
        (0, error_response_1.handleErrorResponse)(res, error);
    }
}
exports.postBooks = [
    upload_1.default.single("image"),
    async (req, res) => {
        try {
            const { title, description, author, category, content, price, stock, } = req.body;
            const image = req.file;
            if (!image) {
                const error = new Error("Image not found");
                return (0, error_response_1.handleErrorResponse)(res, error);
            }
            const imageUrl = await (0, upload_to_cloudinary_1.uploadToCloudinary)(image.buffer);
            const book = await (0, books_repository_1.createBook)({
                title,
                description,
                imageUrl,
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
    },
];
exports.putBooks = [
    upload_1.default.single("image"),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, author, category, content, stock, price, } = req.body;
            const image = req.file;
            const existedBook = await (0, books_repository_1.findBookById)(Number(id));
            if (!existedBook) {
                return (0, error_response_1.handleErrorResponse)(res, new Error("Book not found"), 404);
            }
            if (existedBook.imageUrl) {
                await cld_1.cloudinary.uploader.destroy(existedBook.imageUrl);
            }
            let imageUrl = existedBook.imageUrl;
            if (image) {
                imageUrl = await (0, upload_to_cloudinary_1.uploadToCloudinary)(image.buffer);
            }
            if (!imageUrl || !author || !category) {
                return (0, error_response_1.handleErrorResponse)(res, new Error("Missing required fields"), 400);
            }
            const updatedBook = await (0, books_repository_1.updateBook)(Number(id), {
                title,
                description,
                imageUrl: imageUrl,
                author: author,
                category: category,
                stock: Number(stock),
                content,
                price: Number(price),
            });
            return res.status(200).json({ success: true, data: updatedBook });
        }
        catch (error) {
            console.error("Error updating book:", error);
            return (0, error_response_1.handleErrorResponse)(res, error);
        }
    },
];
async function removeBook(req, res) {
    const { id } = req.params;
    await (0, books_repository_1.deleteBooks)(Number(id));
    res.status(200).json({ success: true, message: "Book deleted successfully" });
}
//# sourceMappingURL=books.service.js.map