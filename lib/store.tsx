"use client";

import React, { createContext, useContext, useReducer, useState, ReactNode, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import type { Pharmacist, Patient, Drug, DrugInteraction, CascadePattern, PrescriptionItem, InventoryItem } from "@/types";
import { subscribeToRealtime } from "./realtime";
import {
  savePharmacistSession,
  saveWorkflowSession,
  clearAuthSession,
  loadPharmacistSession,
  loadWorkflowSession,
  buildWorkflowSnapshot,
  type WorkflowSession,
} from "./auth-session";

export type AppStep =
  | "login" | "dashboard" | "prescription-queue" | "patient-review"
  | "interaction-check" | "cascade-check" | "scan-verify" | "preparation"
  | "label-generate" | "audit-log" | "complete" | "inventory" | "reports"
  | "settings" | "profile" | "help";

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
  pharmacist: { id: string; name: string; role: string; licenseNumber?: string } | null;
  step: AppStep;
  activePatient: Patient | null;
  activePrescription: ActivePrescription | null;
  alerts: Alert[];
  auditLog: any[];
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
  drugs: Record<string, Drug>;
  dbConnected: boolean;
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
    prescriptions: [],
    inventory: [],
    patients: {},
    drugInteractions: [],
    cascadePatterns: [],
    pharmacists: [],
    drugs: {},
    dbConnected: false,
  };
}

