"use client";

import { useApp, useAudit, type AppStep } from "@/lib/store";
import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Zap,
  ChevronRight,
  Package,
  TrendingUp,
  ShieldAlert,
  ScanLine,
  Pill,
  FileClock,
} from "lucide-react";

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const addAudit = useAudit();

  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);

    addAudit(
      "DASHBOARD_ACCESSED",
      "Pharmacist opened main dashboard",
      "info"
    );

    return () => clearInterval(t);
  }, []);

  const urgent = useMemo(
    () => (state.prescriptions ?? []).filter((r) => r.priority === "URGENT" && r.status !== "DISPENSED"),
    [state.prescriptions]
  );

  const pending = useMemo(
    () => (state.prescriptions ?? []).filter((r) => r.status === "PENDING" || r.status === "DISPENSING"),
    [state.prescriptions]
  );

  const highRiskInteractions = useMemo(
    () =>
      (state.drugInteractions ?? []).filter(
        (d) =>
          d.severity === "HIGH" || d.severity === "CONTRAINDICATED"
      ).slice(0, 4),
    [state.drugInteractions]
  );

  const navigate = (step: AppStep) => {
    dispatch({
      type: "SET_STEP",
      step,
    });
  };

  const stats = [
    {
      label: "Pending",
      value: pending.length,
      icon: Clock,
      color: "var(--amber)",
      sub: `${urgent.length} urgent`,
      step: "prescription-queue",
    },
    {
      label: "Dispensed",
      value: 47 + (state.prescriptions ?? []).filter((r) => r.status === "DISPENSED").length,
      icon: CheckCircle,
      color: "var(--green)",
      sub: "↑ 12% today",
      step: "prescription-queue",
    },
    {
      label: "Alerts",
      value: state.alerts.filter(a => !a.dismissed).length,
      icon: AlertTriangle,
      color: "var(--red)",
      sub: state.alerts.filter(a => !a.dismissed).length > 0 ? `${state.alerts.filter(a => !a.dismissed && a.severity === "HIGH").length} critical safety checks` : "All systems secure",
      step: "interaction-check",
    },
    {
      label: "Patients",
      value: Object.keys(state.patients).length,
      icon: Users,
      color: "var(--blue)",
      sub: "Active wards",
      step: "patient-review",
    },
  ];

  const quickActions = [
    {
      label: "Prescription Queue",
      icon: FileClock,
      step: "prescription-queue",
    },
    {
      label: "Scan & Verify",
      icon: ScanLine,
      step: "scan-verify",
    },
    {
      label: "Drug Interactions",
      icon: ShieldAlert,
      step: "interaction-check",
    },
    {
      label: "Inventory",
      icon: Package,
      step: "inventory",
    },
    {
      label: "Preparation",
      icon: Pill,
      step: "preparation",
    },
    {
      label: "Reports",
      icon: TrendingUp,
      step: "reports",
    },
  ];

  return (
    <div
      style={{
        padding: 20,
        width: "100%",
      }}
    >
      {/* HEADER */}
      <div
        className="card"
        style={{
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div
              className="section-label"
              style={{ marginBottom: 6 }}
            >
              COMMAND CENTER
            </div>

            <h1
              className="display-font"
              style={{
                fontSize: "clamp(24px, 4vw, 34px)",
                fontWeight: 800,
                color: "var(--text)",
                lineHeight: 1.1,
              }}
            >
              Good{" "}
              {time
                ? time.getHours() < 12
                  ? "Morning"
                  : time.getHours() < 17
                  ? "Afternoon"
                  : "Evening"
                : "Morning"}
              ,{" "}
              <span className="glow-green">
                {state.pharmacist?.name?.split(" ")[1] || "Pharmacist"}
              </span>
            </h1>

            {time && (
              <div
                style={{
                  color: "var(--text-dim)",
                  fontSize: 13,
                  marginTop: 8,
                }}
              >
                {time.toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}

            {time && (
              <div
                style={{
                  color: "var(--text-faint)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            )}
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate("prescription-queue")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minHeight: 46,
              whiteSpace: "nowrap",
            }}
          >
            <Zap size={16} />
            Start Dispensing
          </button>
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {stats.map((s, i) => {
          const Icon = s.icon;

          return (
            <button
              key={i}
              onClick={() => navigate(s.step as AppStep)}
              className="card"
              style={{
                padding: 20,
                cursor: "pointer",
                textAlign: "left",
                transition: "0.2s",
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div className="section-label">
                  {s.label}
                </div>

                <Icon size={18} color={s.color} />
              </div>

              <div
                className="display-font"
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-faint)",
                  marginTop: 8,
                }}
              >
                {s.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* QUICK ACTIONS */}
      <div
        className="card"
        style={{
          padding: 20,
          marginBottom: 24,
        }}
      >
        <div
          className="section-label"
          style={{ marginBottom: 16 }}
        >
          QUICK ACTIONS
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 14,
          }}
        >
          {quickActions.map((item, i) => {
            const Icon = item.icon;

            return (
              <button
                key={i}
                onClick={() => navigate(item.step as AppStep)}
                className="card-inner"
                style={{
                  padding: 16,
                  borderRadius: 12,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "0.2s",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: "var(--green-glow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <Icon size={18} color="var(--green)" />
                </div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.5fr) minmax(320px,1fr)",
          gap: 24,
        }}
        className="dashboard-grid"
      >
        {/* QUEUE */}
        <div className="card" style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                className="section-label"
                style={{ marginBottom: 4 }}
              >
                PRESCRIPTION QUEUE
              </div>

              <div
                style={{
                  fontSize: 14,
                  color: "var(--text)",
                }}
              >
                Pending & active dispensing requests
              </div>
            </div>

            <button
              className="btn-ghost"
              onClick={() =>
                navigate("prescription-queue")
              }
            >
              View all ({(state.prescriptions ?? []).filter(rx => rx.status !== "DISPENSED").length})
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {(state.prescriptions ?? []).filter(rx => rx.status !== "DISPENSED").length === 0 ? (
              <div style={{ textAlign: "center", padding: 48, color: "var(--text-faint)" }}>
                <CheckCircle size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} color="var(--green)" />
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>All Prescriptions Dispensed</div>
                <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>No active or pending items in the queue</p>
              </div>
            ) : (
              (state.prescriptions ?? [])
                .filter(rx => rx.status !== "DISPENSED")
                .slice(0, 5)
                .map((rx, i) => {
                  const isDispensing = rx.status === "DISPENSING";
                  return (
                    <button
                      key={rx.rxId}
                      onClick={() =>
                        navigate("prescription-queue")
                      }
                      className="card-inner"
                      style={{
                        padding: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "0.2s",
                        borderLeft: isDispensing ? "3px solid #3b82f6" : "1px solid var(--border)",
                        position: "relative"
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background:
                            isDispensing
                              ? "#3b82f6"
                              : rx.priority === "URGENT"
                              ? "var(--red)"
                              : "var(--amber)",
                          boxShadow: isDispensing ? "0 0 8px #3b82f6" : "none",
                          flexShrink: 0,
                        }}
                      />

                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "var(--text)",
                            }}
                          >
                            {rx.drug} {rx.strength}
                          </span>
                          
                          {isDispensing && (
                            <span style={{
                              fontSize: 9,
                              padding: "1px 6px",
                              borderRadius: 4,
                              background: "rgba(59, 130, 246, 0.1)",
                              color: "#3b82f6",
                              border: "1px solid rgba(59, 130, 246, 0.3)",
                              fontWeight: 600,
                            }}>
                              ACTIVE
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--text-dim)",
                            marginTop: 4,
                          }}
                        >
                          {rx.patientName} • {rx.ward}
                        </div>
                      </div>

                      <div
                        style={{
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            padding: "4px 8px",
                            borderRadius: 999,
                            background:
                              isDispensing
                                ? "rgba(59, 130, 246, 0.15)"
                                : rx.priority === "URGENT"
                                ? "var(--red-glow)"
                                : "var(--amber-glow)",
                            color:
                              isDispensing
                                ? "#3b82f6"
                                : rx.priority === "URGENT"
                                ? "var(--red)"
                                : "var(--amber)",
                            fontWeight: 700,
                          }}
                        >
                          {isDispensing ? "DISPENSING" : rx.priority}
                        </div>

                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-faint)",
                            marginTop: 6,
                          }}
                        >
                          {rx.time}
                        </div>
                      </div>

                      <ChevronRight
                        size={16}
                        color={isDispensing ? "#3b82f6" : "var(--text-faint)"}
                      />
                    </button>
                  );
                })
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* LIVE ACTIVITY STREAM */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div className="section-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>LIVE ACTIVITY FEED</span>
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green)" }} className="animate-pulse" />
              </div>
              <button className="btn-ghost" style={{ fontSize: 11, padding: "2px 8px" }} onClick={() => navigate("audit-log")}>
                Full Log
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {state.auditLog.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--text-faint)", textAlign: "center", padding: 12 }}>
                  Waiting for events...
                </div>
              ) : (
                state.auditLog.slice(-4).reverse().map((entry, idx) => {
                  const entryColor = entry.level === "success" ? "var(--green)" : entry.level === "warning" ? "var(--amber)" : entry.level === "error" ? "var(--red)" : "var(--blue)";
                  return (
                    <div
                      key={idx}
                      className="live-activity-item"
                      style={{
                        padding: "8px 12px",
                        background: "var(--surface2)",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        fontSize: 12,
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        animation: "slide-in 0.3s ease-out forwards",
                      }}
                    >
                      <span style={{ fontSize: 10, color: "var(--text-faint)", fontFamily: "var(--mono)", marginTop: 1 }}>
                        [{entry.time}]
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: entryColor, fontSize: 12 }}>
                          {entry.action}
                        </div>
                        <div style={{ color: "var(--text-dim)", fontSize: 11, marginTop: 2 }}>
                          {entry.details}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* INTERACTIONS */}
          <div className="card" style={{ padding: 20 }}>
            <div
              className="section-label"
              style={{ marginBottom: 16 }}
            >
              HIGH-RISK INTERACTIONS
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {highRiskInteractions.map((d, i) => (
                <button
                  key={i}
                  onClick={() =>
                    navigate("interaction-check")
                  }
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background:
                        d.severity ===
                        "CONTRAINDICATED"
                          ? "var(--red-glow)"
                          : "var(--amber-glow)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <AlertTriangle
                      size={16}
                      color={
                        d.severity ===
                        "CONTRAINDICATED"
                          ? "var(--red)"
                          : "var(--amber)"
                      }
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {d.drug1} + {d.drug2}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-dim)",
                        marginTop: 4,
                      }}
                    >
                      {d.effect.slice(0, 70)}...
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SYSTEM HEALTH */}
          <div className="card" style={{ padding: 20 }}>
            <div
              className="section-label"
              style={{ marginBottom: 16 }}
            >
              SYSTEM HEALTH
            </div>

            {[
              {
                label: "Drug Database",
                status: "ONLINE",
                ok: true,
              },
              {
                label: "Barcode Scanner",
                status: "CONNECTED",
                ok: true,
              },
              {
                label: "Label Printer",
                status: "READY",
                ok: true,
              },
              {
                label: "Audit System",
                status: "RECORDING",
                ok: true,
              },
              {
                label: "AI Engine",
                status: "ACTIVE",
                ok: true,
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom:
                    i !== 4
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--text-dim)",
                  }}
                >
                  {item.label}
                </span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    className={`status-dot ${
                      item.ok ? "green" : "red"
                    }`}
                  />

                  <span
                    style={{
                      fontSize: 11,
                      color: item.ok
                        ? "var(--green)"
                        : "var(--red)",
                      fontWeight: 600,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI BANNER */}
      <div
        style={{
          marginTop: 24,
          padding: 20,
          borderRadius: 16,
          border: "1px solid var(--border2)",
          background:
            "linear-gradient(135deg, rgba(0,232,122,0.08) 0%, rgba(0,232,122,0.03) 100%)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            marginTop: 0,
            width: 50,
            height: 50,
            borderRadius: 14,
            background: "rgba(0,232,122,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Activity size={22} color="var(--green)" />
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            AI Safety Engine Active
          </div>

          <div
            style={{
              fontSize: 13,
              color: "var(--text-dim)",
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            Real-time interaction monitoring •
            Prescription cascade detection •
            Barcode verification • Audit logging
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() => navigate("audit-log")}
        >
          Open Audit Log
        </button>
      </div>

      {/* MOBILE RESPONSIVE */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }

        button:hover {
          transform: translateY(-1px);
        }

        button:active {
          transform: scale(0.99);
        }
      `}</style>
    </div>
  );
}