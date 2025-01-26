import { errorHandler, PayloadError } from "@/helper/error-response";

export const mockValidUser = () => {
  return jest.fn(
    (
      strategy: string,
      options: any,
      callback: (err: any, user: any, info: any) => void
    ) => {
      return (req: any, res: any, next: any) => {
        const mockUser = {
          id: "1",
          accessToken: "mockAccessToken",
          refreshToken: "mockRefreshToken",
        };
        callback(null, mockUser, null);
      };
    }
  ) as any;
};

export const mockInvalidUser = () => {
  return jest.fn(
    (
      strategy: string,
      options: any,
      callback: (err: any, user: any, info: any) => void
    ) => {
      return (req: any, res: any, next: any) => {
        callback(null, false, { message: "Invalid credentials" });
      };
    }
  ) as any;
};

export const mockServerError = () => {
  return jest.fn(
    (
      strategy: string,
      options: any,
      callback: (err: any, user: any, info: any) => void
    ) => {
      return (req: any, res: any, next: any) => {
        const error = new PayloadError("Internal Server Error", 500);
        errorHandler(error, req, res, next);
      };
    }
  ) as any;
};
