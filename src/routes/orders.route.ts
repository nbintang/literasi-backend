import { Router } from "express";
import {
  getOrderByUserId,
  patchOrder,
  postOrder,
  removeOrder,
} from "../controller/services";
const route = Router();

route.get("/", getOrderByUserId);
route.post("/", postOrder);
route.delete("/:id", removeOrder);
route.patch("/:id", patchOrder);

export { route as orderRoute };
