"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = uploadToCloudinary;
const cld_1 = require("../lib/cld");
async function uploadToCloudinary(imageBuffer) {
    return new Promise((resolve, reject) => {
        cld_1.cloudinary.uploader
            .upload_stream({ folder: "bookstore" }, (error, result) => {
            if (error || !result) {
                return reject(error);
            }
            resolve(result.secure_url);
        })
            .end(imageBuffer);
    });
}
//# sourceMappingURL=upload-to-cloudinary.js.map