import { Router } from "express";
import { authRoute } from "@/routes/auth";

const authRouter = Router();

authRouter.use(authRoute);

export default authRouter;