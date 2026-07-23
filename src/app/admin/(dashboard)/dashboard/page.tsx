import React from "react";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/ui/logout-button";

export default async function AdminDashboardPage() {
  const session = await verifySession();

  // Guard: If layouts bypass occurs, prevent page load
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto z-10 relative">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-wide">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Welcome back, <span className="text-white font-medium">{session.user.fullName}</span>!
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="glass-panel rounded-3xl p-6 text-center">
        <p className="text-slate-400 text-sm">
          Protected Administrator Panel Area. Database metrics and controls will be active here.
        </p>
      </div>
    </div>
  );
}
