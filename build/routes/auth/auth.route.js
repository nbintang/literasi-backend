"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const services_1 = require("../../controller/services");
const middleware_1 = __importDefault(require("../../middleware"));
const validate_schema_1 = require("../../helper/validate-schema");
const auth_schema_1 = require("../../schemas/auth-schema");
const route = (0, express_1.Router)();
exports.authRoute = route;
route.post("/signup", (0, validate_schema_1.validateSchema)(auth_schema_1.signupSchema), services_1.signUp);
route.post("/signin", (0, validate_schema_1.validateSchema)(auth_schema_1.signinSchema), (0, middleware_1.default)("local"), services_1.signIn);
route.post("/signout", (0, middleware_1.default)("jwt"), services_1.signOut);
route.post("/refresh-token", services_1.refreshAccessToken);
//# sourceMappingURL=auth.route.js.map