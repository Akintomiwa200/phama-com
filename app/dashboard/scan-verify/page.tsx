"use client";
import ScanVerify from "@/components/ScanVerify";
import WorkflowGuard from "@/components/layout/WorkflowGuard";

export default function ScanVerifyPage() {
  return (
    <WorkflowGuard>
      <ScanVerify />
    </WorkflowGuard>
  );
}
