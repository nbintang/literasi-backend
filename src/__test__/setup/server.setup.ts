import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { errorHandler, PayloadError } from "@/helper/error-response";
import appRouter from "@/routes";
import { localConfigMiddleware } from "@/middleware";
const serverApp = () => {
  const app = express();
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    session({
      secret: "For-testing" as string,
      resave: true,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );
  localConfigMiddleware(app);
  app.get("/", (_, res) => {
    res.json({ message: "Hello World" });
  });

  app.use("/api", appRouter);
  app.use(errorHandler);
  return app;
};

export default serverApp;
