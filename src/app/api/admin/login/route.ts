import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { generateRequestId, sendSuccess, sendError } from "@/lib/api-response";
import { adminLoginSchema } from "@/lib/validation";
import { verifyPassword } from "@/lib/security";
import { createSession } from "@/lib/session";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined;

  try {
    const body = await request.json();

    // 1. Validation
    const validation = adminLoginSchema.safeParse(body);
    if (!validation.success) {
      const fields = validation.error.flatten().fieldErrors;
      logger.warn({ requestId, fields }, "Admin login validation failed");
      return sendError("VALIDATION_ERROR", "Username and password are required.", requestId, 422, {
        fields,
      });
    }

    const { username, password, turnstileToken } = validation.data;
    const normalizedUsername = username.trim().toLowerCase();

    // 2. Bot Verification check via Cloudflare Turnstile
    const turnstileSuccess = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstileSuccess) {
      logger.warn({ requestId, clientIp }, "Admin login Turnstile token verification failed");
      return sendError(
        "BOT_VERIFICATION_FAILED",
        "Bot verification failed. Please try again.",
        requestId,
        400
      );
    }

    // 2. Fetch admin user
    const admin = await db.adminUser.findUnique({
      where: { username: normalizedUsername },
    });

    if (!admin) {
      logger.warn({ requestId, username: normalizedUsername }, "Login failed: Username not found");
      return sendError("INVALID_CREDENTIALS", "Invalid username or password.", requestId, 401);
    }

    // 3. Verify Password
    const passwordMatch = await verifyPassword(password, admin.passwordHash);
    if (!passwordMatch) {
      logger.warn({ requestId, username: normalizedUsername }, "Login failed: Password mismatch");
      return sendError("INVALID_CREDENTIALS", "Invalid username or password.", requestId, 401);
    }

    // 4. Verify Account Status
    if (admin.status === "PENDING") {
      logger.warn({ requestId, username: normalizedUsername }, "Login blocked: Account is PENDING");
      return sendError(
        "PENDING_APPROVAL",
        "Your account is pending approval by the Admin.",
        requestId,
        403
      );
    }

    if (admin.status === "REJECTED") {
      logger.warn(
        { requestId, username: normalizedUsername },
        "Login blocked: Account is REJECTED"
      );
      return sendError(
        "ACCOUNT_REJECTED",
        "Your account has been rejected. Access is denied.",
        requestId,
        403
      );
    }

    // 5. Establish secure session cookies and database session log
    await createSession(admin.id);

    logger.info(
      { requestId, adminId: admin.id, username: normalizedUsername },
      "Admin logged in successfully"
    );

    return sendSuccess(
      {
        id: admin.id,
        fullName: admin.fullName,
        username: admin.username,
        role: admin.role,
      },
      "Logged in successfully.",
      requestId
    );
  } catch (error: any) {
    logger.error(
      { requestId, error: error.message, stack: error.stack },
      "Unhandled error during admin login"
    );
    return sendError(
      "INTERNAL_SERVER_ERROR",
      "An unexpected error occurred. Please try again.",
      requestId,
      500
    );
  }
}
