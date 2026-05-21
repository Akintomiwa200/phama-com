import pharmacists from "@/data/pharmacists.json";
import patients from "@/data/patients.json";
import drugs from "@/data/drugs.json";
import drugInteractions from "@/data/interactions.json";
import cascadePatterns from "@/data/cascade-patterns.json";
import auditLogData from "@/data/audit-log.json";
import prescriptionsData from "@/data/prescriptions.json";
import inventoryData from "@/data/inventory.json";

import type {
  Pharmacist,
  Patient,
  Drug,
  DrugInteraction,
  CascadePattern,
  AuditEntry,
  PrescriptionItem,
  InventoryItem,
} from "@/types";

export function getPharmacistById(id: string): Pharmacist | undefined {
  return (pharmacists as Pharmacist[]).find((p) => p.id === id);
}

export function getPatientById(id: string): Patient | undefined {
  return (patients as Patient[]).find((p) => p.id === id);
}

export function getPatients(): Patient[] {
  return patients as Patient[];
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
): DrugInteraction | null {
  const found = (drugInteractions as DrugInteraction[]).find(
    (i) =>
      (i.drug1.toLowerCase() === newDrugName.toLowerCase() &&
        currentMeds.some(
          (med) => med.toLowerCase() === i.drug2.toLowerCase()
        )) ||
      (i.drug2.toLowerCase() === newDrugName.toLowerCase() &&
        currentMeds.some(
          (med) => med.toLowerCase() === i.drug1.toLowerCase()
        ))
  );
  return found || null;
}

export function checkCascade(
  newDrugName: string,
  currentMeds: string[]
): { detected: boolean; pattern?: CascadePattern } {
  const pattern = (cascadePatterns as CascadePattern[]).find(
    (cp) =>
      cp.newDrug.toLowerCase() === newDrugName.toLowerCase() &&
      currentMeds.some(
        (med) => med.toLowerCase() === cp.causeDrug.toLowerCase()
      )
  );
  return pattern
    ? { detected: true, pattern }
    : { detected: false };
}

export function getAuditLog(): AuditEntry[] {
  return auditLogData.entries as AuditEntry[];
}

export function getPrescriptions(): PrescriptionItem[] {
  return prescriptionsData as PrescriptionItem[];
}

export function getInventory(): InventoryItem[] {
  return inventoryData as InventoryItem[];
}

export function getDrugInteractions(): DrugInteraction[] {
  return drugInteractions as DrugInteraction[];
}

export function getCascadePatterns(): CascadePattern[] {
  return cascadePatterns as CascadePattern[];
}
