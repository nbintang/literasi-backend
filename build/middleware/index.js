"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const authMiddleware = (strategy) => {
    return (req, res, next) => {
        passport_1.default.authenticate(strategy, { failWithError: true }, (err, user, info) => {
            if (err)
                return next(err);
            if (!user) {
                res.status(401).json({ success: false, message: info.message });
                return;
            }
            req.user = user;
            return next();
        })(req, res, next);
    };
};
exports.default = authMiddleware;
//# sourceMappingURL=index.js.map