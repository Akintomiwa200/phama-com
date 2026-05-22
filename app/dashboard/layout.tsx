"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";
import WorkflowBanner from "@/components/layout/WorkflowBanner";
import DashboardAuthGuard from "@/components/layout/DashboardAuthGuard";
import { useApp } from "@/lib/store";
import { getStepFromPath } from "@/lib/workflow-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { dispatch, sessionReady } = useApp();

  useEffect(() => {
    dispatch({ type: "SET_STEP", step: getStepFromPath(pathname) });
  }, [pathname, dispatch]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    if (!isMobile) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  // Sidebar widths
  const sidebarExpandedWidth = 256; // w-64 = 256px
  const sidebarCollapsedWidth = 80; // w-20 = 80px

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="fixed inset-y-0 left-0 z-30 hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Main Content Container */}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isMobile ? 0 : (sidebarCollapsed ? sidebarCollapsedWidth : sidebarExpandedWidth),
        }}
      >
        {/* Top Bar */}
        <TopBar onMenuClick={toggleSidebar} />

        {/* Main Content */}
        <main className="min-h-screen pt-4 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <DashboardAuthGuard sessionReady={sessionReady}>
              <WorkflowBanner />
              {children}
            </DashboardAuthGuard>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <Sidebar
                collapsed={false}
                onToggle={toggleSidebar}
                isMobile
                onClose={() => setIsMobileMenuOpen(false)}
              />
            </motion.div>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileNav />}
    </div>
  );
}