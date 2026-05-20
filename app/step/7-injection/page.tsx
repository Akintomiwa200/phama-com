"use client";

import { useEffect, useState } from "react";
import { Syringe, CheckCircle, Loader2, Beaker, Droplets } from "lucide-react";
import StepHeader from "@/components/ui/StepHeader";
import ProgressBar from "@/components/layout/ProgressBar";
import NavButton from "@/components/ui/NavButton";

interface CheckItem {
  id: number;
  label: string;
  detail: string;
  icon: React.ReactNode;
  status: "pending" | "processing" | "complete";
}

export default function InjectionPage() {
  const [checks, setChecks] = useState<CheckItem[]>([
    {
      id: 1,
      label: "Scan drug vial",
      detail: "Artemether 20mg",
      icon: <Syringe size={18} />,
      status: "pending",
    },
    {
      id: 2,
      label: "Scan diluent (mixing liquid)",
      detail: "Sterile water",
      icon: <Beaker size={18} />,
      status: "pending",
    },
    {
      id: 3,
      label: "Check volume",
      detail: "Required: 1.5mL, Detected: 1.5mL",
      icon: <Droplets size={18} />,
      status: "pending",
    },
  ]);

  const [allComplete, setAllComplete] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current >= checks.length) {
        clearInterval(interval);
        setAllComplete(true);
        return;
      }
      setChecks((prev) =>
        prev.map((c, i) =>
          i === current
            ? { ...c, status: "processing" }
            : i < current
            ? { ...c, status: "complete" }
            : c
        )
      );
      setTimeout(() => {
        setChecks((prev) =>
          prev.map((c, i) =>
            i === current ? { ...c, status: "complete" } : c
          )
        );
        current++;
      }, 1200);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <ProgressBar currentStep={7} />
      <StepHeader
        stepNumber={7}
        title="AI Checks Preparation (For Injections)"
        subtitle="If this were an injection, the AI would also check the preparation process."
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Syringe className="text-blue-600" size={24} />
          <h2 className="font-bold text-gray-900">Injection Preparation Check</h2>
        </div>

        <div className="space-y-3">
          {checks.map((check) => (
            <div
              key={check.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                check.status === "complete"
                  ? "bg-green-50 border-green-200"
                  : check.status === "processing"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  check.status === "complete"
                    ? "bg-green-100 text-green-600"
                    : check.status === "processing"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {check.status === "complete" ? (
                  <CheckCircle size={20} />
                ) : check.status === "processing" ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  check.icon
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-900">{check.label}</p>
                <p className="text-sm text-gray-600">{check.detail}</p>
              </div>
              {check.status === "processing" && (
                <span className="text-xs font-medium text-blue-600 animate-pulse">
                  Checking...
                </span>
              )}
              {check.status === "complete" && (
                <span className="text-xs font-medium text-green-600">Verified</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {allComplete && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-green-50 rounded-xl border border-green-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-600" size={20} />
              <span className="font-bold text-green-800">All Checks Passed</span>
            </div>
            <p className="text-sm text-green-700">
              Drug vial verified. Diluent verified. Volume correct (1.5mL). Safe to prepare injection.
            </p>
          </div>

          <div className="flex justify-between">
            <NavButton href="/step/6-scan-success" direction="prev" />
            <NavButton href="/step/8-label" direction="next" label="Generate Label" />
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-1">What the AI is doing</h3>
        <p className="text-sm text-blue-700">
          Preventing errors in mixing injections by verifying the correct drug vial, diluent type, and required volume before preparation.
        </p>
      </div>
    </main>
  );
}
