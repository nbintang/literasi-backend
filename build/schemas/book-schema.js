"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookSchema = void 0;
const z = __importStar(require("zod"));
exports.bookSchema = z.object({
    title: z
        .string()
        .min(6, {
        message: "Title must be at least 6 characters",
    })
        .max(50, {
        message: "Title must be at most 50 characters",
    }),
    description: z
        .string()
        .min(12, {
        message: "Description must be at least 12 characters",
    })
        .max(600, {
        message: "Description must be at most 600 characters",
    }),
    price: z.coerce.number(),
    content: z
        .string()
        .min(200, {
        message: "Content must be at least 200 characters",
    })
        .max(65535, {
        message: "Content must be at most 65535 characters",
    }),
    authorName: z
        .string()
        .min(6, {
        message: "Author name must be at least 6 characters",
    })
        .max(100, {
        message: "Author name must be at most 100 characters",
    }),
    stock: z.coerce.number().default(0),
    categories: z.array(z
        .string()
        .min(4, { message: "Category must be at least 4 characters" })
        .max(50, { message: "Category must be at most 50 characters" })
        .min(1, {
        message: "Category is required",
    })),
});
//# sourceMappingURL=book-schema.js.map