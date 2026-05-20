"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, User, Pill, ClipboardList } from "lucide-react";
import StepHeader from "@/components/ui/StepHeader";
import ProgressBar from "@/components/layout/ProgressBar";
import NavButton from "@/components/ui/NavButton";

export default function PrescriptionPage() {
  const router = useRouter();
  const [patientId, setPatientId] = useState("");
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    if (patientId.trim() === "PT-72819" || patientId.trim() === "folake") {
      setLoaded(true);
    } else {
      alert("Try entering: PT-72819 or 'folake'");
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <ProgressBar currentStep={2} />
      <StepHeader
        stepNumber={2}
        title="Prescription Arrives"
        subtitle="The pharmacist enters the patient ID number. The AI reads the prescription and pulls the patient's medication history."
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="text-blue-600" size={24} />
          <h2 className="font-bold text-gray-900">Enter Patient ID</h2>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={patientId}
            onChange={(e) => {
              setPatientId(e.target.value);
              setLoaded(false);
            }}
            placeholder="Try: PT-72819"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            onKeyDown={(e) => e.key === "Enter" && handleLoad()}
          />
          <button
            onClick={handleLoad}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Load
          </button>
        </div>
      </div>

      {loaded && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              <User className="text-blue-600" size={20} />
              <h3 className="font-bold text-gray-900">Patient Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase">Name</p>
                <p className="font-bold text-gray-900">Mrs. Folake E.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase">Age</p>
                <p className="font-bold text-gray-900">72 years old</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <Pill className="text-green-600" size={20} />
              <h3 className="font-bold text-gray-900">Prescribed Drug</h3>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100 mb-6">
              <p className="font-bold text-green-800 text-lg">Amlodipine 10mg</p>
              <p className="text-sm text-green-700">Once daily</p>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <ClipboardList className="text-amber-600" size={20} />
              <h3 className="font-bold text-gray-900">Current Medications</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Metformin", "Simvastatin", "Lisinopril"].map((med) => (
                <span
                  key={med}
                  className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-100"
                >
                  {med}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <NavButton href="/step/3-interaction" direction="next" label="Check Interactions" />
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-1">What the AI is doing</h3>
        <p className="text-sm text-blue-700">
          Reading the prescription and pulling the patient's complete medication history from the database to prepare for safety checks.
        </p>
      </div>
    </main>
  );
}
