export type InputBooksProps = {
    title: string;
    description: string;
    image?: string
    price: number; // assuming price is a number
    content: string;
    authorName: string,
    stock?: number;
    categories: string[] ;
  }