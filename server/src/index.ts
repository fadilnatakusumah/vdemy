import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";
import express from "express";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import morgan from "morgan";
import { config } from "dotenv";
import path from "path";
import APIRoutes from "./routes";

config();

const csrfProtection = csrf({ cookie: true });

// create express app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE!)
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR => ", err));

// apply middlewares
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// route
// app.use("/", (_, res) => res.json({ message: "Hello :)" }));

app.use("/api", APIRoutes);
// readdirSync(path.join(__dirname, "./routes")).map((routeFileName) =>
//   app.use("/api", require(`./routes/${routeFileName}`))
// );

// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
