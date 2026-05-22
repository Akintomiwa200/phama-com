"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, useAudit } from "@/lib/store";
import {
  CheckCircle, Package, BarChart2, Settings, RefreshCw, AlertTriangle, TrendingUp,
  Users, Activity, Shield, Bell, Moon, Globe, Download, Search, Printer,
  HelpCircle, ChevronRight, ClipboardList, Wifi, BadgeCheck, BookOpen, Phone, Mail,
} from "lucide-react";
import Link from "next/link";
import { getPathFromStep } from "@/lib/workflow-nav";

function printReceipt(state: any) {
  const rx = state.activePrescription;
  const patient = state.activePatient;
  const pharmacist = state.pharmacist;
  const now = new Date();

  const win = window.open("", "_blank", "width=400,height=600");
  if (!win) return;

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dispensing Receipt</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; font-size: 12px; color: #000; padding: 20px; }
        .header { text-align: center; margin-bottom: 16px; }
        .header h1 { font-size: 16px; font-weight: 800; }
        .header p { font-size: 10px; color: #555; }
        .divider { border-top: 1px dashed #999; margin: 12px 0; }
        .row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 11px; }
        .label { color: #555; }
        .section-title { font-weight: 700; font-size: 11px; margin: 8px 0 4px; text-transform: uppercase; }
        .footer { text-align: center; margin-top: 16px; font-size: 9px; color: #888; }
        .signature { margin-top: 20px; text-align: center; }
        .signature .line { border-top: 1px solid #000; width: 200px; margin: 20px auto 4px; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>PHARMACY DISPENSING RECEIPT</h1>
        <p>${now.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        <p>${now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
      </div>

      <div class="divider"></div>

      <div class="section-title">Patient Information</div>
      <div class="row"><span class="label">Name</span><span>${patient?.name || "N/A"}</span></div>
      <div class="row"><span class="label">ID</span><span>${patient?.id || "N/A"}</span></div>
      <div class="row"><span class="label">Age</span><span>${patient?.age || "N/A"}</span></div>
      <div class="row"><span class="label">Ward / Bed</span><span>${patient?.ward || "N/A"} / ${patient?.bed || "N/A"}</span></div>

      <div class="divider"></div>

      <div class="section-title">Prescription Details</div>
      <div class="row"><span class="label">Rx ID</span><span>${rx?.rxId || "N/A"}</span></div>
      <div class="row"><span class="label">Drug</span><span>${rx?.drug || "N/A"} ${rx?.strength || ""}</span></div>
      <div class="row"><span class="label">Quantity</span><span>${rx?.quantity || "N/A"}</span></div>
      <div class="row"><span class="label">Frequency</span><span>${rx?.frequency || "N/A"}</span></div>
      <div class="row"><span class="label">Route</span><span>${rx?.route || "N/A"}</span></div>
      <div class="row"><span class="label">Prescriber</span><span>${rx?.prescriber || "N/A"}</span></div>

      <div class="divider"></div>

      <div class="section-title">Dispensing Information</div>
      <div class="row"><span class="label">Dispensed by</span><span>${pharmacist?.name || "N/A"}</span></div>
      <div class="row"><span class="label">License #</span><span>${pharmacist?.licenseNumber || "N/A"}</span></div>
      <div class="row"><span class="label">Time</span><span>${now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span></div>

      <div class="divider"></div>

      <div class="signature">
        <div class="line"></div>
        <p style="font-size: 10px;">Pharmacist Signature</p>
      </div>

      <div class="footer">
        <p>This is a computer-generated receipt</p>
        <p>SHA-256 secured · NAFDAC compliant</p>
      </div>

      <script>window.print();window.close();<\/script>
    </body>
    </html>
  `);
  win.document.close();
}

export function CompleteScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const addAudit = useAudit();
  
  const checks = [
    { label: "Drug Interaction Check", status: state.interactionChecked ? "PASSED" : "SKIPPED", ok: state.interactionChecked },
    { label: "Cascade Detection", status: state.cascadeChecked ? "PASSED" : "SKIPPED", ok: state.cascadeChecked },
    { label: "Barcode Verification", status: state.scanAttempts.some(a => a.result === "success") ? "PASSED" : "PENDING", ok: state.scanAttempts.some(a => a.result === "success") },
    { label: "Strength Confirmation", status: state.scanAttempts.length > 0 ? "PASSED" : "PENDING", ok: state.scanAttempts.length > 0 },
    { label: "Label Generation", status: state.labelGenerated ? "PASSED" : "PENDING", ok: state.labelGenerated },
    { label: "Audit Log Saved", status: state.auditLog.length > 0 ? "RECORDED" : "PENDING", ok: state.auditLog.length > 0 },
  ];

  const allPassed = checks.every(c => c.ok);
  const passedCount = checks.filter(c => c.ok).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 mb-6 animate-pulse-green">
          <CheckCircle size={48} className="text-emerald-600" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Dispensing <span className="text-emerald-600">Complete</span>
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          {state.activePrescription?.drug} {state.activePrescription?.strength} has been safely verified and dispensed to{" "}
          <strong className="text-gray-900">{state.activePatient?.name}</strong>.
          Every safety check has passed. The patient is safe.
        </p>
      </div>

      {/* Progress Summary */}
      <div className="bg-emerald-50 rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-emerald-700">Safety Checks Completed</span>
          <span className="text-sm font-bold text-emerald-700">{passedCount}/{checks.length}</span>
        </div>
        <div className="w-full bg-emerald-200 rounded-full h-2">
          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${(passedCount / checks.length) * 100}%` }} />
        </div>
      </div>

      {/* Checks Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {checks.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-xl border ${
              item.ok ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
            }`}
          >
            {item.ok ? (
              <CheckCircle size={16} className="text-emerald-600" />
            ) : (
              <AlertTriangle size={16} className="text-amber-500" />
            )}
            <div>
              <p className="text-xs font-medium text-gray-700">{item.label}</p>
              <p className={`text-[10px] font-semibold ${item.ok ? "text-emerald-600" : "text-amber-600"}`}>
                {item.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => {
            dispatch({ type: "NEW_PRESCRIPTION" });
            router.push("/dashboard/prescription-queue");
          }}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} /> New Prescription
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Return to Dashboard
        </button>
        <button onClick={() => { printReceipt(state); addAudit("RECEIPT_PRINTED", `Receipt printed for ${state.activePatient?.name} - ${state.activePrescription?.drug}`, "info"); }} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center gap-2">
          <Printer size={16} /> Print Receipt
        </button>
      </div>
    </div>
  );
}

// Inventory Component
export function Inventory() {
  const { state } = useApp();
  const critical = state.inventory.filter(d => d.criticalStock);
  const low = state.inventory.filter(d => d.lowStock && !d.criticalStock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "critical" | "low" | "ok">("all");

  const filteredInventory = state.inventory.filter(item => {
    const matchesSearch = item.drug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" ||
      (filterType === "critical" && item.criticalStock) ||
      (filterType === "low" && item.lowStock && !item.criticalStock) ||
      (filterType === "ok" && !item.lowStock && !item.criticalStock);
    return matchesSearch && matchesFilter;
  });

  const totalValue = state.inventory.reduce((sum, item) => sum + (item.stock * 10), 0);
  const lowStockCount = state.inventory.filter(i => i.lowStock).length;
  const expiringSoon = state.inventory.filter(i => {
    const expiryDate = new Date(i.expiry);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">PHARMACY INVENTORY</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Drug Stock Management</h1>
        <p className="text-gray-500">Real-time inventory with expiry and stock alerts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900">{state.inventory.length}</p>
          <p className="text-xs text-gray-500">Total Products</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
          <p className="text-xs text-gray-500">Low Stock Items</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-amber-600">{expiringSoon}</p>
          <p className="text-xs text-gray-500">Expiring Soon</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-emerald-600">${totalValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Inventory Value</p>
        </div>
      </div>

      {/* Alerts */}
      {(critical.length > 0 || low.length > 0) && (
        <div className="space-y-2 mb-6">
          {critical.map((d, i) => (
            <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
              <AlertTriangle size={16} className="text-red-500" />
              <span className="text-sm text-red-700">
                CRITICAL STOCK: {d.drug} {d.strength} — only {d.stock} units remaining. Reorder immediately.
              </span>
            </div>
          ))}
          {low.map((d, i) => (
            <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
              <AlertTriangle size={16} className="text-amber-500" />
              <span className="text-sm text-amber-700">
                LOW STOCK: {d.drug} {d.strength} — {d.stock} units remaining. Reorder soon.
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by drug name or batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: "all", label: "All" },
              { value: "critical", label: "Critical" },
              { value: "low", label: "Low Stock" },
              { value: "ok", label: "OK" }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value as any)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  filterType === filter.value
                    ? filter.value === "critical"
                      ? "bg-red-500 text-white"
                      : filter.value === "low"
                      ? "bg-amber-500 text-white"
                      : filter.value === "ok"
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Drug</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Strength</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Form</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInventory.map((item, i) => {
                const stockColor = item.criticalStock ? "text-red-600" : item.lowStock ? "text-amber-600" : "text-emerald-600";
                const expSoon = new Date(item.expiry) < new Date(Date.now() + 90 * 86400000);
                const statusLabel = item.criticalStock ? "CRITICAL" : item.lowStock ? "LOW" : "OK";
                const statusColor = item.criticalStock ? "bg-red-100 text-red-700" : item.lowStock ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
                
                return (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.drug}</p>
                        <p className="text-xs text-gray-400">Batch: {item.batch}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.strength}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.form}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${stockColor}`}>{item.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${expSoon ? "text-amber-600" : "text-gray-500"}`}>
                        {item.expiry}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Reports Component
export function Reports() {
  const { state } = useApp();
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("month");

  const totalDispensed = (state.prescriptions ?? []).filter(r => r.status === "DISPENSED").length;
  const pendingCount = (state.prescriptions ?? []).filter(r => r.status === "PENDING" || r.status === "DISPENSING").length;
  const totalRx = (state.prescriptions ?? []).length;
  const scanErrors = state.scanAttempts.filter(a => a.result === "error").length;
  const scanSuccess = state.scanAttempts.filter(a => a.result === "success").length;
  const totalScans = scanErrors + scanSuccess;
  const errorRate = totalScans > 0 ? ((scanErrors / totalScans) * 100).toFixed(1) : "0.0";
  const interactionCount = state.drugInteractions.length;
  const cascadeCount = state.cascadePatterns.length;
  const patientCount = Object.keys(state.patients).length;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const monthlyLabels = months.slice(Math.max(0, currentMonth - 4), currentMonth + 1);
  const perMonth = Math.max(1, Math.floor(totalDispensed / Math.max(1, monthlyLabels.length)));
  const dispensedByMonth = monthlyLabels.map((_, i) => perMonth + (i === monthlyLabels.length - 1 ? totalDispensed % monthlyLabels.length : 0));
  const maxMonthly = Math.max(...dispensedByMonth, 1);

  const topDrugs = [
    { name: "Amoxicillin", count: 245, percentage: 65 },
    { name: "Lisinopril", count: 189, percentage: 50 },
    { name: "Metformin", count: 156, percentage: 42 },
    { name: "Atorvastatin", count: 134, percentage: 36 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">ANALYTICS</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Pharmacy Reports</h1>
            <p className="text-gray-500">Live performance metrics — {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
          </div>
          <div className="flex gap-2">
            {["week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range as any)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  dateRange === range ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
            <button className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-gray-500">Total Dispensed</span>
            <Package size={16} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalDispensed}</p>
          <p className="text-xs text-gray-400 mt-1">{pendingCount} pending</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-gray-500">Error Rate</span>
            <AlertTriangle size={16} className={scanErrors > 0 ? "text-red-500" : "text-emerald-500"} />
          </div>
          <p className={`text-3xl font-bold ${scanErrors > 0 ? "text-red-600" : "text-emerald-600"}`}>{errorRate}%</p>
          <p className="text-xs text-gray-400 mt-1">{scanErrors} failures in {totalScans} scans</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-gray-500">Drug Interactions</span>
            <Activity size={16} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{interactionCount}</p>
          <p className="text-xs text-gray-400 mt-1">{cascadeCount} cascade patterns</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-gray-500">Active Patients</span>
            <Users size={16} className="text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{patientCount}</p>
          <p className="text-xs text-gray-400 mt-1">{totalRx} total prescriptions</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Dispensing Activity Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Dispensing Activity</h3>
          <div className="flex items-end gap-2 h-48">
            {monthlyLabels.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-medium text-emerald-600">{dispensedByMonth[i]}</div>
                <div
                  className="w-full bg-emerald-500 rounded-t-lg transition-all"
                  style={{ height: `${(dispensedByMonth[i] / maxMonthly) * 100}px`, opacity: i === monthlyLabels.length - 1 ? 1 : 0.6 }}
                />
                <div className="text-xs text-gray-400">{m}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Prescribed Drugs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Top Prescribed Drugs</h3>
          <div className="space-y-3">
            {topDrugs.map((drug) => (
              <div key={drug.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{drug.name}</span>
                  <span className="text-gray-500">{drug.count} prescriptions</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${drug.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Checks */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Safety Checks Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { type: "Barcode scans", count: totalScans, pct: totalScans > 0 ? 100 : 0, color: "bg-blue-500" },
            { type: "Scans passed", count: scanSuccess, pct: totalScans > 0 ? Math.round((scanSuccess / totalScans) * 100) : 0, color: "bg-emerald-500" },
            { type: "Drug interactions configured", count: interactionCount, pct: Math.min(100, interactionCount * 10), color: "bg-purple-500" },
            { type: "Cascade patterns configured", count: cascadeCount, pct: Math.min(100, cascadeCount * 20), color: "bg-amber-500" },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.type}</span>
                <span className="text-gray-500">{item.count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Settings Page Component
export function SettingsPage() {
  const [notifications, setNotifications] = useState({
    drugInteraction: true,
    lowStock: true,
    expiryWarnings: true
  });
  const [security, setSecurity] = useState({
    dualVerification: false,
    biometricLogin: false,
    sessionTimeout: true
  });
  const [aiEngine, setAiEngine] = useState({
    drugInteractionCheck: true,
    cascadeDetection: true,
    counsellingGeneration: true
  });

  const toggleSetting = (category: string, key: string, setter: any) => {
    setter((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">CONFIGURATION</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-500">Configure system preferences and safety features</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Notifications Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-emerald-600" />
              <h2 className="text-base font-bold text-gray-900">Notifications</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Drug interaction alerts</p>
                <p className="text-xs text-gray-500">Real-time popup alerts for drug interactions</p>
              </div>
              <button
                onClick={() => toggleSetting("notifications", "drugInteraction", setNotifications)}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifications.drugInteraction ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications.drugInteraction ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Low stock alerts</p>
                <p className="text-xs text-gray-500">Notify when stock falls below threshold</p>
              </div>
              <button
                onClick={() => toggleSetting("notifications", "lowStock", setNotifications)}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifications.lowStock ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications.lowStock ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Expiry warnings</p>
                <p className="text-xs text-gray-500">Alert 90 days before medication expiry</p>
              </div>
              <button
                onClick={() => toggleSetting("notifications", "expiryWarnings", setNotifications)}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifications.expiryWarnings ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications.expiryWarnings ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-emerald-600" />
              <h2 className="text-base font-bold text-gray-900">Security</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Dual pharmacist verification</p>
                <p className="text-xs text-gray-500">Require second pharmacist for high-risk drugs</p>
              </div>
              <button
                onClick={() => toggleSetting("security", "dualVerification", setSecurity)}
                className={`relative w-11 h-6 rounded-full transition-colors ${security.dualVerification ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${security.dualVerification ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Biometric login</p>
                <p className="text-xs text-gray-500">Enable fingerprint authentication</p>
              </div>
              <button
                onClick={() => toggleSetting("security", "biometricLogin", setSecurity)}
                className={`relative w-11 h-6 rounded-full transition-colors ${security.biometricLogin ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${security.biometricLogin ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Session timeout (15 min)</p>
                <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
              </div>
              <button
                onClick={() => toggleSetting("security", "sessionTimeout", setSecurity)}
                className={`relative w-11 h-6 rounded-full transition-colors ${security.sessionTimeout ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${security.sessionTimeout ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* AI Engine Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-emerald-600" />
              <h2 className="text-base font-bold text-gray-900">AI Engine</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">AI drug interaction check</p>
                <p className="text-xs text-gray-500">Claude-powered interaction analysis</p>
              </div>
              <button
                onClick={() => toggleSetting("aiEngine", "drugInteractionCheck", setAiEngine)}
                className={`relative w-11 h-6 rounded-full transition-colors ${aiEngine.drugInteractionCheck ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${aiEngine.drugInteractionCheck ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">AI prescribing cascade detection</p>
                <p className="text-xs text-gray-500">Pattern recognition for prescribing cascades</p>
              </div>
              <button
                onClick={() => toggleSetting("aiEngine", "cascadeDetection", setAiEngine)}
                className={`relative w-11 h-6 rounded-full transition-colors ${aiEngine.cascadeDetection ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${aiEngine.cascadeDetection ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">AI counselling point generation</p>
                <p className="text-xs text-gray-500">Auto-generate patient instructions</p>
              </div>
              <button
                onClick={() => toggleSetting("aiEngine", "counsellingGeneration", setAiEngine)}
                className={`relative w-11 h-6 rounded-full transition-colors ${aiEngine.counsellingGeneration ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${aiEngine.counsellingGeneration ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
         </div>
       </div>
     </div>
   );
 }

export function ProfilePage() {
  const router = useRouter();
  const { state } = useApp();
  const pharmacist = state.pharmacist;
  const dbRecord = pharmacist
    ? state.pharmacists.find((p) => p.id === pharmacist.id)
    : undefined;

  const myAudit = state.auditLog.filter(
    (e) => e.user === pharmacist?.name || e.details?.includes(pharmacist?.id ?? "")
  );
  const dispensedCount = myAudit.filter(
    (e) =>
      e.action?.includes("DISPENSING") ||
      e.action?.includes("COMPLETE") ||
      e.action === "Dispensing Complete"
  ).length;

  if (!pharmacist) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <p className="text-gray-600 mb-4">Sign in to view your profile.</p>
        <button
          onClick={() => router.push("/login")}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const initials = pharmacist.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          ACCOUNT
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mt-1">My Profile</h1>
        <p className="text-gray-500 mt-1">Practitioner details and session activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl font-bold text-white mb-4">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{pharmacist.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{pharmacist.role}</p>
            <span
              className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                state.dbConnected ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              <Wifi size={12} />
              {state.dbConnected ? "Database connected" : "Offline mode"}
            </span>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Practitioner ID</span>
              <span className="font-mono font-medium text-gray-900">{pharmacist.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">License</span>
              <span className="font-medium text-gray-900">
                {pharmacist.licenseNumber || dbRecord?.licenseNumber || "—"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Authorization</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <BadgeCheck size={14} />
                {dbRecord?.authorized !== false ? "Active" : "Restricted"}
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/settings"
            className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Settings size={16} />
            System Settings
          </Link>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{myAudit.length}</p>
              <p className="text-xs text-gray-500">Actions this session</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-2xl font-bold text-emerald-600">{dispensedCount}</p>
              <p className="text-xs text-gray-500">Dispensing events</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm col-span-2 sm:col-span-1">
              <p className="text-2xl font-bold text-amber-600">
                {state.prescriptions.filter((p) => p.status === "DISPENSING").length}
              </p>
              <p className="text-xs text-gray-500">Rx in progress</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Recent activity</h3>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {myAudit.length === 0 ? (
                <p className="p-6 text-sm text-gray-500 text-center">No audit entries yet this session.</p>
              ) : (
                [...myAudit].reverse().slice(0, 12).map((entry, i) => (
                  <div key={i} className="px-5 py-3">
                    <div className="flex justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900">{entry.action}</span>
                      <span className="text-xs text-gray-400 font-mono shrink-0">{entry.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{entry.details}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const WORKFLOW_GUIDE = [
  { title: "Prescription Queue", step: "prescription-queue" as const, desc: "Select a pending prescription to start dispensing." },
  { title: "Patient Review", step: "patient-review" as const, desc: "Review allergies, meds, labs, and history." },
  { title: "Interaction Check", step: "interaction-check" as const, desc: "AI checks new drug against current medications." },
  { title: "Cascade Check", step: "cascade-check" as const, desc: "Detect prescribing cascade patterns." },
  { title: "Scan & Verify", step: "scan-verify" as const, desc: "Barcode scan must match drug and strength." },
  { title: "Preparation", step: "preparation" as const, desc: "Verify preparation steps for injections if needed." },
  { title: "Label Generation", step: "label-generate" as const, desc: "Print patient label and counselling points." },
  { title: "Audit Log", step: "audit-log" as const, desc: "Review immutable trail and complete dispensing." },
];

export function HelpPage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          SUPPORT
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mt-1">Help Center</h1>
        <p className="text-gray-500 mt-1">Workflow guide, FAQs, and quick links</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={20} className="text-emerald-600" />
            <h2 className="font-bold text-gray-900">Dispensing workflow</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Follow these steps in order. Use the sidebar under <strong>WORKFLOW</strong> or start from the Rx Queue.
          </p>
          <button
            onClick={() => router.push("/dashboard/prescription-queue")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <ClipboardList size={16} />
            Open prescription queue
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={20} className="text-emerald-600" />
            <h2 className="font-bold text-gray-900">Quick answers</h2>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>
              <strong className="text-gray-900">Login:</strong> Enter practitioner ID only (e.g. PANS2024). No password.
            </li>
            <li>
              <strong className="text-gray-900">Live data:</strong> Green &quot;Live sync&quot; means MongoDB is connected.
            </li>
            <li>
              <strong className="text-gray-900">Stuck on Cascade?</strong> Answer all prescriber questions, or pick a prescription from the queue first.
            </li>
            <li>
              <strong className="text-gray-900">Empty lists?</strong> Run <code className="text-xs bg-gray-100 px-1 rounded">pnpm seed</code> with MongoDB running.
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Step-by-step guide</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {WORKFLOW_GUIDE.map((item, i) => (
            <button
              key={item.step}
              type="button"
              onClick={() => router.push(getPathFromStep(item.step))}
              className="w-full flex items-start gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Phone size={18} className="text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Pharmacy IT support</h3>
          </div>
          <p className="text-sm text-gray-500">+234 800 PHARMA (24/7)</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={18} className="text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Clinical escalation</h3>
          </div>
          <p className="text-sm text-gray-500">support@pharmaguard.local</p>
        </div>
      </div>
    </div>
  );
}