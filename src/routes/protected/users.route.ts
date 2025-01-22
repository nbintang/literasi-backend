import { getUserById, getUsers } from "@/controller/services";
import { Router } from "express";
const route = Router();
route.get("/", getUsers);
route.get("/:id", getUserById);
export { route as userRoute };
