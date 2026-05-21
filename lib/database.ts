export const PHARMACISTS = [
  { id: "PANS2024", name: "Dr. Adebayo Okonkwo", role: "Senior Pharmacist", shift: "Morning" },
  { id: "PANS2025", name: "Dr. Chioma Eze", role: "Clinical Pharmacist", shift: "Afternoon" },
  { id: "PANS2026", name: "Dr. Emeka Nwosu", role: "Dispensing Pharmacist", shift: "Night" },
];

export interface Vitals {
  bp: string; hr: number; temp: number; spo2: number; weight: number; date: string;
}

export interface Medication {
  drug: string; dose: string; frequency: string; route: string; since: string;
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
  id: string; name: string; age: number; gender: string; bloodType: string; height: number;
  ward: string; bed: string; allergies: string[]; conditions: string[];
  currentMedications: Medication[]; recentVitals: Vitals;
  labReports: LabReport[]; medicalHistory: MedicalRecord[]; prescriptionHistory: PrescriptionRecord[];
}

export const PATIENTS: Record<string, Patient> = {
  "P001": {
    id: "P001", name: "Mrs. Folake E.", age: 72, gender: "F", bloodType: "O+", height: 162,
    ward: "Cardiology Ward B", bed: "14B",
    allergies: ["Penicillin", "Sulfonamides"],
    conditions: ["Hypertension Stage 2", "Type 2 Diabetes", "Hyperlipidaemia", "Osteoarthritis"],
    currentMedications: [
      { drug: "Metformin", dose: "500mg", frequency: "Twice daily", route: "Oral", since: "2019-03-01" },
      { drug: "Simvastatin", dose: "20mg", frequency: "Once nightly", route: "Oral", since: "2020-07-15" },
      { drug: "Lisinopril", dose: "10mg", frequency: "Once daily", route: "Oral", since: "2021-01-10" },
    ],
    recentVitals: { bp: "158/96", hr: 78, temp: 36.8, spo2: 97, weight: 68, date: "2026-05-19" },
    labReports: [
      { date: "2026-05-18", test: "HbA1c", result: "7.2%", referenceRange: "<6.5%", status: "abnormal" },
      { date: "2026-05-18", test: "LDL Cholesterol", result: "3.1 mmol/L", referenceRange: "<2.6 mmol/L", status: "abnormal" },
      { date: "2026-05-10", test: "Serum Creatinine", result: "82 μmol/L", referenceRange: "45-84 μmol/L", status: "normal" },
      { date: "2026-05-10", test: "eGFR", result: "58 mL/min", referenceRange: ">60 mL/min", status: "abnormal" },
    ],
    medicalHistory: [
      { date: "2024-08-12", event: "Hospital Admission", details: "Hypertensive crisis, BP 210/110, managed with IV labetalol", type: "admission" },
      { date: "2023-11-05", event: "Knee Replacement", details: "Right total knee arthroplasty, uncomplicated recovery", type: "surgery" },
      { date: "2019-02-20", event: "Type 2 Diabetes Diagnosis", details: "HbA1c 8.1%, started on Metformin 500mg", type: "diagnosis" },
    ],
    prescriptionHistory: [
      { date: "2025-06-01", drug: "Amoxicillin", dose: "500mg", frequency: "Three times daily", duration: "7 days", prescriber: "Dr. Adeyemi", status: "completed" },
      { date: "2025-03-15", drug: "Ibuprofen", dose: "400mg", frequency: "Three times daily", duration: "5 days", prescriber: "Dr. Adeyemi", status: "completed" },
      { date: "2024-12-01", drug: "Metformin", dose: "500mg", frequency: "Twice daily", duration: "Ongoing", prescriber: "Dr. Adeyemi", status: "active" },
    ],
  },
  "P002": {
    id: "P002", name: "Mr. Tunde A.", age: 55, gender: "M", bloodType: "A+", height: 175,
    ward: "Internal Medicine", bed: "7A",
    allergies: ["Aspirin", "Codeine"],
    conditions: ["Atrial Fibrillation", "Chronic Kidney Disease Stage 3", "Gout"],
    currentMedications: [
      { drug: "Warfarin", dose: "5mg", frequency: "Once daily", route: "Oral", since: "2022-11-01" },
      { drug: "Atenolol", dose: "50mg", frequency: "Once daily", route: "Oral", since: "2023-02-14" },
      { drug: "Allopurinol", dose: "100mg", frequency: "Once daily", route: "Oral", since: "2024-05-01" },
    ],
    recentVitals: { bp: "142/88", hr: 64, temp: 37.1, spo2: 96, weight: 82, date: "2026-05-19" },
    labReports: [
      { date: "2026-05-17", test: "INR", result: "2.4", referenceRange: "2.0-3.0", status: "normal" },
      { date: "2026-05-17", test: "Serum Creatinine", result: "156 μmol/L", referenceRange: "59-104 μmol/L", status: "abnormal" },
      { date: "2026-05-10", test: "Uric Acid", result: "420 μmol/L", referenceRange: "200-430 μmol/L", status: "normal" },
    ],
    medicalHistory: [
      { date: "2022-10-01", event: "Atrial Fibrillation Diagnosis", details: "Presented with palpitations, ECG confirmed AF, started on Warfarin", type: "diagnosis" },
      { date: "2019-07-20", event: "CKD Stage 3 Diagnosis", details: "eGFR 45 mL/min, referred to nephrology", type: "diagnosis" },
    ],
    prescriptionHistory: [
      { date: "2025-11-15", drug: "Colchicine", dose: "500mcg", frequency: "Twice daily", duration: "10 days", prescriber: "Dr. Hassan", status: "completed" },
      { date: "2024-05-01", drug: "Allopurinol", dose: "100mg", frequency: "Once daily", duration: "Ongoing", prescriber: "Dr. Hassan", status: "active" },
    ],
  },
  "P003": {
    id: "P003", name: "Miss Ngozi I.", age: 28, gender: "F", bloodType: "B+", height: 165,
    ward: "Obstetrics", bed: "3C",
    allergies: [],
    conditions: ["Malaria (P. falciparum)", "Iron Deficiency Anaemia", "Pregnancy 24 weeks"],
    currentMedications: [
      { drug: "Ferrous Sulphate", dose: "200mg", frequency: "Three times daily", route: "Oral", since: "2026-05-10" },
      { drug: "Folic Acid", dose: "5mg", frequency: "Once daily", route: "Oral", since: "2026-05-10" },
    ],
    recentVitals: { bp: "110/70", hr: 88, temp: 38.4, spo2: 98, weight: 61, date: "2026-05-19" },
    labReports: [
      { date: "2026-05-19", test: "Blood Film", result: "P. falciparum +3", referenceRange: "Negative", status: "critical" },
      { date: "2026-05-19", test: "Haemoglobin", result: "9.2 g/dL", referenceRange: "11.5-16.0 g/dL", status: "abnormal" },
      { date: "2026-05-15", test: "Ferritin", result: "15 ng/mL", referenceRange: "20-200 ng/mL", status: "abnormal" },
    ],
    medicalHistory: [
      { date: "2026-05-10", event: "Antenatal Visit", details: "Routine booking, G1P0, LMP Dec 2025, EDD Sep 2026", type: "visit" },
      { date: "2020-03-15", event: "Malaria Admission", details: "Severe malaria treated with IV artesunate", type: "admission" },
    ],
    prescriptionHistory: [
      { date: "2025-08-10", drug: "Ferrous Sulphate", dose: "200mg", frequency: "Twice daily", duration: "3 months", prescriber: "Dr. Bello", status: "completed" },
    ],
  },
  "P004": {
    id: "P004", name: "Mr. Chidi O.", age: 45, gender: "M", bloodType: "AB+", height: 180,
    ward: "Nephrology", bed: "5A",
    allergies: ["Sulfa Drugs"],
    conditions: ["Chronic Kidney Disease Stage 4", "Hypertension", "Anaemia of Chronic Disease"],
    currentMedications: [
      { drug: "Amlodipine", dose: "10mg", frequency: "Once daily", route: "Oral", since: "2025-06-01" },
      { drug: "Erythropoietin", dose: "4000 IU", frequency: "Weekly", route: "Subcutaneous", since: "2025-09-01" },
      { drug: "Calcium Carbonate", dose: "500mg", frequency: "Three times daily", route: "Oral", since: "2025-09-01" },
    ],
    recentVitals: { bp: "148/92", hr: 76, temp: 36.6, spo2: 97, weight: 74, date: "2026-05-20" },
    labReports: [
      { date: "2026-05-18", test: "eGFR", result: "28 mL/min", referenceRange: ">60 mL/min", status: "critical" },
      { date: "2026-05-18", test: "Haemoglobin", result: "9.8 g/dL", referenceRange: "13.0-17.0 g/dL", status: "abnormal" },
      { date: "2026-05-18", test: "Serum Potassium", result: "5.6 mmol/L", referenceRange: "3.5-5.0 mmol/L", status: "abnormal" },
      { date: "2026-05-10", test: "Serum Creatinine", result: "312 μmol/L", referenceRange: "59-104 μmol/L", status: "critical" },
    ],
    medicalHistory: [
      { date: "2025-05-15", event: "CKD Stage 4 Diagnosis", details: "eGFR declined from 35 to 28 over 6 months, referred for transplant workup", type: "diagnosis" },
      { date: "2023-08-20", event: "AV Fistula Creation", details: "Left forearm radiocephalic fistula, matured well", type: "surgery" },
      { date: "2018-11-01", event: "Hypertension Diagnosis", details: "BP 160/95, started on Amlodipine 5mg", type: "diagnosis" },
    ],
    prescriptionHistory: [
      { date: "2025-09-01", drug: "Erythropoietin", dose: "4000 IU", frequency: "Weekly SC", duration: "Ongoing", prescriber: "Dr. Okeke", status: "active" },
      { date: "2025-06-15", drug: "Amlodipine", dose: "10mg", frequency: "Once daily", duration: "Ongoing", prescriber: "Dr. Okeke", status: "active" },
      { date: "2024-03-10", drug: "Furosemide", dose: "40mg", frequency: "Once daily", duration: "6 months", prescriber: "Dr. Okeke", status: "discontinued" },
    ],
  },
  "P005": {
    id: "P005", name: "Mrs. Amara K.", age: 35, gender: "F", bloodType: "O-", height: 168,
    ward: "Endocrinology", bed: "9C",
    allergies: ["Lactose", "Codeine"],
    conditions: ["Type 1 Diabetes", "Hashimoto's Thyroiditis", "Coeliac Disease"],
    currentMedications: [
      { drug: "Insulin Glargine", dose: "22 IU", frequency: "Once nightly", route: "Subcutaneous", since: "2018-06-01" },
      { drug: "Insulin Lispro", dose: "8-12 IU", frequency: "With meals", route: "Subcutaneous", since: "2018-06-01" },
      { drug: "Levothyroxine", dose: "75mcg", frequency: "Once daily", route: "Oral", since: "2021-09-01" },
    ],
    recentVitals: { bp: "118/74", hr: 72, temp: 36.9, spo2: 99, weight: 58, date: "2026-05-20" },
    labReports: [
      { date: "2026-05-16", test: "HbA1c", result: "6.8%", referenceRange: "<6.5%", status: "abnormal" },
      { date: "2026-05-16", test: "TSH", result: "3.8 mIU/L", referenceRange: "0.4-4.0 mIU/L", status: "normal" },
      { date: "2026-05-16", test: "Anti-tTG IgA", result: "12 U/mL", referenceRange: "<15 U/mL", status: "normal" },
      { date: "2026-05-01", test: "Blood Glucose (Fasting)", result: "7.8 mmol/L", referenceRange: "3.9-6.1 mmol/L", status: "abnormal" },
    ],
    medicalHistory: [
      { date: "2021-08-15", event: "Hashimoto's Diagnosis", details: "TSH 12.5, anti-TPO positive, started on Levothyroxine", type: "diagnosis" },
      { date: "2018-05-10", event: "Type 1 Diabetes Diagnosis", details: "DKA at presentation, HbA1c 11.2%, started on basal-bolus insulin", type: "diagnosis" },
      { date: "2016-03-20", event: "Coeliac Disease Diagnosis", details: "Duodenal biopsy confirmed Marsh 3a, started gluten-free diet", type: "diagnosis" },
    ],
    prescriptionHistory: [
      { date: "2025-12-01", drug: "Levothyroxine", dose: "75mcg", frequency: "Once daily", duration: "Ongoing", prescriber: "Dr. Eze", status: "active" },
      { date: "2024-08-10", drug: "Insulin Glargine", dose: "22 IU", frequency: "Once nightly", duration: "Ongoing", prescriber: "Dr. Eze", status: "active" },
    ],
  },
  "P006": {
    id: "P006", name: "Chief Bayo A.", age: 80, gender: "M", bloodType: "A-", height: 170,
    ward: "Geriatrics", bed: "12A",
    allergies: ["Penicillin", "Tramadol"],
    conditions: ["Alzheimer's Dementia", "Benign Prostatic Hyperplasia", "Hypertension", "Glaucoma"],
    currentMedications: [
      { drug: "Donepezil", dose: "10mg", frequency: "Once nightly", route: "Oral", since: "2024-01-15" },
      { drug: "Tamsulosin", dose: "0.4mg", frequency: "Once daily", route: "Oral", since: "2023-08-01" },
      { drug: "Amlodipine", dose: "5mg", frequency: "Once daily", route: "Oral", since: "2022-05-10" },
      { drug: "Latanoprost", dose: "0.005%", frequency: "Once nightly", route: "Ophthalmic", since: "2024-03-01" },
    ],
    recentVitals: { bp: "134/78", hr: 70, temp: 36.5, spo2: 96, weight: 64, date: "2026-05-20" },
    labReports: [
      { date: "2026-05-12", test: "PSA", result: "4.2 ng/mL", referenceRange: "<4.0 ng/mL", status: "abnormal" },
      { date: "2026-05-12", test: "Vitamin B12", result: "180 pg/mL", referenceRange: "200-900 pg/mL", status: "abnormal" },
      { date: "2026-04-28", test: "HbA1c", result: "5.9%", referenceRange: "<6.5%", status: "normal" },
      { date: "2026-04-28", test: "Serum Creatinine", result: "96 μmol/L", referenceRange: "59-104 μmol/L", status: "normal" },
    ],
    medicalHistory: [
      { date: "2026-01-10", event: "Fall with Hip Fracture", details: "Left NOF fracture, underwent hemiarthroplasty, prolonged rehab", type: "admission" },
      { date: "2024-01-01", event: "Alzheimer's Diagnosis", details: "MMSE 18/30, brain MRI showed hippocampal atrophy", type: "diagnosis" },
      { date: "2023-07-15", event: "BPH Diagnosis", details: "IPSS 22, started on Tamsulosin", type: "diagnosis" },
      { date: "2022-04-10", event: "Cataract Surgery", details: "Right phacoemulsification, uneventful", type: "surgery" },
    ],
    prescriptionHistory: [
      { date: "2026-02-01", drug: "Paracetamol", dose: "1g", frequency: "Four times daily", duration: "2 weeks", prescriber: "Dr. Nwosu", status: "completed" },
      { date: "2024-01-15", drug: "Donepezil", dose: "10mg", frequency: "Once nightly", duration: "Ongoing", prescriber: "Dr. Nwosu", status: "active" },
      { date: "2023-12-01", drug: "Risperidone", dose: "0.5mg", frequency: "Once daily", duration: "3 months", prescriber: "Dr. Nwosu", status: "discontinued" },
    ],
  },
  "P007": {
    id: "P007", name: "Miss Zainab B.", age: 22, gender: "F", bloodType: "B-", height: 160,
    ward: "General Medicine", bed: "16B",
    allergies: ["Doxycycline"],
    conditions: ["Typhoid Fever", "Urinary Tract Infection"],
    currentMedications: [
      { drug: "Ceftriaxone", dose: "1g", frequency: "Once daily", route: "IV", since: "2026-05-18" },
      { drug: "Paracetamol", dose: "1g", frequency: "Four times daily", route: "Oral", since: "2026-05-18" },
    ],
    recentVitals: { bp: "116/72", hr: 92, temp: 38.9, spo2: 97, weight: 55, date: "2026-05-20" },
    labReports: [
      { date: "2026-05-18", test: "Widal Test", result: "TO 1:320, TH 1:160", referenceRange: "TO <1:80, TH <1:80", status: "critical" },
      { date: "2026-05-18", test: "Urinalysis", result: "WBC ++, Nitrite +, Bacteria +", referenceRange: "Negative", status: "abnormal" },
      { date: "2026-05-18", test: "Blood Culture", result: "S. Typhi isolated", referenceRange: "No growth", status: "critical" },
      { date: "2026-05-18", test: "Full Blood Count", result: "WBC 11.2 x10^9/L", referenceRange: "4.0-10.0 x10^9/L", status: "abnormal" },
    ],
    medicalHistory: [
      { date: "2026-05-17", event: "Hospital Admission", details: "Fever 7 days, headache, abdominal pain. Started on empiric Ceftriaxone", type: "admission" },
      { date: "2023-04-10", event: "UTI Admission", details: "E. coli UTI, treated with Nitrofurantoin", type: "admission" },
    ],
    prescriptionHistory: [
      { date: "2024-11-15", drug: "Doxycycline", dose: "100mg", frequency: "Twice daily", duration: "7 days", prescriber: "Dr. Bello", status: "completed" },
      { date: "2023-10-10", drug: "Nitrofurantoin", dose: "100mg", frequency: "Twice daily", duration: "5 days", prescriber: "Dr. Bello", status: "completed" },
    ],
  },
  "P008": {
    id: "P008", name: "Mr. Emeka O.", age: 48, gender: "M", bloodType: "O+", height: 183,
    ward: "Orthopaedics", bed: "21C",
    allergies: ["Morphine"],
    conditions: ["Femoral Fracture (Left)", "Chronic Low Back Pain", "GORD"],
    currentMedications: [
      { drug: "Tramadol", dose: "50mg", frequency: "Three times daily", route: "Oral", since: "2026-05-15" },
      { drug: "Omeprazole", dose: "20mg", frequency: "Once daily", route: "Oral", since: "2026-05-15" },
      { drug: "Enoxaparin", dose: "40mg", frequency: "Once daily", route: "Subcutaneous", since: "2026-05-15" },
    ],
    recentVitals: { bp: "122/80", hr: 68, temp: 36.9, spo2: 98, weight: 78, date: "2026-05-20" },
    labReports: [
      { date: "2026-05-16", test: "Platelet Count", result: "220 x10^9/L", referenceRange: "150-400 x10^9/L", status: "normal" },
      { date: "2026-05-16", test: "INR", result: "1.1", referenceRange: "0.9-1.2", status: "normal" },
      { date: "2026-05-15", test: "X-Ray Report", result: "Comminuted left femoral shaft fracture", referenceRange: "Normal", status: "critical" },
    ],
    medicalHistory: [
      { date: "2026-05-15", event: "Trauma Admission", details: "MVA, comminuted left femur fracture, scheduled for ORIF", type: "admission" },
      { date: "2020-08-01", event: "GORD Diagnosis", details: "Endoscopy confirmed Los Angeles Grade B oesophagitis", type: "diagnosis" },
      { date: "2018-03-20", event: "Lumbar Discectomy", details: "L4/L5 microdiscectomy for disc prolapse", type: "surgery" },
    ],
    prescriptionHistory: [
      { date: "2026-05-15", drug: "Enoxaparin", dose: "40mg", frequency: "Once daily SC", duration: "During admission", prescriber: "Dr. Okoro", status: "active" },
      { date: "2025-12-01", drug: "Omeprazole", dose: "20mg", frequency: "Once daily", duration: "Ongoing", prescriber: "Dr. Okoro", status: "active" },
      { date: "2025-09-10", drug: "Diclofenac", dose: "50mg", frequency: "Three times daily", duration: "2 weeks", prescriber: "Dr. Okoro", status: "completed" },
    ],
  },
  "P009": {
    id: "P009", name: "Mrs. Yemisi D.", age: 62, gender: "F", bloodType: "A+", height: 164,
    ward: "Cardiology ICU", bed: "CCU-2",
    allergies: ["Naproxen"],
    conditions: ["Congestive Heart Failure NYHA III", "Type 2 Diabetes", "Dyslipidemia", "Obesity"],
    currentMedications: [
      { drug: "Furosemide", dose: "40mg", frequency: "Twice daily", route: "IV", since: "2026-05-15" },
      { drug: "Spironolactone", dose: "25mg", frequency: "Once daily", route: "Oral", since: "2026-03-01" },
      { drug: "Metformin", dose: "850mg", frequency: "Twice daily", route: "Oral", since: "2020-08-01" },
      { drug: "Atorvastatin", dose: "40mg", frequency: "Once nightly", route: "Oral", since: "2021-06-01" },
      { drug: "Enalapril", dose: "5mg", frequency: "Once daily", route: "Oral", since: "2025-11-01" },
    ],
    recentVitals: { bp: "130/85", hr: 88, temp: 36.7, spo2: 93, weight: 92, date: "2026-05-20" },
    labReports: [
      { date: "2026-05-19", test: "BNP", result: "680 pg/mL", referenceRange: "<100 pg/mL", status: "critical" },
      { date: "2026-05-19", test: "Troponin I", result: "0.04 ng/mL", referenceRange: "<0.04 ng/mL", status: "normal" },
      { date: "2026-05-19", test: "HbA1c", result: "7.8%", referenceRange: "<6.5%", status: "abnormal" },
      { date: "2026-05-19", test: "LDL Cholesterol", result: "3.8 mmol/L", referenceRange: "<2.6 mmol/L", status: "abnormal" },
      { date: "2026-05-19", test: "Serum Potassium", result: "4.8 mmol/L", referenceRange: "3.5-5.0 mmol/L", status: "normal" },
    ],
    medicalHistory: [
      { date: "2026-05-14", event: "CHF Exacerbation Admission", details: "Severe dyspnoea, orthopnoea, bilateral leg oedema, SpO2 88% on room air", type: "admission" },
      { date: "2025-10-01", event: "Echocardiogram", details: "LVEF 35%, moderate mitral regurgitation, diastolic dysfunction", type: "visit" },
      { date: "2021-05-15", event: "Coronary Angiogram", details: "Three-vessel disease, declined CABG, managed medically", type: "surgery" },
    ],
    prescriptionHistory: [
      { date: "2026-04-01", drug: "Furosemide", dose: "40mg", frequency: "Twice daily", duration: "Ongoing", prescriber: "Dr. Adeyemi", status: "active" },
      { date: "2026-02-15", drug: "Spironolactone", dose: "25mg", frequency: "Once daily", duration: "Ongoing", prescriber: "Dr. Adeyemi", status: "active" },
      { date: "2025-11-01", drug: "Enalapril", dose: "5mg", frequency: "Once daily", duration: "Ongoing", prescriber: "Dr. Adeyemi", status: "active" },
      { date: "2024-06-10", drug: "Bisoprolol", dose: "2.5mg", frequency: "Once daily", duration: "12 months", prescriber: "Dr. Adeyemi", status: "discontinued" },
    ],
  },
  "P010": {
    id: "P010", name: "Mr. Adewale B.", age: 30, gender: "M", bloodType: "AB-", height: 178,
    ward: "Pulmonology", bed: "8B",
    allergies: ["Ibuprofen", "House Dust Mite"],
    conditions: ["Bronchial Asthma (Moderate Persistent)", "Allergic Rhinitis", "Eczema"],
    currentMedications: [
      { drug: "Salbutamol", dose: "100mcg", frequency: "As needed (PRN)", route: "Inhalation", since: "2024-01-01" },
      { drug: "Fluticasone/Salmeterol", dose: "250/50mcg", frequency: "Twice daily", route: "Inhalation", since: "2025-06-01" },
      { drug: "Montelukast", dose: "10mg", frequency: "Once nightly", route: "Oral", since: "2025-06-01" },
      { drug: "Cetirizine", dose: "10mg", frequency: "Once daily", route: "Oral", since: "2024-01-01" },
    ],
    recentVitals: { bp: "120/76", hr: 74, temp: 37.0, spo2: 95, weight: 71, date: "2026-05-20" },
    labReports: [
      { date: "2026-05-15", test: "Peak Flow", result: "340 L/min", referenceRange: ">450 L/min", status: "abnormal" },
      { date: "2026-05-15", test: "FeNO", result: "52 ppb", referenceRange: "<25 ppb", status: "abnormal" },
      { date: "2026-05-10", test: "IgE Total", result: "340 IU/mL", referenceRange: "<100 IU/mL", status: "abnormal" },
      { date: "2026-04-01", test: "Chest X-Ray", result: "Hyperinflated lungs, no infiltrates", referenceRange: "Normal", status: "normal" },
    ],
    medicalHistory: [
      { date: "2025-05-20", event: "Asthma Attack Emergency Visit", details: "PEFR 200, required nebulised salbutamol and IV hydrocortisone", type: "visit" },
      { date: "2018-08-01", event: "Asthma Diagnosis", details: "Chronic cough and wheeze, spirometry showed reversible obstruction", type: "diagnosis" },
    ],
    prescriptionHistory: [
      { date: "2025-12-01", drug: "Fluticasone/Salmeterol", dose: "250/50mcg", frequency: "Twice daily inhaled", duration: "Ongoing", prescriber: "Dr. Obi", status: "active" },
      { date: "2025-06-01", drug: "Montelukast", dose: "10mg", frequency: "Once nightly", duration: "Ongoing", prescriber: "Dr. Obi", status: "active" },
      { date: "2024-06-10", drug: "Prednisolone", dose: "40mg", frequency: "Once daily", duration: "7 days", prescriber: "Dr. Obi", status: "completed" },
      { date: "2023-09-01", drug: "Salbutamol", dose: "100mcg", frequency: "PRN inhalation", duration: "Ongoing", prescriber: "Dr. Obi", status: "active" },
    ],
  },
};

