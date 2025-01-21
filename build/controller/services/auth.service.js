"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = signUp;
exports.signIn = signIn;
exports.refreshAccessToken = refreshAccessToken;
exports.signOut = signOut;
const bcrypt_1 = __importDefault(require("bcrypt"));
const repositories_1 = require("../repositories");
const jwt_1 = require("../../lib/jwt");
const error_response_1 = require("../../helper/error-response");
async function signUp(req, res) {
    const { email, password, name } = req.body;
    const userExists = await (0, repositories_1.findUserByEmail)(email);
    if (userExists)
        return (0, error_response_1.handleErrorResponse)(res, new Error("User already exists"));
    try {
        const hashPw = await bcrypt_1.default.hash(password, 10);
        const user = await (0, repositories_1.createUser)({ email, password: hashPw, name });
        if (!user)
            return (0, error_response_1.handleErrorResponse)(res, new Error("Failed to create signup"));
        req.logIn(user, (err) => {
            if (err) {
                return (0, error_response_1.handleErrorResponse)(res, err);
            }
            res.status(200).json({
                success: true,
                message: "Welcome!...",
                user,
            });
        });
    }
    catch (error) {
        (0, error_response_1.handleErrorResponse)(res, error);
    }
}
async function signIn(req, res, next) {
    try {
        const { accessToken, refreshToken } = req.user;
        if (accessToken && refreshToken) {
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
                maxAge: 24 * 60 * 60 * 1000,
            });
        }
        res.status(200).json({
            success: true,
            message: "Welcome!...",
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        console.error("Error in 'signIn", error); // Log the error to check its details
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}
async function refreshAccessToken(req, res, next) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        const error = new Error("Refresh token not found");
        return (0, error_response_1.handleErrorResponse)(res, error, 404);
    }
    try {
        const decode = (await (0, jwt_1.verifyToken)(refreshToken));
        const accessToken = await (0, jwt_1.generateAccessToken)({
            id: decode.id.toString(),
            role: decode.role,
        });
        res.status(200).json({ success: true, accessToken });
    }
    catch (error) {
        res.clearCookie("refreshToken");
        return (0, error_response_1.handleErrorResponse)(res, error, 401);
    }
}
async function signOut(req, res) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        const error = new Error("Refresh token not found");
        return (0, error_response_1.handleErrorResponse)(res, error, 404);
    }
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Sign out successfully" });
}
//# sourceMappingURL=auth.service.js.map