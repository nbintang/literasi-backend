"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.createUser = exports.findUserById = exports.findUsers = void 0;
const db_1 = require("../../lib/db");
const findUsers = async () => await db_1.db.user.findMany({
    where: { role: "USER" },
    select: {
        email: true,
        name: true,
        id: true,
        createdAt: true,
        updatedAt: true,
    },
});
exports.findUsers = findUsers;
const findUserById = async (id) => await db_1.db.user.findUnique({
    where: { id, role: "USER" },
    select: {
        email: true,
        name: true,
        id: true,
        createdAt: true,
        updatedAt: true,
    },
});
exports.findUserById = findUserById;
const createUser = async ({ email, password, name }) => {
    const newUser = await db_1.db.user.create({
        data: { email, password, name },
    });
    const user = await (0, exports.findUserById)(newUser.id);
    return user;
};
exports.createUser = createUser;
const findUserByEmail = async (email) => await db_1.db.user.findUnique({ where: { email } });
exports.findUserByEmail = findUserByEmail;
//# sourceMappingURL=users.repository.js.map