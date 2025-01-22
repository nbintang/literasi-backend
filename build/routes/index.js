"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = __importDefault(require("./protected/routes"));
const middleware_1 = __importDefault(require("@/middleware"));
const routes_2 = __importDefault(require("./auth/routes"));
const appRouter = (0, express_1.Router)();
appRouter.use("/protected", (0, middleware_1.default)("jwt"), routes_1.default);
appRouter.use("/auth", routes_2.default);
exports.default = appRouter;
//# sourceMappingURL=index.js.map