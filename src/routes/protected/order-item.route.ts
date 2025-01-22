import { deleteOrderItem, getOrderItemById } from "@/controller/services";
import { Router } from "express";

const route = Router();

route.get("/:id", getOrderItemById);
route.delete("/:id", deleteOrderItem);
export { route as orderItemRoute };
