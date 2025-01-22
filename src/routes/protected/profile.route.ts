import {
  getUserProfileByUserId,
  getUserProfileDetailsByUserId,
  updateProfileByUserId,
} from "@/controller/services";
import validateSingleFile from "@/helper/validate-file";
import { validateSchema } from "@/helper/validate-schema";
import { profileSchema } from "@/schemas/profile-schema";
import { Router } from "express";

const route = Router();

route.get("/", getUserProfileByUserId);
route.get("/details", getUserProfileDetailsByUserId);
route.put(
  "/update",
  validateSingleFile,
  validateSchema(profileSchema),
  updateProfileByUserId
);

export { route as profileRoute };
