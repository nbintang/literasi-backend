"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoute = void 0;
const services_1 = require("../../controller/services");
const validate_file_1 = __importDefault(require("../../helper/validate-file"));
const validate_schema_1 = require("../../helper/validate-schema");
const profile_schema_1 = require("../../schemas/profile-schema");
const express_1 = require("express");
const route = (0, express_1.Router)();
exports.profileRoute = route;
route.get("/", services_1.getUserProfileByUserId);
route.get("/details", services_1.getUserProfileDetailsByUserId);
route.put("/update", validate_file_1.default, (0, validate_schema_1.validateSchema)(profile_schema_1.profileSchema), services_1.updateProfileByUserId);
//# sourceMappingURL=profile.route.js.map