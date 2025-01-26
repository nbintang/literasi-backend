export type InputUserProps ={
    email: string;
    password: string;
    name: string;
  }

  export type CreateReturnType = {
    id: string;
    email: string;
    name: string;
    image: string | null | undefined;
    role: string | undefined;
    createdAt: Date;
    updatedAt: Date;
  };