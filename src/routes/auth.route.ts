
import { Router } from "express";
import {
  refreshAccessToken,
  signIn,
  signOut,
  signUp,
} from "../core/services/auth.service";
import { authMiddleware } from "../middleware/index";
const route =Router()

route.post("/signup", signUp);
route.post("/signin", signIn);
route.post("/signout", authMiddleware, signOut);
route.post("/refresh-token", refreshAccessToken);
export { route as authRoute };
