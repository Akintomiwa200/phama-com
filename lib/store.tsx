"use client";
import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from "react";
import type { Patient, DrugInteraction, CascadePattern, Pharmacist, PrescriptionItem, InventoryItem, Drug } from "@/types";
import { getPatients, getPrescriptions, getInventory, getDrugInteractions, getCascadePatterns } from "./db";
import pharmacistsData from "@/data/pharmacists.json";
import drugsData from "@/data/drugs.json";

export type AppStep =
  | "login"
  | "dashboard"
  | "prescription-queue"
  | "patient-review"
  | "interaction-check"
  | "cascade-check"
  | "scan-verify"
  | "preparation"
  | "label-generate"
  | "audit-log"
  | "complete"
  | "inventory"
  | "reports"
  | "settings";

export interface Alert {
  id: string;
  type: "interaction" | "cascade" | "scan-error" | "scan-success" | "allergy" | "info" | "expired";
  severity: "HIGH" | "MODERATE" | "LOW" | "CONTRAINDICATED" | "OK" | "INFO";
  title: string;
  message: string;
  details?: string;
  action?: string;
  timestamp: string;
  dismissed?: boolean;
}

export interface ActivePrescription {
  rxId: string;
  patientId: string;
  drug: string;
  strength: string;
  quantity: number;
  frequency: string;
  route: string;
  prescriber: string;
  priority: string;
}

export interface AppState {
  pharmacist: { id: string; name: string; role: string } | null;
  step: AppStep;
  activePatient: Patient | null;
  activePrescription: ActivePrescription | null;
  alerts: Alert[];
  auditLog: AuditEntry[];
  scanAttempts: ScanAttempt[];
  labelGenerated: boolean;
  dispensingComplete: boolean;
  sidebarOpen: boolean;
  interactionChecked: boolean;
  cascadeChecked: boolean;
  currentRxId: string;
  prescriptions: PrescriptionItem[];
  inventory: InventoryItem[];
  patients: Record<string, Patient>;
  drugInteractions: DrugInteraction[];
  cascadePatterns: CascadePattern[];
  pharmacists: Pharmacist[];
  drugs: Drug[];
  dbConnected: boolean;
}

export interface AuditEntry {
  time: string;
  action: string;
  details: string;
  level: "info" | "warning" | "error" | "success";
  user?: string;
}

export interface ScanAttempt {
  barcode: string;
  drug: string;
  strength: string;
  result: "error" | "success";
  reason?: string;
  timestamp: string;
}

function buildInitialState(): AppState {
  const patientsArr = getPatients();
  const patientsMap: Record<string, Patient> = {};
  for (const p of patientsArr) {
    patientsMap[p.id] = p;
  }
  return {
    pharmacist: null,
    step: "login",
    activePatient: null,
    activePrescription: null,
    alerts: [],
    auditLog: [],
    scanAttempts: [],
    labelGenerated: false,
    dispensingComplete: false,
    sidebarOpen: true,
    interactionChecked: false,
    cascadeChecked: false,
    currentRxId: "",
    prescriptions: getPrescriptions(),
    inventory: getInventory(),
    patients: patientsMap,
    drugInteractions: getDrugInteractions(),
    cascadePatterns: getCascadePatterns(),
    pharmacists: pharmacistsData as Pharmacist[],
    drugs: drugsData as Drug[],
    dbConnected: false,
  };
}

