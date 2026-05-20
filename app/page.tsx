"use client";

import { useState, useEffect, CSSProperties, ReactNode } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const TEAL = "#2BBFAA";
const NAVY = "#1B2D3E";

// ─── Types ────────────────────────────────────────────────────────────────────
type IconName =
  | "flask" | "users" | "clock" | "microscope" | "activity" | "droplets"
  | "search" | "menu" | "x" | "chevron" | "arrowRight" | "check"
  | "mail" | "phone" | "pin" | "beaker" | "atom" | "dna"
  | "fb" | "tw" | "li" | "yt";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

interface StatBadgeProps {
  value: string;
  label: string;
}

interface EyebrowProps {
  children: ReactNode;
}

interface DotGridProps {
  style?: CSSProperties;
}

interface TabItem {
  icon: IconName;
  label: string;
}

interface TabDetail {
  title: string;
  desc: string;
  checks: string[];
}

interface FeatureItem {
  icon: IconName;
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

interface ContactItem {
  icon: IconName;
  text: string;
}

interface SocialItem {
  name: IconName;
  href: string;
}

// ─── Icon Component ───────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = TEAL, strokeWidth = 1.8 }: IconProps) => {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const sf = { width: size, height: size, viewBox: "0 0 24 24", fill: color };

  const icons: Record<IconName, ReactNode> = {
    flask: (
      <svg {...s}>
        <path d="M9 3h6M9 3v8l-4.5 7.5A2 2 0 0 0 6.27 21h11.46a2 2 0 0 0 1.77-2.5L15 11V3" />
        <path d="M6.21 15h11.58" />
      </svg>
    ),
    users: (
      <svg {...s}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    clock: (
      <svg {...s}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    microscope: (
      <svg {...s}>
        <path d="M6 18h8M3 21h18M14 10a4 4 0 1 0-8 0v1h8v-1zM12 2v8M8 2v3" />
      </svg>
    ),
    activity: (
      <svg {...s}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    droplets: (
      <svg {...s}>
        <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
        <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
      </svg>
    ),
    search: (
      <svg {...s}>
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    menu: (
      <svg {...s}>
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    x: (
      <svg {...s}>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    chevron: (
      <svg {...s}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
    arrowRight: (
      <svg {...s}>
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    check: (
      <svg {...s}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    mail: (
      <svg {...s}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    phone: (
      <svg {...s}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    pin: (
      <svg {...s}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    beaker: (
      <svg {...s}>
        <path d="M4.5 3h15M6 3v10l-3.5 6A2 2 0 0 0 4.27 21h15.46a2 2 0 0 0 1.77-2L18 13V3" />
        <path d="M6 15h12" />
      </svg>
    ),
    atom: (
      <svg {...s}>
        <circle cx="12" cy="12" r="1" />
        <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9C11.2 3.8 5.87 1.78 3.83 3.82c-2.04 2.04-.02 7.37 4.5 11.91S18.16 22.24 20.2 20.2z" />
        <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.91-2.04-2.04-7.37-.02-11.91 4.5S1.75 18.15 3.79 20.19c2.04 2.04 7.37.02 11.91-4.49z" />
      </svg>
    ),
    dna: (
      <svg {...s}>
        <path d="M2 15c6.667-6 13.333 0 20-6" /><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
        <path d="M15 2c-1.798 1.999-2.518 3.997-2.807 5.994" /><path d="m17 6-2.5-2.5" /><path d="m14 8-1-1" />
        <path d="m7 18 2.5 2.5" /><path d="m10 16 1 1" /><path d="m16.5 11.5 1 1" />
        <path d="m20 9 .5.5" /><path d="m6.5 12.5 1 1" /><path d="m3 16 .5.5" />
      </svg>
    ),
    fb: <svg {...sf}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
    tw: <svg {...sf}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1 4.52 4.52 0 0 0-7.69 4.13A12.83 12.83 0 0 1 2.67.89a4.52 4.52 0 0 0 1.4 6.03A4.47 4.47 0 0 1 2 6.38v.06a4.52 4.52 0 0 0 3.62 4.43 4.52 4.52 0 0 1-2.04.08 4.52 4.52 0 0 0 4.22 3.14A9.06 9.06 0 0 1 2 19.54a12.77 12.77 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 24 4.59a9 9 0 0 1-2.6.72A4.52 4.52 0 0 0 23 3z" /></svg>,
    li: <svg {...sf}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>,
    yt: (
      <svg {...sf}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  };

  return <>{icons[name]}</>;
};

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
const Eyebrow = ({ children }: EyebrowProps) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, color: TEAL, fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
    <span style={{ width: 28, height: 1.5, background: TEAL, borderRadius: 1, display: "inline-block" }} />
    {children}
    <span style={{ width: 28, height: 1.5, background: TEAL, borderRadius: 1, display: "inline-block" }} />
  </div>
);

// ─── DotGrid ──────────────────────────────────────────────────────────────────
const DotGrid = ({ style = {} }: DotGridProps) => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: `radial-gradient(circle, rgba(43,191,170,0.18) 1.5px, transparent 1.5px)`,
    backgroundSize: "22px 22px",
    ...style,
  }} />
);

// ─── StatBadge ────────────────────────────────────────────────────────────────
const StatBadge = ({ value, label }: StatBadgeProps) => (
  <div style={{
    background: "#fff", borderRadius: 16, padding: "14px 20px",
    boxShadow: "0 8px 32px rgba(43,191,170,0.18)", textAlign: "center",
    animation: "float 4s ease-in-out infinite",
  }}>
    <div style={{ fontSize: 28, fontWeight: 700, color: NAVY, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 11, color: "#718096", fontWeight: 500, marginTop: 4 }}>{label}</div>
  </div>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links: string[] = ["Home", "Pages", "Team", "Events", "Gallery", "Blog", "Contact Us"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif}
        a{text-decoration:none;color:inherit}
        @media(max-width:768px){.desktop-nav{display:none!important}.mobile-btn{display:flex!important}}
        @media(max-width:900px){.two-col{grid-template-columns:1fr!important}.footer-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.footer-grid{grid-template-columns:1fr!important}.three-col{grid-template-columns:1fr!important}.four-col{grid-template-columns:1fr 1fr!important}}
      `}</style>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "#fff" : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        boxShadow: scrolled ? "0 2px 20px rgba(27,45,62,0.10)" : "none",
        transition: "all .3s",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY, letterSpacing: "-0.03em" }}>
            <div style={{ width: 34, height: 34, background: TEAL, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="flask" size={18} color="#fff" />
            </div>
            LABOREX
          </a>

          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="desktop-nav">
            {links.map((l) => (
              <a key={l} href="#"
                style={{ fontSize: 13, fontWeight: 500, color: "#4A5568", display: "flex", alignItems: "center", gap: 3, transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4A5568")}
              >
                {l}
                {l !== "Contact Us" && <Icon name="chevron" size={13} color="#94a3b8" />}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <Icon name="search" size={18} color="#718096" />
            </button>
            <a href="#" style={{
              background: TEAL, color: "#fff", padding: "9px 20px", borderRadius: 50,
              fontSize: 13, fontWeight: 600, boxShadow: "0 4px 14px rgba(43,191,170,0.35)", transition: "all .2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1A9E8C"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = TEAL; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Request Quote
            </a>
            <button onClick={() => setMobile(!mobile)}
              style={{ display: "none", background: "none", border: "none", cursor: "pointer" }}
              className="mobile-btn"
            >
              <Icon name={mobile ? "x" : "menu"} size={22} color={NAVY} />
            </button>
          </div>
        </div>

        {mobile && (
          <div style={{ background: "#fff", padding: "16px 24px 24px", borderTop: "1px solid rgba(43,191,170,0.1)" }}>
            {links.map((l) => (
              <a key={l} href="#" style={{ display: "block", padding: "10px 0", fontSize: 15, fontWeight: 500, color: NAVY, borderBottom: "1px solid #f1f5f9" }}>{l}</a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      paddingTop: 64, minHeight: "100vh",
      background: "linear-gradient(135deg,#e8faf8 0%,#eef4ff 55%,#f0f9ff 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <DotGrid style={{ opacity: 0.6 }} />
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 420, height: 420, borderRadius: "50%", background: "rgba(43,191,170,0.08)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "0%", width: 300, height: 300, borderRadius: "50%", background: "rgba(99,179,237,0.08)", filter: "blur(60px)", pointerEvents: "none" }} />

      <div className="two-col" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", position: "relative" }}>
        {/* Left */}
        <div style={{ animation: "fadeUp .7s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(43,191,170,0.1)", color: TEAL, borderRadius: 50, padding: "6px 14px", fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
            <Icon name="atom" size={14} color={TEAL} /> Trusted Research Lab
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(34px,4vw,52px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 18 }}>
            We&apos;re Responsible<br />for The Safety of<br />
            <span style={{ color: TEAL }}>Cosmetics Testing</span>
          </h1>
          <p style={{ fontSize: 15, color: "#6B7A8D", lineHeight: 1.75, maxWidth: 420, marginBottom: 32 }}>
            Excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum at vero eos dignissim.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
            <a href="#" style={{ background: TEAL, color: "#fff", padding: "12px 26px", borderRadius: 50, fontSize: 13, fontWeight: 600, boxShadow: "0 6px 20px rgba(43,191,170,0.35)", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1A9E8C"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = TEAL; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Our Services <Icon name="arrowRight" size={15} color="#fff" />
            </a>
            <a href="#" style={{ border: `1.5px solid ${TEAL}`, color: TEAL, padding: "12px 26px", borderRadius: 50, fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, transition: "all .2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(43,191,170,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Discover
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 14, padding: "12px 18px", boxShadow: "0 4px 20px rgba(27,45,62,0.08)", width: "fit-content" }}>
            <div style={{ width: 40, height: 40, background: "rgba(43,191,170,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="flask" size={20} color={TEAL} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>600+ Different Tests</div>
              <div style={{ fontSize: 11, color: "#718096" }}>Experienced Professionals</div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", animation: "fadeIn .9s ease both .2s" }}>
          <div style={{ position: "absolute", width: 380, height: 380, border: "2px dashed rgba(43,191,170,0.25)", borderRadius: "50%", animation: "float 8s ease-in-out infinite" }} />
          <div style={{ width: 340, height: 380, borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%", background: "linear-gradient(160deg,rgba(43,191,170,0.22) 0%,rgba(99,179,237,0.18) 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ textAlign: "center" }}>
              <Icon name="microscope" size={80} color="rgba(43,191,170,0.3)" />
              <div style={{ fontSize: 12, marginTop: 8, color: "rgba(43,191,170,0.5)", fontWeight: 500 }}>Laboratory Expert</div>
            </div>
          </div>
          <div style={{ position: "absolute", top: "8%", right: "0%", animation: "float 3.5s ease-in-out infinite .5s" }}>
            <StatBadge value="34" label="Journal Articles" />
          </div>
          <div style={{ position: "absolute", bottom: "12%", left: "0%", background: "#fff", borderRadius: 12, padding: "10px 14px", boxShadow: "0 4px 20px rgba(43,191,170,0.15)", animation: "float 5s ease-in-out infinite 1s" }}>
            <Icon name="dna" size={28} color={TEAL} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FeaturesBar ──────────────────────────────────────────────────────────────
function FeaturesBar() {
  const items: FeatureItem[] = [
    { icon: "flask", title: "Laboratory Services", desc: "Excepteur sint occaecat pre dent sunt in culpa qui officia." },
    { icon: "users", title: "Professionals Area", desc: "Excepteur sint occaecat pre dent sunt in culpa qui officia." },
    { icon: "clock", title: "Opening Hours", desc: "Excepteur sint occaecat pre dent sunt in culpa qui officia." },
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
              <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: NAVY, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: "#718096", lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const subItems: FeatureItem[] = [
    { icon: "activity", title: "Medical Research", desc: "Excepteur sint occaecat pre dent sunt in culpa qui." },
    { icon: "droplets", title: "Blood Resources", desc: "Excepteur sint occaecat pre dent sunt in culpa qui." },
  ];
  return (
    <section style={{ padding: "96px 24px", background: "#fff", overflow: "hidden" }}>
      <div className="two-col" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
        <div style={{ position: "relative", height: 440 }}>
          <DotGrid style={{ opacity: 0.4, borderRadius: 24 }} />
          <div style={{ position: "absolute", left: 0, top: 20, width: "68%", height: "72%", background: "linear-gradient(135deg,rgba(43,191,170,0.15),rgba(99,179,237,0.15))", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(43,191,170,0.15)" }}>
            <Icon name="microscope" size={60} color="rgba(43,191,170,0.35)" />
          </div>
          <div style={{ position: "absolute", right: 0, bottom: 20, width: "52%", height: "55%", background: "linear-gradient(135deg,rgba(99,179,237,0.15),rgba(43,191,170,0.12))", borderRadius: 18, border: "3px solid #fff", boxShadow: "0 8px 32px rgba(27,45,62,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="beaker" size={44} color="rgba(43,191,170,0.35)" />
          </div>
        </div>

        <div>
          <Eyebrow>About Research</Eyebrow>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3vw,38px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 20 }}>
            Reliable Agroscience &amp;<br />Soil Analysis Research.
          </h2>
          <p style={{ fontSize: 14.5, color: "#6B7A8D", lineHeight: 1.8, marginBottom: 12 }}>
            Excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum, sed sprouts undo omnia natus error inventore.
          </p>
          <p style={{ fontSize: 14.5, color: "#6B7A8D", lineHeight: 1.8, marginBottom: 36 }}>
            Quae architteaut itlae dicta sunt explicabo nemo enim ipsam voluptatem quia voluptatem.
          </p>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {subItems.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, background: "rgba(43,191,170,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={item.icon} size={20} color={TEAL} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 12.5, color: "#718096", lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── LabServices ──────────────────────────────────────────────────────────────
function LabServices() {
  const [active, setActive] = useState<number>(0);

  const tabs: TabItem[] = [
    { icon: "atom", label: "Molecular Testing" },
    { icon: "microscope", label: "Testing for Traces" },
    { icon: "flask", label: "Microbiology Tests" },
    { icon: "beaker", label: "Biochemistry Tests" },
    { icon: "dna", label: "Histopatology Tests" },
  ];

  const details: TabDetail[] = [
    { title: "Molecular Testing", desc: "Quaes architeat itlae dicta sunt explicabo nemo enim ipsam voluptatem. Aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptam sequi nesciunt que porro.", checks: ["The Mycobacteriology Section", "The Aerobic Bacteriology Section"] },
    { title: "Testing for Traces", desc: "Advanced trace element detection using cutting-edge spectrometry. Our lab identifies contaminants at parts-per-billion levels ensuring safety compliance.", checks: ["Heavy Metal Detection", "Pesticide Residue Analysis"] },
    { title: "Microbiology Tests", desc: "Comprehensive microbial testing including bacterial counts, pathogen identification, and sterility testing across cosmetic and pharma products.", checks: ["Bacterial Identification", "Sterility Testing"] },
    { title: "Biochemistry Tests", desc: "Complete biochemical profiling and enzyme assays. We measure protein levels, metabolic markers, and biochemical interactions with precision.", checks: ["Enzyme Activity Analysis", "Protein Quantification"] },
    { title: "Histopatology Tests", desc: "Tissue sample preparation, staining, and microscopic examination for cellular pathology. Rapid turnaround with expert pathologist review.", checks: ["Tissue Staining Protocols", "Cellular Pathology Reports"] },
  ];

  const iconNames: IconName[] = ["flask", "microscope", "beaker", "dna"];

  return (
    <section style={{ padding: "96px 24px", background: "linear-gradient(135deg,rgba(43,191,170,0.05) 0%,rgba(99,179,237,0.06) 100%)", overflow: "hidden", position: "relative" }}>
      <DotGrid style={{ opacity: 0.35 }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Eyebrow>Laboratory Services</Eyebrow>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3vw,40px)", fontWeight: 700, color: NAVY, lineHeight: 1.2 }}>
            Reliable &amp; High-Quality<br />Laboratory Service
          </h2>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 40, overflowX: "auto", paddingBottom: 4 }}>
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              padding: "16px 18px", borderRadius: 14, border: "none", cursor: "pointer",
              background: active === i ? TEAL : "#fff",
              color: active === i ? "#fff" : NAVY,
              boxShadow: active === i ? "0 6px 24px rgba(43,191,170,0.35)" : "0 2px 12px rgba(27,45,62,0.06)",
              transition: "all .25s", flexShrink: 0, minWidth: 110, fontFamily: "'DM Sans',sans-serif",
            }}>
              <Icon name={tab.icon} size={22} color={active === i ? "#fff" : TEAL} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 16 }}>
              {details[active].title}
            </h3>
            <p style={{ fontSize: 14.5, color: "#6B7A8D", lineHeight: 1.8, marginBottom: 24 }}>
              {details[active].desc}
            </p>
            {details[active].checks.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(43,191,170,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="check" size={12} color={TEAL} />
                </div>
                <span style={{ fontSize: 13.5, color: "#4A5568", fontWeight: 500 }}>{c}</span>
              </div>
            ))}
            <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, background: TEAL, color: "#fff", padding: "11px 24px", borderRadius: 50, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(43,191,170,0.3)", transition: "all .2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1A9E8C"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = TEAL; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Our Services <Icon name="arrowRight" size={14} color="#fff" />
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={{
                borderRadius: 16, overflow: "hidden",
                background: `linear-gradient(${120 + n * 30}deg,rgba(43,191,170,${0.1 + n * 0.03}),rgba(99,179,237,${0.1 + n * 0.02}))`,
                height: n % 2 === 0 ? 140 : 120,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(43,191,170,0.12)",
              }}>
                <Icon name={iconNames[n - 1]} size={40} color="rgba(43,191,170,0.3)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── StatsBanner ──────────────────────────────────────────────────────────────
function StatsBanner() {
  const stats: StatItem[] = [
    { value: "600+", label: "Different Tests" },
    { value: "34", label: "Journal Articles" },
    { value: "98%", label: "Success Rate" },
    { value: "20+", label: "Years Experience" },
  ];
  return (
    <section style={{ background: TEAL, padding: "56px 24px" }}>
      <div className="four-col" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, textAlign: "center" }}>
        {stats.map((s, i) => (
          <div key={i}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const items: TestimonialItem[] = [
    { name: "Dr. Sarah Mitchell", role: "Cosmetic Chemist", text: "Laborex's testing protocols are unmatched. Their precision and turnaround time have been crucial for our product development pipeline." },
    { name: "James Okafor", role: "QA Manager, PharmaCo", text: "The molecular testing team went above and beyond. Every report was thorough, and their communication was exemplary throughout." },
    { name: "Anika Petersen", role: "R&D Director", text: "We've partnered with Laborex for 5 years. Their soil analysis division is world-class and their staff is incredibly knowledgeable." },
  ];
  return (
    <section style={{ padding: "96px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Eyebrow>Testimonials</Eyebrow>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3vw,38px)", fontWeight: 700, color: NAVY }}>
            What Our Clients Say
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
function CTA() {
  return (
    <section style={{ padding: "80px 24px", position: "relative", overflow: "hidden", background: `linear-gradient(135deg,${NAVY} 0%,#1a3a52 100%)` }}>
      <DotGrid style={{ opacity: 0.1 }} />
      <div style={{ position: "absolute", top: "-40%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(43,191,170,0.08)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <Eyebrow>Get Started</Eyebrow>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>
          Ready to Work With Us?<br />Request a Quote Today.
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.75 }}>
          Join hundreds of companies that trust Laborex for accurate, reliable laboratory testing and research services.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#" style={{ background: TEAL, color: "#fff", padding: "14px 30px", borderRadius: 50, fontSize: 14, fontWeight: 600, boxShadow: "0 6px 24px rgba(43,191,170,0.4)", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(43,191,170,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(43,191,170,0.4)"; }}
          >
            Request a Quote <Icon name="arrowRight" size={16} color="#fff" />
          </a>
          <a href="#" style={{ border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", padding: "14px 30px", borderRadius: 50, fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, transition: "all .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.color = TEAL; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const quickLinks: string[] = ["Home", "About Us", "Services", "Our Team", "Events", "Gallery", "Blog", "Contact"];
  const services: string[] = ["Molecular Testing", "Microbiology Tests", "Biochemistry Tests", "Histopatology Tests", "Soil Analysis", "Blood Resources"];
  const socials: SocialItem[] = [{ name: "fb", href: "#" }, { name: "tw", href: "#" }, { name: "li", href: "#" }, { name: "yt", href: "#" }];
  const contactItems: ContactItem[] = [
    { icon: "pin", text: "1234 Research Blvd, Suite 400\nBoston, MA 02110, USA" },
    { icon: "phone", text: "+1 (617) 555-0182" },
    { icon: "mail", text: "hello@laborex.com" },
    { icon: "clock", text: "Mon – Fri: 8:00am – 6:00pm\nSat: 9:00am – 2:00pm" },
  ];
  const legalLinks: string[] = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

  return (
    <footer style={{ background: NAVY, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 40px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1.4fr", gap: 48, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, background: TEAL, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="flask" size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: "-0.03em" }}>LABOREX</span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
              A trusted leader in laboratory testing, agroscience research, and cosmetics safety. Precision, reliability, and scientific excellence since 2004.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {socials.map((s) => (
                <a key={s.name} href={s.href}
                  style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = TEAL; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                >
                  <Icon name={s.name} size={16} color="rgba(255,255,255,0.85)" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 20, letterSpacing: "0.02em" }}>Quick Links</h4>
            <ul style={{ listStyle: "none" }}>
              {quickLinks.map((l) => (
                <li key={l} style={{ marginBottom: 10 }}>
                  <a href="#"
                    style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", transition: "color .2s", display: "flex", alignItems: "center", gap: 6 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, flexShrink: 0, display: "inline-block" }} />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>Services</h4>
            <ul style={{ listStyle: "none" }}>
              {services.map((l) => (
                <li key={l} style={{ marginBottom: 10 }}>
                  <a href="#"
                    style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", transition: "color .2s", display: "flex", alignItems: "center", gap: 6 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, flexShrink: 0, display: "inline-block" }} />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>Contact Us</h4>
            {contactItems.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, background: "rgba(43,191,170,0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <Icon name={c.icon} size={15} color={TEAL} />
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.6)", whiteSpace: "pre-line" }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>© 2024 Laborex. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {legalLinks.map((l) => (
              <a key={l} href="#"
                style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LaborexPage() {
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <Navbar />
      <main>
        <Hero />
        <FeaturesBar />
        <About />
        <LabServices />
        <StatsBanner />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
