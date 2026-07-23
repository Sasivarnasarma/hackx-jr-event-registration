import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { generateRequestId, sendSuccess, sendError } from "@/lib/api-response";
import { verifySession } from "@/lib/session";
import { hashPassword } from "@/lib/security";

/**
 * POST: Resets another administrator's password. Restricted to SUPER_ADMIN.
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    const session = await verifySession();
    if (!session) {
      return sendError("UNAUTHORIZED", "Access denied.", requestId, 401);
    }

    // Only SUPER_ADMIN can trigger password resets
    if (session.user.role !== "SUPER_ADMIN") {
      logger.warn({ requestId, adminId: session.userId }, "Unauthorized attempt to reset admin password");
      return sendError("FORBIDDEN", "Only Super Admins can reset password parameters.", requestId, 403);
    }

    const body = await request.json();
    const { userId, newPassword } = body;

    if (!userId || !newPassword || String(newPassword).trim().length < 8) {
      return sendError("BAD_REQUEST", "User ID and a new password (min 8 chars) are required.", requestId, 400);
    }

    // Verify target user exists
    const targetUser = await db.adminUser.findUnique({
      where: { id: userId },
      select: { id: true, role: true, username: true },
    });

    if (!targetUser) {
      return sendError("NOT_FOUND", "Target administrator account not found.", requestId, 404);
    }

    // Prevent modifying other super admins
    if (targetUser.role === "SUPER_ADMIN" && targetUser.id !== session.userId) {
      return sendError("FORBIDDEN", "Super Admins cannot reset passwords of other Super Admins.", requestId, 403);
    }

    // Hash the new password using Argon2id WASM-backed script
    const hashed = await hashPassword(newPassword);

    // Update password
    await db.adminUser.update({
      where: { id: userId },
      data: { passwordHash: hashed },
    });

    // Revoke all sessions for this user to force re-login
    await db.session.deleteMany({
      where: { userId },
    });

    logger.info(
      { requestId, superAdminId: session.userId, targetId: userId },
      "Password reset and sessions revoked for admin user by Super Admin"
    );

    return sendSuccess(null, "Password reset completed successfully. Active sessions revoked.", requestId);

  } catch (error: any) {
    logger.error({ requestId, error: error.message }, "Error resetting admin user password");
    return sendError("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", requestId, 500);
  }
}
