"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const services_1 = require("../../controller/services");
const express_1 = require("express");
const route = (0, express_1.Router)();
exports.userRoute = route;
route.get("/", services_1.getUsers);
route.get("/:id", services_1.getUserById);
//# sourceMappingURL=users.route.js.map