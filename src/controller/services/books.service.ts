import { Request, Response, NextFunction } from "express";
import {
  findBooks,
  findBookById,
  findBooksByCategory,
  createBook,
  updateBook,
  deleteBooks,
} from "@/controller/repositories";
import { PayloadError } from "@/helper/error-response";
import { InputBooksProps } from "@/types/books";
import manageCloudinaryImages from "@/helper/manage-cloudinary-img";
import { extractPublicId } from "cloudinary-build-url";
import { SafeUserPayload } from "@/types";

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

export async function getBookById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const book = await findBookById(id);
    if (!book) throw new PayloadError("Book not found", 404);
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
}

export async function getBooksByCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
    if (!book) throw new PayloadError("Book not found", 404);
    res
      .status(200)
      .json({ success: true, page: pageNum, genre: name, data: book });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function postBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      title,
      description,
      authorName,
      categories,
      content,
      price,
      stock,
    }: InputBooksProps = req.body;
    const image = req.file;
    const userId = (req.user as SafeUserPayload).id;

    if (!image) throw new PayloadError("No image provided", 404);
    const { public_id, secure_url } = await manageCloudinaryImages({
      buffer: image.buffer,
    });

    const book = await createBook(userId as string, {
      title,
      description,
      image: secure_url,
      authorName,
      categories,
      content,
      price: Number(price),
      stock: Number(stock),
    });
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function putBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      authorName,
      categories,
      content,
      stock,
      price,
    }: InputBooksProps = req.body;
    const image = req.file;
    const userId = (req.user as SafeUserPayload).id;
    const existedBook = await findBookById(id);
    if (!existedBook) throw new PayloadError("Book not found", 404);
    const existedImgPublicId = await extractPublicId(
      existedBook.image as string
    );
    if (!image || !authorName || !categories) throw new PayloadError("Please provide all required fields", 404);
    const { secure_url } = await manageCloudinaryImages({
      buffer: image.buffer,
      public_id: existedImgPublicId,
    });
    const updatedBook = await updateBook(
      userId as string,
      id,
      {
        title,
        description,
        image: secure_url,
        authorName,
        categories,
        stock: Number(stock),
        content,
        price: Number(price),
      }
    );
    res.status(200).json({ success: true, data: updatedBook });
  } catch (error) {
    console.error("Error updating book:", error);
    next(error);
  }
}

export async function removeBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const deletedBook = await deleteBooks(id);
    if (!deletedBook) throw new PayloadError("Book not found", 404);
    res
      .status(200)
      .json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    next(error);
  }
}
