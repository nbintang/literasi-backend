"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyManyPosts = exports.destroyPosts = exports.updateContentPosts = exports.findALlPosts = exports.findPostsByIdAndSlug = exports.findUserPostsByIdAndUserId = exports.findSlugPost = exports.findTwoPosts = exports.createPosts = void 0;
const db_1 = require("../db");
const createPosts = async ({ content, authorId, title, slug, }) => {
    return await db_1.db.post.create({
        data: { content, authorId, title, slug },
    });
};
exports.createPosts = createPosts;
const findTwoPosts = async () => {
    return await db_1.db.post.findMany({ take: 2 });
};
exports.findTwoPosts = findTwoPosts;
const findSlugPost = async (slug) => {
    return await db_1.db.post.findFirst({ where: { slug }, select: { slug: true, title: true } });
};
exports.findSlugPost = findSlugPost;
const findUserPostsByIdAndUserId = async ({ authorId, id, }) => {
    return await db_1.db.post.findMany({
        where: { id, authorId },
        include: { author: true },
    });
};
exports.findUserPostsByIdAndUserId = findUserPostsByIdAndUserId;
const findPostsByIdAndSlug = async ({ authorId, id, slug, }) => {
    return await db_1.db.post.findFirst({
        where: { id, slug },
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};
exports.findPostsByIdAndSlug = findPostsByIdAndSlug;
const findALlPosts = async ({ skip, postsPerPage, }) => {
    return await db_1.db.post.findMany({
        take: postsPerPage,
        skip,
        select: {
            id: true,
            slug: true,
            content: true,
            title: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};
exports.findALlPosts = findALlPosts;
const updateContentPosts = async ({ id, slug, title, content, }) => {
    return await db_1.db.post.update({
        where: { id },
        data: {
            slug,
            title,
            content,
        },
        select: {
            id: true,
            slug: true,
            title: true,
            content: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
    });
};
exports.updateContentPosts = updateContentPosts;
const destroyPosts = async ({ id }) => {
    return await db_1.db.post.delete({ where: { id } });
};
exports.destroyPosts = destroyPosts;
const destroyManyPosts = async ({ id }) => {
    return await db_1.db.post.deleteMany({ where: { authorId: id } });
};
exports.destroyManyPosts = destroyManyPosts;
//# sourceMappingURL=posts.repository.js.map