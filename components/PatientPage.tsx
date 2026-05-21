"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, User, Heart, Pill, AlertTriangle, Activity, ChevronRight,
  Calendar, MapPin, Droplets, Thermometer, Weight, Ruler, Syringe,
  Stethoscope, ClipboardList, Clock, ArrowLeft, Shield, Eye,
  FileText, BadgeAlert, FlaskConical, Bone,
} from "lucide-react";

import { useApp, useAudit } from "@/lib/store";
import { PATIENTS, type Patient } from "@/lib/database";

type Tab = "overview" | "medications" | "lab-reports" | "history";

const CONDITION_COLORS: Record<string, string> = {
  hypertension: "rose",
  diabetes: "amber",
  hyperlipidaemia: "blue",
  kidney: "purple",
  anaemia: "red",
  asthma: "sky",
  thyroid: "teal",
  allergy: "fuchsia",
  heart: "rose",
  dementia: "slate",
  fracture: "orange",
  infection: "lime",
  malaria: "emerald",
  pregnancy: "pink",
};

function getConditionColor(condition: string): string {
  const key = Object.keys(CONDITION_COLORS).find((k) =>
    condition.toLowerCase().includes(k)
  );
  if (!key) return "gray";
  const color = CONDITION_COLORS[key];
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    rose:    { bg: "bg-rose-50",  text: "text-rose-700",  dot: "bg-rose-500" },
    amber:   { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    blue:    { bg: "bg-blue-50",  text: "text-blue-700",  dot: "bg-blue-500" },
    purple:  { bg: "bg-purple-50",text: "text-purple-700",dot: "bg-purple-500" },
    red:     { bg: "bg-red-50",   text: "text-red-700",   dot: "bg-red-500" },
    sky:     { bg: "bg-sky-50",   text: "text-sky-700",   dot: "bg-sky-500" },
    teal:    { bg: "bg-teal-50",  text: "text-teal-700",  dot: "bg-teal-500" },
    fuchsia: { bg: "bg-fuchsia-50",text: "text-fuchsia-700",dot: "bg-fuchsia-500" },
    slate:   { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-500" },
    orange:  { bg: "bg-orange-50",text: "text-orange-700",dot: "bg-orange-500" },
    lime:    { bg: "bg-lime-50",  text: "text-lime-700",  dot: "bg-lime-500" },
    emerald: { bg: "bg-emerald-50",text: "text-emerald-700",dot: "bg-emerald-500" },
    pink:    { bg: "bg-pink-50",  text: "text-pink-700",  dot: "bg-pink-500" },
  };
  return `${map[color]?.bg || "bg-gray-50"} ${map[color]?.text || "text-gray-700"}`;
}

function getConditionDot(condition: string): string {
  const key = Object.keys(CONDITION_COLORS).find((k) =>
    condition.toLowerCase().includes(k)
  );
  if (!key) return "bg-gray-400";
  const map: Record<string, string> = {
    rose: "bg-rose-500", amber: "bg-amber-500", blue: "bg-blue-500",
    purple: "bg-purple-500", red: "bg-red-500", sky: "bg-sky-500",
    teal: "bg-teal-500", fuchsia: "bg-fuchsia-500", slate: "bg-slate-500",
    orange: "bg-orange-500", lime: "bg-lime-500", emerald: "bg-emerald-500",
    pink: "bg-pink-500",
  };
  return map[key] || "bg-gray-400";
}

function getSeverityColor(status: string) {
  switch (status) {
    case "critical": return "text-red-600 bg-red-50 border-red-200";
    case "abnormal": return "text-amber-600 bg-amber-50 border-amber-200";
    default: return "text-emerald-600 bg-emerald-50 border-emerald-200";
  }
}

function getAllergyColor(allergy: string) {
  const severeAllergens = ["Penicillin", "Morphine", "Aspirin"];
  if (severeAllergens.some((a) => allergy.toLowerCase().includes(a.toLowerCase())))
    return "text-red-600 bg-red-50 border-red-200";
  return "text-amber-600 bg-amber-50 border-amber-200";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAgeGroup(age: number): string {
  if (age >= 65) return "Elderly";
  if (age >= 40) return "Adult";
  if (age >= 18) return "Young Adult";
  return "Minor";
}

function VitalsGauge({ label, value, unit, icon: Icon, color, normalRange }: {
  label: string; value: string | number; unit: string; icon: any; color: string; normalRange: string;
}) {
  const val = typeof value === "string" ? parseInt(value.split("/")[0]) : value;
  const isAbnormal = label === "BP" ? (value as string).split("/")[0] > "140" || (value as string).split("/")[1] > "90"
    : label === "HR" ? (val < 60 || val > 100)
    : label === "Temp" ? (val < 36 || val > 37.5)
    : label === "SpO2" ? val < 95
    : false;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400 mb-2">
        <Icon size={13} />
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-bold ${isAbnormal ? "text-amber-600" : "text-gray-900"}`}>
          {value}
        </span>
        <span className="text-[11px] text-gray-400">{unit}</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <div className={`h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden`}>
          <div
            className={`h-full rounded-full transition-all ${isAbnormal ? "bg-amber-400" : "bg-emerald-400"}`}
            style={{ width: `${Math.min(100, (val / 200) * 100)}%` }}
          />
        </div>
        {isAbnormal && <AlertTriangle size={10} className="text-amber-500 shrink-0" />}
      </div>
      <div className="mt-1 text-[9px] text-gray-400">{normalRange}</div>
    </div>
  );
}

function PatientCard({ patient, onSelect }: { patient: Patient; onSelect: (p: Patient) => void }) {
  const initials = getInitials(patient.name);
  const ageGroup = getAgeGroup(patient.age);
  const hasAllergies = patient.allergies.length > 0;
  const urgentConditions = patient.conditions.filter((c) =>
    c.toLowerCase().includes("critical") || c.toLowerCase().includes("failure") || c.toLowerCase().includes("severe")
  );

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(patient)}
      className="group relative w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
    >
      {hasAllergies && (
        <div className="absolute right-3 top-3 rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-semibold text-red-600 border border-red-200">
          ALLERGIES
        </div>
      )}
      {urgentConditions.length > 0 && (
        <div className="absolute right-3 top-10 mt-1">
          <BadgeAlert size={14} className="text-red-400" />
        </div>
      )}

      <div className="flex items-center gap-3.5">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-sm text-white ${
          hasAllergies ? "bg-gradient-to-br from-rose-400 to-rose-600" : "bg-gradient-to-br from-emerald-400 to-emerald-600"
        }`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-gray-900">{patient.name}</span>
            <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
              {patient.id}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
            <span>{patient.age} yrs · {patient.gender === "F" ? "Female" : "Male"}</span>
            <span className="flex items-center gap-1">
              <MapPin size={10} /> {patient.ward}
            </span>
          </div>
        </div>
        <ChevronRight size={16} className="shrink-0 text-gray-300 group-hover:text-emerald-500 transition-colors" />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {patient.conditions.slice(0, 3).map((c, i) => (
          <span key={i} className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${getConditionColor(c)}`}>
            {c.length > 28 ? c.slice(0, 26) + "..." : c}
          </span>
        ))}
        {patient.conditions.length > 3 && (
          <span className="rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-400">
            +{patient.conditions.length - 3}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3 text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <Pill size={10} /> {patient.currentMedications.length} meds
        </span>
        <span className="flex items-center gap-1">
          <Activity size={10} /> {patient.recentVitals.bp}
        </span>
        <span className="flex items-center gap-1">
          {ageGroup}
        </span>
      </div>
    </motion.button>
  );
}

export default function PatientPage() {
  const { state, dispatch } = useApp();
  const addAudit = useAudit();
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [filterWard, setFilterWard] = useState<string>("ALL");

  const allPatients = useMemo(() => Object.values(PATIENTS), []);

  const wards = useMemo(() => {
    const w = new Set(allPatients.map((p) => p.ward));
    return Array.from(w).sort();
  }, [allPatients]);

  const filtered = useMemo(() => {
    let result = allPatients;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.conditions.some((c) => c.toLowerCase().includes(q)) ||
          p.allergies.some((a) => a.toLowerCase().includes(q)) ||
          p.currentMedications.some((m) => m.drug.toLowerCase().includes(q))
      );
    }
    if (filterWard !== "ALL") {
      result = result.filter((p) => p.ward === filterWard);
    }
    return result;
  }, [allPatients, search, filterWard]);

  const handleSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    dispatch({ type: "SET_PATIENT", patient });
    addAudit("PATIENT_VIEWED", `Comprehensive patient profile viewed: ${patient.name}`, "info");
  };

  const handleBack = () => {
    setSelectedPatient(null);
  };

  const handleProceed = () => {
    if (!selectedPatient) return;
    dispatch({ type: "SET_STEP", step: "interaction-check" });
  };

  if (selectedPatient) {
    const p = selectedPatient;
    const initials = getInitials(p.name);

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Patient Profile</span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">{p.id}</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mt-0.5">{p.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              <ArrowLeft size={13} /> Back to list
            </button>
            <button
              onClick={handleProceed}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700 transition"
            >
              Proceed to Interaction Check <ChevronRight size={13} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Patient Identity + Vitals */}
          <div className="xl:col-span-1 space-y-5">
            {/* Identity Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-xl font-bold text-white shadow-sm">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-bold text-gray-900">{p.name}</div>
                  <div className="mt-0.5 text-sm text-gray-500">
                    {p.age} years · {p.gender === "F" ? "Female" : "Male"} · {p.bloodType}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={11} /> {p.ward} · Bed {p.bed}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: User, label: "Patient ID", value: p.id },
                  { icon: Ruler, label: "Height", value: `${p.height} cm` },
                  { icon: Droplets, label: "Blood Type", value: p.bloodType },
                  { icon: Weight, label: "Weight", value: `${p.recentVitals.weight} kg` },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="rounded-xl bg-gray-50 p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400 mb-1">
                        <Icon size={11} /> {item.label}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vitals */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={14} className="text-emerald-500" />
                <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Recent Vitals</span>
                <span className="ml-auto text-[10px] text-gray-400">{p.recentVitals.date}</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <VitalsGauge label="BP" value={p.recentVitals.bp} unit="mmHg" icon={Heart} color="rose" normalRange="120/80" />
                <VitalsGauge label="HR" value={p.recentVitals.hr} unit="bpm" icon={Activity} color="emerald" normalRange="60-100" />
                <VitalsGauge label="Temp" value={p.recentVitals.temp} unit="°C" icon={Thermometer} color="amber" normalRange="36-37.5" />
                <VitalsGauge label="SpO2" value={p.recentVitals.spo2} unit="%" icon={Droplets} color="blue" normalRange="95-100" />
              </div>
            </div>

            {/* Allergies */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={14} className="text-red-500" />
                <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Allergies</span>
                <span className="ml-auto text-[10px] text-gray-400">{p.allergies.length} known</span>
              </div>
              {p.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {p.allergies.map((a, i) => (
                    <span key={i} className={`rounded-lg border px-3 py-1 text-xs font-semibold ${getAllergyColor(a)}`}>
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-600">
                  No known allergies ✓
                </div>
              )}
            </div>

            {/* Conditions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope size={14} className="text-gray-500" />
                <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Conditions</span>
                <span className="ml-auto text-[10px] text-gray-400">{p.conditions.length} diagnosed</span>
              </div>
              <div className="space-y-2">
                {p.conditions.map((c, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${getConditionDot(c)}`} />
                    <span className="text-sm text-gray-700">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Tabs content */}
          <div className="xl:col-span-2 space-y-5">
            {/* Tabs */}
            <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
              {[
                { id: "overview" as Tab, label: "Overview", icon: Eye },
                { id: "medications" as Tab, label: "Medications", icon: Pill },
                { id: "lab-reports" as Tab, label: "Lab Reports", icon: FlaskConical },
                { id: "history" as Tab, label: "Medical History", icon: ClipboardList },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition ${
                      isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon size={13} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-5">
                    {/* Current Medications Summary */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Pill size={14} className="text-blue-500" />
                          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Current Medications</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{p.currentMedications.length} active</span>
                      </div>
                      <div className="space-y-2.5">
                        {p.currentMedications.slice(0, 4).map((med, i) => (
                          <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                              <Pill size={13} className="text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-gray-900">{med.drug} {med.dose}</div>
                              <div className="mt-0.5 text-xs text-gray-500">{med.frequency} · {med.route}</div>
                            </div>
                            <span className="shrink-0 text-[10px] text-gray-400">Since {med.since}</span>
                          </div>
                        ))}
                        {p.currentMedications.length > 4 && (
                          <button
                            onClick={() => setActiveTab("medications")}
                            className="w-full rounded-xl border border-dashed border-gray-200 py-2.5 text-xs font-medium text-gray-500 hover:border-gray-300 transition"
                          >
                            View all {p.currentMedications.length} medications
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Recent Lab Reports Summary */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FlaskConical size={14} className="text-purple-500" />
                          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Recent Lab Results</span>
                        </div>
                        <button
                          onClick={() => setActiveTab("lab-reports")}
                          className="text-[10px] font-medium text-emerald-600 hover:text-emerald-700"
                        >
                          View all →
                        </button>
                      </div>
                      <div className="space-y-2">
                        {p.labReports.slice(0, 3).map((lab, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 px-3.5 py-2.5">
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900">{lab.test}</div>
                              <div className="text-xs text-gray-500">{lab.date}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">{lab.result}</div>
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getSeverityColor(lab.status)}`}>
                                {lab.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Medical History Summary */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <ClipboardList size={14} className="text-gray-500" />
                          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Recent History</span>
                        </div>
                        <button
                          onClick={() => setActiveTab("history")}
                          className="text-[10px] font-medium text-emerald-600 hover:text-emerald-700"
                        >
                          View all →
                        </button>
                      </div>
                      <div className="space-y-2">
                        {p.medicalHistory.slice(0, 2).map((rec, i) => {
                          const typeColors: Record<string, string> = {
                            admission: "text-red-600 bg-red-50 border-red-200",
                            surgery: "text-purple-600 bg-purple-50 border-purple-200",
                            diagnosis: "text-blue-600 bg-blue-50 border-blue-200",
                            visit: "text-gray-600 bg-gray-50 border-gray-200",
                            vaccination: "text-emerald-600 bg-emerald-50 border-emerald-200",
                          };
                          return (
                            <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 px-3.5 py-3">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                <Calendar size={12} className="text-gray-500" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">{rec.event}</span>
                                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${typeColors[rec.type] || "text-gray-600 bg-gray-50 border-gray-200"}`}>
                                    {rec.type.toUpperCase()}
                                  </span>
                                </div>
                                <div className="mt-0.5 text-xs text-gray-500">{rec.details}</div>
                                <div className="mt-0.5 text-[10px] text-gray-400">{rec.date}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* MEDICATIONS TAB */}
                {activeTab === "medications" && (
                  <div className="space-y-5">
                    {/* Current Medications */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Pill size={14} className="text-blue-500" />
                        <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                          Current Medications ({p.currentMedications.length})
                        </span>
                      </div>
                      <div className="overflow-hidden rounded-xl border border-gray-100">
                        <div className="grid grid-cols-6 gap-3 bg-gray-50 px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                          <span className="col-span-2">Drug</span>
                          <span>Dose</span>
                          <span>Frequency</span>
                          <span>Route</span>
                          <span>Since</span>
                        </div>
                        {p.currentMedications.map((med, i) => (
                          <div key={i} className={`grid grid-cols-6 gap-3 px-4 py-3 text-sm ${
                            i < p.currentMedications.length - 1 ? "border-b border-gray-50" : ""
                          }`}>
                            <span className="col-span-2 font-medium text-gray-900">{med.drug}</span>
                            <span className="text-gray-700">{med.dose}</span>
                            <span className="text-gray-600">{med.frequency}</span>
                            <span className="text-gray-600">{med.route}</span>
                            <span className="text-gray-400">{med.since}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Medication History */}
                    {p.prescriptionHistory.length > 0 && (
                      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <Clock size={14} className="text-gray-500" />
                          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                            Prescription History ({p.prescriptionHistory.length})
                          </span>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-gray-100">
                          <div className="grid grid-cols-7 gap-3 bg-gray-50 px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            <span className="col-span-2">Drug</span>
                            <span>Dose</span>
                            <span>Frequency</span>
                            <span>Duration</span>
                            <span>Status</span>
                            <span>Date</span>
                          </div>
                          {p.prescriptionHistory.map((rx, i) => (
                            <div key={i} className={`grid grid-cols-7 gap-3 px-4 py-3 text-sm ${
                              i < p.prescriptionHistory.length - 1 ? "border-b border-gray-50" : ""
                            }`}>
                              <span className="col-span-2 font-medium text-gray-900">{rx.drug}</span>
                              <span className="text-gray-700">{rx.dose}</span>
                              <span className="text-gray-600 text-xs">{rx.frequency}</span>
                              <span className="text-gray-600 text-xs">{rx.duration}</span>
                              <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded self-start ${
                                rx.status === "active" ? "bg-emerald-50 text-emerald-600" :
                                rx.status === "completed" ? "bg-blue-50 text-blue-600" :
                                "bg-gray-50 text-gray-500"
                              }`}>
                                {rx.status}
                              </span>
                              <span className="text-gray-400 text-xs">{rx.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* LAB REPORTS TAB */}
                {activeTab === "lab-reports" && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <FlaskConical size={14} className="text-purple-500" />
                      <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                        Laboratory Reports ({p.labReports.length})
                      </span>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-100">
                      <div className="grid grid-cols-5 gap-3 bg-gray-50 px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        <span className="col-span-2">Test</span>
                        <span>Result</span>
                        <span>Reference</span>
                        <span>Status</span>
                      </div>
                      {p.labReports.map((lab, i) => (
                        <div key={i} className={`grid grid-cols-5 gap-3 px-4 py-3 text-sm ${
                          i < p.labReports.length - 1 ? "border-b border-gray-50" : ""
                        }`}>
                          <div className="col-span-2">
                            <div className="font-medium text-gray-900">{lab.test}</div>
                            <div className="text-[10px] text-gray-400">{lab.date}</div>
                          </div>
                          <span className="font-semibold text-gray-900 self-center">{lab.result}</span>
                          <span className="text-xs text-gray-500 self-center">{lab.referenceRange}</span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded border self-center text-center ${getSeverityColor(lab.status)}`}>
                            {lab.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MEDICAL HISTORY TAB */}
                {activeTab === "history" && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                      <ClipboardList size={14} className="text-gray-500" />
                      <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                        Medical History ({p.medicalHistory.length} records)
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />
                      <div className="space-y-6">
                        {p.medicalHistory.map((rec, i) => {
                          const typeColors: Record<string, string> = {
                            admission: "text-red-600 bg-red-50 border-red-200",
                            surgery: "text-purple-600 bg-purple-50 border-purple-200",
                            diagnosis: "text-blue-600 bg-blue-50 border-blue-200",
                            visit: "text-gray-600 bg-gray-50 border-gray-200",
                            vaccination: "text-emerald-600 bg-emerald-50 border-emerald-200",
                          };
                          const typeIcons: Record<string, any> = {
                            admission: Bone,
                            surgery: Syringe,
                            diagnosis: Stethoscope,
                            visit: User,
                            vaccination: Shield,
                          };
                          const Icon = typeIcons[rec.type] || Calendar;
                          return (
                            <div key={i} className="relative pl-10">
                              <div className={`absolute left-2.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white ${
                                rec.type === "admission" ? "bg-red-500" :
                                rec.type === "surgery" ? "bg-purple-500" :
                                rec.type === "diagnosis" ? "bg-blue-500" :
                                "bg-gray-400"
                              }`} />
                              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <Icon size={13} className={
                                    rec.type === "admission" ? "text-red-500" :
                                    rec.type === "surgery" ? "text-purple-500" :
                                    rec.type === "diagnosis" ? "text-blue-500" :
                                    "text-gray-500"
                                  } />
                                  <span className="text-sm font-semibold text-gray-900">{rec.event}</span>
                                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ml-auto ${typeColors[rec.type] || "text-gray-600 bg-gray-50 border-gray-200"}`}>
                                    {rec.type.toUpperCase()}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-gray-600 leading-relaxed">{rec.details}</p>
                                <div className="mt-1.5 text-[10px] text-gray-400">{rec.date}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Step 3</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-0.5">Patient Review</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search and review comprehensive patient profiles before dispensing
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by name, ID, condition, allergy, or medication..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
          <select
            value={filterWard}
            onChange={(e) => setFilterWard(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="ALL">All Wards</option>
            {wards.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="font-medium text-gray-500">{filtered.length} patients</span>
          {search && <span>· matching &ldquo;{search}&rdquo;</span>}
          {filterWard !== "ALL" && <span>· in {filterWard}</span>}
        </div>
      </div>

      {/* Patient Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20">
          <Search size={36} className="text-gray-200 mb-4" />
          <div className="text-sm font-medium text-gray-500">No patients found</div>
          <div className="mt-1 text-xs text-gray-400">Try adjusting your search or filter</div>
        </div>
      )}
    </div>
  );
}
