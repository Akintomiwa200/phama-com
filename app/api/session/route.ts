import { NextRequest } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/** Verify a stored practitioner ID is still authorized in MongoDB (real session, not client-only). */
export async function GET(request: NextRequest) {
  if (!isMongoConfigured()) {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }

  const id = request.nextUrl.searchParams.get("id")?.trim().toUpperCase();
  if (!id) {
    return Response.json({ error: "Missing practitioner id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const pharmacist = await db.collection("pharmacists").findOne({ id });

    if (!pharmacist || !pharmacist.authorized) {
      return Response.json({ error: "Session invalid or access revoked" }, { status: 401 });
    }

    return Response.json({
      id: pharmacist.id,
      name: pharmacist.name,
      role: "Senior Pharmacist",
      licenseNumber: pharmacist.licenseNumber,
      authorized: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Session verification failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
