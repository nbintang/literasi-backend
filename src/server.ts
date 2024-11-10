import express from "express";
import cors from "cors";
import routes from "./routes"; 
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();
const port = 3000;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
