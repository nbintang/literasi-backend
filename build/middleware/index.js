"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const error_response_1 = require("../helper/error-response");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            req.id = user.id;
            req.role = user.role;
            next();
        });
    }
    catch (error) {
        (0, error_response_1.handleErrorResponse)(res, error);
    }
}
//# sourceMappingURL=index.js.map