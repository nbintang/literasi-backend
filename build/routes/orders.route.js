"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoute = void 0;
const express_1 = require("express");
const order_service_1 = require("../core/services/order.service");
const route = (0, express_1.Router)();
exports.orderRoute = route;
route.get("/", order_service_1.getOrderByUserId);
route.post("/", order_service_1.postOrder);
route.delete("/:id", order_service_1.removeOrder);
route.patch("/:id", order_service_1.patchOrder);
//# sourceMappingURL=orders.route.js.map