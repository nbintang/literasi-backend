import { userRoute } from "./users.route";
import { authRoute } from "./auth.route";
import { bookRoute } from "./books.route";
import { authMiddleware } from "../middleware";
import { orderRoute } from "./orders.route";   
import { orderItemRoute } from "./order-item.route";
import { categoryRoute } from "./category.route";
import { Router } from "express";
const route = Router();
route.use("/books", authMiddleware, bookRoute);
route.use("/users",authMiddleware,userRoute);
route.use("/orders", authMiddleware, orderRoute);
route.use("/order-item", authMiddleware, orderItemRoute);
route.use("/category", authMiddleware, categoryRoute);

route.use(authRoute);
export default route;
