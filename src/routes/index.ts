import { Router } from "express";
import protectedRouter from "./protected/routes";
import authMiddleware from "@/middleware";
import authRouter from "./auth/routes";

const appRouter = Router();

appRouter.use("/protected", authMiddleware("jwt"), protectedRouter);
appRouter.use("/auth", authRouter);

export default appRouter;
