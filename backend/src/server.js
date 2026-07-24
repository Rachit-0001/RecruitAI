import app from "./app.js";
import env from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import logger from "./utils/logger.js";

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`RecruitAI CRM API running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDB();
      logger.info("Server closed. Goodbye!");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection:", reason);
    throw reason;
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1);
  });
};

startServer();
