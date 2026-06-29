import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import SocialIcons from "./SocialIcons";
import { COMPANY, CONTACT_ITEMS, FOOTER_LINKS } from "../config/site";
import { useTheme } from "../context/ThemeContext";

/* ─── constants ─────────────────────────────────────────────── */
const MONO   = "'Space Mono', monospace";
const RED    = "#C8121F";
const RED_HX = "#ff6b6b";

/* ═══════════════════════════════════════════════════════════════
   StarField — animated canvas particles
   ═══════════════════════════════════════════════════════════════ */
function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const stars: { x: number; y: number; r: number; speed: number; o: number }[] = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 280; i++)
      stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.2 + 0.2, speed: Math.random() * 0.16 + 0.04, o: Math.random() * 0.7 + 0.2 });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.o  += (Math.random() - 0.5) * 0.014;
        s.o   = Math.max(0.08, Math.min(0.9, s.o));
        s.y  -= s.speed;
        if (s.y < -2) { s.y = canvas.height + 2; s.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   TyreGlyph — wireframe tyre SVG
   ═══════════════════════════════════════════════════════════════ */
function TyreGlyph() {
  const CX = 200, CY = 200;
  const spokes = Array.from({ length: 7 }, (_, i) => {
    const rad = (i * (360 / 7) * Math.PI) / 180;
    return {
      x1: CX + 30 * Math.cos(rad), y1: CY + 30 * Math.sin(rad),
      x2: CX + 108 * Math.cos(rad), y2: CY + 108 * Math.sin(rad),
    };
  });
  const treads = Array.from({ length: 24 }, (_, i) => {
    const a1 = ((i * 15 - 90) * Math.PI) / 180;
    const a2 = (((i + 1) * 15 - 4 - 90) * Math.PI) / 180;
    const R = 186, r = 158;
    return [
      [CX + R * Math.cos(a1), CY + R * Math.sin(a1)],
      [CX + R * Math.cos(a2), CY + R * Math.sin(a2)],
      [CX + r * Math.cos(a2), CY + r * Math.sin(a2)],
      [CX + r * Math.cos(a1), CY + r * Math.sin(a1)],
    ];
  });

  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 440, display: "block", margin: "0 auto" }}>
      <ellipse cx={CX} cy={CY} rx={188} ry={188} stroke="rgba(200,18,31,.09)" strokeWidth="38" />
      <ellipse cx={CX} cy={CY} rx={188} ry={188} stroke="rgba(255,255,255,.07)" strokeWidth="1" />
      {[186, 165, 148, 132].map((r, i) => (
        <ellipse key={r} cx={CX} cy={CY} rx={r} ry={r}
          stroke={`rgba(255,255,255,${[.18,.14,.10,.07][i]})`}
          strokeWidth={i === 0 ? 1.5 : 1}
          strokeDasharray={i === 3 ? "5 7" : undefined}
        />
      ))}
      {treads.map((pts, i) => (
        <polygon key={i}
          points={pts.map(p => p.join(",")).join(" ")}
          fill="rgba(200,18,31,.055)"
          stroke="rgba(255,255,255,.11)"
          strokeWidth=".7"
        />
      ))}
      <ellipse cx={CX} cy={CY} rx={110} ry={110} stroke="rgba(255,255,255,.20)" strokeWidth="1.5" />
      <ellipse cx={CX} cy={CY} rx={80}  ry={80}  stroke="rgba(255,255,255,.10)" strokeWidth="1" />
      {spokes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke="rgba(255,255,255,.26)" strokeWidth="1.5" />
      ))}
      <ellipse cx={CX} cy={CY} rx={28} ry={28} stroke={RED} strokeWidth="2" fill="rgba(200,18,31,.1)" />
      <ellipse cx={CX} cy={CY} rx={11} ry={11} fill={RED} fillOpacity=".65" />
      <ellipse cx={CX} cy={390} rx={140} ry={10} fill={RED} fillOpacity=".18" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Footer — main export
   ═══════════════════════════════════════════════════════════════ */
