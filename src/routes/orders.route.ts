import { Router } from "express";
import {
  getOrderByUserProfileId,
  patchOrder,
  postOrder,
  removeOrder,
} from "../controller/services";
const route = Router();

route.get("/", getOrderByUserProfileId);
route.post("/", postOrder);
route.delete("/:id", removeOrder);
route.patch("/:id", patchOrder);

export { route as orderRoute };
