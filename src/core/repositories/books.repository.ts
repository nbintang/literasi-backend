import { Book } from "@prisma/client";
import { db } from "../../lib/db";
import { InputBooksProps } from "../../types/books";

export const findBooks = async () => await db.book.findMany();

export const findBookById = async (id: number) =>
  await db.book.findFirst({ where: { id } });

export const findBooksByCategory = async (name: string, page: number) =>
  await db.category.findFirst({
    where: { name },
    select: { id: true, name: true, books: true },
    take: 10,
    skip: (page - 1) * 10,
  });
  export const createBook = async ({
    title,
    description,
    imageUrl,
    price,
    content,
    stock,
    author,
    category,
  }: InputBooksProps) => {
    return await db.book.create({
      data: {
        title,
        description,
        imageUrl,
        price,
        stock,
        content,
        author: {
          connectOrCreate: {
            where: { name: author }, 
            create: { name: author },
          },
        },
        category: {
          connectOrCreate: {
            where: { name: category },
            create: { name: category },
          },
        },
      },
    });
  };
  
export const updateBook = async (
  id: number,
  {
    title,
    description,
    imageUrl,
    price,
    content,
    author,
    stock,
    category,
  }: InputBooksProps
) =>
  await db.book.update({
    where: { id },
    data: {
      title,
      description,
      stock,
      imageUrl,
      price,
      content,
      author: {
        connectOrCreate: {
          where: { name: author },
          create: { name: author },
        },
      },
      category: {
        connectOrCreate: {
          where: { name: category },
          create: { name: category },
        },
      },
    },
  });

export const deleteBooks = async (id: number) =>
  await db.book.delete({ where: { id } });

export const getBooksByIds = async (bookIds: number[]) => {
  return await db.book.findMany({
    where: {
      id: {
        in: bookIds,
      },
    },
    select: {
      id: true,
      price: true,
      stock: true,
      title: true,
    },
  });
};
export const updateBookStock = async (bookId: number, quantity: number) => {
  return await db.book.update({
    where: { id: bookId },
    data: { stock: { decrement: quantity } },
  });
};