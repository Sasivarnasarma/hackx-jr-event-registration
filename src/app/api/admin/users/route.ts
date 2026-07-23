import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { generateRequestId, sendSuccess, sendError } from "@/lib/api-response";
import { verifySession } from "@/lib/session";

/**
 * GET: Fetches all pending admin accounts. Restricted to SUPER_ADMIN.
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    const session = await verifySession();
    if (!session) {
      return sendError("UNAUTHORIZED", "Access denied.", requestId, 401);
    }

    // Only SUPER_ADMIN role is permitted to audit admin requests
    if (session.user.role !== "SUPER_ADMIN") {
      logger.warn({ requestId, adminId: session.userId }, "Unauthorized role check on users list");
      return sendError("FORBIDDEN", "Only Super Admins can manage administrator requests.", requestId, 403);
    }

    const allAdmins = await db.adminUser.findMany({
      where: {
        NOT: { id: session.userId },
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        status: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(allAdmins, "Administrators list retrieved successfully.", requestId);

  } catch (error: any) {
    logger.error({ requestId, error: error.message }, "Error fetching pending admin accounts");
    return sendError("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", requestId, 500);
  }
}

/**
 * PATCH: Approves or rejects a pending admin account. Restricted to SUPER_ADMIN.
 */
export async function PATCH(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    const session = await verifySession();
    if (!session) {
      return sendError("UNAUTHORIZED", "Access denied.", requestId, 401);
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return sendError("FORBIDDEN", "Only Super Admins can manage administrator approvals.", requestId, 403);
    }

    const body = await request.json();
    const { userId, status } = body;

    if (!userId || !status) {
      return sendError("BAD_REQUEST", "User ID and Status are required.", requestId, 400);
    }

    const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return sendError("BAD_REQUEST", "Invalid status value provided.", requestId, 400);
    }

    // Check if the user exists
    const targetUser = await db.adminUser.findUnique({
      where: { id: userId },
      select: { id: true, role: true, username: true },
    });

    if (!targetUser) {
      return sendError("NOT_FOUND", "Target administrator not found.", requestId, 404);
    }

    // Prevent modifying other super admins
    if (targetUser.role === "SUPER_ADMIN") {
      return sendError("FORBIDDEN", "Super Admins cannot modify status parameters of other Super Admins.", requestId, 403);
    }

    // Update user status
    const updatedUser = await db.adminUser.update({
      where: { id: userId },
      data: { status: status as any },
      select: { id: true, username: true, status: true },
    });

    logger.info(
      { requestId, superAdminId: session.userId, targetId: userId, newStatus: status },
      "Admin user status updated by Super Admin"
    );

    // If status is not APPROVED, clean up all active sessions for this user
    if (status !== "APPROVED") {
      await db.session.deleteMany({
        where: { userId },
      });
      logger.info({ requestId, targetId: userId }, "Revoked all active sessions for non-approved user");
    }

    return sendSuccess(updatedUser, `Administrator request status updated to ${status}.`, requestId);

  } catch (error: any) {
    logger.error({ requestId, error: error.message }, "Error updating administrator request status");
    return sendError("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", requestId, 500);
  }
}
