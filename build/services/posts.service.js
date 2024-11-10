"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postPosts = postPosts;
exports.getPostsByIdAndSlug = getPostsByIdAndSlug;
exports.getAllPosts = getAllPosts;
exports.patchPostsContent = patchPostsContent;
exports.deletePosts = deletePosts;
const posts_repository_1 = require("../repositories/posts.repository");
const format_slug_1 = require("../helper/format-slug");
const posts_repository_2 = require("../repositories/posts.repository");
async function postPosts(req, res) {
    const { content, authorId, title } = req.body;
    if (!content || !authorId || !title) {
        res.status(400).json({ msg: "Missing content or authorId" });
        return;
    }
    const slug = await (0, format_slug_1.generateSlugTitle)(title);
    try {
        const verifyTitle = await (0, posts_repository_2.findSlugPost)(slug);
        if (slug === verifyTitle?.slug) {
            res.status(400).json({ msg: "Title already exists" });
            return;
        }
        const data = await (0, posts_repository_1.createPosts)({
            content,
            authorId,
            title,
            slug,
        });
        if (!data) {
            res.status(404).json({ msg: "User not found" });
            return;
        }
        res.status(200).json({ data });
    }
    catch (error) {
        console.log(error);
    }
}
async function getPostsByIdAndSlug(req, res) {
    const id = Number(req.params.id);
    const authorId = Number(req.query.authorId);
    const slug = req.query.slug;
    const data = await (0, posts_repository_1.findPostsByIdAndSlug)({ id, slug, authorId });
    if (!data) {
        res.status(404).json({ msg: "Post not found" });
        return;
    }
    res.status(200).json({ data });
}
async function getAllPosts(req, res) {
    const page = Number(req.query.page) || 1;
    const postsPerPage = 5;
    const skip = (page - 1) * postsPerPage;
    const data = await (0, posts_repository_1.findALlPosts)({ skip, postsPerPage });
    res.status(200).json({ data });
}
async function patchPostsContent(req, res) {
    const id = Number(req.params.id);
    const { content, title } = req.body;
    if (!content || !title) {
        res.status(400).json({ msg: "Missing content" });
        return;
    }
    try {
        const generatedSlug = await (0, format_slug_1.generateSlugTitle)(title);
        const data = await (0, posts_repository_1.updateContentPosts)({
            slug: generatedSlug,
            content,
            title,
            id,
        });
        res.status(200).json({ data });
    }
    catch (error) {
        console.log(error);
    }
}
async function deletePosts(req, res) {
    const id = Number(req.params.id);
    const data = await (0, posts_repository_1.destroyPosts)({ id });
    if (data)
        res.status(200).json({ msg: "Post deleted successfully" });
}
//# sourceMappingURL=posts.service.js.map