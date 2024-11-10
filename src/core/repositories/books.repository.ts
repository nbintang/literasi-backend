import { db } from "../db";

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
