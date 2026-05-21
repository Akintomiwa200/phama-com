"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEAL, NAVY } from "@/components/Icon";
import DotGrid from "@/components/ui/DotGrid";
import Icon from "@/components/Icon";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "error">("idle");
  const [pharmacistName, setPharmacistName] = useState("");

  const handleLogin = () => {
    if (!id.trim()) return;
    setStatus("checking");

    setTimeout(() => {
      if (id.trim() === "PANS2024") {
        setStatus("success");
        setPharmacistName("Dr. Adaobi Nnamdi");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setStatus("error");
      }
    }, 1200);
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
        background: "linear-gradient(135deg,#e8faf8 0%,#eef4ff 55%,#f0f9ff 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <DotGrid style={{ opacity: 0.5 }} />
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(43,191,170,0.08)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "0%",
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "rgba(99,179,237,0.08)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 460,
          animation: "fadeUp .6s ease both",
        }}
      >
        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "40px 36px",
            boxShadow: "0 20px 60px rgba(27,45,62,0.12)",
            border: "1px solid rgba(43,191,170,0.1)",
          }}
        >
          {/* Logo & Title */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                width: 56,
                height: 56,
                background: TEAL,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Icon name="flask" size={28} color="#fff" />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-public-sans), sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: NAVY,
                marginBottom: 8,
              }}
            >
              Pharmacist Login
            </h1>
            <p
              style={{
                fontFamily: "var(--font-public-sans), sans-serif",
                fontSize: 14,
                color: "#718096",
                lineHeight: 1.6,
              }}
            >
              Enter your unique pharmacist ID to access the AI safety system.
            </p>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: NAVY,
                  marginBottom: 8,
                  fontFamily: "var(--font-public-sans), sans-serif",
                }}
              >
                Pharmacist ID
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setStatus("idle");
                }}
                placeholder="Enter ID (try PANS2024)"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 14,
                  fontFamily: "var(--font-public-sans), sans-serif",
                  color: NAVY,
                  background: "#fff",
                  border: `1.5px solid ${status === "error" ? "#ff6b6b" : "#E2E8F0"}`,
                  borderRadius: 12,
                  outline: "none",
                  transition: "all .2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  if (status !== "error") {
                    e.currentTarget.style.borderColor = TEAL;
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(43,191,170,0.15)";
                  }
                }}
                onBlur={(e) => {
                  if (status !== "error") {
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              />
              {status === "error" && (
                <p style={{ fontSize: 12, color: "#ff6b6b", marginTop: 6, fontWeight: 500 }}>
                  Invalid pharmacist ID. Please try again.
                </p>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={status === "checking" || !id.trim()}
              style={{
                width: "100%",
                padding: "14px 24px",
                background: status === "success" ? "#1A9E8C" : TEAL,
                color: "#fff",
                border: "none",
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-public-sans), sans-serif",
                cursor: status === "checking" || !id.trim() ? "not-allowed" : "pointer",
                opacity: status === "checking" || !id.trim() ? 0.7 : 1,
                boxShadow: "0 6px 20px rgba(43,191,170,0.35)",
                transition: "all .2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                if (status !== "checking" && id.trim()) {
                  e.currentTarget.style.background = "#1A9E8C";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (status !== "success") {
                  e.currentTarget.style.background = TEAL;
                }
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {status === "checking" ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin .8s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Verifying...
                </>
              ) : status === "success" ? (
                <>
                  <Icon name="check" size={16} color="#fff" />
                  Authorized
                </>
              ) : (
                <>
                  <Icon name="arrowRight" size={16} color="#fff" />
                  Log In
                </>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div
              style={{
                marginTop: 20,
                padding: "14px 16px",
                background: "rgba(43,191,170,0.08)",
                borderRadius: 12,
                border: `1px solid rgba(43,191,170,0.2)`,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: TEAL,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="check" size={14} color="#fff" />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: NAVY,
                    marginBottom: 2,
                  }}
                >
                  Welcome, {pharmacistName}
                </p>
                <p style={{ fontSize: 12, color: "#718096" }}>
                  Redirecting to prescription...
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div
              style={{
                marginTop: 20,
                padding: "14px 16px",
                background: "rgba(255,107,107,0.06)",
                borderRadius: 12,
                border: "1px solid rgba(255,107,107,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: "#ff6b6b",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="x" size={14} color="#fff" />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: NAVY,
                    marginBottom: 2,
                  }}
                >
                  Access Denied
                </p>
                <p style={{ fontSize: 12, color: "#718096" }}>
                  Invalid pharmacist ID or not authorized.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* AI Explanation Box */}
        <div
          style={{
            marginTop: 20,
            background: "#fff",
            borderRadius: 16,
            padding: "20px 24px",
            boxShadow: "0 4px 20px rgba(27,45,62,0.06)",
            border: "1px solid rgba(43,191,170,0.1)",
            borderLeft: `3px solid ${TEAL}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "rgba(43,191,170,0.1)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="brain" size={16} color={TEAL} />
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: TEAL,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              What the AI is doing
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#6B7A8D",
              lineHeight: 1.7,
              fontFamily: "var(--font-public-sans), sans-serif",
            }}
          >
            Verifying identity against the pharmacist database to protect patient confidentiality and ensure only licensed professionals can access sensitive data.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
