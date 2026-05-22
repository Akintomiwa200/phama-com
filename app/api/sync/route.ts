import { NextRequest } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongodb";
import { loadAppState } from "@/lib/load-app-state";
import { broadcast } from "@/lib/realtime-hub";

export const dynamic = "force-dynamic";

const ALLOWED_COLLECTIONS = new Set([
  "prescriptions",
  "inventory",
  "patients",
  "audit_log",
  "drug_interactions",
  "cascade_patterns",
  "drugs",
  "pharmacists",
]);

export async function GET() {
  if (!isMongoConfigured()) {
    return Response.json({ error: "MongoDB not configured" }, { status: 503 });
  }
  try {
    const state = await loadAppState();
    return Response.json(state);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Load failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isMongoConfigured()) {
    return Response.json({ error: "MongoDB not configured" }, { status: 503 });
  }

  let body: {
    collection?: string;
    operation?: string;
    data?: Record<string, unknown>;
    query?: Record<string, unknown>;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { collection, operation, data, query } = body;

  if (!collection || !ALLOWED_COLLECTIONS.has(collection)) {
    return Response.json({ error: "Invalid collection" }, { status: 400 });
  }

  if (!operation) {
    return Response.json({ error: "Missing operation" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const col = db.collection(collection);

    switch (operation) {
      case "insertOne": {
        if (!data) return Response.json({ error: "Missing data" }, { status: 400 });
        await col.insertOne(data);
        break;
      }
      case "updateOne": {
        if (!data || !query) {
          return Response.json({ error: "Missing data or query" }, { status: 400 });
        }
        const filter = buildFilter(collection, query);
        await col.updateOne(filter, { $set: data });
        break;
      }
      case "replaceOne": {
        if (!data || !query) {
          return Response.json({ error: "Missing data or query" }, { status: 400 });
        }
        const filter = buildFilter(collection, query);
        await col.replaceOne(filter, data, { upsert: true });
        break;
      }
      case "deleteOne": {
        if (!query) return Response.json({ error: "Missing query" }, { status: 400 });
        const filter = buildFilter(collection, query);
        await col.deleteOne(filter);
        break;
      }
      default:
        return Response.json({ error: `Unknown operation: ${operation}` }, { status: 400 });
    }

    const state = await loadAppState();
    broadcast(state);

    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

function buildFilter(collection: string, query: Record<string, unknown>) {
  if (collection === "prescriptions" && query.rxId) {
    return { rxId: query.rxId };
  }
  if (collection === "inventory" && query.barcode) {
    return { barcode: query.barcode };
  }
  if (collection === "patients" && query.id) {
    return { id: query.id };
  }
  if (collection === "audit_log") {
    return query;
  }
  return query;
}
