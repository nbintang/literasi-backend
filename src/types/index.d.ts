// types/bookstore.d.ts

export interface CreateBookInput {
    title: string;
    description: string;
    price: number;
    stock: number;
    content: string;
    imageUrl: string;
    authorId: number;
    categoryId: number;
  }
  
  export interface UpdateBookInput {
    id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    content: string;
    imageUrl: string;
    authorId: number;
    categoryId: number;
  }
  
  export interface CreateAuthorInput {
    name: string;
    bio: string;
  }
  
  export interface CreateCategoryInput {
    name: string;
  }
  
  export interface CreateOrderInput {
    userId: number;
    totalPrice: number;
  }
  
  export interface CreateOrderItemInput {
    orderId: number;
    bookId: number;
    quantity: number;
  }
  
  export interface PaginatedInput {
    skip: number;
    itemsPerPage: number;
  }
  