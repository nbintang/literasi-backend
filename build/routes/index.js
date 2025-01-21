"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_route_1 = require("./users.route");
const auth_route_1 = require("./auth.route");
const books_route_1 = require("./books.route");
const orders_route_1 = require("./orders.route");
const order_item_route_1 = require("./order-item.route");
const category_route_1 = require("./category.route");
const express_1 = require("express");
const profile_route_1 = require("./profile.route");
const middleware_1 = __importDefault(require("../middleware"));
const route = (0, express_1.Router)();
route.use("/books", (0, middleware_1.default)("jwt"), books_route_1.bookRoute);
route.use("/users", (0, middleware_1.default)("jwt"), users_route_1.userRoute);
route.use("/orders", (0, middleware_1.default)("jwt"), orders_route_1.orderRoute);
route.use("/order-item", (0, middleware_1.default)("jwt"), order_item_route_1.orderItemRoute);
route.use("/category", (0, middleware_1.default)("jwt"), category_route_1.categoryRoute);
route.use("/profile", (0, middleware_1.default)("jwt"), profile_route_1.profileRoute);
route.use(auth_route_1.authRoute);
exports.default = route;
//# sourceMappingURL=index.js.map