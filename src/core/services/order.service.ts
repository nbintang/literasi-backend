import { Request, Response } from "express";
import {
  createOrder,
  findOrderBookByUserId,
} from "../repositories/orders.repository";
import { handleErrorResponse } from "../../helper/error-response";
import { RequestWithPayload } from "../../types";
import {
  getBooksByIds,
  updateBookStock,
} from "../repositories/books.repository";
import { OrderProps } from "../../types/order";

export async function getOrderByUserId(req: Request, res: Response) {
  const { id } = req.params;
  const order = await findOrderBookByUserId(Number(id));
  res.status(200).json({ success: true, data: order });
}

export async function postOrder(req: Request, res: Response) {
  console.log("Request Body:", req.body);
  const items: OrderProps[] = req.body.items;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid order items" });
  }

  try {
    const books = await getBooksByIds(items.map((item) => item.bookId));
    const userId = (req as RequestWithPayload).id;
    if (books.length !== items.length) {
      throw new Error("Some books were not found");
    }

    const updateStockPromises = items.map((item) => {
      const book = books.find((b) => b.id === item.bookId);
      if (!book) {
        throw new Error(`Book with ID ${item.bookId} not found`);
      }

      if (book.stock < item.quantity) {
        throw new Error(`Not enough stock for book: ${book.title}`);
      }

      return updateBookStock(book.id, item.quantity);
    });
    await Promise.all(updateStockPromises);

    const totalPrice = items.reduce((total, item) => {
      const book = books.find((b) => b.id === item.bookId);
      if (!book) {
        throw new Error(`Book with ID ${item.bookId} not found`);
      }
      return total + item.quantity * book.price.toNumber();
    }, 0);

    const order = await createOrder(
      Number(userId),
      totalPrice,
      items.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
      }))
    );

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    handleErrorResponse(res, error as Error);
  }
}
