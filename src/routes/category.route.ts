import { Router } from "express";
import { getBooksByCategory } from "../core/services/books.service";

const route = Router()
route.get("/:name", getBooksByCategory);

export { route as categoryRoute };