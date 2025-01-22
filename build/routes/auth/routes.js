"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../routes/auth");
const authRouter = (0, express_1.Router)();
authRouter.use(auth_1.authRoute);
exports.default = authRouter;
//# sourceMappingURL=routes.js.map