type Action =
  | { type: "LOGIN"; pharmacist: AppState["pharmacist"] }
  | { type: "SET_STEP"; step: AppStep }
  | { type: "SET_PATIENT"; patient: Patient }
  | { type: "SET_PRESCRIPTION"; prescription: ActivePrescription }
  | { type: "ADD_ALERT"; alert: Alert }
  | { type: "DISMISS_ALERT"; id: string }
  | { type: "ADD_AUDIT"; entry: AuditEntry }
  | { type: "ADD_SCAN"; attempt: ScanAttempt }
  | { type: "SET_LABEL_GENERATED"; value: boolean }
  | { type: "SET_COMPLETE"; value: boolean }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_INTERACTION_CHECKED"; value: boolean }
  | { type: "SET_CASCADE_CHECKED"; value: boolean }
  | { type: "LOGOUT" }
  | { type: "NEW_PRESCRIPTION" }
  | { type: "SYNC_STATE"; state: Partial<AppState> }
  | { type: "COMPLETE_DISPENSING"; rxId: string; quantity: number; drug: string }
  | { type: "LOAD_DATA"; prescriptions?: PrescriptionItem[]; inventory?: InventoryItem[]; patients?: Record<string, Patient>; drugInteractions?: DrugInteraction[]; cascadePatterns?: CascadePattern[]; pharmacists?: Pharmacist[]; drugs?: Drug[] };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, pharmacist: action.pharmacist, step: "dashboard" };
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_PATIENT":
      return { ...state, activePatient: action.patient };
    case "SET_PRESCRIPTION":
      return {
        ...state,
        activePrescription: action.prescription,
        prescriptions: state.prescriptions.map(p =>
          p.rxId === action.prescription.rxId ? { ...p, status: "DISPENSING" } : p
        )
      };
    case "ADD_ALERT":
      return { ...state, alerts: [action.alert, ...state.alerts] };
    case "DISMISS_ALERT":
      return { ...state, alerts: state.alerts.map(a => a.id === action.id ? { ...a, dismissed: true } : a) };
    case "ADD_AUDIT":
      return { ...state, auditLog: [...state.auditLog, action.entry] };
    case "ADD_SCAN":
      return { ...state, scanAttempts: [...state.scanAttempts, action.attempt] };
    case "SET_LABEL_GENERATED":
      return { ...state, labelGenerated: action.value };
    case "SET_COMPLETE":
      return { ...state, dispensingComplete: action.value };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "SET_INTERACTION_CHECKED":
      return { ...state, interactionChecked: action.value };
    case "SET_CASCADE_CHECKED":
      return { ...state, cascadeChecked: action.value };
    case "LOGOUT":
      return { ...buildInitialState(), prescriptions: state.prescriptions, inventory: state.inventory };
    case "NEW_PRESCRIPTION":
      return {
        ...state,
        activePatient: null,
        activePrescription: null,
        alerts: [],
        scanAttempts: [],
        labelGenerated: false,
        dispensingComplete: false,
        interactionChecked: false,
        cascadeChecked: false,
        step: "prescription-queue",
      };
    case "SYNC_STATE":
      return { ...state, ...action.state };
    case "COMPLETE_DISPENSING": {
      const { rxId, quantity, drug } = action;
      return {
        ...state,
        prescriptions: state.prescriptions.map(p =>
          p.rxId === rxId ? { ...p, status: "DISPENSED" } : p
        ),
        inventory: state.inventory.map(item => {
          if (item.drug.split(" ")[0] === drug.split(" ")[0]) {
            const newStock = Math.max(0, item.stock - quantity);
            return {
              ...item,
              stock: newStock,
              lowStock: newStock < 50,
              criticalStock: newStock < 10
            };
          }
          return item;
        }),
        dispensingComplete: true,
        step: "complete"
      };
    }
    case "LOAD_DATA": {
      const { type: _, ...data } = action;
      return { ...state, ...data, dbConnected: true };
    }
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

