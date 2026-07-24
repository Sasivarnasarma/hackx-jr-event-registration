import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { generateRequestId, sendSuccess, sendError } from "@/lib/api-response";
import { adminRegisterSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/security";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined;

  try {
    const body = await request.json();

    // 1. Validation
    const validation = adminRegisterSchema.safeParse(body);
    if (!validation.success) {
      const fields = validation.error.flatten().fieldErrors;
      logger.warn({ requestId, fields }, "Admin registration validation failed");
      return sendError("VALIDATION_ERROR", "Some fields contain invalid values.", requestId, 422, {
        fields,
      });
    }

    const { fullName, username, password, turnstileToken } = validation.data;
    const normalizedUsername = username.trim().toLowerCase();

    // 2. Bot Verification check via Cloudflare Turnstile
    const turnstileSuccess = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstileSuccess) {
      logger.warn(
        { requestId, clientIp },
        "Admin registration Turnstile token verification failed"
      );
      return sendError(
        "BOT_VERIFICATION_FAILED",
        "Bot verification failed. Please try again.",
        requestId,
        400
      );
    }

    // 2. Uniqueness check
    const existingAdmin = await db.adminUser.findUnique({
      where: { username: normalizedUsername },
      select: { id: true },
    });

    if (existingAdmin) {
      logger.warn({ requestId, username: normalizedUsername }, "Username registration collision");
      return sendError("DUPLICATE_USERNAME", "This username is already taken.", requestId, 409, {
        fields: { username: ["This username is already taken."] },
      });
    }

    // 3. Hash Password
    const passwordHash = await hashPassword(password);

    // 4. Create Pending Admin Account
    const newAdmin = await db.adminUser.create({
      data: {
        fullName: fullName.trim(),
        username: normalizedUsername,
        passwordHash,
        status: "PENDING", // Accounts default to pending approval
        role: "ADMIN",
      },
    });

    logger.info(
      { requestId, adminId: newAdmin.id, username: normalizedUsername },
      "New admin user registered as PENDING"
    );

    return sendSuccess(
      { username: normalizedUsername, status: "PENDING" },
      "Admin registration submitted successfully. Pending approval.",
      requestId,
      null,
      201
    );
  } catch (error: any) {
    logger.error(
      { requestId, error: error.message, stack: error.stack },
      "Unhandled error during admin registration"
    );
    return sendError(
      "INTERNAL_SERVER_ERROR",
      "An unexpected error occurred. Please try again.",
      requestId,
      500
    );
  }
}
