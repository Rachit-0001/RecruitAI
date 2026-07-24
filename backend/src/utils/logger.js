/**
 * Minimal structured logger. Swap the implementation for winston/pino
 * later without touching call sites elsewhere in the app.
 */
const timestamp = () => new Date().toISOString();

const logger = {
  info: (...args) => console.log(`[INFO] ${timestamp()} -`, ...args),
  warn: (...args) => console.warn(`[WARN] ${timestamp()} -`, ...args),
  error: (...args) => console.error(`[ERROR] ${timestamp()} -`, ...args),
  debug: (...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[DEBUG] ${timestamp()} -`, ...args);
    }
  },
};

export default logger;
