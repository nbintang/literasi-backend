"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.getUserAndUserPosts = getUserAndUserPosts;
exports.getUserAndUserPostsByUserId = getUserAndUserPostsByUserId;
exports.postUser = postUser;
exports.patchUser = patchUser;
exports.deleteUser = deleteUser;
const user_repository_1 = require("../repositories/user.repository");
const posts_repository_1 = require("../repositories/posts.repository");
async function getUsers(req, res) {
    const page = Number(req.query.page) || 1;
    const userPerPage = 10;
    const skip = (page - 1) * userPerPage;
    const data = await (0, user_repository_1.findUser)({ skip, userPerPage });
    res.status(200).json({ data });
}
async function getUserById(req, res) {
    const id = Number(req.params.id);
    const data = await (0, user_repository_1.findUserById)({ id });
    if (!data) {
        res.status(404).json({ msg: "User not found" });
        return;
    }
    res.status(200).json({
        data,
    });
}
async function getUserAndUserPosts(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 2;
    const data = await (0, user_repository_1.findUserAndPosts)(page, pageSize);
    res.status(200).json({ data });
}
async function getUserAndUserPostsByUserId(req, res) {
    const id = Number(req.params.id);
    const page = Number(req.query.page) || 1;
    const postsPerPage = 5;
    const skip = (page - 1) * postsPerPage;
    const data = await (0, user_repository_1.findUserAndUserPostsByUserId)({ id, postsPerPage, skip });
    if (!data) {
        res.status(404).json({ msg: "User not found" });
        return;
    }
    res.status(200).json({ data });
}
async function postUser(req, res) {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({ msg: "Missing name or email" });
        return;
    }
    const verifyEmail = await (0, user_repository_1.findUserEmail)(email);
    if (verifyEmail) {
        res.status(400).json({ msg: "Email already exists" });
        return;
    }
    try {
        const data = await (0, user_repository_1.createUser)({ name, email });
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
async function patchUser(req, res) {
    const id = Number(req.params.id);
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({ msg: "Missing name or email" });
        return;
    }
    try {
        const data = await (0, user_repository_1.updateUserById)({ id, name, email });
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
async function deleteUser(req, res) {
    const id = Number(req.params.id);
    const dataPosts = await (0, posts_repository_1.destroyManyPosts)({ id });
    const data = await (0, user_repository_1.destroyUser)({ id });
    if (!data || !dataPosts) {
        res.status(404).json({ msg: "User not found" });
        return;
    }
    res.status(200).json({ msg: "User deleted successfully" });
}
//# sourceMappingURL=user.service.js.map