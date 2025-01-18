import { userRoute } from "./users.route";
import { authRoute } from "./auth.route";
import { bookRoute } from "./books.route";
import { orderRoute } from "./orders.route";
import { orderItemRoute } from "./order-item.route";
import { categoryRoute } from "./category.route";
import { Router } from "express";
import { profileRoute } from "./profile.route";
import authMiddleware from "../middleware";
const route = Router();
route.use("/books",authMiddleware("jwt"), bookRoute);
route.use("/users", authMiddleware("jwt"), userRoute);
route.use("/orders", authMiddleware("jwt"), orderRoute);
route.use("/order-item", authMiddleware("jwt"), orderItemRoute);
route.use("/category", authMiddleware("jwt"), categoryRoute);
route.use("/profile", authMiddleware("jwt"), profileRoute);

route.use(authRoute);
export default route;
