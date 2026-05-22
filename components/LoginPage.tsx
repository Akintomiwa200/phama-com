"use client";
import { useState, useEffect } from "react";
import { useApp, useAudit } from "@/lib/store";
import { Shield, AlertCircle, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { dispatch } = useApp();
  const addAudit = useAudit();
  const [pharmacistId, setPharmacistId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const now = new Date();

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pharmacistId.toUpperCase() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid practitioner ID. Access denied.");
        setLoading(false);
        return;
      }

      dispatch({
        type: "LOGIN",
        pharmacist: {
          id: data.id,
          name: data.name,
          role: data.role,
          licenseNumber: data.licenseNumber,
        },
      });
      addAudit("LOGIN", `${data.name} authenticated successfully`, "success");
      router.push("/dashboard");
    } catch {
      setError("Cannot reach authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
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
              disabled={loading || !pharmacistId.trim()}
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

          {/* Demo credentials removed — use real /api/login with your practitioner ID */}
          <div style={{ marginTop: 24, padding: 14, background: "var(--bg)", borderRadius: 6, border: "1px solid var(--border)" }}>
            <div className="section-label" style={{ marginBottom: 8 }}>LOGIN</div>
            <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Enter your practitioner ID only (e.g. PANS2024). No password required.</div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, color: "var(--text-faint)", fontSize: 11 }}>
          PharmaGuard AI © 2026 · NAFDAC Certified · ISO 9001:2015
        </div>
      </div>
    </div>
  );
}
