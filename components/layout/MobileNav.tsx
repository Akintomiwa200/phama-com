// components/layout/MobileNav.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

const MOBILE_NAV_ITEMS = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
  { name: "Prescriptions", icon: <ClipboardList size={20} />, path: "/dashboard/prescription-queue" },
  { name: "Inventory", icon: <Package size={20} />, path: "/dashboard/inventory" },
  { name: "Patients", icon: <Users size={20} />, path: "/dashboard/patients" },
  { name: "Reports", icon: <BarChart3 size={20} />, path: "/dashboard/reports" },
  { name: "Settings", icon: <Settings size={20} />, path: "/dashboard/settings" },
];

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") return true;
    if (path !== "/dashboard" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 z-40 md:hidden">
      {MOBILE_NAV_ITEMS.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
              active ? "text-emerald-500" : "text-gray-400"
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
