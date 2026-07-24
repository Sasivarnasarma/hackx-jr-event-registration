import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { verifySession } from "@/lib/session";

/**
 * Escapes a cell value for safe CSV parsing.
 * Wraps values containing commas, quotes, or newlines in double quotes.
 * Escapes leading formula injection characters (=, +, -, @) with a single quote.
 */
function escapeCsvCell(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }

  let valStr = String(value).trim();

  // Escape CSV Formula Injection vulnerabilities
  const injectionChars = ["=", "+", "-", "@"];
  if (injectionChars.some((char) => valStr.startsWith(char))) {
    valStr = `'${valStr}`;
  }

  // Escape double quotes by doubling them, then wrap in quotes
  const escaped = valStr.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET() {
  const requestId = Math.random().toString(36).substring(2, 9); // Simple request UID for logging

  try {
    // 1. Session verification
    const session = await verifySession();
    if (!session) {
      logger.warn({ requestId }, "Unauthorized CSV export attempt");
      return new NextResponse("Access Denied", { status: 401 });
    }

    // 2. Fetch all registrations sorted by registration date
    const registrations = await db.registration.findMany({
      orderBy: { createdAt: "asc" },
    });

    // 3. Define headers and rows
    const headers = [
      "ID",
      "Full Name",
      "Mobile Number",
      "Email Address",
      "Participant Type",
      "School",
      "Grade",
      "Awareness Source",
      "Registration Date",
    ];

    const csvRows = [headers.join(",")];

    for (const r of registrations) {
      let formattedGrade = r.grade || "";
      if (formattedGrade && !formattedGrade.startsWith("Grade ") && formattedGrade !== "Other") {
        formattedGrade = `Grade ${formattedGrade}`;
      }

      const row = [
        escapeCsvCell(String(r.id)),
        escapeCsvCell(r.fullName),
        escapeCsvCell(r.mobileNumber),
        escapeCsvCell(r.email),
        escapeCsvCell(r.participantType),
        escapeCsvCell(r.school),
        escapeCsvCell(formattedGrade),
        escapeCsvCell(r.awarenessSource),
        escapeCsvCell(r.createdAt.toISOString()),
      ];
      csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\n");

    logger.info(
      { requestId, adminId: session.userId, recordCount: registrations.length },
      "Registrations CSV exported successfully"
    );

    // 4. Return as browser attachment file download
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=hackx_jr_registrations.csv",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error: any) {
    logger.error({ requestId, error: error.message }, "Error during registrations CSV export");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
