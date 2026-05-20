"use client";
import { useState } from "react";
import { useApp, useAudit } from "@/lib/store";
import { FlaskConical, CheckCircle, ChevronRight, AlertTriangle, Droplets } from "lucide-react";

const INJECTION_STEPS = [
  { id: 1, label: "Scan drug vial", target: "Artemether 20mg", barcode: "567890123456", unit: "vial" },
  { id: 2, label: "Scan diluent (mixing liquid)", target: "Sterile Water for Injection", barcode: "999000000001", unit: "ampoule" },
  { id: 3, label: "Check volume", target: "Required 1.5mL", measured: "1.5mL", unit: "mL" },
];

export default function Preparation() {
  const { state, dispatch } = useApp();
  const addAudit = useAudit();
  const [isInjection, setIsInjection] = useState(false);
  const [injSteps, setInjSteps] = useState<Record<number, "idle" | "pass" | "fail">>({});
  const [injInputs, setInjInputs] = useState<Record<number, string>>({});

  const rx = state.activePrescription;
  const isOral = rx?.route?.toLowerCase().includes("oral");

  function checkInjStep(stepId: number) {
    const step = INJECTION_STEPS.find(s => s.id === stepId);
    if (!step) return;
    const input = injInputs[stepId]?.trim();
    const pass = input && (input === step.barcode || input === step.measured || input.toLowerCase().includes("sterile"));
    setInjSteps(prev => ({ ...prev, [stepId]: pass ? "pass" : "fail" }));
    addAudit(
      pass ? "PREP_STEP_PASS" : "PREP_STEP_FAIL",
      `Preparation step ${stepId} (${step.label}): ${pass ? "PASS" : "FAIL"}`,
      pass ? "success" : "error"
    );
  }

  const allStepsPassed = INJECTION_STEPS.every(s => injSteps[s.id] === "pass");

  function proceed() {
    addAudit("PREPARATION_COMPLETE", `Preparation verified for ${rx?.drug} ${rx?.strength}`, "success");
    dispatch({ type: "SET_STEP", step: "label-generate" });
  }

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 4 }}>STEP 7 — PREPARATION</div>
        <h1 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Preparation Check
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
          AI verifies preparation process to prevent mixing errors
        </p>
      </div>

      {/* Route indicator */}
      <div className="card-inner" style={{ padding: "14px 18px", marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
        <FlaskConical size={16} color={isOral ? "var(--green)" : "var(--amber)"} />
        <div>
          <span style={{ fontSize: 13, color: "var(--text)" }}>{rx?.drug} {rx?.strength}</span>
          <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 10 }}>Route: {rx?.route}</span>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>PREPARATION TYPE</div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setIsInjection(false)}
            style={{
              flex: 1, padding: "12px", borderRadius: 8,
              background: !isInjection ? "var(--green-glow)" : "transparent",
              border: `1px solid ${!isInjection ? "var(--green)" : "var(--border2)"}`,
              color: !isInjection ? "var(--green)" : "var(--text-dim)",
              cursor: "pointer", fontSize: 13, fontFamily: "var(--mono)"
            }}
          >
            Oral / Tablet / Capsule
          </button>
          <button
            onClick={() => setIsInjection(true)}
            style={{
              flex: 1, padding: "12px", borderRadius: 8,
              background: isInjection ? "var(--amber-glow)" : "transparent",
              border: `1px solid ${isInjection ? "var(--amber)" : "var(--border2)"}`,
              color: isInjection ? "var(--amber)" : "var(--text-dim)",
              cursor: "pointer", fontSize: 13, fontFamily: "var(--mono)"
            }}
          >
            Injection / IV / Infusion
          </button>
        </div>
      </div>

      {!isInjection ? (
        <div className="card" style={{ padding: 28, textAlign: "center", borderColor: "var(--green)40" }}>
          <CheckCircle size={40} color="var(--green)" style={{ margin: "0 auto 16px" }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--green)", marginBottom: 8 }}>
            No preparation required
          </div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 20 }}>
            This is an oral medication. Drug has been verified and is ready to dispense.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, textAlign: "left", maxWidth: 340, margin: "0 auto" }}>
            {[
              "Check tablet/capsule count matches quantity",
              "Verify correct blister pack or bottle",
              "Confirm child-resistant cap is fitted",
              "Check package integrity — no damage"
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "var(--text-dim)" }}>
                <CheckCircle size={12} color="var(--green)" style={{ marginTop: 2, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
          <button
            className="btn-primary"
            onClick={proceed}
            style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            Proceed to Label Generation <ChevronRight size={14} />
          </button>
        </div>
      ) : (
        <div>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
              <AlertTriangle size={16} color="var(--amber)" />
              <span style={{ fontSize: 13, color: "var(--amber)" }}>Injection preparation — all steps must be verified by AI before dispensing</span>
            </div>

            {INJECTION_STEPS.map((step, i) => {
              const stepResult = injSteps[step.id];
              return (
                <div key={step.id} className="card-inner" style={{
                  padding: "16px", marginBottom: 12,
                  borderColor: stepResult === "pass" ? "var(--green)40" : stepResult === "fail" ? "var(--red)40" : "var(--border2)"
                }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: stepResult === "pass" ? "var(--green-glow)" : stepResult === "fail" ? "var(--red-glow)" : "var(--surface)",
                      border: `1px solid ${stepResult === "pass" ? "var(--green)" : stepResult === "fail" ? "var(--red)" : "var(--border2)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, color: stepResult === "pass" ? "var(--green)" : "var(--text-faint)"
                    }}>
                      {stepResult === "pass" ? "✓" : stepResult === "fail" ? "✗" : i + 1}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>Step {step.id}: {step.label}</div>
                    {stepResult === "pass" && <CheckCircle size={14} color="var(--green)" style={{ marginLeft: "auto" }} />}
                  </div>

                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10, paddingLeft: 34 }}>
                    Expected: <span style={{ color: "var(--text)" }}>{step.target}</span>
                    {step.measured && <> · Volume: <span style={{ color: "var(--text)" }}>{step.measured}</span></>}
                  </div>

                  <div style={{ display: "flex", gap: 8, paddingLeft: 34 }}>
                    <input
                      className="input-field"
                      placeholder={`Enter barcode or value (try: ${step.barcode || step.measured})`}
                      value={injInputs[step.id] || ""}
                      onChange={e => setInjInputs(prev => ({ ...prev, [step.id]: e.target.value }))}
                      style={{ flex: 1 }}
                    />
                    <button
                      className="btn-primary"
                      onClick={() => checkInjStep(step.id)}
                      disabled={!injInputs[step.id]}
                      style={{ flexShrink: 0, padding: "10px 16px" }}
                    >
                      Verify
                    </button>
                  </div>

                  {stepResult === "fail" && (
                    <div style={{ marginTop: 8, paddingLeft: 34, fontSize: 12, color: "var(--red)" }}>
                      ✗ Verification failed. Check your input and try again.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {allStepsPassed && (
            <button
              className="btn-primary"
              onClick={proceed}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              All Steps Verified — Generate Label <ChevronRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
