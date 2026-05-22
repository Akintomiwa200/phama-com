"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, User, Heart, Pill, AlertTriangle, Activity, ChevronRight,
  Calendar, MapPin, Droplets, Thermometer, Weight, Ruler, Syringe,
  Stethoscope, ClipboardList, Clock, ArrowLeft, Shield, Eye,
  FileText, BadgeAlert, FlaskConical, Bone, Plus, Edit, Trash2,
  Save, X, Filter, RefreshCw, Download, Printer, Bell, MessageSquare,
  Phone, Mail, Video, Camera, Upload, Link, Star, Award, TrendingUp,
  Users, BarChart3, PieChart, LineChart, Settings, HelpCircle, LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp, useAudit } from "@/lib/store";
import { toast } from "react-hot-toast";
import type { Patient as StorePatient } from "@/types";

// Enriched types for display
interface Vitals {
  bp: string;
  hr: number;
  temp: number;
  spo2: number;
  weight: number;
  height: number;
  bmi: number;
  date: string;
}

interface Medication {
  id: string;
  drug: string;
  dose: string;
  frequency: string;
  route: string;
  since: string;
  endDate?: string;
  prescribedBy: string;
  instructions?: string;
}

interface LabReport {
  id: string;
  test: string;
  result: string;
  referenceRange: string;
  status: "normal" | "abnormal" | "critical";
  date: string;
  orderedBy: string;
  notes?: string;
}

interface MedicalRecord {
  id: string;
  event: string;
  details: string;
  date: string;
  type: "admission" | "surgery" | "diagnosis" | "visit" | "vaccination" | "procedure";
  provider: string;
  location?: string;
}

interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe";
  diagnosedDate: string;
  notes?: string;
}

interface Condition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: "active" | "resolved" | "chronic";
  notes?: string;
}

interface EnrichedPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  height: number;
  ward: string;
  bed: string;
  phone?: string;
  email?: string;
  emergencyContact?: { name: string; phone: string; relation: string };
  conditions: Condition[];
  allergies: Allergy[];
  currentMedications: Medication[];
  prescriptionHistory: Medication[];
  labReports: LabReport[];
  medicalHistory: MedicalRecord[];
  recentVitals: Vitals;
  vitalHistory: Vitals[];
  nextAppointment?: string;
  primaryPhysician?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  createdAt?: string;
  lastUpdated?: string;
}

let condId = 0;
let allergId = 0;
let medId = 0;
let labId = 0;
let recId = 0;

function enrichPatient(p: StorePatient): EnrichedPatient {
  const bmi = p.recentVitals.weight && p.height
    ? Number((p.recentVitals.weight / ((p.height / 100) * (p.height / 100))).toFixed(1))
    : 0;

  return {
    id: p.id,
    name: p.name,
    age: p.age,
    gender: p.gender,
    bloodType: p.bloodType,
    height: p.height,
    ward: p.ward,
    bed: p.bed,
    conditions: (p.conditions ?? []).map(c => ({ id: `c${++condId}`, name: c, diagnosedDate: "", status: "active" as const })),
    allergies: (p.allergies ?? []).map(a => ({ id: `a${++allergId}`, allergen: a, reaction: "Unknown", severity: "moderate" as const, diagnosedDate: "" })),
    currentMedications: (p.currentMedications ?? []).map(m => ({ id: `m${++medId}`, ...m, prescribedBy: "Unknown", endDate: undefined, instructions: undefined })),
    prescriptionHistory: (p.prescriptionHistory ?? []).map(m => ({ id: `ph${++medId}`, drug: m.drug, dose: m.dose, frequency: m.frequency, route: "Oral", since: m.date, prescribedBy: m.prescriber || "Unknown", endDate: undefined, instructions: undefined })),
    labReports: (p.labReports ?? []).map(l => ({ id: `l${++labId}`, test: l.test, result: l.result, referenceRange: l.referenceRange, status: l.status, date: l.date, orderedBy: "Unknown", notes: undefined })),
    medicalHistory: (p.medicalHistory ?? []).map(h => ({ id: `h${++recId}`, event: h.event, details: h.details, date: h.date, type: h.type as MedicalRecord["type"], provider: "Unknown", location: undefined })),
    recentVitals: { ...p.recentVitals, height: p.height, bmi },
    vitalHistory: [],
  };
}