export interface DrugInteraction {
  drug1: string; drug2: string;
  severity: "HIGH" | "MODERATE" | "LOW" | "CONTRAINDICATED";
  effect: string; mechanism: string; action: string; references: string;
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
  {
    drug1: "Warfarin", drug2: "Ciprofloxacin",
    severity: "HIGH",
    effect: "Increased INR and bleeding risk",
    mechanism: "Ciprofloxacin inhibits CYP1A2, reducing warfarin metabolism",
    action: "Monitor INR closely; consider reducing warfarin dose.",
    references: "BNF 2024"
  },
  {
    drug1: "Flucloxacillin", drug2: "Methotrexate",
    severity: "HIGH",
    effect: "Severe methotrexate toxicity",
    mechanism: "Flucloxacillin reduces methotrexate renal clearance",
    action: "Avoid combination; consider alternative antibiotic.",
    references: "MHRA 2020"
  },
  {
    drug1: "Enalapril", drug2: "Spironolactone",
    severity: "MODERATE",
    effect: "Risk of hyperkalaemia",
    mechanism: "Dual RAAS blockade reduces potassium excretion",
    action: "Monitor serum potassium regularly; caution in CKD patients.",
    references: "BNF 2024"
  },
  {
    drug1: "Furosemide", drug2: "Gentamicin",
    severity: "MODERATE",
    effect: "Increased risk of ototoxicity and nephrotoxicity",
    mechanism: "Additive toxicity on cochlear and renal cells",
    action: "Monitor renal function and hearing; consider dose adjustment.",
    references: "WHO Essential Medicines 2022"
  },
  {
    drug1: "Salbutamol", drug2: "Atenolol",
    severity: "MODERATE",
    effect: "Beta-blocker may antagonise bronchodilator effect of salbutamol",
    mechanism: "Competitive blockade of beta-2 receptors",
    action: "Use cardioselective beta-blocker with caution; monitor lung function.",
    references: "BNF 2024"
  },
];

