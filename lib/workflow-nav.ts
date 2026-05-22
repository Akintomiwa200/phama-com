import type { AppStep } from "./store";

export const PATH_TO_STEP: Record<string, AppStep> = {
  "/dashboard": "dashboard",
  "/dashboard/prescription-queue": "prescription-queue",
  "/dashboard/patient-review": "patient-review",
  "/dashboard/interaction-check": "interaction-check",
  "/dashboard/cascade-check": "cascade-check",
  "/dashboard/scan-verify": "scan-verify",
  "/dashboard/preparation": "preparation",
  "/dashboard/label-generate": "label-generate",
  "/dashboard/audit-log": "audit-log",
  "/dashboard/complete": "complete",
  "/dashboard/inventory": "inventory",
  "/dashboard/reports": "reports",
  "/dashboard/settings": "settings",
  "/dashboard/profile": "profile",
  "/dashboard/help": "help",
};

export const STEP_TO_PATH: Record<AppStep, string> = {
  login: "/login",
  dashboard: "/dashboard",
  "prescription-queue": "/dashboard/prescription-queue",
  "patient-review": "/dashboard/patient-review",
  "interaction-check": "/dashboard/interaction-check",
  "cascade-check": "/dashboard/cascade-check",
  "scan-verify": "/dashboard/scan-verify",
  preparation: "/dashboard/preparation",
  "label-generate": "/dashboard/label-generate",
  "audit-log": "/dashboard/audit-log",
  complete: "/dashboard/complete",
  inventory: "/dashboard/inventory",
  reports: "/dashboard/reports",
  settings: "/dashboard/settings",
  profile: "/dashboard/profile",
  help: "/dashboard/help",
};

export const STEP_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  "prescription-queue": "Prescription Queue",
  "patient-review": "Patient Review",
  "interaction-check": "Interaction Check",
  "cascade-check": "Cascade Check",
  "scan-verify": "Scan & Verify",
  preparation: "Preparation",
  "label-generate": "Label Generation",
  "audit-log": "Audit Log",
  complete: "Complete",
  inventory: "Inventory",
  reports: "Reports",
  settings: "Settings",
  profile: "My Profile",
  help: "Help Center",
};

export const WORKFLOW_ORDER: AppStep[] = [
  "prescription-queue",
  "patient-review",
  "interaction-check",
  "cascade-check",
  "scan-verify",
  "preparation",
  "label-generate",
  "audit-log",
];

export function getStepFromPath(pathname: string): AppStep {
  if (PATH_TO_STEP[pathname]) return PATH_TO_STEP[pathname];
  const match = Object.keys(PATH_TO_STEP)
    .filter((p) => p !== "/dashboard")
    .sort((a, b) => b.length - a.length)
    .find((p) => pathname.startsWith(p));
  return match ? PATH_TO_STEP[match] : "dashboard";
}

export function getPathFromStep(step: AppStep): string {
  return STEP_TO_PATH[step] || "/dashboard";
}

export function matchDrugName(a: string, b: string): boolean {
  const x = a.toLowerCase().trim();
  const y = b.toLowerCase().trim();
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}
