"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { ClipboardList, Loader2 } from "lucide-react";

export default function WorkflowGuard({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  const router = useRouter();
  const patient = state.activePatient;
  const rx = state.activePrescription;

  useEffect(() => {
    if (!state.dbConnected) return;
    if (!patient || !rx) {
      router.replace("/dashboard/prescription-queue");
    }
  }, [state.dbConnected, patient, rx, router]);

  if (!state.dbConnected && !patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="animate-spin mb-3 text-emerald-600" size={28} />
        <p className="text-sm">Loading patient and prescription data…</p>
      </div>
    );
  }

  if (!patient || !rx) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-10 text-center max-w-lg mx-auto">
        <p className="text-amber-900 font-medium mb-2">No active dispensing session</p>
        <p className="text-sm text-amber-800 mb-4">
          Select a prescription from the queue to start the patient workflow.
        </p>
        <Link
          href="/dashboard/prescription-queue"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <ClipboardList size={16} />
          Go to Rx Queue
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
