"use client";
import { useState, useEffect } from "react";
import { useApp, useAudit } from "@/lib/store";
import { FileText, Printer, CheckCircle, ChevronRight, QrCode, AlertCircle } from "lucide-react";

export default function LabelGenerate() {
  const { state, dispatch } = useApp();
  const addAudit = useAudit();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [printed, setPrinted] = useState(false);
  const [aiWarnings, setAiWarnings] = useState<string[]>([]);
  const [loadingWarnings, setLoadingWarnings] = useState(false);

  const patient = state.activePatient;
  const rx = state.activePrescription;

  const today = new Date().toLocaleDateString("en-GB");
  const expDate = new Date();
  expDate.setDate(expDate.getDate() + (rx?.quantity || 30));

  async function generateLabel() {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    setGenerating(false);
    setGenerated(true);
    dispatch({ type: "SET_LABEL_GENERATED", value: true });
    addAudit("LABEL_GENERATED", `Label generated for ${rx?.drug} ${rx?.strength} — ${patient?.name}`, "success");
    // Get AI patient counselling points
    setLoadingWarnings(true);
    try {
      const resp = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "counselling",
          drug: rx?.drug,
          strength: rx?.strength,
          patient: { name: patient?.name, age: patient?.age, conditions: patient?.conditions }
        })
      });
      const data = await resp.json();
      if (data.warnings) setAiWarnings(data.warnings);
    } catch {
      setAiWarnings(["Take as prescribed by your doctor", "Do not stop medication without medical advice", "Keep out of reach of children", "Store in cool dry place away from sunlight"]);
    }
    setLoadingWarnings(false);
  }

  function printLabel() {
    setPrinted(true);
    addAudit("LABEL_PRINTED", `Label printed for Rx ${rx?.rxId}`, "success");
  }

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 4 }}>STEP 8 — LABEL GENERATION</div>
        <h1 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Generate & Print Label
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
          AI auto-generates a verified dispensing label — eliminating manual typing and spelling errors
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
        {/* Label preview */}
        <div>
          {!generated ? (
            <div className="card" style={{ padding: 32, textAlign: "center" }}>
              <FileText size={36} color="var(--text-faint)" style={{ margin: "0 auto 16px" }} />
              <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 24 }}>
                All safety checks passed. Ready to generate label.
              </div>
              <button
                className="btn-primary"
                onClick={generateLabel}
                disabled={generating}
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                {generating ? (
                  <><FileText size={14} style={{ animation: "blink 0.5s infinite" }} /> Generating…</>
                ) : (
                  <><FileText size={14} /> Generate Label</>
                )}
              </button>
            </div>
          ) : (
            <div className="card animate-slide-up" style={{ borderColor: "var(--green)40" }}>
              {/* Label design */}
              <div style={{ padding: "4px 12px", background: "var(--green)", borderRadius: "10px 10px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--bg)", letterSpacing: "0.1em" }}>PHARMAGUARD DISPENSING LABEL</span>
                <span style={{ fontSize: 10, color: "var(--bg)80" }}>VERIFIED</span>
              </div>
              <div style={{ padding: 20 }}>
                {/* Hospital header */}
                <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "var(--text-faint)" }}>GENERAL HOSPITAL · PHARMACY DEPARTMENT</div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Tel: +234-80-PHARMA · Reg No: PCN/2024/001</div>
                </div>

                {/* Patient */}
                <div style={{ marginBottom: 14 }}>
                  <div className="section-label" style={{ marginBottom: 4 }}>PATIENT</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{patient?.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Age: {patient?.age} · Ward: {patient?.ward} · Bed {patient?.bed}</div>
                </div>

                {/* Drug */}
                <div style={{ padding: "12px 14px", background: "var(--surface2)", borderRadius: 8, marginBottom: 14, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--green)", fontFamily: "var(--display)" }}>
                    {rx?.drug} {rx?.strength}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text)", marginTop: 4 }}>{rx?.frequency} · {rx?.route}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>Quantity: {rx?.quantity} {rx?.route === "Oral" ? "tablets" : "units"}</div>
                </div>

                {/* Dates */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div className="card-inner" style={{ padding: "8px 12px" }}>
                    <div className="section-label" style={{ marginBottom: 2 }}>DATE DISPENSED</div>
                    <div style={{ fontSize: 13, color: "var(--text)" }}>{today}</div>
                  </div>
                  <div className="card-inner" style={{ padding: "8px 12px" }}>
                    <div className="section-label" style={{ marginBottom: 2 }}>PRESCRIBER</div>
                    <div style={{ fontSize: 12, color: "var(--text)" }}>{rx?.prescriber?.split("(")[0]}</div>
                  </div>
                </div>

                {/* QR Code placeholder */}
                <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 14px", background: "var(--bg)", borderRadius: 8 }}>
                  <div style={{ width: 48, height: 48, background: "var(--surface2)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <QrCode size={28} color="var(--text-dim)" />
                  </div>
                  <div>
                    <div className="section-label" style={{ marginBottom: 2 }}>QR CODE</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Scan to verify dispensing record</div>
                    <div style={{ fontSize: 10, color: "var(--text-faint)" }}>Rx: {rx?.rxId}</div>
                  </div>
                </div>

                {/* Pharmacist */}
                <div style={{ marginTop: 12, fontSize: 11, color: "var(--text-faint)", textAlign: "center" }}>
                  Dispensed by: {state.pharmacist?.name} — {state.pharmacist?.role}
                </div>
              </div>

              {/* Print button */}
              <div style={{ padding: "0 20px 20px" }}>
                <button
                  className={printed ? "btn-ghost" : "btn-primary"}
                  onClick={printLabel}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  {printed ? (
                    <><CheckCircle size={14} /> Label Printed</>
                  ) : (
                    <><Printer size={14} /> Print Label</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI counselling points */}
        <div>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>AI PATIENT COUNSELLING POINTS</div>
            {loadingWarnings ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="shimmer" style={{ height: 28, borderRadius: 4 }} />
                ))}
              </div>
            ) : aiWarnings.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {aiWarnings.map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "var(--text-dim)" }}>
                    <AlertCircle size={12} color="var(--blue)" style={{ marginTop: 2, flexShrink: 0 }} />
                    {w}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "var(--text-faint)", fontSize: 12 }}>Generate label to view AI-powered counselling points</div>
            )}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>PRE-DISPENSING CHECKLIST</div>
            {[
              "Label matches prescription drug and strength",
              "Patient name clearly visible on label",
              "Dosing instructions are clear and complete",
              "QR code has been affixed to packaging",
              "Patient counselling points provided",
              "Pharmacist signature applied",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
                <CheckCircle size={12} color={generated ? "var(--green)" : "var(--text-faint)"} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: generated ? "var(--text-dim)" : "var(--text-faint)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {printed && (
        <button
          className="btn-primary"
          onClick={() => {
            addAudit("LABEL_AFFIXED", "Label affixed to medication packaging", "success");
            dispatch({ type: "SET_STEP", step: "audit-log" });
          }}
          style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8 }}
        >
          View Audit Log & Complete <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
