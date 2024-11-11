export type InputBooksProps = {
    title: string;
    description: string;
    imageUrl?: string;
    price: number; // assuming price is a number
    content: string;
    author: string;
    stock?: number;
    category: string;
  }