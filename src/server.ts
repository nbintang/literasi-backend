import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
import { errorHandler } from "@/helper/error-response";
import appRouter from "@/routes";
import { localConfigMiddleware } from "./middleware";
const app = express();
const port = 3001;
dotenv.config();


app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
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
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