import { initLocalRealTimeUpdates } from "./realtime";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);
  const isSyncingRef = useRef(false);
  const initializedRef = useRef(false);
  const seededRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || initializedRef.current) return;
    initializedRef.current = true;

    const initFromMongoDB = async () => {
      try {
        let res = await fetch("/api/sync");
        if (!res.ok) throw new Error("API not available");
        let data = await res.json();

        // Auto-seed if MongoDB is empty
        const hasData = data.patients && Object.keys(data.patients).length > 0;
        if (!hasData && !seededRef.current) {
          seededRef.current = true;
          try {
            await fetch("/api/seed", { method: "POST" });
            res = await fetch("/api/sync");
            data = await res.json();
          } catch {
            console.log("Seed failed, using local data");
          }
        }

        if (data.prescriptions || data.inventory || data.patients) {
          dispatch({ type: "LOAD_DATA", ...data });
        }
      } catch {
        console.log("MongoDB not available, using local data files");
      }
    };

    initFromMongoDB();

    const unsubscribe = initLocalRealTimeUpdates((newState) => {
      isSyncingRef.current = true;
      dispatch({ type: "SYNC_STATE", state: newState });
      setTimeout(() => { isSyncingRef.current = false; }, 50);
    });

    return () => {
      unsubscribe();
      initializedRef.current = false;
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export function useAudit() {
  const { dispatch, state } = useApp();
  const addAudit = (action: string, details: string, level: AuditEntry["level"] = "info") => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    dispatch({
      type: "ADD_AUDIT",
      entry: { time, action, details, level, user: state.pharmacist?.name }
    });
  };
  return addAudit;
}

export async function syncMutation(
  collection: string,
  operation: string,
  data?: any,
  query?: any
) {
  try {
    await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, operation, data, query }),
    });
  } catch {
    console.warn("Sync write failed — MongoDB may be offline");
  }
}

export function useMutations() {
  const { state, dispatch } = useApp();
  const audit = useAudit();

  const completeDispensing = async (rxId: string, quantity: number, drug: string) => {
    dispatch({ type: "COMPLETE_DISPENSING", rxId, quantity, drug });
    await syncMutation("prescriptions", "updateOne", { status: "DISPENSED" }, { rxId });
    audit("Dispensing Complete", `Rx ${rxId}: ${drug} ${quantity}`, "success");
  };

  const setPatient = async (patient: Patient) => {
    dispatch({ type: "SET_PATIENT", patient });
  };

  const setPrescription = async (p: ActivePrescription) => {
    dispatch({ type: "SET_PRESCRIPTION", prescription: p });
    await syncMutation("prescriptions", "updateOne", { status: "DISPENSING" }, { rxId: p.rxId });
    audit("Prescription Selected", `Rx ${p.rxId}: ${p.drug}`, "info");
  };

  const updateInventory = async (barcode: string, updates: Partial<InventoryItem>) => {
    dispatch({ type: "SYNC_STATE", state: { inventory: state.inventory.map(item => item.barcode === barcode ? { ...item, ...updates } : item) } });
    await syncMutation("inventory", "updateOne", updates, { barcode });
  };

  const updatePrescription = async (rxId: string, updates: Partial<PrescriptionItem>) => {
    dispatch({ type: "SYNC_STATE", state: { prescriptions: state.prescriptions.map(p => p.rxId === rxId ? { ...p, ...updates } : p) } });
    await syncMutation("prescriptions", "updateOne", updates, { rxId });
  };

  const updatePatient = async (patientId: string, updates: Partial<Patient>) => {
    const patient = state.patients[patientId];
    if (!patient) return;
    const updated = { ...patient, ...updates };
    dispatch({ type: "SYNC_STATE", state: { patients: { ...state.patients, [patientId]: updated } } });
    await syncMutation("patients", "replaceOne", updated, { id: patientId });
  };

  const addPrescription = async (prescription: PrescriptionItem) => {
    dispatch({ type: "SYNC_STATE", state: { prescriptions: [...state.prescriptions, prescription] } });
    await syncMutation("prescriptions", "insertOne", prescription);
    audit("New Prescription", `Rx ${prescription.rxId}: ${prescription.drug}`, "info");
  };

  const addPatient = async (patient: Patient) => {
    dispatch({ type: "SYNC_STATE", state: { patients: { ...state.patients, [patient.id]: patient } } });
    await syncMutation("patients", "insertOne", patient);
    audit("New Patient", `${patient.name} (${patient.id})`, "info");
  };

  return {
    completeDispensing, setPatient, setPrescription,
    updateInventory, updatePrescription, updatePatient,
    addPrescription, addPatient,
  };
}
