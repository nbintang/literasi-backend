import { Router } from "express"
import { deleteOrderItem, getOrderItemById } from "../controller/services"

const route = Router()

route.get("/:id", getOrderItemById);
route.delete("/:id", deleteOrderItem);
export { route as orderItemRoute }