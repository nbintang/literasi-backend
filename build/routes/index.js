"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_route_1 = require("./posts.route");
const user_route_1 = require("./user.route");
const router_1 = __importDefault(require("../lib/router"));
router_1.default.use(posts_route_1.postsRoute);
router_1.default.use(user_route_1.userRoute);
exports.default = router_1.default;
//# sourceMappingURL=index.js.map