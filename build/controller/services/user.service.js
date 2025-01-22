"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserById = getUserById;
const repositories_1 = require("../../controller/repositories");
const error_response_1 = require("../../helper/error-response");
async function getUsers(req, res) {
    const users = await (0, repositories_1.findUsers)();
    res.status(200).json({ success: true, data: users });
}
async function getUserById(req, res, next) {
    try {
        const { id } = req.params;
        if (!id)
            throw new error_response_1.CustomError("User id not found", 404);
        const user = await (0, repositories_1.findUserById)(id);
        if (!user)
            throw new error_response_1.CustomError("User not found", 404);
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=user.service.js.map