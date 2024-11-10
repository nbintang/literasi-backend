"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const router_1 = __importDefault(require("../lib/router"));
exports.userRoute = router_1.default;
const user_service_1 = require("../services/user.service");
router_1.default.get("/users", user_service_1.getUsers);
router_1.default.get("/users/:id", user_service_1.getUserById);
router_1.default.get("/users/:id/posts", user_service_1.getUserAndUserPostsByUserId);
router_1.default.post("/users", user_service_1.postUser);
router_1.default.patch("/users/:id", user_service_1.patchUser);
router_1.default.delete("/users/:id", user_service_1.deleteUser);
//# sourceMappingURL=user.route.js.map