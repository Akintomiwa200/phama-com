"use client";
import { useState } from "react";
import { useApp, useAudit } from "@/lib/store";
import { PRESCRIPTIONS_QUEUE, PATIENTS } from "@/lib/database";
import { Search, Filter, ChevronRight, Clock, AlertTriangle, CheckCircle, User, Pill } from "lucide-react";

export default function PrescriptionQueue() {
  const { dispatch } = useApp();
  const addAudit = useAudit();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "URGENT" | "ROUTINE">("ALL");

  const filtered = PRESCRIPTIONS_QUEUE.filter(rx => {
    const matchSearch = rx.patientName.toLowerCase().includes(search.toLowerCase()) ||
      rx.drug.toLowerCase().includes(search.toLowerCase()) ||
      rx.rxId.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || rx.priority === filter;
    return matchSearch && matchFilter;
  });

  function handleSelect(rx: typeof PRESCRIPTIONS_QUEUE[0]) {
    const patient = PATIENTS[rx.patientId];
    if (patient) {
      dispatch({ type: "SET_PATIENT", patient });
      dispatch({
        type: "SET_PRESCRIPTION",
        prescription: {
          rxId: rx.rxId, patientId: rx.patientId,
          drug: rx.drug, strength: rx.strength, quantity: rx.quantity,
          frequency: rx.frequency, route: rx.route, prescriber: rx.prescriber,
          priority: rx.priority
        }
      });
      addAudit("PRESCRIPTION_SELECTED", `Opened ${rx.rxId} for ${rx.patientName}`, "info");
      dispatch({ type: "SET_STEP", step: "patient-review" });
    }
  }

  const priorityColor = (p: string) => p === "URGENT" ? "var(--red)" : "var(--amber)";
  const priorityBg = (p: string) => p === "URGENT" ? "var(--red-glow)" : "var(--amber-glow)";

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 4 }}>STEP 2 OF 10</div>
        <h1 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Prescription Queue
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
          Select a prescription to begin the AI-assisted dispensing workflow
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
          <input
            className="input-field"
            placeholder="Search by patient name, drug, or Rx ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["ALL", "URGENT", "ROUTINE"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 16px", borderRadius: 6, fontSize: 12,
                background: filter === f ? (f === "URGENT" ? "var(--red-glow)" : f === "ROUTINE" ? "var(--green-glow)" : "var(--border)") : "transparent",
                border: `1px solid ${filter === f ? (f === "URGENT" ? "var(--red-dim)" : f === "ROUTINE" ? "var(--green)" : "var(--border2)") : "var(--border)"}`,
                color: filter === f ? (f === "URGENT" ? "var(--red)" : f === "ROUTINE" ? "var(--green)" : "var(--text)") : "var(--text-dim)",
                cursor: "pointer"
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Queue items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((rx, i) => (
          <div
            key={i}
            className="card"
            style={{ padding: "20px 24px", cursor: "pointer", transition: "all 0.2s" }}
            onClick={() => handleSelect(rx)}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--green)";
              e.currentTarget.style.background = "var(--surface2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "var(--surface)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Priority indicator */}
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: priorityBg(rx.priority),
                border: `1px solid ${priorityColor(rx.priority)}30`,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Pill size={18} color={priorityColor(rx.priority)} />
              </div>

              {/* Main info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
                    {rx.drug} {rx.strength}
                  </span>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 4,
                    background: priorityBg(rx.priority),
                    color: priorityColor(rx.priority),
                    border: `1px solid ${priorityColor(rx.priority)}40`,
                    letterSpacing: "0.08em"
                  }}>
                    {rx.priority}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 4 }}>
                    <User size={11} /> {rx.patientName}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{rx.ward} · {rx.frequency}</span>
                  <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Qty: {rx.quantity}</span>
                </div>
              </div>

              {/* Right side */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 4 }}>{rx.rxId}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-dim)", fontSize: 11, justifyContent: "flex-end" }}>
                  <Clock size={10} /> {rx.time}
                </div>
                <div style={{ marginTop: 8 }}>
                  <ChevronRight size={16} color="var(--green)" />
                </div>
              </div>
            </div>

            {/* Prescriber */}
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>Prescribed by: <span style={{ color: "var(--text-dim)" }}>{rx.prescriber}</span></span>
              <span style={{ fontSize: 11, color: "var(--green)" }}>→ Begin dispensing</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: "var(--text-faint)" }}>
          <CheckCircle size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
          <div>No prescriptions match your filter</div>
        </div>
      )}
    </div>
  );
}
