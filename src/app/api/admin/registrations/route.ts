import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { generateRequestId, sendSuccess, sendError } from "@/lib/api-response";
import { verifySession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    // 1. Session verification
    const session = await verifySession();
    if (!session) {
      logger.warn({ requestId }, "Unauthorized registration list access attempt");
      return sendError("UNAUTHORIZED", "Access denied.", requestId, 401);
    }

    // 2. Query all registrations sorted by creation date descending
    const registrations = await db.registration.findMany({
      orderBy: { createdAt: "desc" },
    });

    logger.info(
      { requestId, adminId: session.userId, count: registrations.length },
      "Fetched registration records list"
    );

    return sendSuccess(registrations, "Registrations list retrieved successfully.", requestId);
  } catch (error: any) {
    logger.error(
      { requestId, error: error.message, stack: error.stack },
      "Unhandled error fetching registrations list"
    );
    return sendError("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", requestId, 500);
  }
}
