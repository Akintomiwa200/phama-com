"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useApp, useAudit, useMutations } from "@/lib/store";
import {
  Search,
  Filter,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Pill,
  Loader2,
  X,
  Eye,
  Printer,
  MoreVertical,
  Calendar,
  Syringe,
  Activity,
  TrendingUp,
  Shield,
  Award,
  Zap,
  Bell,
  Star,
  Flag
} from "lucide-react";

interface PrescriptionItem {
  rxId: string;
  drug: string;
  strength: string;
  quantity: number;
  frequency: string;
  route: string;
  prescriber: string;
  priority: "URGENT" | "ROUTINE";
  status: "PENDING" | "DISPENSING" | "DISPENSED";
  time: string;
  patientId: string;
}

export default function PrescriptionQueue() {
  const router = useRouter();
  const { state } = useApp();
  const addAudit = useAudit();
  const { setPatient, setPrescription } = useMutations();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | "URGENT" | "ROUTINE">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "DISPENSING" | "DISPENSED">("ALL");
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);

  const enrichedPrescriptions = useMemo(() => {
    return state.prescriptions.map(rx => {
      const patient = state.patients[rx.patientId];
      return {
        ...rx,
        patientName: patient?.name ?? "Unknown Patient",
        ward: patient?.ward ?? "Unknown Ward",
        age: patient?.age ?? "N/A",
        gender: patient?.gender ?? "N/A"
      };
    });
  }, [state.prescriptions, state.patients]);

  const filtered = enrichedPrescriptions.filter(rx => {
    const matchSearch = rx.patientName.toLowerCase().includes(search.toLowerCase()) ||
      rx.drug.toLowerCase().includes(search.toLowerCase()) ||
      rx.rxId.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === "ALL" || rx.priority === priorityFilter;
    const matchStatus = statusFilter === "ALL" || rx.status === statusFilter;
    return matchSearch && matchPriority && matchStatus;
  });

  const stats = {
    total: enrichedPrescriptions.length,
    urgent: enrichedPrescriptions.filter(rx => rx.priority === "URGENT").length,
    pending: enrichedPrescriptions.filter(rx => rx.status === "PENDING").length,
    dispensing: enrichedPrescriptions.filter(rx => rx.status === "DISPENSING").length,
    dispensed: enrichedPrescriptions.filter(rx => rx.status === "DISPENSED").length
  };

  async function handleSelect(rx: typeof enrichedPrescriptions[0]) {
    const patient = state.patients[rx.patientId];
    if (patient) {
      setSelectedPrescription(rx.rxId);
      await setPatient(patient);
      await setPrescription({
        rxId: rx.rxId,
        patientId: rx.patientId,
        drug: rx.drug,
        strength: rx.strength,
        quantity: rx.quantity,
        frequency: rx.frequency,
        route: rx.route,
        prescriber: rx.prescriber,
        priority: rx.priority,
      });
      addAudit("PRESCRIPTION_SELECTED", `Opened ${rx.rxId} for ${patient.name}`, "info");
      router.push("/dashboard/patient-review");
    }
  }

  const getPriorityConfig = (priority: string) => {
    return priority === "URGENT" 
      ? { color: "text-red-600", bg: "bg-red-100", border: "border-red-200", icon: <AlertTriangle size={14} /> }
      : { color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200", icon: <Shield size={14} /> };
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "PENDING":
        return { label: "Pending", color: "text-amber-600", bg: "bg-amber-100", icon: <Clock size={12} /> };
      case "DISPENSING":
        return { label: "In Progress", color: "text-blue-600", bg: "bg-blue-100", icon: <Loader2 size={12} className="animate-spin" /> };
      case "DISPENSED":
        return { label: "Completed", color: "text-emerald-600", bg: "bg-emerald-100", icon: <CheckCircle size={12} /> };
      default:
        return { label: status, color: "text-gray-600", bg: "bg-gray-100", icon: null };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prescription Queue</h1>
        <p className="text-gray-500">Select a prescription to begin the AI-assisted dynamic dispensing workflow</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
          <p className="text-xs text-gray-500">Urgent</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.dispensing}</p>
          <p className="text-xs text-gray-500">In Progress</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{stats.dispensed}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by patient name, drug, or Rx ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "URGENT", "ROUTINE"].map((priority) => (
              <button
                key={priority}
                onClick={() => setPriorityFilter(priority as any)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  priorityFilter === priority
                    ? priority === "URGENT"
                      ? "bg-red-500 text-white"
                      : priority === "ROUTINE"
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {priority === "URGENT" ? "Urgent" : priority === "ROUTINE" ? "Routine" : "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1 mt-4 pt-3 border-t border-gray-100">
          {["ALL", "PENDING", "DISPENSING", "DISPENSED"].map((status) => {
            const count = enrichedPrescriptions.filter(p => status === "ALL" || p.status === status).length;
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              {!state.dbConnected && state.prescriptions.length === 0 ? (
                <>
                  <Loader2 size={48} className="text-emerald-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Loading prescriptions…</h3>
                  <p className="text-gray-500">Syncing live data from the pharmacy database</p>
                </>
              ) : (
                <>
                  <CheckCircle size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
                  <p className="text-gray-500">
                    {state.prescriptions.length === 0
                      ? "Run pnpm seed if the database is empty."
                      : "Try adjusting your search or filter criteria"}
                  </p>
                </>
              )}
            </div>
          ) : (
            filtered.map((rx, index) => {
              const priorityConfig = getPriorityConfig(rx.priority);
              const statusConfig = getStatusConfig(rx.status);
              const isDispensing = rx.status === "DISPENSING";
              const isDispensed = rx.status === "DISPENSED";
              
              return (
                <motion.div
                  key={rx.rxId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    isDispensing ? "border-blue-200 bg-blue-50/20" :
                    isDispensed ? "border-emerald-200" : "border-gray-100"
                  }`}
                  onClick={() => handleSelect(rx)}
                >
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      {/* Left Section - Icon & Details */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          isDispensed ? "bg-emerald-100" :
                          isDispensing ? "bg-blue-100" : priorityConfig.bg
                        }`}>
                          {isDispensed ? (
                            <CheckCircle size={22} className="text-emerald-600" />
                          ) : isDispensing ? (
                            <Loader2 size={22} className="text-blue-600 animate-spin" />
                          ) : (
                            <Pill size={22} className={priorityConfig.color} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {rx.drug} {rx.strength}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color}`}>
                              {priorityConfig.icon}
                              {rx.priority}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                              {statusConfig.icon}
                              {statusConfig.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <User size={14} /> {rx.patientName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Activity size={14} /> {rx.ward}
                            </span>
                            <span className="flex items-center gap-1">
                              <Pill size={14} /> Qty: {rx.quantity}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} /> {rx.frequency}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                            <span>Rx ID: {rx.rxId}</span>
                            <span>•</span>
                            <span>Prescribed by: {rx.prescriber}</span>
                            <span>•</span>
                            <span>Time: {rx.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Action */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                            {isDispensed ? "Completed" : isDispensing ? "Continue" : "Start"}
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Call to Action */}
      {filtered.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Showing {filtered.length} of {enrichedPrescriptions.length} prescriptions
          </p>
        </div>
      )}
    </div>
  );
}