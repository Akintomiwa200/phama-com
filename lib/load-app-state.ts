import { getDb, isMongoConfigured } from "./mongodb";
import type { AppState } from "./store";
import type { Patient, Drug, PrescriptionItem, InventoryItem, DrugInteraction, CascadePattern, Pharmacist } from "@/types";

function stripId<T extends Record<string, unknown>>(doc: T): Omit<T, "_id"> {
  const { _id, ...rest } = doc;
  return rest as Omit<T, "_id">;
}

export function normalizeAuditEntry(raw: Record<string, unknown>) {
  const time =
    (raw.time as string) ||
    (raw.timestamp as string) ||
    new Date().toTimeString().slice(0, 8);
  return {
    time: typeof time === "string" && time.length > 8 ? time.slice(11, 19) || time : time,
    action: String(raw.action ?? ""),
    details: String(raw.details ?? ""),
    level: (raw.level as string) || "info",
    user: (raw.user as string) || (raw.pharmacistId as string) || undefined,
  };
}

export async function loadAppState(): Promise<Partial<AppState>> {
  if (!isMongoConfigured()) {
    return {};
  }

  const db = await getDb();

  const [
    prescriptionsRaw,
    inventoryRaw,
    patientsRaw,
    drugInteractionsRaw,
    cascadePatternsRaw,
    pharmacistsRaw,
    drugsRaw,
    auditLogRaw,
  ] = await Promise.all([
    db.collection("prescriptions").find().toArray(),
    db.collection("inventory").find().toArray(),
    db.collection("patients").find().toArray(),
    db.collection("drug_interactions").find().toArray(),
    db.collection("cascade_patterns").find().toArray(),
    db.collection("pharmacists").find().toArray(),
    db.collection("drugs").find().toArray(),
    db.collection("audit_log").find().sort({ _id: -1 }).limit(200).toArray(),
  ]);

  const patients: Record<string, Patient> = {};
  for (const doc of patientsRaw) {
    const p = stripId(doc) as unknown as Patient;
    patients[p.id] = p;
  }

  const drugs: Record<string, Drug> = {};
  for (const doc of drugsRaw) {
    const d = stripId(doc) as unknown as Drug;
    drugs[d.barcode] = d;
  }

  return {
    prescriptions: prescriptionsRaw.map((d) => stripId(d) as unknown as PrescriptionItem),
    inventory: inventoryRaw.map((d) => stripId(d) as unknown as InventoryItem),
    patients,
    drugInteractions: drugInteractionsRaw.map((d) => stripId(d) as unknown as DrugInteraction),
    cascadePatterns: cascadePatternsRaw.map((d) => stripId(d) as unknown as CascadePattern),
    pharmacists: pharmacistsRaw.map((d) => stripId(d) as unknown as Pharmacist),
    drugs,
    auditLog: auditLogRaw.reverse().map((d) => normalizeAuditEntry(stripId(d) as Record<string, unknown>)),
    dbConnected: true,
  };
}
