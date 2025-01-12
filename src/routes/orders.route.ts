import { Router } from "express";
import {
  getOrderByUserId,
  patchOrder,
  postOrder,
  removeOrder,
} from "../core/services/order.service";
const route = Router();

route.get("/", getOrderByUserId);
route.post("/", postOrder);
route.delete("/:id", removeOrder);
route.patch("/:id", patchOrder);

export { route as orderRoute };
