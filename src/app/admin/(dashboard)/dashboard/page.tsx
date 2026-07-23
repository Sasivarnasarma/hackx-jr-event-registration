import React from "react";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminControls } from "@/components/ui/admin-controls";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await verifySession();

  // Layout protection fallback check
  if (!session) {
    redirect("/admin/login");
  }

  // 1. Fetch registrations list
  const registrations = await db.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 2. Fetch all admins (only if currently logged in user is SUPER_ADMIN)
  let allAdmins: any[] = [];
  if (session.user.role === "SUPER_ADMIN") {
    allAdmins = await db.adminUser.findMany({
      where: {
        NOT: { id: session.user.id },
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
  }

  // Map dates to strings for hydration compatibility in client components
  const serializedRegistrations = registrations.map((r: any) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  const serializedAllAdmins = allAdmins.map((a: any) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  const currentAdmin = {
    id: session.user.id,
    fullName: session.user.fullName,
    username: session.user.username,
    role: session.user.role,
  };

  return (
    <main className="min-h-screen bg-[#010E13]">
      <AdminControls
        initialRegistrations={serializedRegistrations}
        initialAdmins={serializedAllAdmins}
        currentAdmin={currentAdmin}
      />
    </main>
  );
}