export interface CascadePattern {
  causeDrug: string; sideEffect: string; newDrug: string;
  cascadeRisk: string; recommendation: string;
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
  {
    causeDrug: "Metformin",
    sideEffect: "GI intolerance / diarrhoea",
    newDrug: "Metformin MR (modified release)",
    cascadeRisk: "Modified release metformin prescribed for GI side effects rather than dose titration or review of carbohydrate intake",
    recommendation: "Titrate standard metformin gradually over 4 weeks before switching to MR formulation."
  },
  {
    causeDrug: "Salmeterol (LABA)",
    sideEffect: "Inadequate asthma control",
    newDrug: "Montelukast",
    cascadeRisk: "Montelukast added for persisting symptoms without checking inhaler technique or adherence",
    recommendation: "Assess inhaler technique and adherence before adding third-line therapy. Consider stepping up ICS dose."
  },
];

export interface InventoryItem {
  barcode: string; drug: string; strength: string; form: string;
  stock: number; expiry: string; batch: string;
  lowStock?: boolean; criticalStock?: boolean;
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
  { barcode: "901234567890", drug: "Ceftriaxone", strength: "1g", form: "Injection", stock: 96, expiry: "2027-02-15", batch: "CEF1-2025-A" },
  { barcode: "012345678901", drug: "Tramadol", strength: "50mg", form: "Capsule", stock: 310, expiry: "2027-05-01", batch: "TRA50-2024-D" },
  { barcode: "112345678901", drug: "Omeprazole", strength: "20mg", form: "Capsule", stock: 420, expiry: "2027-09-01", batch: "OME20-2025-B" },
  { barcode: "212345678901", drug: "Salbutamol", strength: "100mcg", form: "Inhaler", stock: 65, expiry: "2026-10-01", batch: "SAL100-2025-A" },
  { barcode: "312345678901", drug: "Insulin Glargine", strength: "100 IU/mL", form: "Injection", stock: 22, expiry: "2026-12-01", batch: "INS100-2025-C", lowStock: true },
  { barcode: "412345678901", drug: "Furosemide", strength: "40mg", form: "Tablet", stock: 510, expiry: "2027-04-20", batch: "FUR40-2025-A" },
];

