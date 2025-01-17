"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileByUserId = getUserProfileByUserId;
exports.getUserProfileDetailsByUserId = getUserProfileDetailsByUserId;
exports.updateProfileByUserId = updateProfileByUserId;
const error_response_1 = require("../../helper/error-response");
const repositories_1 = require("../repositories");
const manage_cloudinary_img_1 = __importDefault(require("../../helper/manage-cloudinary-img"));
async function getUserProfileByUserId(req, res) {
    const user = req.user;
    if (!user)
        return (0, error_response_1.handleErrorResponse)(res, new Error("Unauthorized"), 401);
    res.status(200).json({ success: true, data: user });
}
async function getUserProfileDetailsByUserId(req, res) {
    const userId = req.user.id;
    if (!userId)
        return (0, error_response_1.handleErrorResponse)(res, new Error("Unauthorized"), 401);
    const profile = await (0, repositories_1.findProfileByUserId)(userId);
    if (!profile)
        return (0, error_response_1.handleErrorResponse)(res, new Error("Profile not found"), 404);
    res.status(200).json({ success: true, data: profile });
}
async function updateProfileByUserId(req, res) {
    const user = req.user;
    const { fullname, bio } = req.body;
    const image = req.file;
    if (!user)
        return (0, error_response_1.handleErrorResponse)(res, new Error("Unauthorized"), 401);
    if (!fullname || !bio || !image)
        return (0, error_response_1.handleErrorResponse)(res, new Error("No data to update"), 400);
    const { secure_url } = await (0, manage_cloudinary_img_1.default)({ buffer: image.buffer });
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
//# sourceMappingURL=profile.service.js.map