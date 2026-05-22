"use client";
import LabelGenerate from "@/components/LabelGenerate";
import WorkflowGuard from "@/components/layout/WorkflowGuard";

export default function LabelGeneratePage() {
  return (
    <WorkflowGuard>
      <LabelGenerate />
    </WorkflowGuard>
  );
}
