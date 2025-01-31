import { Router } from "express";
import {
  refreshAccessToken,
  resendEmailToken,
  signIn,
  signOut,
  signUp,
  verifyEmailToken,
} from "@/controller/services";
import {authMiddleware} from "@/middleware";
import { validateSchema } from "@/helper/validate-schema";
import { signinSchema, signupSchema } from "@/schemas/auth-schema";
const route = Router();

route.post("/signup", validateSchema(signupSchema), signUp);
route.post(
  "/signin",
  validateSchema(signinSchema),
  authMiddleware("local"),
  signIn
);
route.post("/verify-otp", verifyEmailToken);
route.post("/resend-otp", resendEmailToken);
route.post("/signout", authMiddleware("jwt"), signOut);
route.post("/refresh-token", refreshAccessToken);
export { route as authRoute };
