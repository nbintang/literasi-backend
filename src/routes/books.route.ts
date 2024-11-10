import {
  getBookById,
  getBooks,
  getBooksByCategory,
} from "../core/services/books.service";
import route from "../lib/router";
import { authMiddleware } from "../middleware";

route.get("/books", authMiddleware, getBooks);
route.get("/books/:id", authMiddleware, getBookById);
route.get("/books/category/:name", authMiddleware, getBooksByCategory);
export { route as bookRoute };
