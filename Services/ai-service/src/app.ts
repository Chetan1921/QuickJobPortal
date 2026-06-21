import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { ErrorMiddleware } from "./middleware/ErrorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8003;

app.use(cors());
app.use(express.json());
app.use("/api/v1/ai", routes);
app.use(ErrorMiddleware);

export default app;