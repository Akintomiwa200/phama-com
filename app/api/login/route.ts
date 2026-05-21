import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing pharmacist ID" }, { status: 400 });
    }

    const db = await getDb();
    const pharmacist = await db.collection("pharmacists").findOne({ id: id.trim() });

    if (!pharmacist || !pharmacist.authorized) {
      return NextResponse.json({ error: "Invalid or unauthorized ID" }, { status: 401 });
    }

    return NextResponse.json({
      id: pharmacist.id,
      name: pharmacist.name,
      role: pharmacist.licenseNumber && pharmacist.licenseNumber !== "INVALID" ? "Pharmacist" : "Staff",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
