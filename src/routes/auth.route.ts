import { Router } from "express";
import {
  refreshAccessToken,
  signIn,
  signOut,
  signUp,
} from "../controller/services";
import authMiddleware from "../middleware";
import { validateSchema } from "../helper/validate-schema";
import { signinSchema, signupSchema } from "../schemas/auth-schema";
import passport from "passport";
const route = Router();

route.post("/signup", validateSchema(signupSchema), signUp);
route.post(
  "/signin",
  validateSchema(signinSchema),
  authMiddleware("local"),
  signIn
);
route.post("/signout", authMiddleware("jwt"), signOut);
route.post("/refresh-token", refreshAccessToken);
export { route as authRoute };
