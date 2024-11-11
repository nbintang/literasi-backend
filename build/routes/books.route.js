"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoute = void 0;
const books_service_1 = require("../core/services/books.service");
const route = require("express").Router();
exports.bookRoute = route;
route.get("/", books_service_1.getBooks);
route.get("/:id", books_service_1.getBookById);
route.get("/category/:name", books_service_1.getBooksByCategory);
route.post("/", books_service_1.postBooks);
route.put("/:id", books_service_1.putBooks);
route.delete("/:id", books_service_1.removeBook);
//# sourceMappingURL=books.route.js.map