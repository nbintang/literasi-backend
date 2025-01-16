import { Router } from "express";
import { getUserById, getUsers } from "../controller/services";
const route =Router()
route.get("/", getUsers);
route.get("/:id", getUserById);
export { route as userRoute };
