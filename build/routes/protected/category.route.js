"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoute = void 0;
const services_1 = require("@/controller/services");
const express_1 = require("express");
const route = (0, express_1.Router)();
exports.categoryRoute = route;
route.get("/:name", services_1.getBooksByCategory);
//# sourceMappingURL=category.route.js.map