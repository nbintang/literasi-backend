"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoute = void 0;
const express_1 = require("express");
const books_service_1 = require("../controller/services/books.service");
const route = (0, express_1.Router)();
exports.categoryRoute = route;
route.get("/:name", books_service_1.getBooksByCategory);
//# sourceMappingURL=category.route.js.map