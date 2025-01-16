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
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
      createdAt: true,
      updatedAt: true,
    },
  });
  const mutableBooks = await books.map((book) => ({
    ...book,
    author: book.author.name,
    category: book.category.name,
  }));
  return {
    total: await db.book.count(),
    books: mutableBooks,
  };
};

export const findBookById = async (id: number) => {
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
      author: { select: { id: true, name: true, bio: true, createdAt: true } },
      category: { select: { id: true, name: true } },
      createdAt: true,
      updatedAt: true,
    },
  });
  return {
    ...book,
    author: book?.author.name,
    category: book?.category.name,
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
          author: { select: { id: true, name: true } },
          createdAt: true,
        },
      },
    },
    take,
    skip,
  });

  const mutableCategoryBooks = await categoryBooks?.books.map((book) => ({
    ...book,
    author: book.author.name,
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
  author,
  category,
}: InputBooksProps) => {
  const createdBook = await db.book.create({
    data: {
      title,
      description,
      image,
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
  const book = await findBookById(createdBook.id);
  return book;
};

export const updateBook = async (
  id: number,
  {
    title,
    description,
    image,
    price,
    content,
    author,
    stock,
    category,
  }: InputBooksProps
) => {
  const updatedBook = await db.book.update({
    where: { id },
    data: {
      title,
      description,
      stock,
      image,
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
  const book = await findBookById(updatedBook.id);
  return book;
};

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
