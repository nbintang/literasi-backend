import {
  getBookById,
  getBooks,
  getBooksByCategory,
  putBooks,
  postBooks,
  removeBook,
} from "../core/services/books.service";
const route = require("express").Router();
route.get("/", getBooks);
route.get("/:id", getBookById);
route.get("/category/:name", getBooksByCategory);
route.post("/", postBooks);
route.put("/:id", putBooks);
route.delete("/:id", removeBook);
export { route as bookRoute };
