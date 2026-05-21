"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Search,
  ChevronRight,
  Menu,
  User,
  LogOut,
  Settings,
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  Sun,
  Moon,
  Clock3,
  Wifi,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

interface TopBarProps {
  onMenuClick?: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: Date;
  read: boolean;
}

const STEP_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  "prescription-queue": "Prescription Queue",
  "patient-review": "Patient Review",
  "interaction-check": "Interaction Check",
  "cascade-check": "Cascade Check",
  "scan-verify": "Scan & Verify",
  preparation: "Preparation",
  "label-generate": "Label Generation",
  "audit-log": "Audit Log",
  complete: "Complete",
  inventory: "Inventory",
  reports: "Reports",
  settings: "Settings",
};

export default function TopBar({ onMenuClick }: TopBarProps) {
  const router = useRouter();
  const { state, dispatch } = useApp();

  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const activeAlerts = state.alerts.filter((a) => !a.dismissed);

  const [readBaseIds, setReadBaseIds] = useState<string[]>([]);

  const combinedNotifications = useMemo(() => {
    const alertNotifications = state.alerts.map((alert) => ({
      id: alert.id,
      title: alert.title,
      message: alert.message,
      type: (alert.severity === "HIGH" || alert.severity === "CONTRAINDICATED"
        ? "error"
        : alert.severity === "MODERATE"
        ? "warning"
        : alert.type === "scan-success"
        ? "success"
        : "info") as Notification["type"],
      timestamp: new Date(),
      read: !!alert.dismissed,
    }));
    
    const baseNotifications: Notification[] = [];

    const formattedBase = baseNotifications.map(n => ({
      ...n,
      read: n.read || readBaseIds.includes(n.id)
    }));

    return [...alertNotifications, ...formattedBase].sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return 0;
    });
  }, [state.alerts, readBaseIds]);

  const unreadCount = useMemo(
    () => combinedNotifications.filter((n) => !n.read).length,
    [combinedNotifications]
  );

  useEffect(() => {
    const closeMenus = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", closeMenus);

    return () => {
      document.removeEventListener("mousedown", closeMenus);
    };
  }, []);

  const pharmacistName = state.pharmacist?.name || "Pharmacist";
  const pharmacistInitial = pharmacistName.charAt(0);

  const markAllRead = () => {
    state.alerts.forEach((alert) => {
      if (!alert.dismissed) {
        dispatch({ type: "DISMISS_ALERT", id: alert.id });
      }
    });
    setReadBaseIds(["base-1", "base-2", "base-3"]);
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    router.push("/login");
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "warning":
        return "bg-amber-500";
      case "error":
        return "bg-red-500";
      case "success":
        return "bg-emerald-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-3 px-2 sm:px-4 lg:px-6">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-2 lg:gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 md:hidden"
          >
            <Menu size={18} />
          </button>

          {/* BREADCRUMB */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="hidden text-sm text-gray-400 sm:block">
                Dashboard
              </span>

              <ChevronRight
                size={14}
                className="hidden shrink-0 text-gray-300 sm:block"
              />

              <span className="truncate text-sm font-semibold text-gray-800">
                {STEP_LABELS[state.step] || "Dashboard"}
              </span>
            </div>

          </div>
        </div>

        {/* SEARCH */}
        <div className="hidden flex-1 px-4 lg:flex">
          <div className="relative w-full max-w-xl">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search prescriptions, patients, inventory..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* SYSTEM STATUS */}
          <div className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 h-10 xl:flex">
            <Wifi size={14} className="text-emerald-500" />

            <span className="text-xs font-semibold text-emerald-700">
              Online
            </span>
          </div>

          {/* ACTIVE RX */}
          {state.activePrescription && (
            <div className="hidden 2xl:flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 h-10 max-w-[220px]">
              <Clock3 size={14} className="shrink-0 text-blue-500" />

              <span className="truncate text-xs font-medium text-blue-700">
                {state.activePrescription.drug}{" "}
                {state.activePrescription.strength}
              </span>
            </div>
          )}

          {/* DARK MODE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50"
          >
            {darkMode ? (
              <Sun size={17} className="text-amber-500" />
            ) : (
              <Moon size={17} className="text-gray-600" />
            )}
          </button>

          {/* ALERTS */}
          {activeAlerts.length > 0 && (
            <div className="hidden md:flex h-10 items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3">
              <AlertTriangle size={14} className="text-red-500" />

              <span className="text-xs font-semibold text-red-600">
                {activeAlerts.length}
              </span>
            </div>
          )}

          {/* NOTIFICATIONS */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50"
            >
              <Bell size={17} className="text-gray-600" />

              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-3 w-72 sm:w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 p-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Notifications
                      </h3>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {unreadCount} unread
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[380px] overflow-y-auto">
                    {combinedNotifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => {
                          if (notif.id.startsWith("base-")) {
                            setReadBaseIds((prev) =>
                              prev.includes(notif.id) ? prev : [...prev, notif.id]
                            );
                          } else {
                            dispatch({ type: "DISMISS_ALERT", id: notif.id });
                            const alert = state.alerts.find((a) => a.id === notif.id);
                            if (alert) {
                              if (alert.type === "interaction") {
                                dispatch({ type: "SET_STEP", step: "interaction-check" });
                              } else if (alert.type === "cascade") {
                                dispatch({ type: "SET_STEP", step: "cascade-check" });
                              } else if (alert.type === "scan-error" || alert.type === "scan-success") {
                                dispatch({ type: "SET_STEP", step: "scan-verify" });
                              }
                            }
                          }
                          setShowNotifications(false);
                        }}
                        className={`flex w-full items-start gap-3 border-b border-gray-50 p-4 text-left transition hover:bg-gray-50 ${
                          !notif.read ? "bg-emerald-50/30" : ""
                        }`}
                      >
                        <div
                          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${getTypeColor(
                            notif.type
                          )}`}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-gray-900">
                            {notif.title}
                          </div>

                          <div className="mt-1 text-xs leading-relaxed text-gray-500">
                            {notif.message}
                          </div>

                          <div className="mt-2 text-[11px] text-gray-400">
                            {notif.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* USER MENU */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white pl-1.5 pr-2 transition hover:bg-gray-50"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-white">
                {pharmacistInitial}
              </div>

              <div className="hidden sm:block text-left">
                <div className="max-w-[120px] truncate text-xs font-semibold text-gray-900">
                  {pharmacistName}
                </div>

                <div className="text-[10px] text-gray-500">
                  Pharmacist
                </div>
              </div>

              <ChevronDown
                size={14}
                className="hidden text-gray-400 sm:block"
              />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-3 w-60 sm:w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
                >
                  <div className="border-b border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 font-bold text-white">
                        {pharmacistInitial}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-gray-900">
                          {pharmacistName}
                        </div>

                        <div className="truncate text-xs text-gray-500">
                          {state.pharmacist?.id || "pharmacist"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {[
                      {
                        icon: User,
                        label: "Profile",
                        action: () =>
                          router.push("/dashboard/profile"),
                      },
                      {
                        icon: Settings,
                        label: "Settings",
                        action: () =>
                          dispatch({
                            type: "SET_STEP",
                            step: "settings",
                          }),
                      },
                      {
                        icon: HelpCircle,
                        label: "Help Center",
                        action: () => {},
                      },
                    ].map((item, idx) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={idx}
                          onClick={item.action}
                          className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                          <Icon size={16} />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-100 p-2">
                    <button
                      onClick={handleLogout}
                      className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="border-t border-gray-100 px-3 pb-3 pt-3 lg:hidden">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />
        </div>
      </div>
    </header>
  );
}
