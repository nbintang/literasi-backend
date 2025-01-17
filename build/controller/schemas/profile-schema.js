"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.profileSchema = zod_1.default.object({
    fullname: zod_1.default
        .string()
        .min(6, {
        message: "Name must be at least 6 characters",
    })
        .max(100, {
        message: "Name must be at most 50 characters",
    }),
    bio: zod_1.default
        .string()
        .min(6, {
        message: "Name must be at least 6 characters",
    })
        .max(500, {
        message: "Name must be at most 50 characters",
    }),
});
//# sourceMappingURL=profile-schema.js.map