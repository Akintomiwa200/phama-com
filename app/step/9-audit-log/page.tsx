"use client";

import { Shield, Clock, FileText } from "lucide-react";
import StepHeader from "@/components/ui/StepHeader";
import ProgressBar from "@/components/layout/ProgressBar";
import NavButton from "@/components/ui/NavButton";

const auditEntries = [
  { time: "09:15:22", action: "Pharmacist logged in", detail: "ID: PANS2024", type: "auth" },
  { time: "09:15:45", action: "Prescription received", detail: "Patient: Mrs. Folake E. | Drug: Amlodipine 10mg", type: "rx" },
  { time: "09:16:05", action: "Interaction detected", detail: "Amlodipine + Simvastatin: High risk", type: "alert" },
  { time: "09:16:45", action: "Prescriber updated prescription", detail: "Dose adjusted after consultation", type: "update" },
  { time: "09:17:30", action: "Cascade check", detail: "No cough confirmed by prescriber", type: "check" },
  { time: "09:19:15", action: "Scan failed", detail: "Wrong strength (5mg instead of 10mg)", type: "error" },
  { time: "09:19:30", action: "Scan success", detail: "Verified: Amlodipine 10mg", type: "success" },
  { time: "09:20:30", action: "Label generated", detail: "Auto-printed for Amlodipine 10mg", type: "print" },
  { time: "09:21:00", action: "Dispensing complete", detail: "All safety checks passed", type: "complete" },
];

const typeStyles: Record<string, string> = {
  auth: "border-l-blue-500 bg-blue-50/50",
  rx: "border-l-purple-500 bg-purple-50/50",
  alert: "border-l-red-500 bg-red-50/50",
  update: "border-l-amber-500 bg-amber-50/50",
  check: "border-l-indigo-500 bg-indigo-50/50",
  error: "border-l-red-600 bg-red-50/50",
  success: "border-l-green-500 bg-green-50/50",
  print: "border-l-teal-500 bg-teal-50/50",
  complete: "border-l-green-600 bg-green-50/50",
};

export default function AuditLogPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <ProgressBar currentStep={9} />
      <StepHeader
        stepNumber={9}
        title="AI Saves Everything to an Audit Log"
        subtitle="The AI saves every single action to an audit log that cannot be changed or deleted."
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-blue-600" size={24} />
          <h2 className="font-bold text-gray-900">Immutable Audit Log</h2>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
            <FileText size={14} className="text-green-400" />
            <span className="text-green-400 font-bold">AUDIT_LOG_SECURE.log</span>
            <span className="text-gray-500 ml-auto">READ-ONLY</span>
          </div>

          <div className="space-y-2">
            {auditEntries.map((entry, i) => (
              <div
                key={i}
                className={`flex gap-3 p-2 rounded border-l-4 ${typeStyles[entry.type] || "border-l-gray-400"}`}
              >
                <span className="text-gray-500 shrink-0 w-20">[{entry.time}]</span>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-800">{entry.action}</span>
                  <span className="text-gray-600 ml-2">- {entry.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <Clock size={14} />
          <span>All timestamps are server-synchronized and cryptographically signed.</span>
        </div>
      </div>

      <div className="flex justify-between">
        <NavButton href="/step/8-label" direction="prev" />
        <NavButton href="/step/10-complete" direction="next" label="Finish" />
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-1">What the AI is doing</h3>
        <p className="text-sm text-blue-700">
          Creating a permanent, tamper-proof record for hospital audits, regulatory compliance, and safety investigations. Every action is timestamped and traceable.
        </p>
      </div>
    </main>
  );
}
