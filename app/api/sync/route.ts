import { NextResponse } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MONGODB_URI not configured" }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection");
    const db = await getDb();

    if (collection) {
      const docs = await db.collection(collection).find({}).toArray();
      return NextResponse.json(docs.map(({ _id, ...rest }: any) => rest));
    }

    const [prescriptions, inventory, patients, interactions, cascades] = await Promise.all([
      db.collection("prescriptions").find({}).toArray(),
      db.collection("inventory").find({}).toArray(),
      db.collection("patients").find({}).toArray(),
      db.collection("drug_interactions").find({}).toArray(),
      db.collection("cascade_patterns").find({}).toArray(),
    ]);

    return NextResponse.json({
      prescriptions: prescriptions.map(({ _id, ...rest }: any) => rest),
      inventory: inventory.map(({ _id, ...rest }: any) => rest),
      patients: patients.reduce((acc: any, p: any) => {
        const { _id, ...rest } = p;
        acc[p.id] = rest;
        return acc;
      }, {}),
      drugInteractions: interactions.map(({ _id, ...rest }: any) => rest),
      cascadePatterns: cascades.map(({ _id, ...rest }: any) => rest),
    });
  } catch {
    return NextResponse.json({ error: "MongoDB connection failed" }, { status: 503 });
  }
}
