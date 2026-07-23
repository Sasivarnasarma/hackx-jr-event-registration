import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "./db";
import { AdminUser } from "@prisma/client";

const SESSION_COOKIE_NAME = "session_token";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Hashes a raw session token using SHA-256.
 * Storing only hashes in the database protects session tokens from DB leaks.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a new session in the database for the given user,
 * and sets the session token in an HttpOnly cookie.
 */
export async function createSession(userId: string): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  // Store hashed session token in the database
  await db.session.create({
    data: {
      userId,
      sessionTokenHash: hashedToken,
      expiresAt,
    },
  });

  // Write session token to secure HttpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return rawToken;
}

/**
 * Verifies the session token cookie against the database.
 * Returns the session and user details if valid, or null otherwise.
 */
export async function verifySession(): Promise<{ id: string; userId: string; user: AdminUser } | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawToken) {
    return null;
  }

  const hashedToken = hashToken(rawToken);

  try {
    const session = await db.session.findUnique({
      where: { sessionTokenHash: hashedToken },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    // Check expiration
    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await db.session.delete({ where: { id: session.id } }).catch(() => {});
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    // Check if user status is approved
    if (session.user.status !== "APPROVED") {
      // Revoke session if user is no longer approved
      await db.session.delete({ where: { id: session.id } }).catch(() => {});
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    // Optional sliding session window: update expiration if it expires in less than 3 days
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    if (session.expiresAt.getTime() - Date.now() < threeDaysMs) {
      const newExpiresAt = new Date(Date.now() + SESSION_DURATION_MS);
      await db.session.update({
        where: { id: session.id },
        data: { expiresAt: newExpiresAt },
      }).catch(() => {});
    }

    return session;
  } catch (error) {
    console.error("Error verifying admin session:", error);
    return null;
  }
}

/**
 * Revokes the current session by deleting it from the database
 * and clearing the session cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (rawToken) {
    const hashedToken = hashToken(rawToken);
    try {
      await db.session.delete({
        where: { sessionTokenHash: hashedToken },
      });
    } catch (error) {
      // Ignore if session not found or already deleted
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
