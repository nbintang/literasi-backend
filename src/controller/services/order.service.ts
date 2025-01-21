import { NextFunction, Request, Response } from "express";
import {
  createOrder,
  deleteOrderById,
  findOrderBookByUserId,
  findOrderById,
  updateOrderById,
  getBooksByIds,
} from "../repositories";
import { CustomError } from "../../helper/error-response";
import { OrderProps } from "../../types/order";
import {
  countInsufficientStock,
  countTotalPrice,
} from "../../helper/count-price";

export async function getOrderByUserProfileId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.query.id as string;
    if (!userId) throw new CustomError("User id not found", 404);
    const order = await findOrderBookByUserId(userId);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

export async function postOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const items: OrderProps[] = req.body.items;
  try {
    if (!items || !Array.isArray(items))
      throw new CustomError("Invalid items", 400);
    const userId = req.user?.id;
    if (!userId) throw new CustomError("Unauthorized", 401);
    const bookIds = items.map((item) => item.bookId);
    const books = await getBooksByIds(bookIds);
    if (!books) throw new CustomError("Some books were not found", 404);
    if (books.length !== items.length)
      throw new CustomError("Some books were not found", 404);
    const insufficientStock = await countInsufficientStock(items, books);
    if (insufficientStock) {
      throw new Error(`Insufficient stock for id:${insufficientStock.bookId}`);
    }
    const totalPrice = await countTotalPrice(items, books);
    const result = await createOrder({
      items,
      orderedUserId: userId,
      totalPrice,
    });
    res
      .status(201)
      .json({ success: true, message: "Order created", data: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function patchOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const orderId = req.params.id;
  const items: OrderProps[] = req.body.items;
  try {
    if (!items || !Array.isArray(items))
      throw new CustomError("Invalid items", 400);

    const userId = req.user?.id;
    if (!userId) throw new CustomError("Unauthorized", 401);
    const bookIds = items.map((item) => item.bookId)
    const books = await getBooksByIds(bookIds);
    if (!books) throw new CustomError("Some books were not found", 404);
    if (books.length !== items.length)
      throw new CustomError("Some books were not found", 404);
    const insufficientStock = await countInsufficientStock(items, books);
    if (insufficientStock)
      throw new CustomError(
        `Insufficient stock for id:${insufficientStock.bookId}`,
        400
      );
    const totalPrice = await countTotalPrice(items, books);
    const result = await updateOrderById({
      orderId,
      items,
      orderedUserId: userId,
      totalPrice,
    });
    res
      .status(201)
      .json({ success: true, message: "Order updated", data: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function removeOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
try {
  const orderId = req.params.id;
  const existedOrder = await findOrderById(orderId);
if(!existedOrder) throw new CustomError("Order not found", 404);  
  await deleteOrderById(existedOrder.id);
  res.status(200).json({ success: true, message: "Order deleted" });
} catch (error) {
  next(error);
}
}
