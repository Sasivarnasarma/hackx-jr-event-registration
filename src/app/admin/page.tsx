import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";

/**
 * Root administrative landing page.
 * Determines authentication state on the server and redirects:
 * - To /admin/dashboard if logged in.
 * - To /admin/login if anonymous.
 */
export default async function AdminPage() {
  const session = await verifySession();

  if (session) {
    redirect("/admin/dashboard");
  } else {
    redirect("/admin/login");
  }
}
