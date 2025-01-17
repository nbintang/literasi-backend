import { db } from "../../lib/db";
import { InputBooksProps } from "../../types/books";

export const findBooks = async (take: number, skip: number) => {
  const books = await db.book.findMany({
    take,
    skip,
    select: {
      id: true,
      title: true,
      image: true,
      description: true,
      price: true,
      stock: true,
      authorName: true,
      categories: {
        select: {
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  const mutableBooks = await books.map((book) => ({
    ...book,
    author: book.authorName,
    categories: book.categories.map((category) => category.name).join(", "),
  }));
  return {
    total: await db.book.count(),
    books: mutableBooks,
  };
};

export const findBookById = async (id: string) => {
  const book = await db.book.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      image: true,
      description: true,
      price: true,
      stock: true,
      content: true,
      authorName: true,
      categories: { select: { name: true } },
      createdAt: true,
      updatedAt: true,
    },
  });
  return {
    ...book,
    author: book?.authorName,
    categories: book?.categories.map((category) => category.name).join(", "),
  };
};

export const findBooksByCategory = async ({
  name,
  take,
  skip,
}: {
  name: string;
  take: number;
  skip: number;
}) => {
  const categoryBooks = await db.category.findFirst({
    where: { name },
    select: {
      id: true,
      name: true,
      books: {
        select: {
          id: true,
          title: true,
          image: true,
          description: true,
          price: true,
        authorName: true,
        }}
    },
    take,
    skip,
  });

  const mutableCategoryBooks = await categoryBooks?.books.map((book) => ({
    ...book,
    author: book.authorName,
  }));
  return mutableCategoryBooks;
};

export const createBook = async ({
  title,
  description,
  image,
  price,
  content,
  stock,
  categories,
  authorName
}: InputBooksProps) => {
  const createdBook = await db.book.create({
    data: {
      title,
      description,
      image,
      price,
      stock,
      content,
      authorName,
      categories: {
        connectOrCreate: categories.map((category) => ({
          where: { name: category },
          create: { name: category },
        })), 
      },
    },
  });
  const book = await findBookById(createdBook.id);
  return book;
};

export const updateBook = async (
  id: string,
  {
    title,
    description,
    image,
    price,
    content,
    stock,
    authorName,
    categories,
  }: InputBooksProps
) => {
  const updatedBook = await db.book.update({
    where: {id},
    data: {
      title,
      description,
      image,
      price,
      stock,
      content,
      authorName,
      categories: {
        connectOrCreate: categories.map((category) => ({
          where: { name: category },
          create: { name: category },
        })),
      },
    },
  });
  const book = await findBookById(updatedBook.id);
  return book;
};

export const deleteBooks = async (id: string) =>
  await db.book.delete({ where: { id } });

export const getBooksByIds = async (bookIds: string[]) => {
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
export const updateBookStock = async (bookId: string, quantity: number) => {
  return await db.book.update({
    where: { id: bookId },
    data: { stock: { decrement: quantity } },
  });
};
