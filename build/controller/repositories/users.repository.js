"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.createUser = exports.findUserById = exports.findUsers = void 0;
const db_1 = require("../../lib/db");
const findUsers = async () => await db_1.db.user.findMany({
    where: {
        profile: {
            role: "USER",
        },
    },
    select: {
        email: true,
        name: true,
        id: true,
        createdAt: true,
        updatedAt: true,
    },
});
exports.findUsers = findUsers;
const findUserById = async (id) => {
    const user = await db_1.db.user.findUnique({
        where: { id },
        select: {
            email: true,
            name: true,
            id: true,
            profile: {
                select: {
                    image: true,
                    role: true,
                },
            },
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user)
        return null;
    // Return a clean response without the profile field
    return {
        email: user.email,
        name: user.name,
        id: user.id,
        image: user.profile?.image,
        role: user.profile?.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.findUserById = findUserById;
const createUser = async ({ email, password, name }) => {
    const newUser = await db_1.db.user.create({
        data: { email, password, name },
    });
    const user = await (0, exports.findUserById)(newUser.id);
    return user;
};
exports.createUser = createUser;
const findUserByEmail = async (email) => await db_1.db.user.findUnique({
    where: { email },
    include: { profile: { select: { image: true, role: true } } },
});
exports.findUserByEmail = findUserByEmail;
//# sourceMappingURL=users.repository.js.map