type Action =
  | { type: "LOGIN"; pharmacist: NonNullable<AppState["pharmacist"]> }
  | { type: "RESTORE_SESSION"; pharmacist: NonNullable<AppState["pharmacist"]>; workflow?: WorkflowSession | null }
  | { type: "SET_STEP"; step: AppStep }
  | { type: "SET_PATIENT"; patient: Patient }
  | { type: "SET_PRESCRIPTION"; prescription: ActivePrescription }
  | { type: "ADD_ALERT"; alert: Alert }
  | { type: "DISMISS_ALERT"; id: string }
  | { type: "ADD_AUDIT"; entry: any }
  | { type: "ADD_SCAN"; attempt: ScanAttempt }
  | { type: "ADD_PRESCRIPTION"; prescription: PrescriptionItem }
  | { type: "SET_LABEL_GENERATED"; value: boolean }
  | { type: "SET_COMPLETE"; value: boolean }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_INTERACTION_CHECKED"; value: boolean }
  | { type: "SET_CASCADE_CHECKED"; value: boolean }
  | { type: "LOGOUT" }
  | { type: "NEW_PRESCRIPTION" }
  | { type: "SYNC_STATE"; state: Partial<AppState> }
  | { type: "COMPLETE_DISPENSING"; rxId: string; quantity: number; drug: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN":
      savePharmacistSession(action.pharmacist);
      return { ...state, pharmacist: action.pharmacist, step: "dashboard" };
    case "RESTORE_SESSION": {
      const wf = action.workflow;
      const patient =
        wf?.activePatientId && state.patients[wf.activePatientId]
          ? state.patients[wf.activePatientId]
          : wf?.activePatientId
            ? state.activePatient
            : null;
      return {
        ...state,
        pharmacist: action.pharmacist,
        step: "dashboard",
        activePatient: patient,
        activePrescription: wf?.activePrescription ?? null,
        interactionChecked: wf?.interactionChecked ?? false,
        cascadeChecked: wf?.cascadeChecked ?? false,
        labelGenerated: wf?.labelGenerated ?? false,
        dispensingComplete: wf?.dispensingComplete ?? false,
      };
    }
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
        ),
      };
    case "ADD_ALERT":
      return { ...state, alerts: [action.alert, ...state.alerts] };
    case "DISMISS_ALERT":
      return { ...state, alerts: state.alerts.map(a => a.id === action.id ? { ...a, dismissed: true } : a) };
    case "ADD_AUDIT":
      return { ...state, auditLog: [...state.auditLog, action.entry] };
    case "ADD_SCAN":
      return { ...state, scanAttempts: [...state.scanAttempts, action.attempt] };
    case "ADD_PRESCRIPTION":
      return { ...state, prescriptions: [...state.prescriptions, action.prescription] };
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
      clearAuthSession();
      return buildInitialState();
    case "NEW_PRESCRIPTION": {
      const next = {
        ...state,
        activePatient: null,
        activePrescription: null,
        alerts: [],
        scanAttempts: [],
        labelGenerated: false,
        dispensingComplete: false,
        interactionChecked: false,
        cascadeChecked: false,
        step: "prescription-queue" as AppStep,
      };
      if (state.pharmacist) {
        saveWorkflowSession(buildWorkflowSnapshot(next));
      }
      return next;
    }
    case "COMPLETE_DISPENSING":
      return {
        ...state,
        dispensingComplete: true,
        labelGenerated: true,
        prescriptions: state.prescriptions.map(p =>
          p.rxId === action.rxId ? { ...p, status: "DISPENSED" } : p
        ),
        inventory: state.inventory.map(item =>
          item.drug.toLowerCase() === action.drug.toLowerCase()
            ? { ...item, stock: Math.max(0, item.stock - action.quantity) }
            : item
        ),
      };
    case "SYNC_STATE": {
      const incoming = action.state;
      const next = { ...state, dbConnected: true };

      if (incoming.prescriptions !== undefined) next.prescriptions = incoming.prescriptions;
      if (incoming.inventory !== undefined) next.inventory = incoming.inventory;
      if (incoming.patients !== undefined) {
        next.patients = incoming.patients;
        if (state.activePatient?.id && incoming.patients[state.activePatient.id]) {
          next.activePatient = incoming.patients[state.activePatient.id];
        }
      }
      if (incoming.drugInteractions !== undefined) next.drugInteractions = incoming.drugInteractions;
      if (incoming.cascadePatterns !== undefined) next.cascadePatterns = incoming.cascadePatterns;
      if (incoming.pharmacists !== undefined) next.pharmacists = incoming.pharmacists;
      if (incoming.drugs !== undefined) next.drugs = incoming.drugs;
      if (incoming.auditLog !== undefined) next.auditLog = incoming.auditLog;

      if (incoming.activePatient !== undefined) next.activePatient = incoming.activePatient;
      if (incoming.activePrescription !== undefined) next.activePrescription = incoming.activePrescription;

      return next;
    }
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  sessionReady: boolean;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);
  const [sessionReady, setSessionReady] = useState(false);
  const realtimeInitRef = useRef(false);
  const workflowRestoredRef = useRef(false);
  const pendingWorkflowRef = useRef<WorkflowSession | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    async function restoreSession() {
      const saved = loadPharmacistSession();
      if (!saved?.id) {
        setSessionReady(true);
        return;
      }

      try {
        const res = await fetch(`/api/session?id=${encodeURIComponent(saved.id)}`);
        if (cancelled) return;

        if (res.ok) {
          const verified = await res.json();
          pendingWorkflowRef.current = loadWorkflowSession();
          dispatch({
            type: "RESTORE_SESSION",
            pharmacist: {
              id: verified.id,
              name: verified.name,
              role: verified.role ?? "Senior Pharmacist",
              licenseNumber: verified.licenseNumber,
            },
            workflow: pendingWorkflowRef.current,
          });
        } else {
          clearAuthSession();
        }
      } catch {
        clearAuthSession();
      } finally {
        if (!cancelled) setSessionReady(true);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sessionReady || realtimeInitRef.current) return;
    realtimeInitRef.current = true;

    const loadFromServer = async () => {
      try {
        const res = await fetch("/api/sync");
        if (res.ok) {
          const data = await res.json();
          dispatch({ type: "SYNC_STATE", state: data as Partial<AppState> });
        }
      } catch {
        // SSE will deliver state when available
      }
    };

    loadFromServer();

    const unsubscribe = subscribeToRealtime((newState) => {
      dispatch({ type: "SYNC_STATE", state: newState as Partial<AppState> });
    });

    return () => {
      unsubscribe();
      realtimeInitRef.current = false;
    };
  }, [sessionReady]);

  useEffect(() => {
    if (!state.pharmacist || workflowRestoredRef.current) return;
    if (!pendingWorkflowRef.current?.activePatientId) {
      workflowRestoredRef.current = true;
      return;
    }
    if (!state.dbConnected || !state.patients[pendingWorkflowRef.current.activePatientId]) return;

    const wf = pendingWorkflowRef.current;
    dispatch({
      type: "RESTORE_SESSION",
      pharmacist: state.pharmacist,
      workflow: wf,
    });
    workflowRestoredRef.current = true;
    pendingWorkflowRef.current = null;
  }, [state.dbConnected, state.patients, state.pharmacist]);

  useEffect(() => {
    if (!state.pharmacist) return;
    savePharmacistSession(state.pharmacist);
    saveWorkflowSession(buildWorkflowSnapshot(state));
  }, [
    state.pharmacist,
    state.activePatient?.id,
    state.activePrescription,
    state.interactionChecked,
    state.cascadeChecked,
    state.labelGenerated,
    state.dispensingComplete,
  ]);

  return (
    <AppContext.Provider value={{ state, dispatch, sessionReady }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1f2937", color: "#fff", borderRadius: "8px" },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export function useSessionReady() {
  return useApp().sessionReady;
}

export function useAudit() {
  const { dispatch, state } = useApp();
  const addAudit = (action: string, details: string, level: any = "info") => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    const entry = { time, action, details, level, user: state.pharmacist?.name };
    dispatch({ type: "ADD_AUDIT", entry });
    syncMutation("audit_log", "insertOne", entry).catch(() => {});
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
    const item = state.inventory.find(
      (i) => i.drug.toLowerCase() === drug.toLowerCase()
    );
    if (item) {
      const stock = Math.max(0, item.stock - quantity);
      await syncMutation("inventory", "updateOne", { stock }, { barcode: item.barcode });
    }
    audit("Dispensing Complete", `Rx ${rxId}: ${drug} ${quantity}`, "success");
  };

  const setPatient = async (patient: Patient) => {
    dispatch({ type: "SET_PATIENT", patient });
  };

  const setPrescription = async (p: ActivePrescription) => {
    dispatch({ type: "SET_PRESCRIPTION", prescription: p });
    await syncMutation("prescriptions", "updateOne", { status: "DISPENSING" }, { rxId: p.rxId });
  };

  const updateInventory = async (barcode: string, updates: Partial<InventoryItem>) => {
    dispatch({
      type: "SYNC_STATE",
      state: {
        inventory: state.inventory.map(item =>
          item.barcode === barcode ? { ...item, ...updates } : item
        ),
      },
    });
    await syncMutation("inventory", "updateOne", updates, { barcode });
  };

  const updatePrescription = async (rxId: string, updates: Partial<PrescriptionItem>) => {
    dispatch({
      type: "SYNC_STATE",
      state: {
        prescriptions: state.prescriptions.map(p =>
          p.rxId === rxId ? { ...p, ...updates } : p
        ),
      },
    });
    await syncMutation("prescriptions", "updateOne", updates, { rxId });
  };

  const updatePatient = async (patientId: string, updates: Partial<Patient>) => {
    const patient = state.patients[patientId];
    if (!patient) return;
    const updated = { ...patient, ...updates };
    dispatch({
      type: "SYNC_STATE",
      state: { patients: { ...state.patients, [patientId]: updated } },
    });
    await syncMutation("patients", "replaceOne", updated, { id: patientId });
  };

  const addPrescription = async (prescription: PrescriptionItem) => {
    dispatch({
      type: "SYNC_STATE",
      state: { prescriptions: [...state.prescriptions, prescription] },
    });
    await syncMutation("prescriptions", "insertOne", prescription);
    audit("New Prescription", `Rx ${prescription.rxId}: ${prescription.drug}`, "info");
  };

  return {
    completeDispensing,
    setPatient,
    setPrescription,
    updateInventory,
    updatePrescription,
    updatePatient,
    addPrescription,
  };
}
