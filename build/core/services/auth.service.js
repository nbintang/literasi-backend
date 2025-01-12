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
const users_repository_1 = require("../repositories/users.repository");
const jwt_1 = require("../../lib/jwt");
const error_response_1 = require("../../helper/error-response");
async function signUp(req, res) {
    const { email, password, name } = req.body;
    try {
        const hashPw = await bcrypt_1.default.hash(password, 10);
        const user = await (0, users_repository_1.createUser)({ email, password: hashPw, name });
        res.status(201).json({ message: "User created", data: user });
    }
    catch (error) {
        (0, error_response_1.handleErrorResponse)(res, error);
    }
}
async function signIn(req, res) {
    const { email, password } = req.body;
    try {
        const userExisted = await (0, users_repository_1.findUserByEmail)(email);
        if (!userExisted) {
            const error = new Error("User not found");
            return (0, error_response_1.handleErrorResponse)(res, error, 404);
        }
        const isPwValid = await bcrypt_1.default.compare(password, userExisted.password);
        if (!isPwValid) {
            const error = new Error("Invalid password");
            return (0, error_response_1.handleErrorResponse)(res, error, 401);
        }
        const id = userExisted.id.toString();
        const accessToken = await (0, jwt_1.generateAccessToken)({
            id,
            role: userExisted.role,
        });
        const refreshToken = await (0, jwt_1.generateRefreshToken)({
            id,
            role: userExisted.role,
        });
        res.cookie("refreshToken", refreshToken, {
            sameSite: "lax",
            secure: false,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: "Welcome!...",
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        (0, error_response_1.handleErrorResponse)(res, error);
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
    res.status(200).json({ message: "Sign out successfully" });
}
//# sourceMappingURL=auth.service.js.map