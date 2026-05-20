export interface Pharmacist {
  id: string;
  name: string;
  licenseNumber: string;
  authorized: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  currentMedications: string[];
}

export interface Drug {
  barcode: string;
  name: string;
  strength: string;
  form: "tablet" | "capsule" | "injection" | "syrup";
  instructions: string;
}

export interface Interaction {
  drugA: string;
  drugB: string;
  severity: "high" | "medium" | "low";
  description: string;
  recommendation: string;
}

export interface CascadePattern {
  causingDrug: string;
  sideEffect: string;
  prescribedForSideEffect: string;
  question: string;
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  details: string;
  pharmacistId: string;
  patientId?: string;
}

export interface Prescription {
  patientId: string;
  drugBarcode: string;
  quantity: number;
  date: string;
}

export interface ScanResult {
  barcode: string;
  drugName: string;
  strength: string;
  status: "verified" | "error";
  message: string;
}

export interface LabelData {
  patientName: string;
  drugName: string;
  strength: string;
  dose: string;
  quantity: number;
  date: string;
  qrCode: string;
}
