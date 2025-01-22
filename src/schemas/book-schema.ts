import * as z from "zod";
import { InputBooksProps } from "../types/books";

export const bookSchema = z.object({
  title: z
    .string()
    .min(6, {
      message: "Title must be at least 6 characters",
    })
    .max(50, {
      message: "Title must be at most 50 characters",
    }),
  description: z
    .string()
    .min(12, {
      message: "Description must be at least 12 characters",
    })
    .max(600, {
      message: "Description must be at most 600 characters",
    }),
  price: z.coerce.number(),
  content: z
    .string()
    .min(200, {
      message: "Content must be at least 200 characters",
    })
    .max(65535, {
      message: "Content must be at most 65535 characters",
    }),
  authorName: z
    .string()
    .min(6, {
      message: "Author name must be at least 6 characters",
    })
    .max(100, {
      message: "Author name must be at most 100 characters",
    }),
  stock: z.coerce.number().default(0),
  categories: z
    .array(
      z
        .string()
        .min(4, {
          message: "Category must be at least 4 characters",
        })
        .max(50, {
          message: "Category must be at most 50 characters",
        })
    )
}) satisfies z.ZodType<InputBooksProps>;
