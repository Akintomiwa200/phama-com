"use client";
import { useApp } from "@/lib/store";
import { CheckCircle, Package, BarChart2, Settings, RefreshCw, AlertTriangle, TrendingUp, Users, Activity, Shield, Bell, Moon, Globe } from "lucide-react";
import { DRUG_INVENTORY } from "@/lib/database";

export function CompleteScreen() {
  const { state, dispatch } = useApp();
  return (
    <div style={{ padding: 32, maxWidth: 700, textAlign: "center" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{
          width: 88, height: 88, borderRadius: "50%", margin: "0 auto 24px",
          background: "var(--green-glow)", border: "2px solid var(--green)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }} className="animate-pulse-green">
          <CheckCircle size={44} color="var(--green)" />
        </div>

        <div className="display-font" style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8 }}>
          Dispensing <span className="glow-green">Complete</span>
        </div>
        <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7 }}>
          {state.activePrescription?.drug} {state.activePrescription?.strength} has been safely verified and dispensed to{" "}
          <strong style={{ color: "var(--text)" }}>{state.activePatient?.name}</strong>.
          Every safety check has passed. Every error has been caught. The patient is safe.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32, textAlign: "left" }}>
        {[
          { label: "Drug Interaction Check", status: "PASSED" },
          { label: "Cascade Detection", status: "PASSED" },
          { label: "Barcode Verification", status: "PASSED" },
          { label: "Strength Confirmation", status: "PASSED" },
          { label: "Label Generation", status: "PASSED" },
          { label: "Audit Log Saved", status: "RECORDED" },
        ].map((item, i) => (
          <div key={i} className="card-inner" style={{ padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
            <CheckCircle size={12} color="var(--green)" />
            <div>
              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{item.label}</div>
              <div style={{ fontSize: 10, color: "var(--green)", letterSpacing: "0.05em" }}>{item.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          className="btn-primary"
          onClick={() => dispatch({ type: "NEW_PRESCRIPTION" })}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <RefreshCw size={14} /> New Prescription
        </button>
        <button
          className="btn-ghost"
          onClick={() => dispatch({ type: "SET_STEP", step: "dashboard" })}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export function Inventory() {
  const { state } = useApp();
  const critical = state.inventory.filter(d => d.criticalStock);
  const low = state.inventory.filter(d => d.lowStock && !d.criticalStock);

  return (
    <div style={{ padding: 32, maxWidth: 1000 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 4 }}>PHARMACY INVENTORY</div>
        <h1 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Drug Stock Management
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>Real-time inventory with expiry and stock alerts</p>
      </div>

      {/* Alerts */}
      {(critical.length > 0 || low.length > 0) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {critical.map((d, i) => (
            <div key={i} style={{ padding: "10px 16px", background: "var(--red-glow)", border: "1px solid var(--red-dim)", borderRadius: 6, display: "flex", gap: 8, alignItems: "center" }}>
              <AlertTriangle size={13} color="var(--red)" />
              <span style={{ fontSize: 12, color: "var(--red)" }}>CRITICAL STOCK: {d.drug} {d.strength} — only {d.stock} units remaining. Reorder immediately.</span>
            </div>
          ))}
          {low.map((d, i) => (
            <div key={i} style={{ padding: "10px 16px", background: "var(--amber-glow)", border: "1px solid var(--amber)40", borderRadius: 6, display: "flex", gap: 8, alignItems: "center" }}>
              <AlertTriangle size={13} color="var(--amber)" />
              <span style={{ fontSize: 12, color: "var(--amber)" }}>LOW STOCK: {d.drug} {d.strength} — {d.stock} units remaining. Reorder soon.</span>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px",
          padding: "12px 20px", background: "var(--surface2)", borderBottom: "1px solid var(--border)"
        }}>
          {["Drug", "Strength", "Form", "Stock", "Expiry", "Status"].map((h, i) => (
            <span key={i} className="section-label">{h}</span>
          ))}
        </div>
        {state.inventory.map((item, i) => {
          const stockColor = item.criticalStock ? "var(--red)" : item.lowStock ? "var(--amber)" : "var(--green)";
          const expSoon = new Date(item.expiry) < new Date(Date.now() + 90 * 86400000);
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px",
              padding: "14px 20px",
              borderBottom: i < state.inventory.length - 1 ? "1px solid var(--border)" : "none",
              transition: "background 0.15s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div>
                <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{item.drug}</div>
                <div style={{ fontSize: 10, color: "var(--text-faint)" }}>Batch: {item.batch}</div>
              </div>
              <span style={{ fontSize: 13, color: "var(--text-dim)", alignSelf: "center" }}>{item.strength}</span>
              <span style={{ fontSize: 13, color: "var(--text-dim)", alignSelf: "center" }}>{item.form}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: stockColor, alignSelf: "center" }}>{item.stock}</span>
              <span style={{ fontSize: 12, color: expSoon ? "var(--amber)" : "var(--text-dim)", alignSelf: "center" }}>{item.expiry}</span>
              <div style={{ alignSelf: "center" }}>
                <span style={{
                  fontSize: 10, padding: "3px 8px", borderRadius: 4,
                  background: item.criticalStock ? "var(--red-glow)" : item.lowStock ? "var(--amber-glow)" : "var(--green-glow)",
                  color: stockColor,
                  border: `1px solid ${stockColor}30`
                }}>
                  {item.criticalStock ? "CRITICAL" : item.lowStock ? "LOW" : "OK"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Reports() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May"];
  const dispensed = [312, 289, 401, 378, 423];
  const errors = [8, 5, 12, 6, 3];
  const max = Math.max(...dispensed);

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 4 }}>ANALYTICS</div>
        <h1 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Pharmacy Reports
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>Performance metrics and safety statistics — 2026</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Dispensed", val: "1,803", sub: "Jan–May 2026", icon: Package, color: "var(--green)" },
          { label: "Error Rate", val: "0.94%", sub: "↓ from 1.4% last yr", icon: AlertTriangle, color: "var(--red)" },
          { label: "Avg. Dispense Time", val: "4.2 min", sub: "↓ 1.8 min from 2025", icon: Activity, color: "var(--blue)" },
          { label: "Patient Satisfaction", val: "97.1%", sub: "Based on 208 surveys", icon: Users, color: "var(--amber)" },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div className="section-label">{k.label}</div>
                <Icon size={14} color={k.color} />
              </div>
              <div className="display-font" style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.val}</div>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>{k.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div className="section-label" style={{ marginBottom: 20 }}>MONTHLY DISPENSING VOLUME</div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 140 }}>
          {months.map((m, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 11, color: "var(--green)" }}>{dispensed[i]}</div>
              <div style={{
                width: "100%", borderRadius: "4px 4px 0 0",
                background: i === months.length - 1 ? "var(--green)" : "var(--green-glow)",
                border: "1px solid var(--green)40",
                height: `${(dispensed[i] / max) * 100}px`,
                transition: "height 0.5s",
              }} />
              <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{m}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety */}
      <div className="card" style={{ padding: 24 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>ERRORS INTERCEPTED BY AI</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { type: "Wrong drug scanned", count: 14, pct: 40 },
            { type: "Wrong strength scanned", count: 11, pct: 31 },
            { type: "Drug interactions flagged", count: 7, pct: 20 },
            { type: "Prescribing cascade detected", count: 3, pct: 9 },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{item.type}</span>
                <span style={{ fontSize: 12, color: "var(--text)" }}>{item.count}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "var(--surface2)" }}>
                <div style={{ height: "100%", borderRadius: 3, background: "var(--green)", width: `${item.pct}%`, transition: "width 0.8s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div style={{ padding: 32, maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 4 }}>CONFIGURATION</div>
        <h1 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          System Settings
        </h1>
      </div>

      {[
        {
          group: "NOTIFICATIONS", icon: Bell,
          items: [
            { label: "Drug interaction alerts", sub: "Real-time popup alerts", on: true },
            { label: "Low stock alerts", sub: "Notify when stock < 50 units", on: true },
            { label: "Expiry warnings", sub: "Alert 90 days before expiry", on: true },
          ]
        },
        {
          group: "SECURITY", icon: Shield,
          items: [
            { label: "Dual pharmacist verification", sub: "Require second pharmacist for high-risk drugs", on: false },
            { label: "Biometric login", sub: "Enable fingerprint authentication", on: false },
            { label: "Session timeout (15 min)", sub: "Auto-logout after inactivity", on: true },
          ]
        },
        {
          group: "AI ENGINE", icon: Activity,
          items: [
            { label: "AI drug interaction check", sub: "Claude-powered interaction analysis", on: true },
            { label: "AI prescribing cascade detection", sub: "Pattern recognition for cascades", on: true },
            { label: "AI counselling point generation", sub: "Auto-generate patient instructions", on: true },
          ]
        },
      ].map((section, si) => {
        const Icon = section.icon;
        return (
          <div key={si} className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
              <Icon size={14} color="var(--text-faint)" />
              <div className="section-label">{section.group}</div>
            </div>
            {section.items.map((item, ii) => (
              <div key={ii} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: ii < section.items.length - 1 ? "1px solid var(--border)" : "none"
              }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text)" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{item.sub}</div>
                </div>
                <div style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: item.on ? "var(--green)" : "var(--border2)",
                  position: "relative", cursor: "pointer", transition: "background 0.2s"
                }}>
                  <div style={{
                    position: "absolute", top: 3,
                    left: item.on ? 21 : 3,
                    width: 16, height: 16, borderRadius: "50%",
                    background: "white", transition: "left 0.2s"
                  }} />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
