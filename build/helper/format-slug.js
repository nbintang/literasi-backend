"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlugTitle = void 0;
const generateSlugTitle = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
};
exports.generateSlugTitle = generateSlugTitle;
//# sourceMappingURL=format-slug.js.map