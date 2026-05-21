"use client";
import { useApp } from "@/lib/store";
import DashboardHome from "@/components/Dashboard";
import PrescriptionQueue from "@/components/PrescriptionQueue";
import PatientPage from "@/components/PatientPage";
import InteractionCheck from "@/components/InteractionCheck";
import CascadeCheck from "@/components/CascadeCheck";
import ScanVerify from "@/components/ScanVerify";
import Preparation from "@/components/Preparation";
import LabelGenerate from "@/components/LabelGenerate";
import AuditLog from "@/components/AuditLog";
import {
  CompleteScreen,
  Inventory,
  Reports,
  SettingsPage,
} from "@/components/ExtraPages";

const styles = `
  .section-label {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-faint);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .display-font {
    font-family: var(--display);
  }

  .btn-primary {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background: var(--green);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-primary:hover { opacity: 0.9; }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-ghost {
    padding: 8px 16px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: transparent;
    color: var(--text-dim);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-ghost:hover { background: var(--surface2); }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .card-inner {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .input-field {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text);
    background: var(--surface);
    outline: none;
    transition: border-color 0.15s;
  }
  .input-field:focus { border-color: var(--green); }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }
  .status-dot.green { background: var(--green); }
  .status-dot.red { background: var(--red); }
  .status-dot.amber { background: var(--amber); }

  .glow-green {
    color: var(--green);
  }

  .grid-bg {
    background-image: radial-gradient(circle, rgba(5,150,105,0.06) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes rotate-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 0 0 rgba(5,150,105,0.3); }
    50% { box-shadow: 0 0 0 8px rgba(5,150,105,0); }
  }
  @keyframes pulse-red {
    0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.3); }
    50% { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
  }
  @keyframes slide-in-right {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .animate-slide-up { animation: slide-up 0.3s ease forwards; }
  .animate-fade { animation: fade 0.3s ease forwards; }
  .animate-pulse-green { animation: pulse-green 2s ease infinite; }
  .animate-pulse-red { animation: pulse-red 2s ease infinite; }
  .scan-effect { position: relative; overflow: hidden; }
  .scan-effect::after {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    animation: scan-line 2s ease-in-out infinite;
  }
  @keyframes scan-line {
    0% { left: -60%; }
    100% { left: 100%; }
  }
  .shimmer {
    background: linear-gradient(90deg, var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s ease infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

function DashboardContent() {
  const { state } = useApp();

  const renderStep = () => {
    switch (state.step) {
      case "dashboard":
        return <DashboardHome />;
      case "prescription-queue":
        return <PrescriptionQueue />;
      case "patient-review":
        return <PatientPage />;
      case "interaction-check":
        return <InteractionCheck />;
      case "cascade-check":
        return <CascadeCheck />;
      case "scan-verify":
        return <ScanVerify />;
      case "preparation":
        return <Preparation />;
      case "label-generate":
        return <LabelGenerate />;
      case "audit-log":
        return <AuditLog />;
      case "complete":
        return <CompleteScreen />;
      case "inventory":
        return <Inventory />;
      case "reports":
        return <Reports />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
    >

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >

        <div style={{ flex: 1, overflowY: "auto" }}>{renderStep()}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <style>{styles}</style>
      <DashboardContent />
    </>
  );
}
