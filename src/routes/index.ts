const route = require("express").Router();
import { userRoute } from "./users.route";
import { authRoute } from "./auth.route";
import { bookRoute } from "./books.route";
import { authMiddleware } from "../middleware";
route.use("/books", authMiddleware, bookRoute);
route.use("/users",authMiddleware,userRoute);
route.use(authRoute);
export default route;
