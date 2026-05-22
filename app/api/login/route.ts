import { NextRequest } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isMongoConfigured()) {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const id = body.id?.trim().toUpperCase();
  if (!id) {
    return Response.json({ error: "Practitioner ID required" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const pharmacist = await db.collection("pharmacists").findOne({ id });

    if (!pharmacist || !pharmacist.authorized) {
      return Response.json({ error: "Unknown practitioner ID or access denied." }, { status: 401 });
    }

    return Response.json({
      id: pharmacist.id,
      name: pharmacist.name,
      role: "Senior Pharmacist",
      licenseNumber: pharmacist.licenseNumber,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
