import { Request, Response } from "express";
import {
  findBooks,
  findBookById,
  findBooksByCategory,
  createBook,
  updateBook,
  deleteBooks,
} from "../repositories/books.repository";
import { handleErrorResponse } from "../../helper/error-response";
import { InputBooksProps } from "../../types/books";
import upload from "../../lib/upload";
import { cloudinary } from "../../lib/cld";
import { uploadToCloudinary } from "../../helper/upload-to-cloudinary";

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

export const postBooks = [
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        author,
        category,
        content,
        price,
        stock,
      }: InputBooksProps = req.body;
      const image = req.file;
      if (!image) {
        const error = new Error("Image not found");
        return handleErrorResponse(res, error);
      }
      const imageUrl = await uploadToCloudinary(image.buffer);
      const book = await createBook({
        title,
        description,
        imageUrl,
        author,
        category,
        content,
        price,
        stock,
      });
      res.status(200).json({ success: true, data: book });
    } catch (error) {
      handleErrorResponse(res, error as Error);
    }
  },
];

export const putBooks = [
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        author,
        category,
        content,
        stock,
        price,
      }: InputBooksProps = req.body;
      const image = req.file;
      const existedBook = await findBookById(Number(id));
      if (!existedBook) {
        return handleErrorResponse(res, new Error("Book not found"), 404);
      }
      if (existedBook.imageUrl) {
        await cloudinary.uploader.destroy(existedBook.imageUrl);
      }
      let imageUrl = existedBook.imageUrl;
      if (image) {
        imageUrl = await uploadToCloudinary(image.buffer);
      }
      if (!imageUrl || !author || !category) {
        return handleErrorResponse(
          res,
          new Error("Missing required fields"),
          400
        );
      }
      const updatedBook = await updateBook(Number(id), {
        title,
        description,
        imageUrl: imageUrl,
        author: author,
        category: category,
        stock: Number(stock),
        content,
        price: Number(price),
      });
      return res.status(200).json({ success: true, data: updatedBook });
    } catch (error) {
      console.error("Error updating book:", error);
      return handleErrorResponse(res, error as Error);
    }
  },
];

export async function removeBook(req: Request, res: Response) {
  const { id } = req.params;
  await deleteBooks(Number(id));
  res.status(200).json({ success: true, message: "Book deleted successfully" });
}

