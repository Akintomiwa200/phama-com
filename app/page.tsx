"use client";

import { useState, useEffect, ReactNode } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const TEAL = "#2BBFAA";
const NAVY = "#1B2D3E";

// ─── Types ────────────────────────────────────────────────────────────────────
type IconName =
  | "flask" | "users" | "clock" | "microscope" | "activity" | "droplets"
  | "search" | "menu" | "x" | "chevron" | "arrowRight" | "check"
  | "mail" | "phone" | "pin" | "beaker" | "atom" | "dna"
  | "fb" | "tw" | "li" | "yt" | "shield" | "alert" | "brain" | "file" | "prescription";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

interface EyebrowProps {
  children: ReactNode;
}

interface DotGridProps {
  style?: React.CSSProperties;
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

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  screenLines: string[];
  aiAction: string;
  alertType?: "interaction" | "cascade";
}

// ─── Icon Component ───────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = TEAL, strokeWidth = 1.8 }: IconProps): ReactNode => {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" as const, stroke: color, strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const sf = { width: size, height: size, viewBox: "0 0 24 24", fill: color };

  const icons: Record<IconName, ReactNode> = {
    flask: (<svg {...s}><path d="M9 3h6M9 3v8l-4.5 7.5A2 2 0 0 0 6.27 21h11.46a2 2 0 0 0 1.77-2.5L15 11V3" /><path d="M6.21 15h11.58" /></svg>),
    users: (<svg {...s}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
    clock: (<svg {...s}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>),
    microscope: (<svg {...s}><path d="M6 18h8M3 21h18M14 10a4 4 0 1 0-8 0v1h8v-1zM12 2v8M8 2v3" /></svg>),
    activity: (<svg {...s}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>),
    droplets: (<svg {...s}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" /></svg>),
    search: (<svg {...s}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>),
    menu: (<svg {...s}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>),
    x: (<svg {...s}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>),
    chevron: (<svg {...s}><polyline points="6 9 12 15 18 9" /></svg>),
    arrowRight: (<svg {...s}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>),
    check: (<svg {...s}><polyline points="20 6 9 17 4 12" /></svg>),
    mail: (<svg {...s}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>),
    phone: (<svg {...s}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>),
    pin: (<svg {...s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>),
    beaker: (<svg {...s}><path d="M4.5 3h15M6 3v10l-3.5 6A2 2 0 0 0 4.27 21h15.46a2 2 0 0 0 1.77-2L18 13V3" /><path d="M6 15h12" /></svg>),
    atom: (<svg {...s}><circle cx="12" cy="12" r="1" /><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9C11.2 3.8 5.87 1.78 3.83 3.82c-2.04 2.04-.02 7.37 4.5 11.91S18.16 22.24 20.2 20.2z" /><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.91-2.04-2.04-7.37-.02-11.91 4.5S1.75 18.15 3.79 20.19c2.04 2.04 7.37.02 11.91-4.49z" /></svg>),
    dna: (<svg {...s}><path d="M2 15c6.667-6 13.333 0 20-6" /><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" /><path d="M15 2c-1.798 1.999-2.518 3.997-2.807 5.994" /><path d="m17 6-2.5-2.5" /><path d="m14 8-1-1" /><path d="m7 18 2.5 2.5" /><path d="m10 16 1 1" /><path d="m16.5 11.5 1 1" /><path d="m20 9 .5.5" /><path d="m6.5 12.5 1 1" /><path d="m3 16 .5.5" /></svg>),
    shield: (<svg {...s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),
    alert: (<svg {...s}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="0.5" fill={color} stroke="none" /></svg>),
    brain: (<svg {...s}><path d="M12 4a4 4 0 0 1 3.5 6A4 4 0 0 1 12 18a4 4 0 0 1-3.5-6A4 4 0 0 1 12 4z" /><path d="M18.5 8A5 5 0 0 1 22 12a5 5 0 0 1-3.5 4.8" /><path d="M5.5 8A5 5 0 0 0 2 12a5 5 0 0 0 3.5 4.8" /></svg>),
    file: (<svg {...s}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>),
    prescription: (<svg {...s}><path d="M8 21h8M12 3v18M8 7h8" /><path d="M7 12h10" /></svg>),
    fb: <svg {...sf}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
    tw: <svg {...sf}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1 4.52 4.52 0 0 0-7.69 4.13A12.83 12.83 0 0 1 2.67.89a4.52 4.52 0 0 0 1.4 6.03A4.47 4.47 0 0 1 2 6.38v.06a4.52 4.52 0 0 0 3.62 4.43 4.52 4.52 0 0 1-2.04.08 4.52 4.52 0 0 0 4.22 3.14A9.06 9.06 0 0 1 2 19.54a12.77 12.77 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 24 4.59a9 9 0 0 1-2.6.72A4.52 4.52 0 0 0 23 3z" /></svg>,
    li: <svg {...sf}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>,
    yt: (<svg {...sf}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg>),
  };

  return icons[name] || null;
};

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
const Eyebrow = ({ children }: EyebrowProps): ReactNode => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, color: TEAL, fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
    <span style={{ width: 28, height: 1.5, background: TEAL, borderRadius: 1, display: "inline-block" }} />
    {children}
    <span style={{ width: 28, height: 1.5, background: TEAL, borderRadius: 1, display: "inline-block" }} />
  </div>
);

// ─── DotGrid ──────────────────────────────────────────────────────────────────
const DotGrid = ({ style = {} }: DotGridProps): ReactNode => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: `radial-gradient(circle, rgba(43,191,170,0.18) 1.5px, transparent 1.5px)`,
    backgroundSize: "22px 22px",
    ...style,
  }} />
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar(): ReactNode {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobile, setMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links: string[] = ["Home", "Services", "AI Platform", "Team", "Resources", "Contact"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
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
                style={{ fontSize: 13, fontWeight: 500, color: "#4A5568", transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4A5568")}
              >
                {l}
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
              Request Demo
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
function Hero(): ReactNode {
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
        <div style={{ animation: "fadeUp .7s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(43,191,170,0.1)", color: TEAL, borderRadius: 50, padding: "6px 14px", fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
            <Icon name="brain" size={14} color={TEAL} /> AI-Powered Pharmacy Safety
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(34px,4vw,52px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 18 }}>
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
              <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: NAVY, marginBottom: 8 }}>{item.title}</h3>
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
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3vw,40px)", fontWeight: 700, color: NAVY, lineHeight: 1.2 }}>
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
                fontFamily: "'DM Sans', sans-serif"
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

            <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 13, lineHeight: 1.8 }}>
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
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{s.value}</div>
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
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3vw,38px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 20 }}>
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
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3vw,38px)", fontWeight: 700, color: NAVY }}>
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
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>
          Ready to Protect Your Patients?<br />Request a Demo Today.
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.75 }}>
          Join hundreds of pharmacies using Laborex AI to prevent medication errors and save lives.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#" style={{ background: TEAL, color: "#fff", padding: "14px 30px", borderRadius: 50, fontSize: 14, fontWeight: 600, boxShadow: "0 6px 24px rgba(43,191,170,0.4)", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(43,191,170,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(43,191,170,0.4)"; }}
          >
            Request Demo <Icon name="arrowRight" size={16} color="#fff" />
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

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer(): ReactNode {
  const quickLinks: string[] = ["Home", "About Us", "AI Platform", "Security", "Blog", "Contact"];
  const services: string[] = ["Drug Interaction Detection", "Cascade Analysis", "API Integration", "Compliance Reporting", "Training", "Support"];
  const socials: SocialItem[] = [{ name: "fb", href: "#" }, { name: "tw", href: "#" }, { name: "li", href: "#" }, { name: "yt", href: "#" }];
  const contactItems: ContactItem[] = [
    { icon: "pin", text: "1234 Research Blvd, Suite 400\nBoston, MA 02110, USA" },
    { icon: "phone", text: "+1 (617) 555-0182" },
    { icon: "mail", text: "hello@laborex.ai" },
    { icon: "clock", text: "24/7 Support Available" },
  ];
  const legalLinks: string[] = ["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Cookie Policy"];

  return (
    <footer style={{ background: NAVY, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 40px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1.4fr", gap: 48, marginBottom: 56 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, background: TEAL, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="flask" size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: "-0.03em" }}>LABOREX AI</span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
              Intelligent medication safety through AI-powered drug interaction and prescribing cascade detection.
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

          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>Solutions</h4>
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

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>© 2024 Laborex AI. All rights reserved.</p>
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
export default function LaborexPage(): ReactNode {
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <Navbar />
      <main>
        <Hero />
        <FeaturesBar />
        <AIWorkflowDemo />
        <StatsBanner />
        <About />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
  }
