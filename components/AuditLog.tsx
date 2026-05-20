"use client";
import { useApp, useAudit } from "@/lib/store";
import { ClipboardList, Download, CheckCircle, ChevronRight, Lock, AlertTriangle, Info, XCircle } from "lucide-react";

export default function AuditLog() {
  const { state, dispatch } = useApp();
  const addAudit = useAudit();

  const icons = {
    info: <Info size={12} color="var(--blue)" />,
    warning: <AlertTriangle size={12} color="var(--amber)" />,
    error: <XCircle size={12} color="var(--red)" />,
    success: <CheckCircle size={12} color="var(--green)" />,
  };

  const colors = {
    info: "var(--blue)",
    warning: "var(--amber)",
    error: "var(--red)",
    success: "var(--green)",
  };

  function complete() {
    addAudit("DISPENSING_COMPLETE", `${state.activePrescription?.drug} dispensed successfully to ${state.activePatient?.name}`, "success");
    dispatch({ type: "SET_COMPLETE", value: true });
    dispatch({ type: "SET_STEP", step: "complete" });
  }

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 4 }}>STEP 9 — AUDIT TRAIL</div>
        <h1 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Immutable Audit Log
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
          Every action is permanently recorded and cannot be modified or deleted
        </p>
      </div>

      {/* Security banner */}
      <div style={{
        marginBottom: 24, padding: "12px 18px",
        background: "rgba(77,166,255,0.06)",
        border: "1px solid rgba(77,166,255,0.2)",
        borderRadius: 8, display: "flex", gap: 10, alignItems: "center"
      }}>
        <Lock size={14} color="var(--blue)" />
        <span style={{ fontSize: 12, color: "var(--blue)" }}>
          SHA-256 hash secured · Timestamp verified · Pharmacist-linked · NAFDAC compliant
        </span>
        <button
          className="btn-ghost"
          style={{ marginLeft: "auto", fontSize: 11, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}
        >
          <Download size={11} /> Export
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          padding: "12px 20px",
          background: "var(--surface2)",
          borderBottom: "1px solid var(--border)",
          display: "grid",
          gridTemplateColumns: "100px 1fr 80px",
          gap: 16
        }}>
          <span className="section-label">TIMESTAMP</span>
          <span className="section-label">ACTION / DETAILS</span>
          <span className="section-label">LEVEL</span>
        </div>

        {/* Entries */}
        <div style={{ maxHeight: 460, overflowY: "auto" }}>
          {state.auditLog.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-faint)", fontSize: 13 }}>
              No audit entries yet
            </div>
          ) : (
            state.auditLog.map((entry, i) => (
              <div
                key={i}
                className="animate-slide-up"
                style={{
                  padding: "12px 20px",
                  borderBottom: i < state.auditLog.length - 1 ? "1px solid var(--border)" : "none",
                  display: "grid",
                  gridTemplateColumns: "100px 1fr 80px",
                  gap: 16,
                  alignItems: "flex-start",
                  animationDelay: `${i * 0.04}s`
                }}
              >
                <div style={{ fontSize: 11, color: "var(--text-faint)", fontFamily: "var(--mono)" }}>
                  [{entry.time}]
                </div>
                <div>
                  <div style={{ fontSize: 12, color: colors[entry.level], fontWeight: 500, marginBottom: 2 }}>
                    {entry.action}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{entry.details}</div>
                  {entry.user && <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2 }}>by: {entry.user}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {icons[entry.level]}
                  <span style={{ fontSize: 10, color: colors[entry.level], textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {entry.level}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20 }}>
        {[
          { label: "Total Entries", val: state.auditLog.length, color: "var(--text)" },
          { label: "Warnings", val: state.auditLog.filter(e => e.level === "warning").length, color: "var(--amber)" },
          { label: "Errors Caught", val: state.auditLog.filter(e => e.level === "error").length, color: "var(--red)" },
          { label: "Success", val: state.auditLog.filter(e => e.level === "success").length, color: "var(--green)" },
        ].map((s, i) => (
          <div key={i} className="card-inner" style={{ padding: "12px 14px" }}>
            <div className="section-label" style={{ marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <button
        className="btn-primary"
        onClick={complete}
        style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8 }}
      >
        Complete Dispensing <ChevronRight size={14} />
      </button>
    </div>
  );
}
