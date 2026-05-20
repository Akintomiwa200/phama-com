"use client";
import { useApp, useAudit } from "@/lib/store";
import { User, Heart, Pill, AlertTriangle, Activity, ChevronRight, Calendar, MapPin } from "lucide-react";

export default function PatientReview() {
  const { state, dispatch } = useApp();
  const addAudit = useAudit();
  const patient = state.activePatient;
  const rx = state.activePrescription;

  if (!patient || !rx) {
    return (
      <div style={{ padding: 32 }}>
        <div style={{ color: "var(--text-dim)" }}>No patient selected. Go to the prescription queue first.</div>
      </div>
    );
  }

  function proceed() {
    addAudit("PATIENT_REVIEWED", `Patient profile reviewed: ${patient!.name}, ${patient!.conditions.join(", ")}`, "info");
    dispatch({ type: "SET_STEP", step: "interaction-check" });
  }

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 4 }}>STEP 3 — PATIENT PROFILE</div>
        <h1 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Patient Review
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
          AI is pulling full medication history and clinical profile
        </p>
      </div>

      {/* AI reading indicator */}
      <div className="card-inner scan-effect" style={{ padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10, alignItems: "center" }}>
        <Activity size={14} color="var(--green)" />
        <span style={{ fontSize: 12, color: "var(--green)" }}>AI reading prescription and pulling patient medication history…</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-faint)" }}>
          Rx: {rx.rxId} · {rx.drug} {rx.strength}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Identity card */}
        <div className="card" style={{ padding: 24 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>PATIENT IDENTITY</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: "var(--green-glow)",
              border: "1px solid var(--green)30",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <User size={22} color="var(--green)" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{patient.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                {patient.age} yrs · {patient.gender === "F" ? "Female" : "Male"} · ID: {patient.id}
              </div>
            </div>
          </div>
          {[
            { icon: MapPin, label: "Ward", val: `${patient.ward} · Bed ${patient.bed}` },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <Icon size={13} color="var(--text-faint)" />
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{item.label}:</span>
                <span style={{ fontSize: 12, color: "var(--text)" }}>{item.val}</span>
              </div>
            );
          })}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 6 }}>CONDITIONS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {patient.conditions.map((c, i) => (
                <span key={i} style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 4,
                  background: "var(--surface2)", border: "1px solid var(--border2)",
                  color: "var(--text-dim)"
                }}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Vitals */}
        <div className="card" style={{ padding: 24 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>RECENT VITALS — {patient.recentVitals.date}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Blood Pressure", val: patient.recentVitals.bp, unit: "mmHg", warn: true },
              { label: "Heart Rate", val: `${patient.recentVitals.hr}`, unit: "bpm", warn: false },
              { label: "Temperature", val: `${patient.recentVitals.temp}`, unit: "°C", warn: false },
              { label: "SpO₂", val: `${patient.recentVitals.spo2}`, unit: "%", warn: false },
              { label: "Weight", val: `${patient.recentVitals.weight}`, unit: "kg", warn: false },
            ].map((v, i) => (
              <div key={i} className="card-inner" style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: "var(--text-faint)", marginBottom: 4 }}>{v.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: v.warn ? "var(--amber)" : "var(--text)" }}>
                    {v.val}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{v.unit}</span>
                </div>
                {v.warn && <div style={{ fontSize: 10, color: "var(--amber)", marginTop: 2 }}>↑ Elevated</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current medications */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>
          CURRENT MEDICATIONS ({patient.currentMedications.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {patient.currentMedications.map((med, i) => (
            <div key={i} className="card-inner" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <Pill size={14} color="var(--blue)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{med.drug} {med.dose}</span>
                <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 10 }}>{med.frequency} · {med.route}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Since {med.since}</div>
            </div>
          ))}
        </div>

        {/* New prescription highlight */}
        <div style={{
          marginTop: 12, padding: "12px 16px",
          background: "rgba(77,166,255,0.06)", border: "1px solid rgba(77,166,255,0.2)",
          borderRadius: 8, display: "flex", alignItems: "center", gap: 12
        }}>
          <Pill size={14} color="var(--blue)" />
          <div>
            <span style={{ fontSize: 12, color: "var(--blue)" }}>NEW PRESCRIPTION: </span>
            <span style={{ fontSize: 13, color: "var(--text)" }}>{rx.drug} {rx.strength} — {rx.frequency}</span>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-faint)" }}>{rx.prescriber}</span>
        </div>
      </div>

      {/* Allergies */}
      {patient.allergies.length > 0 && (
        <div style={{
          marginBottom: 20, padding: "14px 18px",
          background: "var(--red-glow)", border: "1px solid var(--red-dim)",
          borderRadius: 8, display: "flex", gap: 10, alignItems: "center"
        }}>
          <AlertTriangle size={16} color="var(--red)" />
          <div>
            <span style={{ fontSize: 12, color: "var(--red)", fontWeight: 600 }}>KNOWN ALLERGIES: </span>
            <span style={{ fontSize: 12, color: "var(--text)" }}>{patient.allergies.join(", ")}</span>
          </div>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={proceed}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        Proceed to Drug Interaction Check <ChevronRight size={14} />
      </button>
    </div>
  );
}
