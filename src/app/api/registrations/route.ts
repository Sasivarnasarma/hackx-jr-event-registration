import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";
import { generateRequestId, sendSuccess, sendError } from "@/lib/api-response";
import {
  registrationSchema,
  normalizeMobileNumber,
  normalizeEmail,
  normalizeSpaces,
} from "@/lib/validation";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();

  // Extract client IP address for logging and Turnstile verification
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined;

  try {
    const body = await request.json();

    // 1. Zod Validation
    const validation = registrationSchema.safeParse(body);
    if (!validation.success) {
      const fields: Record<string, string[]> = {};
      validation.error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!fields[path]) {
          fields[path] = [];
        }
        fields[path].push(err.message);
      });

      logger.warn({ requestId, fields }, "Registration validation failed");
      return sendError("VALIDATION_ERROR", "Some fields contain invalid values.", requestId, 422, {
        fields,
      });
    }

    const data = validation.data;

    // 2. Cloudflare Turnstile verification
    const isHuman = await verifyTurnstileToken(data.turnstileToken, clientIp);
    if (!isHuman) {
      logger.warn({ requestId, clientIp }, "Turnstile verification failed");
      return sendError(
        "TURNSTILE_ERROR",
        "Bot verification failed. Please try again.",
        requestId,
        400
      );
    }

    // 3. Normalization
    const normalizedFullName = normalizeSpaces(data.fullName);
    const normalizedSchool = normalizeSpaces(data.school);
    const normalizedMobile = normalizeMobileNumber(data.mobileNumber)!;
    const normalizedEmail = normalizeEmail(data.email);
    const normalizedSource = data.awarenessSource
      ? normalizeSpaces(data.awarenessSource)
      : "Not Specified";

    // 4. Duplicate checks
    // Check mobile number duplicate
    const duplicateMobile = await db.registration.findUnique({
      where: { mobileNumber: normalizedMobile },
      select: { id: true },
    });
    if (duplicateMobile) {
      logger.warn(
        { requestId, mobileNumber: normalizedMobile },
        "Duplicate mobile number registration attempt"
      );
      return sendError(
        "DUPLICATE_MOBILE",
        "A registration already exists with this mobile number.",
        requestId,
        409,
        { field: "mobileNumber" }
      );
    }

    // Check email duplicate if provided
    if (normalizedEmail) {
      const duplicateEmail = await db.registration.findUnique({
        where: { email: normalizedEmail },
        select: { id: true },
      });
      if (duplicateEmail) {
        logger.warn({ requestId, email: normalizedEmail }, "Duplicate email registration attempt");
        return sendError(
          "DUPLICATE_EMAIL",
          "A registration already exists with this email address.",
          requestId,
          409,
          { field: "email" }
        );
      }
    }

    // 5. Insert registration into Database
    const registration = await db.registration.create({
      data: {
        fullName: normalizedFullName,
        mobileNumber: normalizedMobile,
        email: normalizedEmail,
        participantType: data.participantType,
        school: normalizedSchool,
        grade: data.grade || null,
        awarenessSource: normalizedSource,
      },
    });

    logger.info(
      {
        requestId,
        registrationId: registration.id,
        participantType: data.participantType,
      },
      "Registration created successfully"
    );

    // 6. Return standard success format
    return sendSuccess(
      { id: registration.id },
      "Registration completed successfully.",
      requestId,
      null,
      201
    );
  } catch (error: any) {
    logger.error(
      { requestId, error: error.message, stack: error.stack },
      "Unhandled error during registration"
    );
    return sendError(
      "INTERNAL_SERVER_ERROR",
      "An unexpected error occurred. Please try again.",
      requestId,
      500
    );
  }
}
