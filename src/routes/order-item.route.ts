import { Router } from "express"
import { getOrderItemById } from "../core/services/order-item.service"

const route = Router()

route.get("/:id", getOrderItemById)


export { route as orderItemRoute }