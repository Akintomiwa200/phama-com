"use client";
import InteractionCheck from "@/components/InteractionCheck";
import WorkflowGuard from "@/components/layout/WorkflowGuard";

export default function InteractionCheckPage() {
  return (
    <WorkflowGuard>
      <InteractionCheck />
    </WorkflowGuard>
  );
}
