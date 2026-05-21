export interface Pharmacist {
  id: string;
  name: string;
  licenseNumber: string;
  authorized: boolean;
}

export interface Medication {
  drug: string; dose: string; frequency: string; route: string; since: string;
}

export interface Vitals {
  bp: string; hr: number; temp: number; spo2: number; weight: number; date: string;
}

export interface LabReport {
  date: string; test: string; result: string; referenceRange: string; status: "normal" | "abnormal" | "critical";
}

export interface MedicalRecord {
  date: string; event: string; details: string; type: "admission" | "surgery" | "diagnosis" | "vaccination" | "visit";
}

export interface PrescriptionRecord {
  date: string; drug: string; dose: string; frequency: string; duration: string; prescriber: string; status: "completed" | "discontinued" | "active";
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  height: number;
  ward: string;
  bed: string;
  allergies: string[];
  conditions: string[];
  currentMedications: Medication[];
  recentVitals: Vitals;
  labReports: LabReport[];
  medicalHistory: MedicalRecord[];
  prescriptionHistory: PrescriptionRecord[];
}

export interface Drug {
  barcode: string;
  name: string;
  strength: string;
  form: "tablet" | "capsule" | "injection" | "syrup";
  instructions: string;
}

export interface DrugInteraction {
  drug1: string; drug2: string;
  severity: "HIGH" | "MODERATE" | "LOW" | "CONTRAINDICATED";
  effect: string; mechanism: string; action: string; references: string;
}

export interface Interaction {
  drugA: string;
  drugB: string;
  severity: "high" | "medium" | "low";
  description: string;
  recommendation: string;
}

export interface CascadePattern {
  causeDrug: string;
  sideEffect: string;
  newDrug: string;
  cascadeRisk: string;
  recommendation: string;
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  details: string;
  pharmacistId: string;
  patientId?: string;
}

export interface PrescriptionItem {
  rxId: string; patientId: string; patientName: string;
  drug: string; strength: string; quantity: number;
  frequency: string; route: string;
  prescriber: string; ward: string;
  priority: string; status: string; time: string;
}

export interface InventoryItem {
  barcode: string; drug: string; strength: string; form: string;
  stock: number; expiry: string; batch: string;
  lowStock?: boolean; criticalStock?: boolean;
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
