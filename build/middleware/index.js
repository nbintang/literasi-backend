"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const passport_1 = __importDefault(require("passport"));
const repositories_1 = require("../controller/repositories");
const passport_jwt_1 = require("passport-jwt");
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}, async (jwtPayload, done) => {
    try {
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
exports.authMiddleware = passport_1.default.authenticate("jwt", { session: false });
//# sourceMappingURL=index.js.map