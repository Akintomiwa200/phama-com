"use client";
import Preparation from "@/components/Preparation";
import WorkflowGuard from "@/components/layout/WorkflowGuard";

export default function PreparationPage() {
  return (
    <WorkflowGuard>
      <Preparation />
    </WorkflowGuard>
  );
}
