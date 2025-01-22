"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = manageCloudinaryImages;
exports.uploadImgToCloudinary = uploadImgToCloudinary;
const cld_1 = require("../lib/cld");
async function manageCloudinaryImages({ buffer, folder = "book-covers", public_id, }) {
    if (public_id) {
        try {
            await checkAndDestroyImage(public_id);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    return await uploadImgToCloudinary({ buffer, folder, public_id });
}
async function checkAndDestroyImage(public_id) {
    return new Promise((resolve, reject) => {
        if (!public_id)
            return resolve();
        cld_1.cloudinary.api.resource(public_id, (error, result) => {
            if (error || !result) {
                return reject(error);
            }
            cld_1.cloudinary.uploader.destroy(public_id, (destroyError) => {
                if (destroyError) {
                    return reject(destroyError);
                }
                resolve();
            });
        });
    });
}
async function uploadImgToCloudinary({ buffer, folder, public_id, }) {
    return new Promise((resolve, reject) => {
        cld_1.cloudinary.uploader
            .upload_stream({
            folder,
            resource_type: "image",
            public_id,
        }, (error, result) => {
            if (error || !result) {
                return reject(error);
            }
            resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
            });
        })
            .end(buffer);
    });
}
//# sourceMappingURL=manage-cloudinary-img.js.map