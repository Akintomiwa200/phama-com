export const PHARMACISTS = [
  { id: "PANS2024", name: "Dr. Adebayo Okonkwo", role: "Senior Pharmacist", shift: "Morning" },
  { id: "PANS2025", name: "Dr. Chioma Eze", role: "Clinical Pharmacist", shift: "Afternoon" },
  { id: "PANS2026", name: "Dr. Emeka Nwosu", role: "Dispensing Pharmacist", shift: "Night" },
];

export const PATIENTS: Record<string, Patient> = {
  "P001": {
    id: "P001", name: "Mrs. Folake E.", age: 72, gender: "F",
    ward: "Cardiology Ward B", bed: "14B",
    allergies: ["Penicillin", "Sulfonamides"],
    conditions: ["Hypertension", "Type 2 Diabetes", "Hyperlipidaemia"],
    currentMedications: [
      { drug: "Metformin", dose: "500mg", frequency: "Twice daily", route: "Oral", since: "2019-03-01" },
      { drug: "Simvastatin", dose: "20mg", frequency: "Once nightly", route: "Oral", since: "2020-07-15" },
      { drug: "Lisinopril", dose: "10mg", frequency: "Once daily", route: "Oral", since: "2021-01-10" },
    ],
    recentVitals: {
      bp: "158/96", hr: 78, temp: 36.8, spo2: 97, weight: 68,
      date: "2026-05-19"
    },
    prescriptionHistory: [],
  },
  "P002": {
    id: "P002", name: "Mr. Tunde A.", age: 55, gender: "M",
    ward: "Internal Medicine", bed: "7A",
    allergies: ["Aspirin"],
    conditions: ["Atrial Fibrillation", "Chronic Kidney Disease Stage 3"],
    currentMedications: [
      { drug: "Warfarin", dose: "5mg", frequency: "Once daily", route: "Oral", since: "2022-11-01" },
      { drug: "Atenolol", dose: "50mg", frequency: "Once daily", route: "Oral", since: "2023-02-14" },
    ],
    recentVitals: {
      bp: "142/88", hr: 64, temp: 37.1, spo2: 96, weight: 82,
      date: "2026-05-19"
    },
    prescriptionHistory: [],
  },
  "P003": {
    id: "P003", name: "Miss Ngozi I.", age: 28, gender: "F",
    ward: "Obstetrics", bed: "3C",
    allergies: [],
    conditions: ["Malaria", "Iron Deficiency Anaemia"],
    currentMedications: [
      { drug: "Ferrous Sulphate", dose: "200mg", frequency: "Three times daily", route: "Oral", since: "2026-05-10" },
      { drug: "Folic Acid", dose: "5mg", frequency: "Once daily", route: "Oral", since: "2026-05-10" },
    ],
    recentVitals: {
      bp: "110/70", hr: 88, temp: 38.4, spo2: 98, weight: 61,
      date: "2026-05-19"
    },
    prescriptionHistory: [],
  },
};

export interface Patient {
  id: string; name: string; age: number; gender: string;
  ward: string; bed: string; allergies: string[];
  conditions: string[];
  currentMedications: Medication[];
  recentVitals: Vitals;
  prescriptionHistory: any[];
}

export interface Medication {
  drug: string; dose: string; frequency: string; route: string; since: string;
}

export interface Vitals {
  bp: string; hr: number; temp: number; spo2: number; weight: number; date: string;
}

export const DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    drug1: "Amlodipine", drug2: "Simvastatin",
    severity: "HIGH",
    effect: "High risk of muscle damage (rhabdomyolysis) and kidney failure",
    mechanism: "Amlodipine inhibits CYP3A4, increasing simvastatin plasma levels 3-7x",
    action: "Contact prescriber before dispensing. Consider switching to Rosuvastatin.",
    references: "MHRA 2012; NICE CG181"
  },
  {
    drug1: "Warfarin", drug2: "Aspirin",
    severity: "HIGH",
    effect: "Significantly increased bleeding risk including life-threatening haemorrhage",
    mechanism: "Additive anticoagulant and antiplatelet effects",
    action: "Avoid combination unless benefit clearly outweighs risk. Monitor INR closely.",
    references: "BNF 2024; WHO Essential Medicines"
  },
  {
    drug1: "Metformin", drug2: "Contrast Dye",
    severity: "MODERATE",
    effect: "Risk of lactic acidosis post-contrast procedure",
    mechanism: "Renal impairment from contrast reduces metformin clearance",
    action: "Hold metformin 48hrs before and after contrast imaging",
    references: "ACR Manual on Contrast Media 2023"
  },
  {
    drug1: "Lisinopril", drug2: "Potassium",
    severity: "MODERATE",
    effect: "Hyperkalaemia — can cause cardiac arrhythmias",
    mechanism: "ACE inhibitors reduce aldosterone; potassium supplementation compounds the rise",
    action: "Monitor serum potassium. Avoid high-potassium foods and supplements.",
    references: "BNF 2024"
  },
  {
    drug1: "Artemether", drug2: "Halofantrine",
    severity: "CONTRAINDICATED",
    effect: "Potentially fatal QT prolongation and cardiac arrhythmia",
    mechanism: "Both drugs prolong QT interval; additive effect",
    action: "Do not co-administer. Use alternative antimalarials.",
    references: "WHO Malaria Treatment Guidelines 2022"
  },
];

