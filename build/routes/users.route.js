"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const route = require("express").Router();
exports.userRoute = route;
const order_service_1 = require("../core/services/order.service");
const user_service_1 = require("../core/services/user.service");
route.get("/", user_service_1.getUsers);
route.get("/:id", user_service_1.getUserById);
route.get("/:id/orders", order_service_1.getOrderByUserId);
route.post("/orders", order_service_1.postOrder);
//# sourceMappingURL=users.route.js.map