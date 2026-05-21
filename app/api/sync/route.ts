import { NextResponse } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MONGODB_URI not configured" }, { status: 503 });
  }

  try {
    const db = await getDb();

    const [prescriptions, inventory, patients, interactions, cascades, pharmacists, drugs, auditLog] = await Promise.all([
      db.collection("prescriptions").find({}).toArray(),
      db.collection("inventory").find({}).toArray(),
      db.collection("patients").find({}).toArray(),
      db.collection("drug_interactions").find({}).toArray(),
      db.collection("cascade_patterns").find({}).toArray(),
      db.collection("pharmacists").find({}).toArray(),
      db.collection("drugs").find({}).toArray(),
      db.collection("audit_log").find({}).toArray(),
    ]);

    const result: Record<string, any> = {};

    if (prescriptions.length) result.prescriptions = prescriptions.map(({ _id, ...rest }: any) => rest);
    if (inventory.length) result.inventory = inventory.map(({ _id, ...rest }: any) => rest);
    if (patients.length) {
      result.patients = patients.reduce((acc: any, p: any) => {
        const { _id, ...rest } = p;
        acc[p.id] = rest;
        return acc;
      }, {});
    }
    if (interactions.length) result.drugInteractions = interactions.map(({ _id, ...rest }: any) => rest);
    if (cascades.length) result.cascadePatterns = cascades.map(({ _id, ...rest }: any) => rest);
    if (pharmacists.length) result.pharmacists = pharmacists.map(({ _id, ...rest }: any) => rest);
    if (drugs.length) result.drugs = drugs.map(({ _id, ...rest }: any) => rest);
    if (auditLog.length) result.auditLog = auditLog.map(({ _id, ...rest }: any) => rest);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "MongoDB connection failed" }, { status: 503 });
  }
}

export async function POST(req: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MONGODB_URI not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { collection, operation, data, query } = body;

    if (!collection || !operation) {
      return NextResponse.json({ error: "collection and operation required" }, { status: 400 });
    }

    const db = await getDb();

    switch (operation) {
      case "insertOne":
        await db.collection(collection).insertOne(data);
        break;
      case "insertMany":
        await db.collection(collection).insertMany(data);
        break;
      case "updateOne":
        await db.collection(collection).updateOne(query, { $set: data });
        break;
      case "updateMany":
        await db.collection(collection).updateMany(query, { $set: data });
        break;
      case "deleteOne":
        await db.collection(collection).deleteOne(query);
        break;
      case "replaceOne":
        await db.collection(collection).replaceOne(query, data, { upsert: true });
        break;
      default:
        return NextResponse.json({ error: "Unknown operation" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}