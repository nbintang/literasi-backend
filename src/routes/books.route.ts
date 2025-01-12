
import { Router } from "express";
import {
  getBookById,
  getBooks,
  getBooksByCategory,
  putBooks,
  postBooks,
  removeBook,
} from "../core/services/books.service";
import upload from "../lib/upload";
const route =Router()

route.get("/", getBooks);
route.get("/:id", getBookById);
route.post("/", upload.single("image"), postBooks);
route.put("/:id", upload.single("image"), putBooks);
route.delete("/:id", removeBook);
export { route as bookRoute };
