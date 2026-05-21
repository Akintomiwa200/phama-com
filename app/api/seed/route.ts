import { NextResponse } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongodb";
import { readFileSync } from "fs";
import { resolve } from "path";

export const dynamic = "force-dynamic";

const dataDir = resolve(process.cwd(), "data");

function loadJSON(file: string) {
  const raw = readFileSync(resolve(dataDir, file), "utf-8");
  return JSON.parse(raw);
}

const COLLECTIONS: { name: string; file: string; transform?: (data: any) => any }[] = [
  { name: "pharmacists", file: "pharmacists.json" },
  { name: "prescriptions", file: "prescriptions.json" },
  { name: "inventory", file: "inventory.json" },
  { name: "patients", file: "patients.json" },
  { name: "drug_interactions", file: "interactions.json" },
  { name: "cascade_patterns", file: "cascade-patterns.json" },
  { name: "drugs", file: "drugs.json" },
  { name: "audit_log", file: "audit-log.json", transform: (data) => Array.isArray(data) ? data : data.entries || [] },
];

export async function POST() {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MONGODB_URI not configured" }, { status: 503 });
  }

  try {
    const db = await getDb();
    const seeded: string[] = [];

    for (const { name, file } of COLLECTIONS) {
      const data = loadJSON(file);
      const docs = Array.isArray(data) ? data : data.entries || [];

      await db.collection(name).deleteMany({});
      if (docs.length > 0) {
        await db.collection(name).insertMany(docs);
      }
      seeded.push(name);
    }

    return NextResponse.json({ ok: true, collections: seeded });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
