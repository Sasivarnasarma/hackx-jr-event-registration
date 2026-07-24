import { env } from "./env";

/**
 * Verifies a Cloudflare Turnstile token server-side.
 */
export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  // Bypasses validation during local development if dummy Turnstile test keys are configured
  if (
    env.NODE_ENV === "development" &&
    (token === "dummy" ||
      env.TURNSTILE_SECRET_KEY.startsWith("1x") ||
      env.TURNSTILE_SECRET_KEY.startsWith("2x"))
  ) {
    console.log("ℹ️ Turnstile verification bypassed in development mode using dummy keys");
    return true;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", env.TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    if (ip) {
      formData.append("remoteip", ip);
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error(`Cloudflare siteverify returned HTTP status ${response.status}`);
      return false;
    }

    const data = await response.json();
    return !!data.success;
  } catch (error) {
    console.error("Error verifying Cloudflare Turnstile token:", error);
    return false;
  }
}
