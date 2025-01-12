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
import manageCloudinaryImages from "../../helper/manage-cloudinary-img";
import { extractPublicId } from "cloudinary-build-url";

export async function getBooks(req: Request, res: Response) {
  const { page, pageSize } = req.query || {};
  const pageNum = Number(page) || 1;
  const pageSizeNum = Number(pageSize) || 10;

  const skip = (pageNum - 1) * pageSizeNum;

  const { books, total } = await findBooks(pageSizeNum, skip);
  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    data: books,
  });
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
    const name = req.params.name as string;
    const { page, pageSize } = req.query || {};
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;
    const skip = (pageNum - 1) * pageSizeNum;
    const book = await findBooksByCategory({
      name,
      take: pageSizeNum,
      skip,
    });
    if (!book) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }
    res
      .status(200)
      .json({ success: true, page: pageNum, genre: name, data: book });
  } catch (error) {
    handleErrorResponse(res, error as Error);
  }
}

export async function postBooks(req: Request, res: Response) {
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
    const { public_id, secure_url } = await manageCloudinaryImages({
      buffer: image.buffer,
    });

    const book = await createBook({
      title,
      description,
      image: secure_url,
      author,
      category,
      content,
      price: Number(price),
      stock: Number(stock),
    });
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    handleErrorResponse(res, error as Error);
  }
}

export async function putBooks(req: Request, res: Response) {
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
    const existedImgPublicId = await extractPublicId(
      existedBook.image as string
    );
    if (!image || !author || !category) {
      return handleErrorResponse(
        res,
        new Error("Missing required fields"),
        400
      );
    }
    const { secure_url } = await manageCloudinaryImages({
      buffer: image.buffer,
      public_id: existedImgPublicId,
    });
    const updatedBook = await updateBook(Number(id), {
      title,
      description,
      image: secure_url,
      author: author,
      category: category,
      stock: Number(stock),
      content,
      price: Number(price),
    });
    res.status(200).json({ success: true, data: updatedBook });
  } catch (error) {
    console.error("Error updating book:", error);
    return handleErrorResponse(res, error as Error);
  }
}

export async function removeBook(req: Request, res: Response) {
  const { id } = req.params;
  await deleteBooks(Number(id));
  res.status(200).json({ success: true, message: "Book deleted successfully" });
}
