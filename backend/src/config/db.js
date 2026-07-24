import { PrismaClient } from "@prisma/client";
import env from "./env.js";
import logger from "../utils/logger.js";

// Prevent multiple PrismaClient instances during nodemon hot-reloads in dev.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.IS_PROD ? ["error", "warn"] : ["error", "warn", "info"],
  });

if (!env.IS_PROD) {
  globalForPrisma.prisma = prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info("PostgreSQL (Neon) connected via Prisma");
  } catch (error) {
    logger.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};
