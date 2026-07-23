import pino from "pino";
import { env } from "./env";

/**
 * Structured logger configured to output JSON logs.
 * In development, uses pino-pretty for human-readable output.
 */
export const logger = pino({
  level: env.LOG_LEVEL || "info",
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        }
      : undefined,
});
