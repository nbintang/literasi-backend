"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const auth_service_1 = require("../core/services/auth.service");
const index_1 = require("../middleware/index");
const route = (0, express_1.Router)();
exports.authRoute = route;
route.post("/signup", auth_service_1.signUp);
route.post("/signin", auth_service_1.signIn);
route.post("/signout", index_1.authMiddleware, auth_service_1.signOut);
route.post("/refresh-token", auth_service_1.refreshAccessToken);
//# sourceMappingURL=auth.route.js.map