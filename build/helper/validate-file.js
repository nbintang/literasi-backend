"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const error_response_1 = require("./error-response");
const path_1 = __importDefault(require("path"));
// Set up the storage configuration (optional, can be omitted for default storage)
const storage = multer_1.default.memoryStorage();
// Create a file filter to accept only jpg, jpeg, and png
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    // Accept only .jpg, .jpeg, and .png files
    if (mimetype && extname) {
        cb(null, true); // Accept the file
    }
    else {
        cb(new error_response_1.CustomError("Invalid file type. Only JPG, PNG, and JPEG are allowed!")); // Reject the file
    }
};
// Set up multer with the storage and file filter
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 }, // Optional: Limit the file size (e.g., 1MB)
});
const validateSingleFile = upload.single("image");
exports.default = validateSingleFile;
//# sourceMappingURL=validate-file.js.map