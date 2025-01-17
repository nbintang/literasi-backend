import { Decimal } from "@prisma/client/runtime/library";
import { OrderProps } from "../types/order";

interface BooksProps {
  id: string;
  title: string;
  price: Decimal;
  stock: number;
}
[];
export async function countTotalPrice(
  items: OrderProps[],
  books: BooksProps[]
) {
  const totalPrice = items.reduce((total, item) => {
    const book = books.find((b) => b.id === item.bookId)!;
    return total + item.quantity * book.price.toNumber();
  }, 0);

  return totalPrice;
}

export async function countInsufficientStock(
  items: OrderProps[],
  books: BooksProps[]
) {
  const insufficientStock = items.find((item) => {
    const book = books.find((b) => b.id === item.bookId);
    return !book || book.stock < item.quantity;
  });
  return insufficientStock;
}
