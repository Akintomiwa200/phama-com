import { NextRequest } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isMongoConfigured()) {
    return Response.json({ found: false, error: "MongoDB not configured" }, { status: 503 });
  }

  let body: { barcode?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ found: false, error: "Invalid JSON" }, { status: 400 });
  }

  const barcode = body.barcode?.trim();
  if (!barcode) {
    return Response.json({ found: false, error: "Missing barcode" }, { status: 400 });
  }

  try {
    const db = await getDb();

    const [drugDoc, inventoryDoc] = await Promise.all([
      db.collection("drugs").findOne({ barcode }),
      db.collection("inventory").findOne({ barcode }),
    ]);

    if (drugDoc) {
      const { _id, ...rest } = drugDoc;
      return Response.json({ found: true, source: "drugs", item: rest });
    }

    if (inventoryDoc) {
      const { _id, ...rest } = inventoryDoc;
      return Response.json({ found: true, source: "inventory", item: rest });
    }

    return Response.json({ found: false, barcode });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Lookup failed";
    return Response.json({ found: false, error: message }, { status: 500 });
  }
}
