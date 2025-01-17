
import { Router } from "express";
import {
  refreshAccessToken,
  signIn,
  signOut,
  signUp,
} from "../controller/services";
import { authMiddleware } from "../middleware";
import { validateSchema } from "../helper/validate-schema";
import { signinSchema, signupSchema } from '../controller/schemas/auth-schema';
const route =Router()

route.post("/signup",validateSchema(signupSchema), signUp);
route.post("/signin", validateSchema(signinSchema), signIn);
route.post("/signout", authMiddleware, signOut);
route.post("/refresh-token", refreshAccessToken);
export { route as authRoute };
