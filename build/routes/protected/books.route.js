"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoute = void 0;
const express_1 = require("express");
const services_1 = require("../../controller/services");
const validate_file_1 = __importDefault(require("../../helper/validate-file"));
const validate_schema_1 = require("../../helper/validate-schema");
const book_schema_1 = require("../../schemas/book-schema");
const route = (0, express_1.Router)();
exports.bookRoute = route;
route.get("/", services_1.getBooks);
route.get("/:id", services_1.getBookById);
route.post("/", validate_file_1.default, (0, validate_schema_1.validateSchema)(book_schema_1.bookSchema), services_1.postBooks);
route.put("/:id", validate_file_1.default, (0, validate_schema_1.validateSchema)(book_schema_1.bookSchema), services_1.putBooks);
route.delete("/:id", services_1.removeBook);
//# sourceMappingURL=books.route.js.map