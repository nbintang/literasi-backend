"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileByUserId = getUserProfileByUserId;
exports.getUserProfileDetailsByUserId = getUserProfileDetailsByUserId;
exports.updateProfileByUserId = updateProfileByUserId;
const error_response_1 = require("@/helper/error-response");
const repositories_1 = require("@/controller/repositories");
const manage_cloudinary_img_1 = __importDefault(require("@/helper/manage-cloudinary-img"));
async function getUserProfileByUserId(req, res, next) {
    try {
        const user = req.user;
        if (!user)
            throw new error_response_1.CustomError("Unauthorized", 401);
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
}
async function getUserProfileDetailsByUserId(req, res, next) {
    try {
        const userId = req.user.id;
        if (!userId)
            throw new error_response_1.CustomError("Unauthorized", 401);
        const profile = await (0, repositories_1.findProfileByUserId)(userId);
        if (!profile)
            throw new error_response_1.CustomError("Profile not found", 404);
        res.status(200).json({ success: true, data: profile });
    }
    catch (error) {
        next(error);
    }
}
async function updateProfileByUserId(req, res, next) {
    try {
        const user = req.user;
        const { fullname, bio } = req.body;
        const image = req.file;
        if (!user)
            throw new error_response_1.CustomError("Unauthorized", 401);
        if (!fullname || !bio || !image)
            throw new error_response_1.CustomError("Invalid data", 400);
        const { secure_url } = await (0, manage_cloudinary_img_1.default)({
            buffer: image.buffer,
        });
        const updatedProfile = await (0, repositories_1.updateProfile)(user.id, {
            fullname,
            bio,
            image: secure_url,
        });
        const profile = {
            id: updatedProfile.userId,
            fullname: updatedProfile.fullname,
            bio: updatedProfile.bio,
            image: updatedProfile.image,
        };
        res.status(200).json({ success: true, data: profile });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=profile.service.js.map