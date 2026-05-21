"use client";
import { useApp } from "@/lib/store";
import { AppStep } from "@/lib/store";
import {
  LayoutDashboard, ListOrdered, User, AlertTriangle, GitBranch,
  ScanLine, FlaskConical, FileText, ClipboardList, CheckCircle2,
  Package, BarChart2, Settings, LogOut, Shield, ChevronLeft, ChevronRight
} from "lucide-react";

const NAV_ITEMS: { step: AppStep; label: string; icon: any; group?: string }[] = [
  { step: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "MAIN" },
  { step: "prescription-queue", label: "Rx Queue", icon: ListOrdered, group: "MAIN" },
  { step: "inventory", label: "Inventory", icon: Package, group: "MAIN" },
  { step: "patient-review", label: "Patient Review", icon: User, group: "WORKFLOW" },
  { step: "interaction-check", label: "Interactions", icon: AlertTriangle, group: "WORKFLOW" },
  { step: "cascade-check", label: "Cascade Check", icon: GitBranch, group: "WORKFLOW" },
  { step: "scan-verify", label: "Scan & Verify", icon: ScanLine, group: "WORKFLOW" },
  { step: "preparation", label: "Preparation", icon: FlaskConical, group: "WORKFLOW" },
  { step: "label-generate", label: "Label Print", icon: FileText, group: "WORKFLOW" },
  { step: "audit-log", label: "Audit Log", icon: ClipboardList, group: "RECORDS" },
  { step: "reports", label: "Reports", icon: BarChart2, group: "RECORDS" },
  { step: "settings", label: "Settings", icon: Settings, group: "SYSTEM" },
];

export default function Sidebar({
  collapsed: collapsedProp,
  onToggle,
  isMobile,
  onClose,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
} = {}) {
  const { state, dispatch } = useApp();

  const collapsed = collapsedProp !== undefined ? collapsedProp : !state.sidebarOpen;

  const toggle = onToggle || (() => dispatch({ type: "TOGGLE_SIDEBAR" }));

  const groups = ["MAIN", "WORKFLOW", "RECORDS", "SYSTEM"];

  function isActive(step: AppStep) {
    return state.step === step;
  }

  function isCompleted(step: AppStep) {
    const order: AppStep[] = [
      "patient-review", "interaction-check", "cascade-check",
      "scan-verify", "preparation", "label-generate", "audit-log"
    ];
    const currentIdx = order.indexOf(state.step);
    const stepIdx = order.indexOf(step);
    return stepIdx !== -1 && stepIdx < currentIdx;
  }

  return (
    <aside style={{
      width: !collapsed ? 220 : 64,
      minHeight: "100vh",
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s ease",
      position: "relative",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: !collapsed ? "20px 16px" : "20px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10,
        overflow: "hidden"
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg, var(--green) 0%, #00a855 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Shield size={16} color="#0a0f0d" />
        </div>
        {!collapsed && (
          <div>
            <div className="display-font" style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
              PharmaGuard
            </div>
            <div style={{ fontSize: 9, color: "var(--text-faint)", letterSpacing: "0.1em" }}>AI SYSTEM</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        {groups.map(group => {
          const items = NAV_ITEMS.filter(n => n.group === group);
          return (
            <div key={group} style={{ marginBottom: 4 }}>
              {!collapsed && (
                <div className="section-label" style={{ padding: "8px 16px 4px" }}>
                  {group}
                </div>
              )}
              {items.map(item => {
                const Icon = item.icon;
                const active = isActive(item.step);
                const done = isCompleted(item.step);
                return (
                  <button
                    key={item.step}
                    onClick={() => dispatch({ type: "SET_STEP", step: item.step })}
                    title={!!collapsed ? item.label : undefined}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      gap: 10, padding: !collapsed ? "9px 16px" : "9px 16px",
                      background: active ? "var(--green-glow)" : "none",
                      border: "none", borderLeft: active ? "2px solid var(--green)" : "2px solid transparent",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      color: active ? "var(--green)" : done ? "var(--text-dim)" : "var(--text-faint)",
                      overflow: "hidden",
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = done ? "var(--text-dim)" : "var(--text-faint)"; }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <Icon size={16} />
                      {done && (
                        <CheckCircle2 size={10} style={{
                          position: "absolute", bottom: -3, right: -3,
                          color: "var(--green)", background: "var(--surface)"
                        }} />
                      )}
                    </div>
                    {!collapsed && (
                      <span style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Pharmacist info */}
      {state.pharmacist && (
        <div style={{
          padding: !collapsed ? "12px 16px" : "12px 12px",
          borderTop: "1px solid var(--border)",
        }}>
          {!collapsed ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="status-dot green" />
                <span style={{ fontSize: 12, color: "var(--green)" }}>Active Session</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>
                {state.pharmacist.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{state.pharmacist.role}</div>
              <button
                className="btn-ghost"
                onClick={() => dispatch({ type: "LOGOUT" })}
                style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", fontSize: 12 }}
              >
                <LogOut size={12} /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => dispatch({ type: "LOGOUT" })}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "block", width: "100%", textAlign: "center" }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      )}

      {/* Toggle button */}
      {!isMobile && (
        <button
          onClick={toggle}
          style={{
            position: "absolute", right: -12, top: 72,
            width: 24, height: 24, borderRadius: "50%",
            background: "var(--surface2)", border: "1px solid var(--border2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-dim)", transition: "all 0.2s",
            zIndex: 10
          }}
        >
          {!collapsed ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      )}
    </aside>
  );
}
