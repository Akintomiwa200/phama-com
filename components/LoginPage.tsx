"use client";
import { useState, useEffect } from "react";
import { useApp, useAudit } from "@/lib/store";
import { PHARMACISTS } from "@/lib/database";
import { Shield, Eye, EyeOff, AlertCircle, Activity } from "lucide-react";

export default function LoginPage() {
  const { dispatch } = useApp();
  const addAudit = useAudit();
  const [pharmacistId, setPharmacistId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const now = new Date();

  async function handleLogin() {
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const found = PHARMACISTS.find(p => p.id === pharmacistId.toUpperCase());
    if (!found || password.length < 4) {
      setError("Invalid credentials. Access denied.");
      setLoading(false);
      return;
    }
    dispatch({ type: "LOGIN", pharmacist: { id: found.id, name: found.name, role: found.role } });
    addAudit("LOGIN", `${found.name} authenticated successfully`, "success");
    setLoading(false);
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(0,232,122,0.04) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "linear-gradient(135deg, var(--green) 0%, #00a855 100%)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Shield size={24} color="#0a0f0d" />
            </div>
            <div style={{ textAlign: "left" }}>
              <div className="display-font" style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
                PharmaGuard
              </div>
              <div className="section-label">AI Dispensing System v3.2</div>
            </div>
          </div>

          {/* Live clock */}
          <div className="card-inner" style={{ padding: "8px 16px", display: "inline-flex", gap: 16, alignItems: "center" }}>
            <div className="flex items-center gap-2">
              <span className="status-dot green" />
              <span style={{ color: "var(--green)", fontSize: 12 }}>SYSTEM ONLINE</span>
            </div>
            <span style={{ color: "var(--text-faint)", fontSize: 11 }}>|</span>
            <span style={{ color: "var(--text-dim)", fontSize: 12 }}>
              {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="card animate-fade" style={{ padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 4 }}>
              Secure Pharmacist Authentication
            </div>
            <div style={{ height: 1, background: "var(--border)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="section-label" style={{ display: "block", marginBottom: 6 }}>
                Pharmacist ID
              </label>
              <input
                className="input-field"
                placeholder="e.g. PANS2024"
                value={pharmacistId}
                onChange={e => setPharmacistId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
              />
            </div>

            <div>
              <label className="section-label" style={{ display: "block", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  style={{ paddingRight: 44 }}
                />
                <button
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "var(--text-faint)", cursor: "pointer"
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="animate-slide-up" style={{
                background: "var(--red-glow)", border: "1px solid var(--red-dim)",
                borderRadius: 6, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 8
              }}>
                <AlertCircle size={14} color="var(--red)" />
                <span style={{ color: "var(--red)", fontSize: 12 }}>{error}</span>
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleLogin}
              disabled={loading || !pharmacistId || !password}
              style={{ marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {loading ? (
                <>
                  <Activity size={14} className="animate-spin" />
                  Verifying identity...
                </>
              ) : (
                "Authenticate & Enter"
              )}
            </button>
          </div>

          {/* Demo credentials */}
          <div style={{ marginTop: 24, padding: 14, background: "var(--bg)", borderRadius: 6, border: "1px solid var(--border)" }}>
            <div className="section-label" style={{ marginBottom: 8 }}>DEMO CREDENTIALS</div>
            {PHARMACISTS.map(p => (
              <button
                key={p.id}
                onClick={() => { setPharmacistId(p.id); setPassword("password123"); }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: "none", border: "none", cursor: "pointer",
                  padding: "4px 0", color: "var(--text-dim)", fontSize: 12,
                  transition: "color 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--green)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
              >
                <span style={{ color: "var(--green)", marginRight: 8 }}>{p.id}</span>
                {p.name} — {p.role}
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, color: "var(--text-faint)", fontSize: 11 }}>
          PharmaGuard AI © 2026 · NAFDAC Certified · ISO 9001:2015
        </div>
      </div>
    </div>
  );
}
