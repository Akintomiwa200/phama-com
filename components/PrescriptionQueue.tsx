"use client";
import { useState } from "react";
import { useApp, useAudit } from "@/lib/store";
import { PATIENTS } from "@/lib/database";
import { Search, Filter, ChevronRight, Clock, AlertTriangle, CheckCircle, User, Pill, Loader2 } from "lucide-react";

export default function PrescriptionQueue() {
  const { state, dispatch } = useApp();
  const addAudit = useAudit();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | "URGENT" | "ROUTINE">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "DISPENSING" | "DISPENSED">("ALL");

  const filtered = state.prescriptions.filter(rx => {
    const matchSearch = rx.patientName.toLowerCase().includes(search.toLowerCase()) ||
      rx.drug.toLowerCase().includes(search.toLowerCase()) ||
      rx.rxId.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === "ALL" || rx.priority === priorityFilter;
    const matchStatus = statusFilter === "ALL" || rx.status === statusFilter;
    return matchSearch && matchPriority && matchStatus;
  });

  function handleSelect(rx: typeof state.prescriptions[0]) {
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
      {/* Dynamic Keyframe style for pulsing animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-blue {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .pulse-dispensing {
          animation: pulse-blue 2s infinite;
        }
      `}} />

      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 4 }}>STEP 2 OF 10</div>
        <h1 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Prescription Queue
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
          Select an active prescription to begin the AI-assisted dynamic dispensing workflow (Real-Time Synchronized)
        </p>
      </div>

      {/* Dual Row Filters: Search & Status Tabs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12 }}>
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
                onClick={() => setPriorityFilter(f)}
                style={{
                  padding: "8px 16px", borderRadius: 6, fontSize: 12,
                  background: priorityFilter === f ? (f === "URGENT" ? "var(--red-glow)" : f === "ROUTINE" ? "var(--green-glow)" : "var(--border)") : "transparent",
                  border: `1px solid ${priorityFilter === f ? (f === "URGENT" ? "var(--red-dim)" : f === "ROUTINE" ? "var(--green)" : "var(--border2)") : "var(--border)"}`,
                  color: priorityFilter === f ? (f === "URGENT" ? "var(--red)" : f === "ROUTINE" ? "var(--green)" : "var(--text)") : "var(--text-dim)",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Status Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", paddingBottom: 2, gap: 16 }}>
          {(["ALL", "PENDING", "DISPENSING", "DISPENSED"] as const).map(tab => {
            const count = state.prescriptions.filter(p => tab === "ALL" || p.status === tab).length;
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: "8px 4px 12px",
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${isActive ? "var(--green)" : "transparent"}`,
                  color: isActive ? "var(--text)" : "var(--text-dim)",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s"
                }}
              >
                <span>
                  {tab === "ALL" ? "All Queue" : tab === "DISPENSED" ? "Dispensed" : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </span>
                <span style={{
                  fontSize: 10,
                  padding: "1px 6px",
                  borderRadius: 8,
                  background: isActive ? "var(--green-glow)" : "var(--border2)",
                  color: isActive ? "var(--green)" : "var(--text-faint)",
                  fontWeight: 600
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Queue items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((rx, i) => {
          const isDispensing = rx.status === "DISPENSING";
          const isDispensed = rx.status === "DISPENSED";
          
          return (
            <div
              key={rx.rxId}
              className="card"
              style={{
                padding: "20px 24px",
                cursor: "pointer",
                transition: "all 0.2s",
                position: "relative",
                overflow: "hidden",
                borderLeft: isDispensing 
                  ? "4px solid #3b82f6" 
                  : isDispensed 
                    ? "4px solid var(--green)" 
                    : "1px solid var(--border)"
              }}
              onClick={() => handleSelect(rx)}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = isDispensing ? "#3b82f6" : isDispensed ? "var(--green)" : "var(--green)";
                e.currentTarget.style.background = "var(--surface2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = isDispensing ? "#3b82f6" : isDispensed ? "var(--green)" : "var(--border)";
                e.currentTarget.style.background = "var(--surface)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Priority / Status Left Icon */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: isDispensing ? "rgba(59, 130, 246, 0.15)" : isDispensed ? "var(--green-glow)" : priorityBg(rx.priority),
                  border: `1px solid ${isDispensing ? "#3b82f630" : isDispensed ? "var(--green)30" : `${priorityColor(rx.priority)}30`}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {isDispensed ? (
                    <CheckCircle size={18} color="var(--green)" />
                  ) : isDispensing ? (
                    <Loader2 size={18} color="#3b82f6" className="animate-spin" />
                  ) : (
                    <Pill size={18} color={priorityColor(rx.priority)} />
                  )}
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

                    {/* Status Badge */}
                    {isDispensing && (
                      <span className="pulse-dispensing" style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 4,
                        background: "rgba(59, 130, 246, 0.1)",
                        color: "#3b82f6",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}>
                        DISPENSING
                      </span>
                    )}

                    {isDispensed && (
                      <span style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 4,
                        background: "var(--green-glow)",
                        color: "var(--green)",
                        border: "1px solid var(--green)",
                        fontWeight: 600
                      }}>
                        DISPENSED
                      </span>
                    )}
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
                    <ChevronRight size={16} color={isDispensing ? "#3b82f6" : isDispensed ? "var(--green)" : "var(--green)"} />
                  </div>
                </div>
              </div>

              {/* Prescriber */}
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>Prescribed by: <span style={{ color: "var(--text-dim)" }}>{rx.prescriber}</span></span>
                <span style={{ fontSize: 11, color: isDispensing ? "#3b82f6" : isDispensed ? "var(--green)" : "var(--green)" }}>
                  {isDispensed ? "Dispensing Complete" : isDispensing ? "→ Resume dispensing process" : "→ Begin dispensing"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: "var(--text-faint)" }}>
          <CheckCircle size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
          <div>No prescriptions match your filters</div>
        </div>
      )}
    </div>
  );
}
