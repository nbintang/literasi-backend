"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserById = getUserById;
const repositories_1 = require("../repositories");
const error_response_1 = require("../../helper/error-response");
async function getUsers(req, res) {
    const users = await (0, repositories_1.findUsers)();
    res.status(200).json({ success: true, data: users });
}
async function getUserById(req, res) {
    const { id } = req.params;
    if (!id) {
        const error = new Error("Invalid user id");
        return (0, error_response_1.handleErrorResponse)(res, error);
    }
    const user = await (0, repositories_1.findUserById)(id);
    if (!user) {
        const error = new Error("User not found");
        return (0, error_response_1.handleErrorResponse)(res, error, 404);
    }
    res.status(200).json({ success: true, data: user });
}
//# sourceMappingURL=user.service.js.map