"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import { User, Pill, ChevronRight, Wifi, WifiOff, ClipboardList } from "lucide-react";

const WORKFLOW_PATHS = [
  "/dashboard/prescription-queue",
  "/dashboard/patient-review",
  "/dashboard/interaction-check",
  "/dashboard/cascade-check",
  "/dashboard/scan-verify",
  "/dashboard/preparation",
  "/dashboard/label-generate",
  "/dashboard/audit-log",
  "/dashboard/complete",
];

export default function WorkflowBanner() {
  const { state } = useApp();
  const pathname = usePathname();

  if (!WORKFLOW_PATHS.some((p) => pathname?.startsWith(p))) {
    return null;
  }

  const patient = state.activePatient;
  const rx = state.activePrescription;

  return (
    <div className="mb-4 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              state.dbConnected
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {state.dbConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {state.dbConnected ? "Live sync" : "Connecting…"}
          </span>

          {patient ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-800">
              <User size={14} className="text-emerald-600 shrink-0" />
              <span className="font-medium truncate max-w-[180px]">{patient.name}</span>
              <span className="text-gray-400 text-xs">({patient.id})</span>
            </span>
          ) : (
            <span className="text-sm text-amber-700">No patient selected</span>
          )}

          {patient && rx && (
            <>
              <ChevronRight size={14} className="text-gray-300 hidden sm:block" />
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-800">
                <Pill size={14} className="text-emerald-600 shrink-0" />
                <span className="font-medium">
                  {rx.drug} {rx.strength}
                </span>
                <span className="text-gray-400 text-xs">{rx.rxId}</span>
              </span>
            </>
          )}
        </div>

        {!rx && (
          <Link
            href="/dashboard/prescription-queue"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <ClipboardList size={14} />
            Select prescription
          </Link>
        )}
      </div>
    </div>
  );
}
