"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserById = getUserById;
const users_repository_1 = require("../repositories/users.repository");
const error_response_1 = require("../../helper/error-response");
async function getUsers(req, res) {
    const users = await (0, users_repository_1.findUsers)();
    res.status(200).json(users);
}
async function getUserById(req, res) {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        const error = new Error("Invalid user id");
        return (0, error_response_1.handleErrorResponse)(res, error);
    }
    const user = await (0, users_repository_1.findUserById)(Number(id));
    if (!user) {
        const error = new Error("User not found");
        return (0, error_response_1.handleErrorResponse)(res, error, 404);
    }
    res.status(200).json({ success: true, data: user });
}
//# sourceMappingURL=user.service.js.map