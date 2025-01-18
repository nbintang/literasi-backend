import { Router } from "express";
import { getUserProfileByUserId, getUserProfileDetailsByUserId, updateProfileByUserId } from "../controller/services";
import { validateSchema } from "../helper/validate-schema";
import { profileSchema } from "../schemas/profile-schema";
import upload from "../lib/upload";

const route = Router();

route.get("/", getUserProfileByUserId);
route.get("/details", getUserProfileDetailsByUserId);
route.put("/update",upload.single("image"), validateSchema(profileSchema), updateProfileByUserId);

export { route as profileRoute };
