
import { Router } from "express";
import {
  refreshAccessToken,
  signIn,
  signOut,
  signUp,
} from "../controller/services";
import { authMiddleware } from "../middleware";
const route =Router()

route.post("/signup", signUp);
route.post("/signin", signIn);
route.post("/signout", authMiddleware, signOut);
route.post("/refresh-token", refreshAccessToken);
export { route as authRoute };
