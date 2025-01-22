"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProfileByUserId = findProfileByUserId;
exports.updateProfile = updateProfile;
const db_1 = require("@/lib/db");
async function findProfileByUserId(userId) {
    const user = await db_1.db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            profile: {
                select: {
                    image: true,
                    role: true,
                    fullname: true,
                    bio: true,
                },
            },
            name: true,
            email: true,
        },
    });
    return {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        ...user?.profile,
    };
}
async function updateProfile(userId, data) {
    return await db_1.db.profile.update({
        where: { userId },
        data
    });
}
//# sourceMappingURL=profile.repository.js.map