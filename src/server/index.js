import "dotenv/config";

import express from "express";
import cors from "cors";

import routes from "../routes/index.js";
import ErrorHandler from "../middlewares/error.js";
const app = express();
app.use(cors({ origin: "https://notesapp-v1.dicodingacademy.com/" }));
app.use(express.json());
app.use(routes);
app.use(ErrorHandler);
export default app;
