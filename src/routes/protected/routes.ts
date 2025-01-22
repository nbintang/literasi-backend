import { Router } from "express";
import {
  bookRoute,
  categoryRoute,
  orderItemRoute,
  orderRoute,
  profileRoute,
  userRoute,
} from "@/routes/protected";
const protectedRouter = Router();
protectedRouter.use("/books", bookRoute);
protectedRouter.use("/users", userRoute);
protectedRouter.use("/orders", orderRoute);
protectedRouter.use("/order-item", orderItemRoute);
protectedRouter.use("/category", categoryRoute);
protectedRouter.use("/profile", profileRoute);

export default protectedRouter;
