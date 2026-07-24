import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import env from "./config/env.js";
import apiRouter from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.middleware.js";

const app = express();

// --- Security & core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// --- Logging ---
app.use(morgan(env.IS_PROD ? "combined" : "dev"));

// --- Static (locally stored resumes in dev) ---
app.use("/uploads", express.static("uploads"));

// --- API routes ---
app.use("/api", apiRouter);

// --- 404 + centralized error handler (order matters, must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
