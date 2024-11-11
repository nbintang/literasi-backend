const route = require("express").Router();
import { getOrderByUserId, postOrder } from "../core/services/order.service";
import { getUserById, getUsers } from "../core/services/user.service";
route.get("/", getUsers);
route.get("/:id", getUserById);
route.get("/:id/orders", getOrderByUserId);
route.post("/orders", postOrder);
export { route as userRoute };
