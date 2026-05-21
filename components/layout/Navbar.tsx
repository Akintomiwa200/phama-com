"use client";

import { useState, useEffect } from "react";
import Icon, { TEAL, NAVY } from "@/components/Icon";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links: string[] = ["Home", "Services", "AI Platform", "Team", "Resources", "Contact"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "#fff" : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        boxShadow: scrolled ? "0 2px 20px rgba(27,45,62,0.10)" : "none",
        transition: "all .3s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: NAVY,
            letterSpacing: "-0.03em",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: TEAL,
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="flask" size={18} color="#fff" />
          </div>
          LABOREX
        </a>

        <div
          style={{ display: "flex", gap: 28, alignItems: "center" }}
          className="desktop-nav"
        >
          {links.map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#4A5568",
                transition: "color .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4A5568")}
            >
              {l}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            <Icon name="search" size={18} color="#718096" />
          </button>
          <a
            href="/login"
            style={{
              background: TEAL,
              color: "#fff",
              padding: "9px 20px",
              borderRadius: 50,
              fontSize: 13,
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(43,191,170,0.35)",
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1A9E8C";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = TEAL;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Login
          </a>
          <button
            onClick={() => setMobile(!mobile)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            className="mobile-btn"
          >
            <Icon name={mobile ? "x" : "menu"} size={22} color={NAVY} />
          </button>
        </div>
      </div>

      {mobile && (
        <div
          style={{
            background: "#fff",
            padding: "16px 24px 24px",
            borderTop: "1px solid rgba(43,191,170,0.1)",
          }}
        >
          {links.map((l) => (
            <a
              key={l}
              href="#"
              style={{
                display: "block",
                padding: "10px 0",
                fontSize: 15,
                fontWeight: 500,
                color: NAVY,
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
