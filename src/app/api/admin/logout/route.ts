import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { generateRequestId, sendSuccess, sendError } from "@/lib/api-response";
import { destroySession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    await destroySession();
    logger.info({ requestId }, "Admin logged out and session revoked");
    return sendSuccess(null, "Logged out successfully.", requestId);
  } catch (error: any) {
    logger.error({ requestId, error: error.message, stack: error.stack }, "Unhandled error during admin logout");
    return sendError("INTERNAL_SERVER_ERROR", "An unexpected error occurred. Please try again.", requestId, 500);
  }
}
