import { getBooksByCategory } from "@/controller/services";
import { Router } from "express";


const route = Router()
route.get("/:name", getBooksByCategory);

export { route as categoryRoute };