export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [vis, setVis]       = useState(false);
  const [email, setEmail]   = useState("");
  const [subOk, setSubOk]   = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const FT = {
    bg:          isDark ? "#080809"                    : "#F5F2EB",
    bg2:         isDark ? "rgba(255,255,255,0.04)"     : "rgba(0,0,0,0.04)",
    border:      isDark ? "rgba(255,255,255,0.07)"     : "rgba(0,0,0,0.10)",
    text:        isDark ? "rgba(255,255,255,0.82)"     : "#1A1A14",
    textDim:     isDark ? "rgba(255,255,255,0.42)"     : "rgba(26,26,20,0.55)",
    textMuted:   isDark ? "rgba(255,255,255,0.28)"     : "rgba(26,26,20,0.40)",
    textFaint:   isDark ? "rgba(255,255,255,0.32)"     : "rgba(26,26,20,0.35)",
    placeholder: isDark ? "rgba(255,255,255,0.32)"     : "rgba(26,26,20,0.35)",
    inputBg:     isDark ? "rgba(255,255,255,0.04)"     : "rgba(0,0,0,0.04)",
    inputBorder: isDark ? "rgba(255,255,255,0.16)"     : "rgba(0,0,0,0.14)",
    inputText:   isDark ? "#ffffff"                    : "#1A1A14",
    iconBorder:  isDark ? "rgba(255,255,255,0.18)"     : "rgba(0,0,0,0.14)",
    iconColor:   isDark ? "rgba(255,255,255,0.65)"     : "rgba(26,26,20,0.55)",
    navLinkClr:  isDark ? "rgba(255,255,255,0.82)"     : "#1A1A14",
    socialClr:   isDark ? "rgba(255,255,255,0.42)"     : "rgba(26,26,20,0.55)",
    starfield:   isDark,
    glowRed:     isDark ? "rgba(200,18,31,0.26)"       : "rgba(200,18,31,0.10)",
    scanline:    isDark ? "rgba(255,255,255,0.011)"    : "rgba(0,0,0,0.015)",
    logoFilter:  isDark ? undefined : "brightness(0.15) saturate(2) sepia(0.4) hue-rotate(5deg)",
    bottomText:  isDark ? "rgba(255,255,255,0.28)"     : "rgba(26,26,20,0.40)",
  };

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fromLeft  = (delay: number): React.CSSProperties => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "none" : "translateX(-36px)",
    transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
  });
  const fromRight = (delay: number): React.CSSProperties => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "none" : "translateX(36px)",
    transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
  });
  const fromTop = (delay: number): React.CSSProperties => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "none" : "translateY(-16px)",
    transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
  });

  return (
    <>
      <style>{`
        .ft-root { font-family: Archivo, Inter, sans-serif; }
        .ft-root * { box-sizing: border-box; }

        /* Nav links */
        .ft-navlink {
          display: flex; align-items: center; gap: 12px;
          font-family: Archivo, sans-serif;
          font-size: clamp(.95rem, 1.7vw, 1.48rem);
          font-weight: 800; color: ${FT.navLinkClr};
          text-decoration: none; letter-spacing: -.01em;
          padding: 9px 0;
          border-bottom: 1px solid ${FT.border};
          transition: color .2s ease;
        }
        .ft-navlink:hover { color: ${RED_HX}; }

        /* Social text links */
        .ft-social {
          color: ${FT.socialClr}; text-decoration: none;
          font-family: ${MONO}; font-size: .78rem; font-weight: 700;
          letter-spacing: .18em; display: block; padding: 10px 0;
          border-bottom: 1px solid ${FT.border};
          text-align: right; transition: color .2s ease;
        }
        .ft-social:hover { color: ${RED_HX}; }

        .ft-sub-input::placeholder { color: ${FT.placeholder}; }
        .ft-sub-input { color: ${FT.inputText}; }

        /* ── Subscribe bar ── */
        .ft-subscribe {
          position: relative; z-index: 3;
          border-bottom: 1px solid ${FT.border};
          padding: 26px 48px;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }

        /* ── 3-col body ── */
        .ft-body {
          position: relative; z-index: 3; flex: 1;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: end;
          padding: 0 48px;
          min-height: 500px;
        }

        /* Left nav col */
        .ft-left {
          padding-bottom: 56px;
          display: flex; flex-direction: column;
        }

        /* Center tyre glyph */
        .ft-center {
          width: clamp(260px, 28vw, 440px);
          align-self: flex-end;
          pointer-events: none;
        }

        /* Right contact col */
        .ft-right {
          padding-bottom: 56px;
          display: flex; flex-direction: column;
          align-items: flex-end;
        }

        /* Bottom bar */
        .ft-bottom {
          position: relative; z-index: 3;
          border-top: 1px solid ${FT.border};
          padding: 17px 48px;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 8px;
        }

        /* Contact item row (right col) */
        .ft-contact-item {
          display: flex; align-items: center; gap: 14px;
          justify-content: flex-end;
          margin-bottom: 26px;
        }

        /* ══════════════════════════════════════════════════
           TABLET — 960px
           ══════════════════════════════════════════════════ */
        @media (max-width: 960px) {
          .ft-body {
            grid-template-columns: 1fr 1fr !important;
            padding: 0 32px !important;
            min-height: auto !important;
          }
          /* Hide centre tyre on tablet — too cramped */
          .ft-center { display: none !important; }

          .ft-left  { padding-bottom: 40px !important; }
          .ft-right { padding-bottom: 40px !important; }

          .ft-subscribe { padding: 22px 32px !important; }
          .ft-bottom    { padding: 14px 32px !important; }
        }

        /* ══════════════════════════════════════════════════
           MOBILE — 640px
           Single-column stacked layout
           ══════════════════════════════════════════════════ */
        @media (max-width: 640px) {
          .ft-body {
            grid-template-columns: 1fr !important;
            padding: 0 20px !important;
          }

          /* Tyre shows centered between sections on mobile */
          .ft-center {
            display: block !important;
            width: 100% !important;
            max-width: 240px !important;
            margin: 0 auto 8px !important;
            align-self: auto !important;
            opacity: 1 !important;
            transform: none !important;
          }

          /* Right col: left-align everything on mobile */
          .ft-right {
            align-items: flex-start !important;
            border-top: 1px solid ${FT.border};
            padding-top: 32px !important;
            padding-bottom: 32px !important;
          }

          .ft-contact-item {
            justify-content: flex-start !important;
            flex-direction: row-reverse !important;
          }
          .ft-contact-item > div:first-child {
            text-align: left !important;
          }

          .ft-social {
            text-align: left !important;
          }

          .ft-left { padding-bottom: 0 !important; }

          .ft-subscribe {
            padding: 20px !important;
            align-items: stretch !important;
          }
          .ft-subscribe p { text-align: center; }

          /* Stack subscribe input/button vertically */
          .ft-sub-row {
            flex-direction: column !important;
            border-radius: 10px !important;
          }
          .ft-sub-row input {
            border-bottom: 1px solid ${FT.inputBorder} !important;
            padding: 14px 18px !important;
          }
          .ft-sub-row button {
            padding: 14px !important;
            border-radius: 0 0 8px 8px !important;
          }

          .ft-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
            padding: 16px 20px !important;
          }
          .ft-bottom-links {
            flex-wrap: wrap !important;
            gap: 16px !important;
          }
        }
      `}</style>

      <footer
        ref={footerRef}
        className="ft-root"
        style={{
          position: "relative", background: FT.bg, overflow: "hidden",
          minHeight: "88vh", display: "flex", flexDirection: "column",
          transition: "background 0.3s ease, color 0.3s ease",
        }}
      >
        <StarField />

        {/* Scan-line overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 2px,${FT.scanline} 3px)`, pointerEvents: "none", zIndex: 1 }} />

        {/* Red radial glow */}
        <div style={{ position: "absolute", bottom: "-12%", left: "50%", transform: "translateX(-50%)", width: 720, height: 520, borderRadius: "50%", background: `radial-gradient(ellipse at center,${FT.glowRed} 0%,transparent 68%)`, pointerEvents: "none", zIndex: 1 }} />

        {/* ── SUBSCRIBE BAR ── */}
        <div className="ft-subscribe" style={{ ...fromTop(0) }}>
          <p style={{ fontFamily: MONO, fontSize: ".7rem", letterSpacing: ".22em", textTransform: "uppercase", color: FT.textDim, margin: 0, textAlign: "center" }}>
            Stay up to date with our latest offers and tyre tips
          </p>
          <div
            className="ft-sub-row"
            style={{
              display: "flex", width: "100%", maxWidth: 600,
              border: `1.5px solid ${FT.inputBorder}`,
              borderRadius: 40, overflow: "hidden",
              background: FT.inputBg, backdropFilter: "blur(6px)",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setSubOk(false); }}
              placeholder="ENTER YOUR EMAIL"
              className="ft-sub-input"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "15px 22px", color: FT.inputText, fontFamily: MONO, fontSize: ".75rem", letterSpacing: ".13em", minWidth: 0 }}
            />
            <button
              onClick={() => { if (email) { setSubOk(true); setEmail(""); } }}
              style={{ background: subOk ? "#1a7a3c" : RED, color: "#fff", border: "none", padding: "0 26px", fontFamily: MONO, fontSize: ".75rem", fontWeight: 700, letterSpacing: ".17em", cursor: "pointer", transition: "background .3s ease", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              {subOk ? "✓ DONE" : "SUBSCRIBE"}
            </button>
          </div>
        </div>

        {/* ── MAIN BODY GRID ── */}
        <div className="ft-body">

          {/* LEFT — logo + nav links */}
          <nav className="ft-left">
            <div style={{ marginBottom: 32, ...fromLeft(80) }}>
              <Logo size={36} filter={FT.logoFilter} />
              <div style={{ fontFamily: MONO, fontSize: ".6rem", letterSpacing: ".22em", color: FT.textFaint, marginTop: 10, textTransform: "uppercase" }}>
                {COMPANY.tagline}
              </div>
            </div>

            {FOOTER_LINKS.map((link, i) => (
              <Link
                key={link.label}
                to={link.to}
                className="ft-navlink"
                style={{ ...fromLeft(160 + i * 75) }}
              >
                <span style={{ fontFamily: MONO, fontSize: ".58rem", color: RED, opacity: .75, minWidth: 20 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label.toUpperCase()}
              </Link>
            ))}

            <div style={{ marginTop: 28, ...fromLeft(160 + FOOTER_LINKS.length * 75) }}>
              <SocialIcons />
            </div>
          </nav>

          {/* CENTER — tyre glyph (hidden on tablet, shown on desktop + mobile-special) */}
          <div
            className="ft-center"
            style={{
              opacity: vis ? 1 : 0,
              transform: vis ? "translateY(0)" : "translateY(70px)",
              transition: "opacity 1s ease 260ms, transform 1.1s cubic-bezier(.22,1,.36,1) 260ms",
            }}
          >
            <TyreGlyph />
          </div>

          {/* RIGHT — contact details */}
          <div className="ft-right">
            {CONTACT_ITEMS.map((item, i) => (
              <div
                key={item.label}
                className="ft-contact-item"
                style={{ ...fromRight(200 + i * 90) }}
              >
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "Archivo, sans-serif", fontSize: i === 0 ? "clamp(1.2rem,2vw,1.85rem)" : ".95rem", fontWeight: i === 0 ? 900 : 700, color: FT.text, lineHeight: 1.2 }}>
                    {item.value}
                  </div>
                  {i > 0 && (
                    <div style={{ fontFamily: MONO, fontSize: ".6rem", letterSpacing: ".1em", color: FT.textMuted, marginTop: 2, textTransform: "uppercase" }}>
                      {item.label}
                    </div>
                  )}
                </div>
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${FT.iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: FT.iconColor, flexShrink: 0 }}>
                  {item.icon}
                </div>
              </div>
            ))}

            {["INSTAGRAM", "FACEBOOK", "WHATSAPP"].map((s, i) => (
              <a
                key={s}
                href="#"
                className="ft-social"
                style={{
                  width: "100%",
                  ...fromRight(440 + i * 80),
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          className="ft-bottom"
          style={{
            opacity: vis ? 1 : 0,
            transition: "opacity .9s ease 700ms",
          }}
        >
          <span style={{ fontFamily: MONO, fontSize: ".6rem", letterSpacing: ".13em", color: FT.bottomText, textTransform: "uppercase" }}>
            © {new Date().getFullYear()} {COMPANY.fullName}. All rights reserved.
          </span>
          <div className="ft-bottom-links" style={{ display: "flex", gap: 24 }}>
            <a href="#" style={{ fontFamily: MONO, fontSize: ".6rem", letterSpacing: ".13em", color: FT.textMuted, textDecoration: "none", textTransform: "uppercase" }}>Privacy Policy</a>
            <a href="#" style={{ fontFamily: MONO, fontSize: ".6rem", letterSpacing: ".13em", color: FT.textMuted, textDecoration: "none", textTransform: "uppercase" }}>Terms of Service</a>
          </div>
          <span style={{ fontFamily: MONO, fontSize: ".6rem", letterSpacing: ".13em", color: FT.bottomText, textTransform: "uppercase" }}>
            Made with ♥ in Jammu
          </span>
        </div>
      </footer>
    </>
  );
}
