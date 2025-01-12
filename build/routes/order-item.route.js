"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemRoute = void 0;
const express_1 = require("express");
const order_item_service_1 = require("../core/services/order-item.service");
const route = (0, express_1.Router)();
exports.orderItemRoute = route;
route.get("/:id", order_item_service_1.getOrderItemById);
//# sourceMappingURL=order-item.route.js.map