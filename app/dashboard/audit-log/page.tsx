"use client";
import AuditLog from "@/components/AuditLog";
import WorkflowGuard from "@/components/layout/WorkflowGuard";

export default function AuditLogPage() {
  return (
    <WorkflowGuard>
      <AuditLog />
    </WorkflowGuard>
  );
}
