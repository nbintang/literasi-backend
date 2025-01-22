"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protected_1 = require("../../routes/protected");
const protectedRouter = (0, express_1.Router)();
protectedRouter.use("/books", protected_1.bookRoute);
protectedRouter.use("/users", protected_1.userRoute);
protectedRouter.use("/orders", protected_1.orderRoute);
protectedRouter.use("/order-item", protected_1.orderItemRoute);
protectedRouter.use("/category", protected_1.categoryRoute);
protectedRouter.use("/profile", protected_1.profileRoute);
exports.default = protectedRouter;
//# sourceMappingURL=routes.js.map