// Helper functions
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "severe": return "text-red-600 bg-red-50 border-red-200";
    case "moderate": return "text-amber-600 bg-amber-50 border-amber-200";
    default: return "text-emerald-600 bg-emerald-50 border-emerald-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "critical": return "text-red-600 bg-red-50 border-red-200";
    case "abnormal": return "text-amber-600 bg-amber-50 border-amber-200";
    default: return "text-emerald-600 bg-emerald-50 border-emerald-200";
  }
};

const getInitials = (name: string) => {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
};

const VitalsCard = ({ vitals }: { vitals: Vitals }) => {
  const isAbnormal = (label: string, value: any) => {
    if (label === "BP") {
      const [sys, dia] = value.split("/").map(Number);
      return sys > 140 || dia > 90;
    }
    if (label === "HR") return value < 60 || value > 100;
    if (label === "Temp") return value < 36 || value > 37.5;
    if (label === "SpO2") return value < 95;
    return false;
  };

  const vitalsData = [
    { label: "BP", value: vitals.bp, unit: "mmHg", icon: Heart, normalRange: "120/80" },
    { label: "HR", value: vitals.hr, unit: "bpm", icon: Activity, normalRange: "60-100" },
    { label: "Temp", value: vitals.temp, unit: "°C", icon: Thermometer, normalRange: "36-37.5" },
    { label: "SpO2", value: vitals.spo2, unit: "%", icon: Droplets, normalRange: "95-100" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {vitalsData.map((item) => {
        const Icon = item.icon;
        const abnormal = isAbnormal(item.label, item.value);
        return (
          <div key={item.label} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400 mb-2">
              <Icon size={13} /> {item.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-bold ${abnormal ? "text-amber-600" : "text-gray-900"}`}>
                {item.value}
              </span>
              <span className="text-[11px] text-gray-400">{item.unit}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${abnormal ? "bg-amber-400" : "bg-emerald-400"}`}
                  style={{ width: `${Math.min(100, (typeof item.value === "number" ? item.value / 200 : 70) * 100)}%` }} />
              </div>
              {abnormal && <AlertTriangle size={10} className="text-amber-500 shrink-0" />}
            </div>
            <div className="mt-1 text-[9px] text-gray-400">{item.normalRange}</div>
          </div>
        );
      })}
    </div>
  );
};

export default function PatientPage() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const addAudit = useAudit();

  const patients = useMemo(() => Object.values(state.patients).map(enrichPatient), [state.patients]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<EnrichedPatient | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "medications" | "labs" | "history">("overview");
  const [filterWard, setFilterWard] = useState<string>("ALL");

  const handleSelectPatient = (patient: EnrichedPatient) => {
    setSelectedPatient(patient);
    const storePatient = state.patients[patient.id];
    if (storePatient) {
      dispatch({ type: "SET_PATIENT", patient: storePatient });
    }
    addAudit("PATIENT_VIEWED", `Viewed patient profile: ${patient.name}`, "info");
  };

  const handleBack = () => {
    setSelectedPatient(null);
  };

  const handleProceed = () => {
    if (!selectedPatient) return;
    if (!state.activePrescription) {
      toast.error("Select a prescription from the Rx Queue first");
      router.push("/dashboard/prescription-queue");
      return;
    }
    router.push("/dashboard/interaction-check");
  };

  useEffect(() => {
    if (state.activePatient) {
      setSelectedPatient(enrichPatient(state.activePatient));
    }
  }, [state.activePatient?.id]);

  useEffect(() => {
    if (selectedPatient && state.patients[selectedPatient.id]) {
      setSelectedPatient(enrichPatient(state.patients[selectedPatient.id]));
    }
  }, [state.patients, selectedPatient?.id]);

  const wards = useMemo(() => {
    const w = new Set(patients.map(p => p.ward));
    return Array.from(w).sort();
  }, [patients]);

  const filteredPatients = useMemo(() => {
    let result = patients;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.conditions.some(c => c.name.toLowerCase().includes(q)) ||
        p.allergies.some(a => a.allergen.toLowerCase().includes(q))
      );
    }
    if (filterWard !== "ALL") {
      result = result.filter(p => p.ward === filterWard);
    }
    return result;
  }, [patients, search, filterWard]);

  if (selectedPatient) {
    const p = selectedPatient;
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Patient Profile</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">{p.id}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">{p.name}</h1>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {state.activePrescription && (
                <p className="text-xs text-gray-500">
                  Active Rx:{" "}
                  <span className="font-semibold text-emerald-700">
                    {state.activePrescription.drug} {state.activePrescription.strength}
                  </span>{" "}
                  ({state.activePrescription.rxId})
                </p>
              )}
              <button
                onClick={handleProceed}
                disabled={!state.activePrescription}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Interaction Check <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Patient Info */}
            <div className="space-y-5">
              {/* Identity Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                    {getInitials(p.name)}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.age} years · {p.gender === "M" ? "Male" : p.gender === "F" ? "Female" : "Other"} · {p.bloodType}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <MapPin size={11} /> {p.ward} · Bed {p.bed}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vitals */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Recent Vitals</span>
                  <span className="ml-auto text-[10px] text-gray-400">{p.recentVitals.date}</span>
                </div>
                <VitalsCard vitals={p.recentVitals} />
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">BMI</span>
                    <span className="font-medium text-gray-900">{p.recentVitals.bmi}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Weight</span>
                    <span className="font-medium text-gray-900">{p.recentVitals.weight} kg</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Height</span>
                    <span className="font-medium text-gray-900">{p.recentVitals.height} cm</span>
                  </div>
                </div>
              </div>

              {/* Allergies */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={14} className="text-red-500" />
                  <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Allergies</span>
                </div>
                {p.allergies.length > 0 ? (
                  <div className="space-y-2">
                    {p.allergies.map(a => (
                      <div key={a.id} className={`rounded-lg border p-3 ${getSeverityColor(a.severity)}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{a.allergen}</div>
                            <div className="text-xs mt-0.5">Reaction: {a.reaction}</div>
                          </div>
                          <span className="text-xs font-medium uppercase">{a.severity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-emerald-50 rounded-xl px-4 py-3 text-center text-sm font-medium text-emerald-600">
                    No known allergies ✓
                  </div>
                )}
              </div>

              {/* Conditions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope size={14} className="text-gray-500" />
                  <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Conditions</span>
                </div>
                <div className="space-y-2">
                  {p.conditions.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-900">{c.name}</div>
                        {c.diagnosedDate && <div className="text-xs text-gray-500">Diagnosed: {c.diagnosedDate}</div>}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Tabs */}
            <div className="lg:col-span-2 space-y-5">
              {/* Tabs */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1 flex gap-1">
                {[
                  { id: "overview" as const, label: "Overview", icon: Eye },
                  { id: "medications" as const, label: "Medications", icon: Pill },
                  { id: "labs" as const, label: "Lab Reports", icon: FlaskConical },
                  { id: "history" as const, label: "History", icon: ClipboardList },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                >
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Medications</h3>
                        <div className="space-y-2">
                          {p.currentMedications.slice(0, 3).map(med => (
                            <div key={med.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Pill size={14} className="text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{med.drug} {med.dose}</div>
                                <div className="text-xs text-gray-500">{med.frequency} · {med.route}</div>
                              </div>
                              <span className="text-xs text-gray-400">Since {med.since}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Lab Results</h3>
                        <div className="space-y-2">
                          {p.labReports.slice(0, 2).map(lab => (
                            <div key={lab.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                              <div>
                                <div className="font-medium text-gray-900">{lab.test}</div>
                                <div className="text-xs text-gray-500">{lab.date}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{lab.result}</div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(lab.status)}`}>
                                  {lab.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Medical History</h3>
                        <div className="space-y-2">
                          {p.medicalHistory.slice(0, 2).map(rec => (
                            <div key={rec.id} className="p-3 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar size={12} className="text-gray-400" />
                                <span className="font-medium text-gray-900">{rec.event}</span>
                                <span className="text-xs text-gray-400 ml-auto">{rec.date}</span>
                              </div>
                              <p className="text-sm text-gray-600">{rec.details}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Medications Tab */}
                  {activeTab === "medications" && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Current Medications ({p.currentMedications.length})</h3>
                      </div>
                      <div className="overflow-hidden rounded-xl border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-100">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Drug</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Dose</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Frequency</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Route</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Since</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {p.currentMedications.map(med => (
                              <tr key={med.id} className="hover:bg-gray-50/50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{med.drug}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{med.dose}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{med.frequency}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{med.route}</td>
                                <td className="px-4 py-3 text-sm text-gray-400">{med.since}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Lab Reports Tab */}
                  {activeTab === "labs" && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Laboratory Reports ({p.labReports.length})</h3>
                      <div className="space-y-3">
                        {p.labReports.map(lab => (
                          <div key={lab.id} className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-semibold text-gray-900">{lab.test}</div>
                                <div className="text-xs text-gray-500">{lab.date} · Ordered by {lab.orderedBy}</div>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(lab.status)}`}>
                                {lab.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div>
                                <div className="text-xs text-gray-500">Result</div>
                                <div className="text-sm font-medium text-gray-900">{lab.result}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Reference Range</div>
                                <div className="text-sm text-gray-700">{lab.referenceRange}</div>
                              </div>
                            </div>
                            {lab.notes && <p className="text-xs text-gray-500 mt-2">{lab.notes}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* History Tab */}
                  {activeTab === "history" && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Medical History ({p.medicalHistory.length})</h3>
                      <div className="relative pl-6 space-y-5">
                        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
                        {p.medicalHistory.map(rec => (
                          <div key={rec.id} className="relative">
                            <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                            <div className="p-4 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">{rec.event}</span>
                                <span className="text-xs text-gray-400">{rec.date}</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{rec.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Patient List View
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Review</h1>
            <p className="text-sm text-gray-500 mt-1">Search and review comprehensive patient profiles</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search by name, ID, condition, or allergy..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <select
              value={filterWard}
              onChange={(e) => setFilterWard(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
            >
              <option value="ALL">All Wards</option>
              {wards.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>

        {/* Patient Grid */}
        {!state.dbConnected && patients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <RefreshCw size={40} className="text-emerald-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading patients…</h3>
            <p className="text-gray-500">Syncing from pharmacy database</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Search size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500">
              {patients.length === 0
                ? "No patients in database. Run pnpm seed after starting MongoDB."
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPatients.map((patient, idx) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleSelectPatient(patient)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                      {getInitials(patient.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{patient.name}</h3>
                      <p className="text-xs text-gray-500">{patient.age} yrs · {patient.gender === "M" ? "Male" : "Female"}</p>
                    </div>
                  </div>
                  {patient.allergies.length > 0 && (
                    <AlertTriangle size={14} className="text-amber-500" />
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <MapPin size={10} /> {patient.ward} · Bed {patient.bed}
                  <span className="ml-auto">{patient.id}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {patient.conditions.slice(0, 2).map(c => (
                    <span key={c.id} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {c.name}
                    </span>
                  ))}
                  {patient.conditions.length > 2 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">
                      +{patient.conditions.length - 2}
                    </span>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
                  <span>{patient.currentMedications.length} medications</span>
                  <span>{patient.labReports.length} lab reports</span>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
