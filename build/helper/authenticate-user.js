"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authenticateUser;
const passport_1 = __importDefault(require("passport"));
async function authenticateUser(req, res) {
    return new Promise((resolve, reject) => {
        passport_1.default.authenticate("local", (err, user, info) => {
            if (err)
                return reject(new Error(err.message));
            if (!user)
                return reject(new Error(info.message));
            resolve(user);
        })(req, res);
    });
}
//# sourceMappingURL=authenticate-user.js.map