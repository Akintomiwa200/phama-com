"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export default function DashboardAuthGuard({
  children,
  sessionReady,
}: {
  children: React.ReactNode;
  sessionReady: boolean;
}) {
  const { state } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!sessionReady) return;
    if (!pathname?.startsWith("/dashboard")) return;
    if (!state.pharmacist) {
      router.replace("/login");
    }
  }, [sessionReady, state.pharmacist, pathname, router]);

  if (!sessionReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Restoring your session…</p>
        </div>
      </div>
    );
  }

  if (!state.pharmacist) {
    return null;
  }

  return <>{children}</>;
}
