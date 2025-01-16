
import { Router } from "express";
import {
  getBookById,
  getBooks,
  putBooks,
  postBooks,
  removeBook,
} from "../controller/services";
import upload from "../lib/upload";
const route =Router()

route.get("/", getBooks);
route.get("/:id", getBookById);
route.post("/", upload.single("image"), postBooks);
route.put("/:id", upload.single("image"), putBooks);
route.delete("/:id", removeBook);
export { route as bookRoute };
