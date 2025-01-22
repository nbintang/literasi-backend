import {
  getOrderByUserProfileId,
  patchOrder,
  postOrder,
  removeOrder,
} from "@/controller/services";
import { Router } from "express";

const route = Router();

route.get("/", getOrderByUserProfileId);
route.post("/", postOrder);
route.delete("/:id", removeOrder);
route.patch("/:id", patchOrder);

export { route as orderRoute };
