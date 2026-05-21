import pharmacists from "@/data/pharmacists.json";
import patientsData from "@/data/patients.json";
import drugInteractions from "@/data/interactions.json";
import cascadePatterns from "@/data/cascade-patterns.json";
import prescriptionsData from "@/data/prescriptions.json";
import inventoryData from "@/data/inventory.json";

import type {
  Patient,
  DrugInteraction,
  CascadePattern,
  InventoryItem,
  PrescriptionItem,
  Pharmacist,
  Medication,
  Vitals,
  LabReport,
  MedicalRecord,
  PrescriptionRecord,
} from "@/types";

export type {
  Patient,
  DrugInteraction,
  CascadePattern,
  InventoryItem,
  PrescriptionItem,
  Pharmacist,
  Medication,
  Vitals,
  LabReport,
  MedicalRecord,
  PrescriptionRecord,
};

export const PHARMACISTS: Pharmacist[] = pharmacists as Pharmacist[];

export const PATIENTS: Record<string, Patient> = {};
for (const p of (patientsData as Patient[])) {
  PATIENTS[p.id] = p;
}

export const DRUG_INTERACTIONS: DrugInteraction[] = drugInteractions as DrugInteraction[];

export const CASCADE_PATTERNS: CascadePattern[] = cascadePatterns as CascadePattern[];

export const DRUG_INVENTORY: InventoryItem[] = inventoryData as InventoryItem[];

export const PRESCRIPTIONS_QUEUE: PrescriptionItem[] = prescriptionsData as PrescriptionItem[];
