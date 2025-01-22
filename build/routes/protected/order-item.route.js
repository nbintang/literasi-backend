"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemRoute = void 0;
const services_1 = require("../../controller/services");
const express_1 = require("express");
const route = (0, express_1.Router)();
exports.orderItemRoute = route;
route.get("/:id", services_1.getOrderItemById);
route.delete("/:id", services_1.deleteOrderItem);
//# sourceMappingURL=order-item.route.js.map