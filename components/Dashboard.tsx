"use client";
import { useApp, useAudit } from "@/lib/store";
import { PRESCRIPTIONS_QUEUE, DRUG_INTERACTIONS, PATIENTS } from "@/lib/database";
import { Activity, AlertTriangle, CheckCircle, Clock, Package, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const addAudit = useAudit();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    addAudit("DASHBOARD_ACCESSED", "Pharmacist opened main dashboard", "info");
    return () => clearInterval(t);
  }, []);

  const urgent = PRESCRIPTIONS_QUEUE.filter(r => r.priority === "URGENT");
  const pending = PRESCRIPTIONS_QUEUE.filter(r => r.status === "PENDING");

  const stats = [
    { label: "Pending Prescriptions", value: pending.length, icon: Clock, color: "var(--amber)", sub: `${urgent.length} urgent` },
    { label: "Dispensed Today", value: 47, icon: CheckCircle, color: "var(--green)", sub: "↑ 12% from yesterday" },
    { label: "Alerts Flagged", value: 6, icon: AlertTriangle, color: "var(--red)", sub: "2 unresolved" },
    { label: "Active Patients", value: Object.keys(PATIENTS).length, icon: Users, color: "var(--blue)", sub: "In-patient wards" },
  ];

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="section-label" style={{ marginBottom: 4 }}>COMMAND CENTER</div>
          <h1 className="display-font" style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
            Good {time.getHours() < 12 ? "Morning" : time.getHours() < 17 ? "Afternoon" : "Evening"},{" "}
            <span className="glow-green">{state.pharmacist?.name.split(" ")[1]}</span>
          </h1>
          <div style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
            {time.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            {" · "}
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() => dispatch({ type: "SET_STEP", step: "prescription-queue" })}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Zap size={14} />
          Start Dispensing
        </button>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card" style={{ padding: 20, animationDelay: `${i * 0.08}s` }} >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div className="section-label">{s.label}</div>
                <Icon size={16} color={s.color} />
              </div>
              <div className="display-font" style={{ fontSize: 36, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 6 }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        {/* Urgent prescriptions */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 2 }}>PRESCRIPTION QUEUE</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>Pending orders</div>
            </div>
            <button
              className="btn-ghost"
              onClick={() => dispatch({ type: "SET_STEP", step: "prescription-queue" })}
              style={{ fontSize: 12, padding: "6px 12px" }}
            >
              View all →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PRESCRIPTIONS_QUEUE.map((rx, i) => (
              <div
                key={i}
                className="card-inner"
                style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--green)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border2)")}
                onClick={() => dispatch({ type: "SET_STEP", step: "prescription-queue" })}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                  background: rx.priority === "URGENT" ? "var(--red)" : "var(--amber)"
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                    {rx.drug} {rx.strength}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {rx.patientName} · {rx.ward}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 4,
                    background: rx.priority === "URGENT" ? "var(--red-glow)" : "var(--amber-glow)",
                    color: rx.priority === "URGENT" ? "var(--red)" : "var(--amber)",
                    border: `1px solid ${rx.priority === "URGENT" ? "var(--red-dim)" : "var(--amber)"}`,
                    letterSpacing: "0.05em"
                  }}>
                    {rx.priority}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>{rx.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Known high-risk interactions */}
          <div className="card" style={{ padding: 20 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>HIGH-RISK INTERACTION ALERTS</div>
            {DRUG_INTERACTIONS.filter(d => d.severity === "HIGH" || d.severity === "CONTRAINDICATED").slice(0, 3).map((d, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                padding: "8px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none"
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 1,
                  background: d.severity === "CONTRAINDICATED" ? "var(--red-glow)" : "var(--amber-glow)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <AlertTriangle size={10} color={d.severity === "CONTRAINDICATED" ? "var(--red)" : "var(--amber)"} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>
                    {d.drug1} + {d.drug2}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{d.effect.slice(0, 55)}…</div>
                </div>
              </div>
            ))}
          </div>

          {/* System health */}
          <div className="card" style={{ padding: 20 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>SYSTEM HEALTH</div>
            {[
              { label: "Drug Database", status: "ONLINE", ok: true },
              { label: "Barcode Scanner", status: "CONNECTED", ok: true },
              { label: "Label Printer", status: "READY", ok: true },
              { label: "Audit System", status: "RECORDING", ok: true },
              { label: "AI Engine", status: "ACTIVE", ok: true },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{item.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className={`status-dot ${item.ok ? "green" : "red"}`} />
                  <span style={{ fontSize: 11, color: item.ok ? "var(--green)" : "var(--red)" }}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Banner */}
      <div style={{
        marginTop: 24, padding: "16px 24px",
        background: "linear-gradient(135deg, rgba(0,232,122,0.06) 0%, rgba(0,232,122,0.02) 100%)",
        border: "1px solid var(--border2)",
        borderRadius: 12, display: "flex", alignItems: "center", gap: 16
      }}>
        <Activity size={20} color="var(--green)" />
        <div>
          <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>AI Safety Engine Active</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
            Real-time drug interaction monitoring · Prescribing cascade detection · Automated verification · Tamper-proof audit logging
          </div>
        </div>
        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: "var(--green)" }}>47 checks today</div>
          <div style={{ fontSize: 11, color: "var(--text-faint)" }}>3 errors caught</div>
        </div>
      </div>
    </div>
  );
}
