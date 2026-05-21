"use client";
import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from "react";
import { Patient, PATIENTS, Medication, PRESCRIPTIONS_QUEUE, DRUG_INVENTORY, DRUG_INTERACTIONS, CASCADE_PATTERNS, PrescriptionItem, InventoryItem, DrugInteraction, CascadePattern } from "./database";

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

const initialState: AppState = {
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
  prescriptions: PRESCRIPTIONS_QUEUE,
  inventory: DRUG_INVENTORY,
  patients: PATIENTS,
  drugInteractions: DRUG_INTERACTIONS,
  cascadePatterns: CASCADE_PATTERNS,
};

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
  | { type: "LOAD_DATA"; prescriptions: PrescriptionItem[]; inventory: InventoryItem[]; patients: Record<string, Patient>; drugInteractions: DrugInteraction[]; cascadePatterns: CascadePattern[] };

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
      return { ...initialState, prescriptions: state.prescriptions, inventory: state.inventory };
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
      return { ...state, ...data };
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const isSyncingRef = useRef(false);
  const initializedRef = useRef(false);

  // Load data from MongoDB and initialize real-time
  useEffect(() => {
    if (typeof window === "undefined" || initializedRef.current) return;
    initializedRef.current = true;

    const loadFromMongoDB = async () => {
      try {
        const res = await fetch("/api/sync");
        if (!res.ok) throw new Error("API not available");
        const data = await res.json();
        if (data.prescriptions || data.inventory || data.patients) {
          dispatch({ type: "LOAD_DATA", ...data });
        }
      } catch {
        console.log("MongoDB not configured, using local data");
      }
    };

    loadFromMongoDB();

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
