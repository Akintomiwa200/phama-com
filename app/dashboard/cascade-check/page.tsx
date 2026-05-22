"use client";
import CascadeCheck from "@/components/CascadeCheck";
import WorkflowGuard from "@/components/layout/WorkflowGuard";

export default function CascadeCheckPage() {
  return (
    <WorkflowGuard>
      <CascadeCheck />
    </WorkflowGuard>
  );
}
