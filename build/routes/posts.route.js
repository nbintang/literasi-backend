"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRoute = void 0;
const router_1 = __importDefault(require("../lib/router"));
exports.postsRoute = router_1.default;
const posts_service_1 = require("../services/posts.service");
router_1.default.get("/posts", posts_service_1.getAllPosts);
router_1.default.get("/posts/:id", posts_service_1.getPostsByIdAndSlug);
router_1.default.post("/posts", posts_service_1.postPosts);
router_1.default.patch("/posts/:id", posts_service_1.patchPostsContent);
router_1.default.delete("/posts/:id", posts_service_1.deletePosts);
//# sourceMappingURL=posts.route.js.map