"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_service_1 = require("../core/services/user.service");
const route = (0, express_1.Router)();
exports.userRoute = route;
route.get("/", user_service_1.getUsers);
route.get("/:id", user_service_1.getUserById);
//# sourceMappingURL=users.route.js.map