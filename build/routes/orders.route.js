"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoute = void 0;
const express_1 = require("express");
const services_1 = require("../controller/services");
const route = (0, express_1.Router)();
exports.orderRoute = route;
route.get("/", services_1.getOrderByUserProfileId);
route.post("/", services_1.postOrder);
route.delete("/:id", services_1.removeOrder);
route.patch("/:id", services_1.patchOrder);
//# sourceMappingURL=orders.route.js.map