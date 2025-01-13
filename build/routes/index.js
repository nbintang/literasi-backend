"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_route_1 = require("./users.route");
const auth_route_1 = require("./auth.route");
const books_route_1 = require("./books.route");
const middleware_1 = require("../middleware");
const orders_route_1 = require("./orders.route");
const router_1 = __importDefault(require("../lib/router"));
const order_item_route_1 = require("./order-item.route");
const category_route_1 = require("./category.route");
router_1.default.use("/books", middleware_1.authMiddleware, books_route_1.bookRoute);
router_1.default.use("/users", middleware_1.authMiddleware, users_route_1.userRoute);
router_1.default.use("/orders", middleware_1.authMiddleware, orders_route_1.orderRoute);
router_1.default.use("/order-item", middleware_1.authMiddleware, order_item_route_1.orderItemRoute);
router_1.default.use("/category", middleware_1.authMiddleware, category_route_1.categoryRoute);
router_1.default.use(auth_route_1.authRoute);
exports.default = router_1.default;
//# sourceMappingURL=index.js.map