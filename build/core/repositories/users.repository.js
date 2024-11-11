"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.createUser = exports.findUserById = exports.findUsers = void 0;
const db_1 = require("../../lib/db");
const findUsers = async () => await db_1.db.user.findMany({ where: { role: "USER" }, });
exports.findUsers = findUsers;
const findUserById = async (id) => await db_1.db.user.findUnique({ where: { id }, include: { orders: true } });
exports.findUserById = findUserById;
const createUser = async ({ email, password, name }) => await db_1.db.user.create({
    data: { email, password, name },
    select: { email: true, name: true },
});
exports.createUser = createUser;
const findUserByEmail = async (email) => await db_1.db.user.findUnique({ where: { email } });
exports.findUserByEmail = findUserByEmail;
//# sourceMappingURL=users.repository.js.map