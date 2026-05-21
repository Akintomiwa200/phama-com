"use client";
import { useEffect, useState } from "react";
import { useApp, useAudit, syncMutation } from "@/lib/store";

import { GitBranch, AlertTriangle, CheckCircle, Activity, ChevronRight, Info } from "lucide-react";

export default function CascadeCheck() {
  const { state, dispatch } = useApp();
  const addAudit = useAudit();
  const [detected, setDetected] = useState<typeof state.cascadePatterns>([]);
  const [answers, setAnswers] = useState<Record<number, "yes" | "no" | null>>({});

  const patient = state.activePatient;
  const rx = state.activePrescription;

  useEffect(() => {
    if (!patient || !rx) return;
    const allMeds = patient.currentMedications.map(m => m.drug);
    const found = state.cascadePatterns.filter(c =>
      allMeds.includes(c.causeDrug) && rx.drug.includes(c.newDrug.split(" ")[0])
    );
    setDetected(found);
    syncMutation("audit_log", "insertOne", {
      time: new Date().toISOString(), action: "CASCADE_CHECK",
      details: found.length > 0 ? `Cascade pattern detected: ${found.map(f => f.causeDrug + " → " + f.newDrug).join(", ")}` : "No cascade patterns detected",
      level: found.length > 0 ? "warning" : "success", user: state.pharmacist?.name
    }).catch(() => {});
    if (found.length > 0) {
      addAudit("CASCADE_DETECTED", `Prescribing cascade pattern detected: ${found.map(f => f.causeDrug + " → " + f.newDrug).join(", ")}`, "warning");
    } else {
      addAudit("CASCADE_CHECK", "No prescribing cascade patterns detected", "success");
    }
  }, [patient, rx, state.cascadePatterns]);

  function proceed() {
    const answeredAll = detected.every((_, i) => answers[i] !== null && answers[i] !== undefined);
    if (detected.length > 0 && !answeredAll) return;
    dispatch({ type: "SET_CASCADE_CHECKED", value: true });
    addAudit("CASCADE_ACKNOWLEDGED", "Prescribing cascade review completed by pharmacist", "info");
    syncMutation("audit_log", "insertOne", {
      time: new Date().toISOString(), action: "CASCADE_ACKNOWLEDGED",
      details: "Prescribing cascade review completed", level: "info", user: state.pharmacist?.name
    }).catch(() => {});
    dispatch({ type: "SET_STEP", step: "scan-verify" });
  }

  const allAnswered = detected.every((_, i) => answers[i] !== null && answers[i] !== undefined);

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 4 }}>STEP 5 — PATTERN ANALYSIS</div>
        <h1 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Prescribing Cascade Detection
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
          AI identifies cases where a new drug treats a side effect of an existing drug
        </p>
      </div>

      {/* Explanation card */}
      <div className="card-inner" style={{ padding: "14px 18px", marginBottom: 24, display: "flex", gap: 10 }}>
        <Info size={16} color="var(--blue)" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--text)" }}>What is a prescribing cascade?</strong> A prescribing cascade occurs when a drug is prescribed to treat the side effect of another drug, rather than addressing the underlying cause. This leads to unnecessary medications, increased costs, and compounded adverse effects.
        </div>
      </div>

      {detected.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
              {/* Alert */}
              <div style={{
                padding: "16px 20px", background: "var(--amber-glow)",
                border: "2px solid var(--amber)40", borderRadius: 10,
                display: "flex", gap: 12, alignItems: "center"
              }}>
                <AlertTriangle size={20} color="var(--amber)" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--amber)" }}>
                    CASCADE PATTERN DETECTED
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
                    Please confirm the clinical rationale with the prescriber
                  </div>
                </div>
              </div>

              {detected.map((pattern, i) => (
                <div key={i} className="card animate-slide-up" style={{ padding: 24 }}>
                  {/* Pattern visualization */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{
                      padding: "6px 12px", borderRadius: 6,
                      background: "var(--surface2)", border: "1px solid var(--border2)",
                      fontSize: 13, color: "var(--text)"
                    }}>
                      {pattern.causeDrug}
                    </div>
                    <div style={{ color: "var(--text-faint)", fontSize: 12 }}>→ causes →</div>
                    <div style={{
                      padding: "6px 12px", borderRadius: 6,
                      background: "var(--amber-glow)", border: "1px solid var(--amber)30",
                      fontSize: 13, color: "var(--amber)"
                    }}>
                      {pattern.sideEffect}
                    </div>
                    <div style={{ color: "var(--text-faint)", fontSize: 12 }}>→ prescribed →</div>
                    <div style={{
                      padding: "6px 12px", borderRadius: 6,
                      background: "var(--red-glow)", border: "1px solid var(--red-dim)30",
                      fontSize: 13, color: "var(--red)"
                    }}>
                      {pattern.newDrug} ← cascade risk
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div className="section-label" style={{ marginBottom: 6 }}>CASCADE RISK</div>
                    <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{pattern.cascadeRisk}</p>
                  </div>

                  <div style={{ marginBottom: 20, padding: "10px 14px", background: "var(--green-glow)", border: "1px solid var(--green)20", borderRadius: 6 }}>
                    <div className="section-label" style={{ marginBottom: 4 }}>AI RECOMMENDATION</div>
                    <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{pattern.recommendation}</p>
                  </div>

                  {/* Clinical question */}
                  <div style={{ padding: "14px 16px", background: "var(--surface2)", borderRadius: 8, border: "1px solid var(--border2)" }}>
                    <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 12 }}>
                      <strong>Confirm with prescriber:</strong> Does the patient have {pattern.causeDrug}-induced {pattern.sideEffect.split(" ")[0].toLowerCase()}?
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {(["yes", "no"] as const).map(opt => (
                        <button
                          key={opt}
                          onClick={() => setAnswers(prev => ({ ...prev, [i]: opt }))}
                          style={{
                            padding: "8px 24px", borderRadius: 6, cursor: "pointer",
                            fontSize: 13, fontFamily: "var(--mono)",
                            background: answers[i] === opt
                              ? (opt === "yes" ? "var(--red-glow)" : "var(--green-glow)")
                              : "transparent",
                            border: `1px solid ${answers[i] === opt
                              ? (opt === "yes" ? "var(--red)" : "var(--green)")
                              : "var(--border2)"}`,
                            color: answers[i] === opt
                              ? (opt === "yes" ? "var(--red)" : "var(--green)")
                              : "var(--text-dim)",
                            transition: "all 0.2s"
                          }}
                        >
                          {opt === "yes" ? "Yes — cascade confirmed" : "No — separate indication"}
                        </button>
                      ))}
                    </div>
                    {answers[i] === "yes" && (
                      <div style={{ marginTop: 10, fontSize: 12, color: "var(--amber)", padding: "8px 12px", background: "var(--amber-glow)", borderRadius: 6 }}>
                        ⚠ Recommend contacting prescriber to consider switching {pattern.causeDrug} to an alternative class
                      </div>
                    )}
                  </div>
                </div>
              ))}
            <button
              className="btn-primary"
              onClick={proceed}
              disabled={!allAnswered}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              Proceed to Barcode Verification <ChevronRight size={14} />
            </button>
          </div>
        ) : (
        <div>
          <div className="card animate-slide-up" style={{ padding: 32, textAlign: "center", marginBottom: 24, borderColor: "var(--green)40" }}>
            <CheckCircle size={40} color="var(--green)" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--green)", marginBottom: 8 }}>No Cascade Patterns Detected</div>
            <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
              The new prescription does not appear to be treating a side effect of existing medications.
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={proceed}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            Proceed to Barcode Verification <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