export interface PrescriptionItem {
  rxId: string; patientId: string; patientName: string;
  drug: string; strength: string; quantity: number;
  frequency: string; route: string;
  prescriber: string; ward: string;
  priority: string; status: string; time: string;
}

export const PRESCRIPTIONS_QUEUE: PrescriptionItem[] = [
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
  {
    rxId: "RX-2026-0521-004", patientId: "P009", patientName: "Mrs. Yemisi D.",
    drug: "Furosemide", strength: "40mg", quantity: 60,
    frequency: "Twice daily", route: "IV",
    prescriber: "Dr. Adeyemi (Cardiologist)", ward: "Cardiology ICU",
    priority: "URGENT", status: "PENDING", time: "10:30"
  },
  {
    rxId: "RX-2026-0521-005", patientId: "P008", patientName: "Mr. Emeka O.",
    drug: "Enoxaparin", strength: "40mg", quantity: 10,
    frequency: "Once daily", route: "Subcutaneous",
    prescriber: "Dr. Okoro (Orthopaedic Surgeon)", ward: "Orthopaedics",
    priority: "ROUTINE", status: "PENDING", time: "11:00"
  },
  {
    rxId: "RX-2026-0521-006", patientId: "P007", patientName: "Miss Zainab B.",
    drug: "Ceftriaxone", strength: "1g", quantity: 7,
    frequency: "Once daily", route: "IV",
    prescriber: "Dr. Bello (Internist)", ward: "General Medicine",
    priority: "URGENT", status: "PENDING", time: "11:15"
  },
];
