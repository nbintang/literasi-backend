import { Router } from "express";
import {
  getBookById,
  getBooks,
  postBooks,
  putBooks,
  removeBook,
} from "@/controller/services";
import validateSingleFile from "@/helper/validate-file";
import { validateSchema } from "@/helper/validate-schema";
import { bookSchema } from "@/schemas/book-schema";
const route = Router();

route.get("/", getBooks);
route.get("/:id", getBookById);
route.post("/", validateSingleFile, validateSchema(bookSchema), postBooks);
route.put("/:id", validateSingleFile, validateSchema(bookSchema), putBooks);
route.delete("/:id", removeBook);
export { route as bookRoute };
