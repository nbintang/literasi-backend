"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoute = void 0;
const express_1 = require("express");
const services_1 = require("../controller/services");
const validate_schema_1 = require("../helper/validate-schema");
const profile_schema_1 = require("../controller/schemas/profile-schema");
const upload_1 = __importDefault(require("../lib/upload"));
const route = (0, express_1.Router)();
exports.profileRoute = route;
route.get("/", services_1.getUserProfileByUserId);
route.get("/details", services_1.getUserProfileDetailsByUserId);
route.put("/update", upload_1.default.single("image"), (0, validate_schema_1.validateSchema)(profile_schema_1.profileSchema), services_1.updateProfileByUserId);
//# sourceMappingURL=profile.route.js.map