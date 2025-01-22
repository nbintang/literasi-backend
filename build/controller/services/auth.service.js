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
const repositories_1 = require("../../controller/repositories");
const jwt_1 = require("../../lib/jwt");
const error_response_1 = require("../../helper/error-response");
async function signUp(req, res, next) {
    const { email, password, name } = req.body;
    const userExists = await (0, repositories_1.findUserByEmail)(email);
    try {
        if (userExists)
            throw new error_response_1.CustomError("User already exists", 400);
        const hashPw = await bcrypt_1.default.hash(password, 10);
        const user = await (0, repositories_1.createUser)({ email, password: hashPw, name });
        if (!user)
            throw new error_response_1.CustomError("User not created", 500);
        req.logIn(user, (err) => {
            if (err)
                return next(err);
            res.status(200).json({
                success: true,
                message: "Welcome!...",
                user,
            });
        });
    }
    catch (error) {
        console.error("Error in 'signUp", error); // Log the error to check its details
        next(error);
    }
}
async function signIn(req, res, next) {
    try {
        const user = req.user;
        if (!user)
            throw new error_response_1.CustomError("Unauthorized", 401);
        if ("accessToken" in user && "refreshToken" in user) {
            const { accessToken, refreshToken } = user;
            if (accessToken && refreshToken) {
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
                    maxAge: 24 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    success: true,
                    message: "Welcome!...",
                    accessToken,
                    refreshToken,
                });
            }
        }
    }
    catch (error) {
        console.error("Error in 'signIn", error); // Log the error to check its details
        next(error);
    }
}
async function refreshAccessToken(req, res, next) {
    const { refreshToken } = req.cookies;
    try {
        if (!refreshToken)
            throw new error_response_1.CustomError("Refresh token not found", 404);
        const decode = (await (0, jwt_1.verifyToken)(refreshToken));
        const accessToken = await (0, jwt_1.generateAccessToken)({
            id: decode.id.toString(),
            role: decode.role,
        });
        res.status(200).json({ success: true, accessToken });
    }
    catch (error) {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        next(error);
    }
}
async function signOut(req, res, next) {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken)
            throw new error_response_1.CustomError("Refresh token not found", 404);
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.status(200).json({ message: "Sign out successfully" });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.service.js.map