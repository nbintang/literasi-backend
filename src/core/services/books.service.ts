import { Request, Response } from "express";
import {
  findBooks,
  findBookById,
  findBooksByCategory,
} from "../repositories/books.repository";
import { handleErrorResponse } from "../../helper/error-response";

export async function getBooks(req: Request, res: Response) {
  const book = await findBooks();
  res.status(200).json({ success: true, data: book });
}

export async function getBookById(req: Request, res: Response) {
  const { id } = req.params;
  const book = await findBookById(Number(id));
  if (!book) {
    res.status(404).json({ success: false, message: "Book not found" });
    return;
  }
  res.status(200).json({ success: true, data: book });
}

export async function getBooksByCategory(req: Request, res: Response) {
  try {
    const { name } = req.params;
    const { page } = req.query || 1;

    const book = await findBooksByCategory(name as string, Number(page));
    if (!book) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    handleErrorResponse(res, error as Error);
  }
}