export interface DrugInteraction {
  drug1: string; drug2: string;
  severity: "HIGH" | "MODERATE" | "LOW" | "CONTRAINDICATED";
  effect: string; mechanism: string; action: string; references: string;
}

export const CASCADE_PATTERNS: CascadePattern[] = [
  {
    causeDrug: "Lisinopril",
    sideEffect: "Dry cough (10-20% of patients)",
    newDrug: "Amlodipine",
    cascadeRisk: "Amlodipine is sometimes added for blood pressure control when Lisinopril cough occurs, instead of switching to an ARB.",
    recommendation: "Confirm with prescriber: Does patient have Lisinopril-induced cough? If yes, consider switching to Losartan (ARB) rather than adding Amlodipine."
  },
  {
    causeDrug: "NSAIDs",
    sideEffect: "GI irritation / peptic ulcer",
    newDrug: "Omeprazole",
    cascadeRisk: "PPI prescribed to treat NSAID-induced GI side effects rather than stopping the NSAID",
    recommendation: "Review necessity of NSAID. Consider Paracetamol if appropriate. If NSAID essential, prescribe PPI with shortest effective duration."
  },
  {
    causeDrug: "Thiazide diuretics",
    sideEffect: "Gout attacks",
    newDrug: "Allopurinol",
    cascadeRisk: "Allopurinol prescribed for gout triggered by thiazide diuretics",
    recommendation: "Consider switching diuretic class. Review whether thiazide is the most appropriate agent."
  },
];

export interface CascadePattern {
  causeDrug: string; sideEffect: string; newDrug: string;
  cascadeRisk: string; recommendation: string;
}

export const DRUG_INVENTORY: InventoryItem[] = [
  { barcode: "123456789012", drug: "Amlodipine", strength: "5mg", form: "Tablet", stock: 340, expiry: "2027-08-01", batch: "AM5-2024-B" },
  { barcode: "123456789013", drug: "Amlodipine", strength: "10mg", form: "Tablet", stock: 210, expiry: "2027-06-15", batch: "AM10-2024-C" },
  { barcode: "234567890123", drug: "Metformin", strength: "500mg", form: "Tablet", stock: 580, expiry: "2026-12-01", batch: "MET500-2024-A" },
  { barcode: "345678901234", drug: "Simvastatin", strength: "20mg", form: "Tablet", stock: 175, expiry: "2027-03-20", batch: "SIM20-2024-D" },
  { barcode: "456789012345", drug: "Lisinopril", strength: "10mg", form: "Tablet", stock: 290, expiry: "2027-01-10", batch: "LIS10-2024-B" },
  { barcode: "567890123456", drug: "Artemether", strength: "20mg", form: "Injection", stock: 48, expiry: "2026-11-30", batch: "ART20-2024-A" },
  { barcode: "678901234567", drug: "Warfarin", strength: "5mg", form: "Tablet", stock: 120, expiry: "2027-04-15", batch: "WAR5-2024-C" },
  { barcode: "789012345678", drug: "Ferrous Sulphate", strength: "200mg", form: "Tablet", stock: 44, expiry: "2026-08-01", batch: "FER200-2024-B", lowStock: true },
  { barcode: "890123456789", drug: "Amoxicillin", strength: "250mg", form: "Capsule", stock: 8, expiry: "2026-07-01", batch: "AMX250-2024-A", lowStock: true, criticalStock: true },
];

export interface InventoryItem {
  barcode: string; drug: string; strength: string; form: string;
  stock: number; expiry: string; batch: string;
  lowStock?: boolean; criticalStock?: boolean;
}

export const PRESCRIPTIONS_QUEUE = [
  {
    rxId: "RX-2026-0521-001", patientId: "P001", patientName: "Mrs. Folake E.",
    drug: "Amlodipine", strength: "10mg", quantity: 30,
    frequency: "Once daily", route: "Oral",
    prescriber: "Dr. Adeyemi (Cardiologist)", ward: "Cardiology Ward B",
    priority: "ROUTINE", status: "PENDING", time: "09:15"
  },
  {
    rxId: "RX-2026-0521-002", patientId: "P003", patientName: "Miss Ngozi I.",
    drug: "Artemether-Lumefantrine", strength: "20/120mg", quantity: 24,
    frequency: "Twice daily x3 days", route: "Oral",
    prescriber: "Dr. Bello (Internist)", ward: "Obstetrics",
    priority: "URGENT", status: "PENDING", time: "09:32"
  },
  {
    rxId: "RX-2026-0521-003", patientId: "P002", patientName: "Mr. Tunde A.",
    drug: "Apixaban", strength: "5mg", quantity: 56,
    frequency: "Twice daily", route: "Oral",
    prescriber: "Dr. Hassan (Cardiologist)", ward: "Internal Medicine",
    priority: "ROUTINE", status: "PENDING", time: "10:05"
  },
];
