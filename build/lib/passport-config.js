"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const repositories_1 = require("../controller/repositories");
const bcrypt_1 = __importDefault(require("bcrypt"));
const initializeLocalPassport = () => {
    passport_1.default.use(new passport_local_1.Strategy({
        usernameField: "email",
        passwordField: "password",
    }, async (email, password, done) => {
        try {
            const userExisted = await (0, repositories_1.findUserByEmail)(email);
            if (!userExisted || !userExisted.profile) {
                return done(null, false, { message: "User not found" });
            }
            const isPwValid = await bcrypt_1.default.compare(password, userExisted.password);
            if (!isPwValid) {
                return done(null, false, { message: "Password is not valid" });
            }
            const filterUser = {
                id: userExisted.id,
                email: userExisted.email,
                username: userExisted.name,
                role: userExisted.profile.role,
            };
            return done(null, filterUser);
        }
        catch (error) {
            return done(error);
        }
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
exports.default = initializeLocalPassport;
//# sourceMappingURL=passport-config.js.map