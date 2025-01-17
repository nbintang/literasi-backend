"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoute = void 0;
const express_1 = require("express");
const services_1 = require("../controller/services");
const upload_1 = __importDefault(require("../lib/upload"));
const route = (0, express_1.Router)();
exports.bookRoute = route;
route.get("/", services_1.getBooks);
route.get("/:id", services_1.getBookById);
route.post("/", upload_1.default.single("image"), services_1.postBooks);
route.put("/:id", upload_1.default.single("image"), services_1.putBooks);
route.delete("/:id", services_1.removeBook);
//# sourceMappingURL=books.route.js.map