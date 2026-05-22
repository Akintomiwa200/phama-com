"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Package,
  FileText,
  AlertTriangle,
  GitBranch,
  ScanLine,
  FlaskConical,
  Printer,
  BarChart3,
  Settings,
  UserCircle,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getStepFromPath, WORKFLOW_ORDER } from "@/lib/workflow-nav";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
  group?: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "MAIN" },
  { path: "/dashboard/prescription-queue", label: "Rx Queue", icon: ClipboardList, group: "MAIN" },
  { path: "/dashboard/inventory", label: "Inventory", icon: Package, group: "MAIN" },
  { path: "/dashboard/patient-review", label: "Patient Review", icon: Users, group: "WORKFLOW" },
  { path: "/dashboard/interaction-check", label: "Interactions", icon: AlertTriangle, group: "WORKFLOW" },
  { path: "/dashboard/cascade-check", label: "Cascade Check", icon: GitBranch, group: "WORKFLOW" },
  { path: "/dashboard/scan-verify", label: "Scan & Verify", icon: ScanLine, group: "WORKFLOW" },
  { path: "/dashboard/preparation", label: "Preparation", icon: FlaskConical, group: "WORKFLOW" },
  { path: "/dashboard/label-generate", label: "Label Print", icon: Printer, group: "WORKFLOW" },
  { path: "/dashboard/audit-log", label: "Audit Log", icon: FileText, group: "RECORDS" },
  { path: "/dashboard/reports", label: "Reports", icon: BarChart3, group: "RECORDS" },
  { path: "/dashboard/profile", label: "My Profile", icon: UserCircle, group: "SYSTEM" },
  { path: "/dashboard/settings", label: "Settings", icon: Settings, group: "SYSTEM" },
  { path: "/dashboard/help", label: "Help Center", icon: HelpCircle, group: "SYSTEM" },
];

const GROUPS = ["MAIN", "WORKFLOW", "RECORDS", "SYSTEM"];

export default function Sidebar({
  collapsed: collapsedProp,
  onToggle,
  isMobile,
  onClose,
}: SidebarProps = {}) {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const collapsed = collapsedProp !== undefined ? collapsedProp : !state.sidebarOpen;
  const toggle = onToggle || (() => dispatch({ type: "TOGGLE_SIDEBAR" }));

  const currentStep = getStepFromPath(pathname);
  const pendingRxCount = state.prescriptions.filter((p) => p.status === "PENDING").length;

  function isActive(path: string) {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(path);
  }

  function isCompleted(itemPath: string) {
    const itemStep = getStepFromPath(itemPath);
    if (!WORKFLOW_ORDER.includes(itemStep)) return false;
    const currentIdx = WORKFLOW_ORDER.indexOf(currentStep as (typeof WORKFLOW_ORDER)[number]);
    const stepIdx = WORKFLOW_ORDER.indexOf(itemStep as (typeof WORKFLOW_ORDER)[number]);
    if (currentIdx === -1 || stepIdx === -1) return false;
    return stepIdx < currentIdx;
  }

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const getUserInitials = () => {
    const name = state.pharmacist?.name || "Pharmacist";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-emerald-800 to-emerald-900 flex flex-col shadow-2xl z-50 transition-all duration-300 overflow-y-auto overflow-x-hidden ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-emerald-700/30">
        <Link href="/dashboard" onClick={handleLinkClick} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Shield size={16} className="text-emerald-300" />
          </div>
          {!collapsed && (
            <span className="text-white font-bold text-lg">PharmaGuard</span>
          )}
        </Link>
        <button
          onClick={toggle}
          className={`p-1 rounded-full bg-white/10 hover:bg-white/20 transition-all ${
            collapsed ? "hidden" : ""
          }`}
        >
          <ChevronLeft size={14} className="text-white/70" />
        </button>
      </div>
{/* 
      {state.pharmacist && !collapsed && (
        <div className="px-4 py-4 border-b border-emerald-700/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 text-xs">Active Session</span>
              </div>
              <p className="text-white text-sm font-medium truncate mt-1">
                {state.pharmacist.name}
              </p>
              <p className="text-emerald-200/60 text-xs">{state.pharmacist.role}</p>
            </div>
          </div>
        </div>
      )} */}

      <nav className="flex-1 py-4 px-3 space-y-1">
        {GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((n) => n.group === group);
          if (items.length === 0) return null;

          return (
            <div key={group} className="mb-4">
              {!collapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300/50 mb-2 px-3">
                  {group}
                </p>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                const done = isCompleted(item.path);
                const badge =
                  item.path === "/dashboard/prescription-queue" && pendingRxCount > 0
                    ? pendingRxCount
                    : item.badge;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={handleLinkClick}
                    onMouseEnter={() => setHoveredItem(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center h-11 text-sm font-medium rounded-xl transition-all duration-200 ${
                      collapsed ? "justify-center px-0" : "gap-3 px-3"
                    } ${
                      active
                        ? "bg-white/15 text-white shadow-lg"
                        : done
                          ? "text-emerald-300/50 hover:bg-white/10 hover:text-emerald-200"
                          : "text-emerald-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="relative">
                      <Icon size={18} />
                      {done && (
                        <CheckCircle2
                          size={10}
                          className="absolute -bottom-1 -right-1 text-emerald-400 bg-emerald-900 rounded-full"
                        />
                      )}
                      {badge && !collapsed && (
                        <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                      )}
                    </div>
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        {badge && (
                          <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-500/20 text-red-200">
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-emerald-700/30">
        <button
          onClick={handleLogout}
          className={`flex items-center h-10 text-sm font-medium rounded-xl transition-all w-full ${
            collapsed ? "justify-center" : "gap-3 px-3"
          } text-red-200 hover:bg-red-500/20 hover:text-red-100`}
        >
          <LogOut size={collapsed ? 20 : 18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {collapsed && hoveredItem && (
        <div className="fixed left-20 ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none shadow-lg">
          {NAV_ITEMS.find((n) => n.path === hoveredItem)?.label}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
        </div>
      )}
    </aside>
  );
}
