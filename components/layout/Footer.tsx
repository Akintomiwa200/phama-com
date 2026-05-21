"use client";

import Icon, { TEAL, NAVY } from "@/components/Icon";

export default function Footer() {
  const quickLinks: string[] = ["Home", "About Us", "AI Platform", "Security", "Blog", "Contact"];
  const services: string[] = ["Drug Interaction Detection", "Cascade Analysis", "API Integration", "Compliance Reporting", "Training", "Support"];
  type IconName = import("@/components/Icon").IconName;
  const socials: { name: IconName; href: string }[] = [
    { name: "fb", href: "#" },
    { name: "tw", href: "#" },
    { name: "li", href: "#" },
    { name: "yt", href: "#" },
  ];
  const contactItems: { icon: IconName; text: string }[] = [
    { icon: "pin", text: "1234 Research Blvd, Suite 400\nBoston, MA 02110, USA" },
    { icon: "phone", text: "+1 (617) 555-0182" },
    { icon: "mail", text: "hello@laborex.ai" },
    { icon: "clock", text: "24/7 Support Available" },
  ];
  const legalLinks: string[] = ["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Cookie Policy"];

  return (
    <footer style={{ background: NAVY, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 40px" }}>
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1.4fr",
            gap: 48,
            marginBottom: 56,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: TEAL,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="flask" size={18} color="#fff" />
              </div>
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                }}
              >
                LABOREX AI
              </span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
              Intelligent medication safety through AI-powered drug interaction and prescribing cascade detection.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: "rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = TEAL;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  }}
                >
                  <Icon name={s.name} size={16} color="rgba(255,255,255,0.85)" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4
              style={{
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                marginBottom: 20,
                letterSpacing: "0.02em",
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: "none" }}>
              {quickLinks.map((l) => (
                <li key={l} style={{ marginBottom: 10 }}>
                  <a
                    href="#"
                    style={{
                      fontSize: 13.5,
                      color: "rgba(255,255,255,0.6)",
                      transition: "color .2s",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: TEAL,
                        flexShrink: 0,
                        display: "inline-block",
                      }}
                    />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
              Solutions
            </h4>
            <ul style={{ listStyle: "none" }}>
              {services.map((l) => (
                <li key={l} style={{ marginBottom: 10 }}>
                  <a
                    href="#"
                    style={{
                      fontSize: 13.5,
                      color: "rgba(255,255,255,0.6)",
                      transition: "color .2s",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: TEAL,
                        flexShrink: 0,
                        display: "inline-block",
                      }}
                    />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
              Contact Us
            </h4>
            {contactItems.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: "rgba(43,191,170,0.12)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <Icon name={c.icon} size={15} color={TEAL} />
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.6)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            &copy; 2024 Laborex AI. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {legalLinks.map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  transition: "color .2s",
                }}
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
