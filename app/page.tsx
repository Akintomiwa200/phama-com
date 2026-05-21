"use client";

import { useState, ReactNode } from "react";
import Icon, { TEAL, NAVY } from "@/components/Icon";
import Eyebrow from "@/components/ui/Eyebrow";
import DotGrid from "@/components/ui/DotGrid";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FeatureItem {
  icon: import("@/components/Icon").IconName;
  title: string;
  desc: string;
}

interface StatItem {
  value: string;
  label: string;
}

interface TestimonialItem {
  name: string;
  role: string;
  text: string;
}

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  screenLines: string[];
  aiAction: string;
  alertType?: "interaction" | "cascade";
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero(): ReactNode {
  return (
    <section style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#e8faf8 0%,#eef4ff 55%,#f0f9ff 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <DotGrid style={{ opacity: 0.6 }} />
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 420, height: 420, borderRadius: "50%", background: "rgba(43,191,170,0.08)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "0%", width: 300, height: 300, borderRadius: "50%", background: "rgba(99,179,237,0.08)", filter: "blur(60px)", pointerEvents: "none" }} />

      <div className="two-col" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", position: "relative" }}>
        <div style={{ animation: "fadeUp .7s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(43,191,170,0.1)", color: TEAL, borderRadius: 50, padding: "6px 14px", fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
            <Icon name="brain" size={14} color={TEAL} /> AI-Powered Pharmacy Safety
          </div>
          <h1 style={{ fontFamily: "var(--font-public-sans), sans-serif", fontSize: "clamp(34px,4vw,52px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 18 }}>
            Intelligent Drug Safety<br />for Better Patient<br />
            <span style={{ color: TEAL }}>Outcomes</span>
          </h1>
          <p style={{ fontSize: 15, color: "#6B7A8D", lineHeight: 1.75, maxWidth: 480, marginBottom: 32 }}>
            Our AI platform detects dangerous drug interactions and prescribing cascades before they reach patients. Protecting lives through intelligent medication safety.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
            <a href="#" style={{ background: TEAL, color: "#fff", padding: "12px 26px", borderRadius: 50, fontSize: 13, fontWeight: 600, boxShadow: "0 6px 20px rgba(43,191,170,0.35)", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1A9E8C"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = TEAL; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              See AI in Action <Icon name="arrowRight" size={15} color="#fff" />
            </a>
            <a href="#" style={{ border: `1.5px solid ${TEAL}`, color: TEAL, padding: "12px 26px", borderRadius: 50, fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, transition: "all .2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(43,191,170,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Learn More
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 14, padding: "12px 18px", boxShadow: "0 4px 20px rgba(27,45,62,0.08)", width: "fit-content" }}>
            <div style={{ width: 40, height: 40, background: "rgba(43,191,170,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="shield" size={20} color={TEAL} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>98% Interaction Detection Rate</div>
              <div style={{ fontSize: 11, color: "#718096" }}>Trusted by 500+ Pharmacies</div>
            </div>
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", animation: "fadeIn .9s ease both .2s" }}>
          <div style={{ position: "absolute", width: 380, height: 380, border: "2px dashed rgba(43,191,170,0.25)", borderRadius: "50%", animation: "float 8s ease-in-out infinite" }} />
          <div style={{ width: 340, height: 380, borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%", background: "linear-gradient(160deg,rgba(43,191,170,0.22) 0%,rgba(99,179,237,0.18) 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ textAlign: "center" }}>
              <Icon name="brain" size={80} color="rgba(43,191,170,0.3)" />
              <div style={{ fontSize: 12, marginTop: 8, color: "rgba(43,191,170,0.5)", fontWeight: 500 }}>AI Safety Engine</div>
            </div>
          </div>
          <div style={{ position: "absolute", top: "8%", right: "0%", animation: "float 3.5s ease-in-out infinite .5s" }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "12px 18px", boxShadow: "0 8px 32px rgba(43,191,170,0.18)" }}>
              <div style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>Real-time Scanning</div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "12%", left: "0%", background: "#fff", borderRadius: 12, padding: "10px 14px", boxShadow: "0 4px 20px rgba(43,191,170,0.15)", animation: "float 5s ease-in-out infinite 1s" }}>
            <Icon name="prescription" size={28} color={TEAL} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FeaturesBar ──────────────────────────────────────────────────────────────
function FeaturesBar(): ReactNode {
  const items: FeatureItem[] = [
    { icon: "shield", title: "Drug Interaction Detection", desc: "Real-time scanning against 2M+ drug pairs to prevent dangerous combinations." },
    { icon: "brain", title: "Prescribing Cascade Alerts", desc: "Identifies when new drugs treat side effects instead of root causes." },
    { icon: "clock", title: "Instant Verification", desc: "Sub-second response times for seamless pharmacy workflow integration." },
  ];
  return (
    <section style={{ background: "#fff", padding: "0 24px", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, background: "#fff", borderRadius: 20, padding: "36px 40px", boxShadow: "0 8px 48px rgba(27,45,62,0.10)", marginTop: -40, border: "1px solid rgba(43,191,170,0.08)" }}>
          {items.map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "8px 16px" }}>
              <div style={{ width: 52, height: 52, background: "rgba(43,191,170,0.1)", borderRadius: 14, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={item.icon} size={24} color={TEAL} />
              </div>
              <h3 style={{ fontFamily: "var(--font-public-sans), sans-serif", fontSize: 15, fontWeight: 600, color: NAVY, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: "#718096", lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Workflow Demo ─────────────────────────────────────────────────────────
function AIWorkflowDemo(): ReactNode {
  const [step, setStep] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const steps: WorkflowStep[] = [
    {
      id: 1,
      title: "Pharmacist Logs In",
      description: "The pharmacist starts by logging into the system with their unique ID. The AI checks if this person is authorized to dispense medication.",
      screenLines: ["Pharmacist ID: PANS2024", "✓ Authorized. Welcome."],
      aiAction: "Verifying identity to protect patient confidentiality."
    },
    {
      id: 2,
      title: "Prescription Arrives",
      description: "Pharmacist enters the patient ID number. The AI pulls the complete medication history.",
      screenLines: [
        "Patient: Mrs. Folake E. (72 years old)",
        "Prescribed: Amlodipine 10mg (once daily)",
        "Current: Metformin, Simvastatin, Lisinopril"
      ],
      aiAction: "Reading the prescription and pulling the patient's medication history."
    },
    {
      id: 3,
      title: "AI Checks for Drug Interactions",
      description: "The AI now checks if the new drug will react badly with any of the patient's current medications.",
      screenLines: [
        "AI Scanning Drug List...",
        "⚠️ INTERACTION FOUND",
        "Amlodipine + Simvastatin = High risk of muscle damage",
        "Contact prescriber before dispensing."
      ],
      aiAction: "Comparing the new drug against a database of dangerous drug pairs.",
      alertType: "interaction"
    },
    {
      id: 4,
      title: "AI Checks for Prescribing Cascade",
      description: "The AI checks for a prescribing cascade - when a new drug is prescribed to treat a side effect of an old drug, instead of fixing the original problem.",
      screenLines: [
        "🔍 CASCADE PATTERN DETECTED",
        "Patient takes Lisinopril (causes dry cough in 10-20%)",
        "Amlodipine is sometimes added when cough occurs",
        "Confirm with prescriber: Does patient have Lisinopril-induced cough?"
      ],
      aiAction: "Recognizing patterns that lead to unnecessary medications.",
      alertType: "cascade"
    }
  ];

  const currentStep: WorkflowStep = steps[step - 1];

  const goToStep = (stepNum: number): void => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(stepNum);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <section style={{ padding: "96px 24px", background: "linear-gradient(135deg,rgba(43,191,170,0.03) 0%,rgba(99,179,237,0.04) 100%)", position: "relative", overflow: "hidden" }}>
      <DotGrid style={{ opacity: 0.3 }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Eyebrow>Live Demo</Eyebrow>
          <h2 style={{ fontFamily: "var(--font-public-sans), sans-serif", fontSize: "clamp(28px,3vw,40px)", fontWeight: 700, color: NAVY, lineHeight: 1.2 }}>
            See AI in Action<br />
            <span style={{ color: TEAL }}>Real-time Medication Safety</span>
          </h2>
          <p style={{ fontSize: 14.5, color: "#6B7A8D", maxWidth: 600, margin: "16px auto 0", lineHeight: 1.7 }}>
            Watch how our AI protects patients by detecting dangerous drug interactions and prescribing cascades
          </p>
        </div>

        {/* Step Progress */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => goToStep(s.id)}
              style={{
                padding: "10px 20px",
                borderRadius: 40,
                border: "none",
                cursor: "pointer",
                background: step === s.id ? TEAL : "#fff",
                color: step === s.id ? "#fff" : NAVY,
                fontSize: 13,
                fontWeight: 600,
                boxShadow: step === s.id ? "0 4px 16px rgba(43,191,170,0.3)" : "0 2px 8px rgba(27,45,62,0.06)",
                transition: "all .2s",
                fontFamily: "var(--font-public-sans), sans-serif"
              }}
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "stretch" }}>
          {/* Screen Display */}
          <div style={{
            background: NAVY,
            borderRadius: 24,
            padding: "28px",
            boxShadow: "0 20px 40px rgba(27,45,62,0.2)",
            transition: "all .3s",
            opacity: isAnimating ? 0.7 : 1,
            transform: isAnimating ? "scale(0.98)" : "scale(1)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
              </div>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginLeft: 8 }}>AI Pharmacy Safety System</span>
            </div>

            <div style={{ fontFamily: "var(--font-public-sans), monospace", fontSize: 13, lineHeight: 1.8 }}>
              {currentStep.screenLines.map((line, idx) => {
                if (line.includes("⚠️ INTERACTION FOUND")) {
                  return (
                    <div key={idx} style={{ color: "#ff6b6b", marginBottom: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon name="alert" size={14} color="#ff6b6b" /> {line.replace("⚠️ ", "")}
                    </div>
                  );
                }
                if (line.includes("🔍 CASCADE PATTERN DETECTED")) {
                  return (
                    <div key={idx} style={{ color: "#ffb347", marginBottom: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                      🔍 {line.replace("🔍 ", "")}
                    </div>
                  );
                }
                if (line.startsWith("✓")) {
                  return <div key={idx} style={{ color: TEAL, marginBottom: 8 }}>{line}</div>;
                }
                if (line.startsWith("AI Scanning")) {
                  return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 6, height: 6, background: TEAL, borderRadius: "50%", animation: "pulse 1s infinite" }} />
                      <span style={{ color: "rgba(255,255,255,0.8)" }}>{line}</span>
                    </div>
                  );
                }
                return <div key={idx} style={{ color: idx === 0 ? TEAL : "rgba(255,255,255,0.8)", marginBottom: 8 }}>{line}</div>;
              })}
            </div>

            {currentStep.alertType && (
              <div style={{
                marginTop: 20,
                padding: 12,
                background: currentStep.alertType === "interaction" ? "rgba(255,107,107,0.1)" : "rgba(255,179,71,0.1)",
                borderRadius: 12,
                borderLeft: `3px solid ${currentStep.alertType === "interaction" ? "#ff6b6b" : "#ffb347"}`
              }}>
                <div style={{ color: currentStep.alertType === "interaction" ? "#ff6b6b" : "#ffb347", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                  {currentStep.alertType === "interaction" ? "⚠️ CLINICAL ALERT" : "⚠️ CASCADE WARNING"}
                </div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, lineHeight: 1.5 }}>
                  {currentStep.alertType === "interaction"
                    ? "High risk of muscle damage and kidney failure. Contact prescriber before dispensing."
                    : "Lisinopril causes dry cough. Amlodipine may be treating the cough, not the BP. Please verify with prescriber."}
                </div>
              </div>
            )}
          </div>

          {/* AI Action Panel */}
          <div style={{
            background: "#fff",
            borderRadius: 24,
            padding: "28px",
            boxShadow: "0 8px 32px rgba(27,45,62,0.08)",
            border: "1px solid rgba(43,191,170,0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, background: "rgba(43,191,170,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="brain" size={22} color={TEAL} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>AI Analysis</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{currentStep.title}</div>
              </div>
            </div>

            <p style={{ fontSize: 14.5, color: "#6B7A8D", lineHeight: 1.75, marginBottom: 24 }}>
              {currentStep.description}
            </p>

            <div style={{
              background: "rgba(43,191,170,0.05)",
              borderRadius: 16,
              padding: "16px 20px",
              borderLeft: `3px solid ${TEAL}`
            }}>
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 8 }}>WHAT THE AI IS DOING</div>
              <p style={{ fontSize: 13.5, color: "#4A5568", lineHeight: 1.65 }}>
                {currentStep.aiAction}
              </p>
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${(step / steps.length) * 100}%`, height: "100%", background: TEAL, borderRadius: 2, transition: "width .3s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                <button
                  onClick={() => goToStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: step === 1 ? "not-allowed" : "pointer",
                    color: step === 1 ? "#CBD5E0" : TEAL,
                    fontSize: 13,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  ← Previous
                </button>
                <span style={{ fontSize: 12, color: "#718096" }}>Step {step} of {steps.length}</span>
                <button
                  onClick={() => goToStep(Math.min(steps.length, step + 1))}
                  disabled={step === steps.length}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: step === steps.length ? "not-allowed" : "pointer",
                    color: step === steps.length ? "#CBD5E0" : TEAL,
                    fontSize: 13,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── StatsBanner ──────────────────────────────────────────────────────────────
function StatsBanner(): ReactNode {
  const stats: StatItem[] = [
    { value: "2M+", label: "Drug Pairs Analyzed" },
    { value: "500+", label: "Partner Pharmacies" },
    { value: "98%", label: "Detection Rate" },
    { value: "15K+", label: "Lives Protected" },
  ];
  return (
    <section style={{ background: TEAL, padding: "56px 24px" }}>
      <div className="four-col" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, textAlign: "center" }}>
        {stats.map((s, i) => (
          <div key={i}>
            <div style={{ fontFamily: "var(--font-public-sans), sans-serif", fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About(): ReactNode {
  return (
    <section style={{ padding: "96px 24px", background: "#fff", overflow: "hidden" }}>
      <div className="two-col" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
        <div style={{ position: "relative", height: 440 }}>
          <DotGrid style={{ opacity: 0.4, borderRadius: 24 }} />
          <div style={{ position: "absolute", left: 0, top: 20, width: "68%", height: "72%", background: "linear-gradient(135deg,rgba(43,191,170,0.15),rgba(99,179,237,0.15))", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(43,191,170,0.15)" }}>
            <Icon name="shield" size={60} color="rgba(43,191,170,0.35)" />
          </div>
          <div style={{ position: "absolute", right: 0, bottom: 20, width: "52%", height: "55%", background: "linear-gradient(135deg,rgba(99,179,237,0.15),rgba(43,191,170,0.12))", borderRadius: 18, border: "3px solid #fff", boxShadow: "0 8px 32px rgba(27,45,62,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="brain" size={44} color="rgba(43,191,170,0.35)" />
          </div>
        </div>

        <div>
          <Eyebrow>About Laborex AI</Eyebrow>
          <h2 style={{ fontFamily: "var(--font-public-sans), sans-serif", fontSize: "clamp(28px,3vw,38px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 20 }}>
            Protecting Patients Through<br />Intelligent Medication Safety
          </h2>
          <p style={{ fontSize: 14.5, color: "#6B7A8D", lineHeight: 1.8, marginBottom: 12 }}>
            Every year, preventable drug interactions harm thousands of patients. Our AI platform identifies dangerous medication combinations and prescribing cascades before they reach the patient.
          </p>
          <p style={{ fontSize: 14.5, color: "#6B7A8D", lineHeight: 1.8, marginBottom: 36 }}>
            We partner with pharmacies and healthcare providers to create a safer medication ecosystem through real-time clinical decision support.
          </p>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, background: "rgba(43,191,170,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="clock" size={20} color={TEAL} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 4 }}>Real-time Processing</div>
                <div style={{ fontSize: 12.5, color: "#718096", lineHeight: 1.65 }}>Sub-second alerts during verification</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, background: "rgba(43,191,170,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="users" size={20} color={TEAL} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 4 }}>Seamless Integration</div>
                <div style={{ fontSize: 12.5, color: "#718096", lineHeight: 1.65 }}>Works with existing pharmacy systems</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials(): ReactNode {
  const items: TestimonialItem[] = [
    { name: "Dr. Sarah Mitchell", role: "Chief Pharmacist", text: "Laborex AI has transformed how we verify medications. The cascade detection caught a dangerous pattern we would have missed. This is life-saving technology." },
    { name: "James Okafor", role: "Pharmacy Director", text: "Since implementing Laborex, we've prevented over 50 serious drug interactions. The integration was seamless and the team's support is exceptional." },
    { name: "Anika Petersen", role: "Healthcare Admin", text: "The prescribing cascade alerts are revolutionary. We're finally addressing polypharmacy issues proactively instead of reacting to adverse events." },
  ];
  return (
    <section style={{ padding: "96px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Eyebrow>Testimonials</Eyebrow>
          <h2 style={{ fontFamily: "var(--font-public-sans), sans-serif", fontSize: "clamp(28px,3vw,38px)", fontWeight: 700, color: NAVY }}>
            Trusted by Healthcare Professionals
          </h2>
        </div>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {items.map((t, i) => (
            <div key={i}
              style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 4px 28px rgba(27,45,62,0.08)", border: "1px solid rgba(43,191,170,0.1)", transition: "all .25s" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 48px rgba(43,191,170,0.18)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 28px rgba(27,45,62,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ color: TEAL, fontSize: 36, lineHeight: 1, marginBottom: 16, fontFamily: "Georgia,serif" }}>&ldquo;</div>
              <p style={{ fontSize: 14, color: "#6B7A8D", lineHeight: 1.8, marginBottom: 20 }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,rgba(43,191,170,0.2),rgba(99,179,237,0.2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="users" size={20} color={TEAL} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#718096" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA(): ReactNode {
  return (
    <section style={{ padding: "80px 24px", position: "relative", overflow: "hidden", background: `linear-gradient(135deg,${NAVY} 0%,#1a3a52 100%)` }}>
      <DotGrid style={{ opacity: 0.1 }} />
      <div style={{ position: "absolute", top: "-40%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(43,191,170,0.08)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <Eyebrow>Get Started</Eyebrow>
        <h2 style={{ fontFamily: "var(--font-public-sans), sans-serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>
          Ready to Protect Your Patients?<br />Get Started Today.
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.75 }}>
          Join hundreds of pharmacies using Laborex AI to prevent medication errors and save lives.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/login" style={{ background: TEAL, color: "#fff", padding: "14px 30px", borderRadius: 50, fontSize: 14, fontWeight: 600, boxShadow: "0 6px 24px rgba(43,191,170,0.4)", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(43,191,170,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(43,191,170,0.4)"; }}
          >
            Get Started <Icon name="arrowRight" size={16} color="#fff" />
          </a>
          <a href="#" style={{ border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", padding: "14px 30px", borderRadius: 50, fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, transition: "all .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.color = TEAL; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
          >
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LaborexPage(): ReactNode {
  return (
    <div style={{ fontFamily: "var(--font-public-sans), sans-serif" }}>
      <main>
        <Hero />
        <FeaturesBar />
        <AIWorkflowDemo />
        <StatsBanner />
        <About />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
}
