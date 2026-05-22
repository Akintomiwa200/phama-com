import type { Patient, Drug, DrugInteraction, CascadePattern } from "@/types";

export function checkInteraction(
  newDrugName: string,
  currentMeds: string[],
  interactions: DrugInteraction[]
): DrugInteraction | null {
  const found = interactions.find(
    (i) =>
      (i.drug1.toLowerCase() === newDrugName.toLowerCase() &&
        currentMeds.some((med) => med.toLowerCase() === i.drug2.toLowerCase())) ||
      (i.drug2.toLowerCase() === newDrugName.toLowerCase() &&
        currentMeds.some((med) => med.toLowerCase() === i.drug1.toLowerCase()))
  );
  return found || null;
}

export function checkCascade(
  newDrugName: string,
  currentMeds: string[],
  patterns: CascadePattern[]
): { detected: boolean; pattern?: CascadePattern } {
  const pattern = patterns.find(
    (cp) =>
      cp.newDrug.toLowerCase() === newDrugName.toLowerCase() &&
      currentMeds.some((med) => med.toLowerCase() === cp.causeDrug.toLowerCase())
  );
  return pattern ? { detected: true, pattern } : { detected: false };
}

export function getDrugByBarcode(barcode: string, drugs: Drug[]): Drug | undefined {
  return drugs.find((d) => d.barcode === barcode);
}

export function getDrugByName(name: string, drugs: Drug[]): Drug | undefined {
  return drugs.find((d) => d.name.toLowerCase() === name.toLowerCase());
}

export function getPatientById(id: string, patients: Record<string, Patient>): Patient | undefined {
  return patients[id];
}
