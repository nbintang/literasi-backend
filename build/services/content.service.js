"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postContent = postContent;
const posts_repository_1 = require("../repositories/posts.repository");
async function postContent(req, res) {
    const { content, authorId } = req.body;
    if (!content || !authorId) {
        res.status(400).json({ msg: "Missing content or authorId" });
        return;
    }
    try {
        const data = await (0, posts_repository_1.createPosts)({ content, authorId });
        if (!data) {
            res.status(404).json({ msg: "User not found" });
            return;
        }
        res.json({ data });
    }
    catch (error) {
        console.log(error);
    }
}
//# sourceMappingURL=content.service.js.map