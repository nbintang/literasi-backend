import { Router } from "express";
import { getOrderByUserId, postOrder } from "../core/services/order.service";
import { getUserById, getUsers } from "../core/services/user.service";
const route =Router()
route.get("/", getUsers);
route.get("/:id", getUserById);
export { route as userRoute };
