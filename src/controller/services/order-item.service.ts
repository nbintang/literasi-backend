import { Request, Response } from "express";
import {
  deleteOrderItemById,
  findOrderItemById,
} from "../repositories";

export async function deleteOrderItem(req: Request, res: Response) {
  const { id } = req.params;
  await deleteOrderItemById(id);
  res
    .status(200)
    .json({ success: true, message: "Order item deleted successfully" });
}

export async function getOrderItemById(req: Request, res: Response) {
  const { id } = req.params;
  const orderItem = await findOrderItemById(id);

  if (!orderItem) {
    res.status(404).json({ success: false, message: "Order item not found" });
  }

  res.status(200).json({ success: true, data: orderItem });
}
