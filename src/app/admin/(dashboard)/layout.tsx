import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";

/**
 * Layout wrapper for protected administrative dashboard views.
 * Queries the database session on the server to prevent access for expired sessions.
 */
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  // If session is missing or invalid, redirect to admin login
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#010E13] text-[#f0f4ff] font-sans antialiased relative">
      {children}
    </div>
  );
}
