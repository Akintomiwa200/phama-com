import pharmacists from "@/data/pharmacists.json";
import patients from "@/data/patients.json";
import drugs from "@/data/drugs.json";
import interactions from "@/data/interactions.json";
import cascadePatterns from "@/data/cascade-patterns.json";
import auditLogData from "@/data/audit-log.json";

import type {
  Pharmacist,
  Patient,
  Drug,
  Interaction,
  AuditEntry,
} from "@/types";

export function getPharmacistById(id: string): Pharmacist | undefined {
  return (pharmacists as Pharmacist[]).find((p) => p.id === id);
}

export function getPatientById(id: string): Patient | undefined {
  return (patients as Patient[]).find((p) => p.id === id);
}

export function getDrugByBarcode(barcode: string): Drug | undefined {
  return (drugs as Drug[]).find((d) => d.barcode === barcode);
}

export function getDrugByName(name: string): Drug | undefined {
  return (drugs as Drug[]).find(
    (d) => d.name.toLowerCase() === name.toLowerCase()
  );
}

export function checkInteraction(
  newDrugName: string,
  currentMeds: string[]
): Interaction | null {
  const found = (interactions as Interaction[]).find(
    (i) =>
      (i.drugA.toLowerCase() === newDrugName.toLowerCase() &&
        currentMeds.some(
          (med) => med.toLowerCase() === i.drugB.toLowerCase()
        )) ||
      (i.drugB.toLowerCase() === newDrugName.toLowerCase() &&
        currentMeds.some(
          (med) => med.toLowerCase() === i.drugA.toLowerCase()
        ))
  );
  return found || null;
}

export function checkCascade(
  newDrugName: string,
  currentMeds: string[]
): { detected: boolean; pattern?: (typeof cascadePatterns)[0] } {
  const pattern = (cascadePatterns as typeof cascadePatterns).find(
    (cp) =>
      cp.prescribedForSideEffect.toLowerCase() ===
        newDrugName.toLowerCase() &&
      currentMeds.some(
        (med) => med.toLowerCase() === cp.causingDrug.toLowerCase()
      )
  );
  return pattern
    ? { detected: true, pattern }
    : { detected: false };
}

export function getAuditLog(): AuditEntry[] {
  return auditLogData.entries as AuditEntry[];
}
