"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const router_1 = __importDefault(require("../lib/router"));
exports.authRoute = router_1.default;
const auth_service_1 = require("../core/services/auth.service");
const index_1 = require("../middleware/index");
router_1.default.post("/signup", auth_service_1.signUp);
router_1.default.post("/signin", auth_service_1.signIn);
router_1.default.post("/signout", index_1.authMiddleware, auth_service_1.signOut);
router_1.default.post("/refresh-token", auth_service_1.refreshAccessToken);
//# sourceMappingURL=auth.route.js.map