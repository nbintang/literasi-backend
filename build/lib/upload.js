"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Set up the storage configuration (optional, can be omitted for default storage)
const storage = multer_1.default.memoryStorage();
// Create a file filter to accept only jpg, jpeg, and png
const fileFilter = (req, file, cb) => {
    // Accept only .jpg, .jpeg, and .png files
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // Accept the file
    }
    else {
        cb(new Error('Invalid file type. Only JPG, PNG, and JPEG are allowed!')); // Reject the file
    }
};
// Set up multer with the storage and file filter
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Limit the file size (e.g., 10MB)
});
exports.default = upload;
//# sourceMappingURL=upload.js.map