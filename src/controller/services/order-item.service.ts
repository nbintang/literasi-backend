import { NextFunction, Request, Response } from "express";
import { deleteOrderItemById, findOrderItemById } from "@/controller/repositories";
import { CustomError } from "@/helper/error-response";

export async function getOrderItemById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const orderItem = await findOrderItemById(id);
    if (!orderItem) throw new CustomError("Order item not found", 404);
    res.status(200).json({ success: true, data: orderItem });
  } catch (error) {
    next(error);
  }
}
export async function deleteOrderItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const orderItem = await deleteOrderItemById(id);
    if (!orderItem) throw new CustomError("Order item not found", 404);
    res
      .status(200)
      .json({ success: true, message: "Order item deleted successfully" });
  } catch (error) {
    next(error);
  }
}
