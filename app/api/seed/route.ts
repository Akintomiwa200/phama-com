import { NextResponse } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongodb";
import {
  PRESCRIPTIONS_QUEUE, DRUG_INVENTORY, PATIENTS,
  DRUG_INTERACTIONS, CASCADE_PATTERNS, PHARMACISTS,
} from "@/lib/database";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MONGODB_URI not configured" }, { status: 503 });
  }

  try {
    const db = await getDb();

    await db.collection("pharmacists").deleteMany({});
    await db.collection("pharmacists").insertMany(PHARMACISTS as any);

    await db.collection("prescriptions").deleteMany({});
    await db.collection("prescriptions").insertMany(PRESCRIPTIONS_QUEUE as any);

    await db.collection("inventory").deleteMany({});
    await db.collection("inventory").insertMany(DRUG_INVENTORY as any);

    await db.collection("patients").deleteMany({});
    await db.collection("patients").insertMany(
      Object.values(PATIENTS) as any
    );

    await db.collection("drug_interactions").deleteMany({});
    await db.collection("drug_interactions").insertMany(DRUG_INTERACTIONS as any);

    await db.collection("cascade_patterns").deleteMany({});
    await db.collection("cascade_patterns").insertMany(CASCADE_PATTERNS as any);

    return NextResponse.json({ ok: true, collections: ["pharmacists", "prescriptions", "inventory", "patients", "drug_interactions", "cascade_patterns"] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
