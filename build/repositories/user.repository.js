"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyUser = exports.updateUserById = exports.findUserEmail = exports.createUser = exports.findUserAndUserPostsByUserId = exports.findUserById = exports.findUserAndPosts = exports.findUser = void 0;
const db_1 = require("../db");
const findUser = async ({ userPerPage, skip, }) => {
    return await db_1.db.user.findMany({
        take: userPerPage,
        skip,
    });
};
exports.findUser = findUser;
const findUserAndPosts = async (page, pageSize) => {
    const skip = (page - 1) * pageSize;
    const usersWithPosts = await db_1.db.user.findMany({
        take: pageSize,
        skip: skip,
        include: {
            posts: {
                take: pageSize,
                skip: skip,
            },
        },
    });
    return usersWithPosts;
};
exports.findUserAndPosts = findUserAndPosts;
const findUserById = async ({ id }) => {
    return await db_1.db.user.findFirst({
        where: { id },
    });
};
exports.findUserById = findUserById;
const findUserAndUserPostsByUserId = async ({ id, postsPerPage, skip, }) => {
    return await db_1.db.user.findFirst({
        where: { id },
        include: {
            posts: {
                take: postsPerPage,
                skip,
            },
        },
    });
};
exports.findUserAndUserPostsByUserId = findUserAndUserPostsByUserId;
const createUser = async ({ name, email, }) => {
    return await db_1.db.user.create({
        data: {
            name,
            email,
        },
    });
};
exports.createUser = createUser;
const findUserEmail = async (email) => {
    return await db_1.db.user.findFirst({
        where: { email },
        select: { email: true },
    });
};
exports.findUserEmail = findUserEmail;
const updateUserById = async ({ id, name, email, }) => {
    return await db_1.db.user.update({
        where: { id },
        data: {
            name,
            email,
        },
    });
};
exports.updateUserById = updateUserById;
const destroyUser = async ({ id }) => {
    return await db_1.db.user.delete({ where: { id } });
};
exports.destroyUser = destroyUser;
//# sourceMappingURL=user.repository.js.map