const PHARMACIST_KEY = "pharmaguard_pharmacist";
const WORKFLOW_KEY = "pharmaguard_workflow";

export interface PharmacistSession {
  id: string;
  name: string;
  role: string;
  licenseNumber?: string;
}

export interface WorkflowSession {
  activePatientId?: string;
  activePrescription?: {
    rxId: string;
    patientId: string;
    drug: string;
    strength: string;
    quantity: number;
    frequency: string;
    route: string;
    prescriber: string;
    priority: string;
  } | null;
  interactionChecked?: boolean;
  cascadeChecked?: boolean;
  labelGenerated?: boolean;
  dispensingComplete?: boolean;
}

export function savePharmacistSession(pharmacist: PharmacistSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PHARMACIST_KEY, JSON.stringify(pharmacist));
}

export function loadPharmacistSession(): PharmacistSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PHARMACIST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PharmacistSession;
    if (!parsed?.id || !parsed?.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveWorkflowSession(workflow: WorkflowSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WORKFLOW_KEY, JSON.stringify(workflow));
}

export function loadWorkflowSession(): WorkflowSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WORKFLOW_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WorkflowSession;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PHARMACIST_KEY);
  localStorage.removeItem(WORKFLOW_KEY);
}

export function buildWorkflowSnapshot(state: {
  activePatient: { id: string } | null;
  activePrescription: WorkflowSession["activePrescription"];
  interactionChecked: boolean;
  cascadeChecked: boolean;
  labelGenerated: boolean;
  dispensingComplete: boolean;
}): WorkflowSession {
  return {
    activePatientId: state.activePatient?.id,
    activePrescription: state.activePrescription,
    interactionChecked: state.interactionChecked,
    cascadeChecked: state.cascadeChecked,
    labelGenerated: state.labelGenerated,
    dispensingComplete: state.dispensingComplete,
  };
}
