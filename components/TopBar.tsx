"use client";
import { useApp } from "@/lib/store";
import { Bell, Search, ChevronRight } from "lucide-react";

const STEP_LABELS: Record<string, string> = {
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
};

const WORKFLOW_STEPS = [
  "prescription-queue",
  "patient-review",
  "interaction-check",
  "cascade-check",
  "scan-verify",
  "preparation",
  "label-generate",
  "audit-log",
  "complete",
];

export default function TopBar() {
  const { state } = useApp();
  const currentIdx = WORKFLOW_STEPS.indexOf(state.step);

  const activeAlerts = state.alerts.filter(a => !a.dismissed);

  return (
    <header style={{
      height: 52,
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      gap: 16,
      flexShrink: 0,
    }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
        <span style={{ fontSize: 12, color: "var(--text-faint)" }}>PharmaGuard</span>
        <ChevronRight size={12} color="var(--text-faint)" />
        <span style={{ fontSize: 12, color: "var(--text)" }}>{STEP_LABELS[state.step] || state.step}</span>
      </div>

      {/* Workflow progress (only during dispensing workflow) */}
      {currentIdx !== -1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {WORKFLOW_STEPS.slice(0, -1).map((step, i) => (
            <div key={i} style={{
              width: i <= currentIdx ? 20 : 16,
              height: 4,
              borderRadius: 2,
              background: i < currentIdx ? "var(--green)" : i === currentIdx ? "var(--green)" : "var(--border2)",
              opacity: i < currentIdx ? 0.6 : 1,
              transition: "all 0.3s"
            }} />
          ))}
          <span style={{ fontSize: 11, color: "var(--text-dim)", marginLeft: 8 }}>
            Step {currentIdx + 1} / {WORKFLOW_STEPS.length - 1}
          </span>
        </div>
      )}

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Rx info if active */}
        {state.activePrescription && currentIdx !== -1 && (
          <div style={{
            padding: "4px 10px", background: "var(--surface2)", border: "1px solid var(--border2)",
            borderRadius: 6, fontSize: 11, color: "var(--text-dim)"
          }}>
            <span style={{ color: "var(--text)" }}>{state.activePrescription.drug} {state.activePrescription.strength}</span>
            {" · "}
            <span style={{ color: "var(--text-faint)" }}>{state.activePatient?.name}</span>
          </div>
        )}

        {/* Alert bell */}
        <button style={{
          background: "none", border: "none", cursor: "pointer",
          color: activeAlerts.length > 0 ? "var(--red)" : "var(--text-faint)",
          position: "relative", display: "flex", alignItems: "center"
        }}>
          <Bell size={16} />
          {activeAlerts.length > 0 && (
            <span style={{
              position: "absolute", top: -4, right: -4,
              width: 14, height: 14, borderRadius: "50%",
              background: "var(--red)", color: "white",
              fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700
            }}>
              {activeAlerts.length}
            </span>
          )}
        </button>

        {/* Pharmacist badge */}
        <div style={{
          padding: "4px 10px", background: "var(--green-glow)",
          border: "1px solid var(--green)30",
          borderRadius: 6, display: "flex", alignItems: "center", gap: 6
        }}>
          <span className="status-dot green" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: 11, color: "var(--green)" }}>
            {state.pharmacist?.id}
          </span>
        </div>
      </div>
    </header>
  );
}
