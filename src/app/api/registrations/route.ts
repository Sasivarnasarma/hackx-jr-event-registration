import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { generateRequestId, sendSuccess, sendError } from "@/lib/api-response";
import {
  registrationSchema,
  normalizeMobileNumber,
  normalizeSpaces,
} from "@/lib/validation";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
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

    // 4. Duplicate WhatsApp number check
    const duplicateMobile = await db.registration.findUnique({
      where: { mobileNumber: normalizedMobile },
      select: { id: true },
    });
    if (duplicateMobile) {
      logger.warn(
        { requestId, mobileNumber: normalizedMobile },
        "Duplicate WhatsApp number registration attempt"
      );
      return sendError(
        "DUPLICATE_MOBILE",
        "A registration already exists with this WhatsApp number.",
        requestId,
        409,
        { field: "mobileNumber" }
      );
    }

    // 5. Insert registration into Database
    const registration = await db.registration.create({
      data: {
        fullName: normalizedFullName,
        mobileNumber: normalizedMobile,
        email: null,
        participantType: data.participantType,
        school: normalizedSchool,
        grade: data.participantType === "STUDENT" ? data.grade || null : null,
        awarenessSource: "Not Specified",
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

    // 6. Return standard success format including registration id
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

/**
 * PATCH endpoint to update optional post-registration feedback (awarenessSource)
 */
export async function PATCH(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    const body = await request.json();
    const { id, awarenessSource } = body;

    if (!id || typeof id !== "number") {
      return sendError("INVALID_INPUT", "Registration ID is required", requestId, 400);
    }

    if (!awarenessSource || typeof awarenessSource !== "string") {
      return sendError("INVALID_INPUT", "Awareness source is required", requestId, 400);
    }

    const normalizedSource = normalizeSpaces(awarenessSource);

    const updated = await db.registration.update({
      where: { id },
      data: { awarenessSource: normalizedSource },
    });

    logger.info({ requestId, registrationId: id, awarenessSource: normalizedSource }, "Awareness source updated");

    return sendSuccess({ id: updated.id }, "Feedback saved successfully", requestId, null, 200);
  } catch (error: any) {
    logger.error({ requestId, error: error.message }, "Error updating awareness source");
    return sendError("INTERNAL_SERVER_ERROR", "Failed to update feedback", requestId, 500);
  }
}
