"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, useAudit, syncMutation } from "@/lib/store";

import { AlertTriangle, CheckCircle, Activity, ChevronRight, BookOpen, Phone } from "lucide-react";

export default function InteractionCheck() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const addAudit = useAudit();
  const [found, setFound] = useState<typeof state.drugInteractions>([]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [aiComment, setAiComment] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const patient = state.activePatient;
  const rx = state.activePrescription;

  useEffect(() => {
    if (!patient || !rx) return;
    const allMeds = patient.currentMedications.map(m => m.drug);
    const newDrug = rx.drug;
    const matchDrug = (a: string, b: string) =>
      a.toLowerCase() === b.toLowerCase() ||
      a.toLowerCase().includes(b.toLowerCase()) ||
      b.toLowerCase().includes(a.toLowerCase());

    const interactions = state.drugInteractions.filter(
      (i) =>
        (matchDrug(i.drug1, newDrug) && allMeds.some((m) => matchDrug(m, i.drug2))) ||
        (matchDrug(i.drug2, newDrug) && allMeds.some((m) => matchDrug(m, i.drug1)))
    );
    setFound(interactions);
    if (interactions.length > 0) {
      addAudit("INTERACTION_DETECTED", `${interactions.length} interaction(s) found for ${newDrug}`, "warning");
      setLoadingAI(true);
      fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "interaction",
          drug: rx.drug, strength: rx.strength,
          patient: { name: patient.name, age: patient.age, conditions: patient.conditions },
          interactions: interactions.map(f => ({ drugs: `${f.drug1} + ${f.drug2}`, severity: f.severity, effect: f.effect }))
        })
      }).then(r => r.json()).then(d => setAiComment(d.message || "")).catch(() => setAiComment("AI advisory unavailable. Please consult the BNF and senior pharmacist."))
      .finally(() => setLoadingAI(false));
    } else {
      addAudit("INTERACTION_CHECK", `No interactions found for ${newDrug}`, "success");
    }
  }, [patient, rx, state.drugInteractions]);

  function proceed() {
    dispatch({ type: "SET_INTERACTION_CHECKED", value: true });
    addAudit("INTERACTION_ACKNOWLEDGED", "Pharmacist acknowledged interaction alerts and contacted prescriber", "warning");
    syncMutation("audit_log", "insertOne", {
      time: new Date().toISOString(), action: "INTERACTION_ACKNOWLEDGED",
      details: "Pharmacist acknowledged interaction alerts", level: "warning", user: state.pharmacist?.name
    }).catch(() => {});
    router.push("/dashboard/cascade-check");
  }

  const severityColor = (s: string) => {
    if (s === "CONTRAINDICATED") return "var(--red)";
    if (s === "HIGH") return "var(--red)";
    if (s === "MODERATE") return "var(--amber)";
    return "var(--text-dim)";
  };
  const severityBg = (s: string) => {
    if (s === "CONTRAINDICATED" || s === "HIGH") return "var(--red-glow)";
    if (s === "MODERATE") return "var(--amber-glow)";
    return "transparent";
  };

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 4 }}>DRUG INTERACTIONS</div>
        <h1 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Drug Interaction Analysis
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
          AI comparing {rx?.drug} against patient's existing medications database
        </p>
      </div>

      {found.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          {/* Alert banner */}
          <div style={{
            padding: "16px 20px",
            background: "var(--red-glow)",
            border: "2px solid var(--red-dim)",
            borderRadius: 10, display: "flex", gap: 12, alignItems: "center"
          }} className="animate-pulse-red">
            <AlertTriangle size={20} color="var(--red)" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--red)" }}>
                INTERACTION FOUND — {found.length} alert{found.length > 1 ? "s" : ""}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
                Do not dispense without prescriber confirmation
              </div>
            </div>
          </div>

          {/* Interaction cards */}
          {found.map((interaction, i) => (
            <div key={i} className="card animate-slide-up" style={{ padding: 24, borderColor: severityColor(interaction.severity) + "50" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{
                  padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                  background: severityBg(interaction.severity),
                  color: severityColor(interaction.severity),
                  border: `1px solid ${severityColor(interaction.severity)}40`,
                  letterSpacing: "0.08em"
                }}>
                  {interaction.severity} RISK
                </span>
                <span style={{ fontSize: 15, color: "var(--text)", fontWeight: 600 }}>
                  {interaction.drug1} + {interaction.drug2}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div className="section-label" style={{ marginBottom: 6 }}>CLINICAL EFFECT</div>
                  <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{interaction.effect}</p>
                </div>
                <div>
                  <div className="section-label" style={{ marginBottom: 6 }}>MECHANISM</div>
                  <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5 }}>{interaction.mechanism}</p>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <div className="section-label" style={{ marginBottom: 6 }}>RECOMMENDED ACTION</div>
                  <div style={{
                    padding: "10px 14px",
                    background: "var(--amber-glow)", border: "1px solid var(--amber)30",
                    borderRadius: 6, fontSize: 13, color: "var(--text)"
                  }}>
                    {interaction.action}
                  </div>
                </div>
                <div>
                  <div className="section-label" style={{ marginBottom: 4 }}>REFERENCES</div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)", display: "flex", gap: 6, alignItems: "center" }}>
                    <BookOpen size={11} /> {interaction.references}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* AI Advisory */}
          <div className="card" style={{ padding: 20, borderColor: "var(--blue)30" }}>
            <div className="section-label" style={{ marginBottom: 12 }}>AI CLINICAL ADVISORY</div>
            {loadingAI ? (
              <p style={{ fontSize: 13, color: "var(--text-faint)" }}>Consulting AI advisor...</p>
            ) : aiComment ? (
              <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7 }}>{aiComment}</p>
            ) : (
              <p style={{ fontSize: 12, color: "var(--text-faint)" }}>AI advisory will load automatically.</p>
            )}
          </div>

          {/* Actions */}
          <div className="card" style={{ padding: 20 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>REQUIRED ACTIONS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={e => setAcknowledged(e.target.checked)}
                  style={{ marginTop: 2 }}
                />
                <span style={{ fontSize: 13, color: "var(--text)" }}>
                  I have reviewed the interaction alerts and contacted the prescriber ({rx?.prescriber}). The prescriber has confirmed to proceed / modify prescription.
                </span>
              </label>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={proceed}
            disabled={!acknowledged}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            Continue to Cascade Check <ChevronRight size={14} />
          </button>
        </div>
      ) : (
        <div>
          <div className="card animate-slide-up" style={{ padding: 32, textAlign: "center", borderColor: "var(--green)40" }}>
            <CheckCircle size={40} color="var(--green)" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--green)", marginBottom: 8 }}>No Interactions Detected</div>
            <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
              {rx?.drug} is safe to co-administer with the patient's current medications.
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={proceed}
            style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}
          >
            Continue to Cascade Check <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
