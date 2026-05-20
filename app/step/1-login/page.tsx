"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, LogIn, Loader2 } from "lucide-react";
import StepHeader from "@/components/ui/StepHeader";
import ProgressBar from "@/components/layout/ProgressBar";
import StatusBadge from "@/components/ui/StatusBadge";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "error">("idle");
  const [pharmacistName, setPharmacistName] = useState("");

  const handleLogin = () => {
    if (!id.trim()) return;
    setStatus("checking");

    setTimeout(() => {
      if (id.trim() === "PANS2024") {
        setStatus("success");
        setPharmacistName("Dr. Adaobi Nnamdi");
        setTimeout(() => {
          router.push("/step/2-prescription");
        }, 1500);
      } else {
        setStatus("error");
      }
    }, 1200);
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <ProgressBar currentStep={1} />
      <StepHeader
        stepNumber={1}
        title="Pharmacist Login"
        subtitle="The pharmacist starts by logging into the system with their unique ID. The AI checks if this person is authorized to dispense medication."
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-blue-600" size={24} />
          <h2 className="font-bold text-gray-900">Identity Verification</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pharmacist ID
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setStatus("idle");
              }}
              placeholder="Enter ID (try PANS2024)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={status === "checking" || !id.trim()}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "checking" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Log In
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 min-h-[80px]">
        {status === "success" && (
          <div className="space-y-3">
            <StatusBadge status="success" text={`Authorized. Welcome, ${pharmacistName}.`} />
            <p className="text-sm text-gray-500">Redirecting to prescription...</p>
          </div>
        )}
        {status === "error" && (
          <StatusBadge status="error" text="Access Denied. Invalid pharmacist ID or not authorized." />
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-1">What the AI is doing</h3>
        <p className="text-sm text-blue-700">
          Verifying identity against the pharmacist database to protect patient confidentiality and ensure only licensed professionals can access sensitive data.
        </p>
      </div>
    </main>
  );
}
