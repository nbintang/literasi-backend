import { Router } from "express";
import { getBooksByCategory } from "../controller/services/books.service";

const route = Router()
route.get("/:name", getBooksByCategory);

export { route as categoryRoute };