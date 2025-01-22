"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const repositories_1 = require("../controller/repositories");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("./jwt");
const passport_jwt_1 = require("passport-jwt");
const initializeLocalPassport = () => {
    passport_1.default.use("local", new passport_local_1.Strategy({
        usernameField: "email",
        passwordField: "password",
    }, async (email, password, done) => {
        const userExisted = await (0, repositories_1.findUserByEmail)(email);
        if (!userExisted || !userExisted.profile) {
            return done(null, false, { message: "User not found" });
        }
        const isPwValid = await bcrypt_1.default.compare(password, userExisted.password);
        if (!isPwValid) {
            return done(null, false, { message: "Password is not valid" });
        }
        const { accessToken, refreshToken } = await (0, jwt_1.generateTokens)({
            id: userExisted.id.toString(),
            role: userExisted.profile.role,
        });
        const filterUser = {
            id: userExisted.id,
            accessToken,
            refreshToken,
        };
        return done(null, filterUser);
    }));
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport_1.default.deserializeUser(async (id, done) => {
        try {
            const user = await (0, repositories_1.findUserById)(id);
            if (!user)
                return done(null, false);
            const safeUser = {
                id: user.id,
                email: user.email,
                username: user.name,
                image: user.image,
                role: user.role,
            };
            done(null, safeUser);
        }
        catch (error) {
            done(error);
        }
    });
};
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}, async (jwtPayload, done) => {
    try {
        if (!jwtPayload.id)
            return done(null, false, { message: "Unauthorized" });
        const user = await (0, repositories_1.findUserById)(jwtPayload.id);
        if (!user)
            return done(null, false, { message: "User not found" });
        const safeUser = {
            id: user.id,
            image: user.image,
            username: user.name,
            email: user.email,
        };
        return done(null, safeUser);
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.use("signup", new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}, async (req, email, password, done) => {
    const userExisted = await (0, repositories_1.findUserByEmail)(email);
    if (userExisted) {
        return done(null, false, { message: "User already exists" });
    }
    const hashPw = await bcrypt_1.default.hash(password, 10);
    const user = await (0, repositories_1.createUser)({
        email,
        password: hashPw,
        name: req.body.name,
    });
    if (!user)
        return done(null, false, { message: "Failed to create user" });
    const { accessToken, refreshToken } = await (0, jwt_1.generateTokens)({
        id: user.id.toString(),
        role: user.role,
    });
    const filterUser = {
        id: user.id,
        accessToken,
        refreshToken,
    };
    return done(null, filterUser);
}));
exports.default = initializeLocalPassport;
//# sourceMappingURL=passport-config.js.map