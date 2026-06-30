import { useEffect, useRef, useState, createContext, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ROUTES, COMPANY } from "../config/site";
import { useTheme } from "../context/ThemeContext";

/* ============================================================================
   DESIGN TOKENS — computed per-theme
   ========================================================================== */
function getAboutTokens(isDark: boolean) {
  return {
    bg:       isDark ? "#0C0D08"                      : "#F5F2EB",
    bg2:      isDark ? "#141608"                      : "#FFFFFF",
    ink:      isDark ? "#F5F0E8"                      : "#1A1A14",
    inkDim:   isDark ? "#8C8878"                      : "#6B6550",
    amber:    isDark ? "#D4A843"                      : "#B8760A",
    amberDim: isDark ? "#A07A20"                      : "#8A5808",
    green:    isDark ? "#3D5A2E"                      : "#2D4A20",
    greenBrt: isDark ? "#6BA84F"                      : "#4D8B31",
    rust:     isDark ? "#B84A2C"                      : "#A03820",
    hairline: isDark ? "rgba(212,168,67,0.18)"        : "rgba(184,118,10,0.18)",
    gradMain: isDark
      ? "linear-gradient(135deg, #D4A843, #6BA84F)"
      : "linear-gradient(135deg, #B8760A, #4D8B31)",
    gradWarm: isDark
      ? "linear-gradient(135deg, #D4A843, #B84A2C)"
      : "linear-gradient(135deg, #B8760A, #A03820)",
    radius: 4,
    radiusLg: 10,
    display:  "'Archivo','Georgia',serif",
    body:     "'Archivo',sans-serif",
    mono:     "'Space Mono',monospace",
  };
}
/* Module-level fallback for sub-components */
const T = getAboutTokens(true);

/* Page-level context so sub-components get reactive tokens */
type AboutTokens = ReturnType<typeof getAboutTokens>;
const AboutTheme = createContext<AboutTokens>(getAboutTokens(true));
const useAboutT  = () => useContext(AboutTheme);

/* ============================================================================
   CSS
   ========================================================================== */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
  .contact-root *{ box-sizing:border-box; }
  ::selection{ background:#D4A843; color:#0C0D08; }

  @keyframes cu-fadeUp  { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
  @keyframes cu-fadeL   { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:none} }
  @keyframes cu-fadeR   { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:none} }
  @keyframes cu-glow    { 0%,100%{opacity:.3} 50%{opacity:.85} }
  @keyframes cu-lineW   { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes cu-wordUp  { from{transform:translateY(110%);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes cu-ticker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes cu-scanH   { 0%{top:-100%} 100%{top:200%} }
  @keyframes cu-shine   { 0%{left:-60%} 100%{left:110%} }
  @keyframes cu-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes cu-borderS { from{--cug:0deg} to{--cug:360deg} }
  @property --cug { syntax:"<angle>"; initial-value:0deg; inherits:false; }

  .cu-rv  { opacity:0; }
  .cu-rv.in  { animation:cu-fadeUp .75s cubic-bezier(.22,1,.36,1) both; }
  .cu-rvL.in { animation:cu-fadeL  .75s cubic-bezier(.22,1,.36,1) both; }
  .cu-rvR.in { animation:cu-fadeR  .75s cubic-bezier(.22,1,.36,1) both; }

  .cu-wclip { overflow:hidden; display:inline-block; vertical-align:bottom; }
  .cu-winn  { display:inline-block; transform:translateY(110%); opacity:0; }
  .cu-winn.go { animation:cu-wordUp .72s cubic-bezier(.22,1,.36,1) forwards; }

  .cu-ld  { transform:scaleX(0); transform-origin:left; }
  .cu-ld.go { animation:cu-lineW .9s cubic-bezier(.22,1,.36,1) forwards; }

  .cu-tick { display:flex; animation:cu-ticker 36s linear infinite; width:max-content; }
  .cu-tick:hover { animation-play-state:paused; }

  /* inputs */
  .cu-iw {
    border:1px solid var(--cv-border); border-radius:6px;
    background:var(--cv-bg2, rgba(20,22,8,.9)); transition:border-color .25s, box-shadow .25s; overflow:hidden;
  }
  .cu-iw:focus-within { border-color:#D4A843; box-shadow:0 0 0 3px rgba(212,168,67,.12); }
  .cu-iw input,.cu-iw textarea,.cu-iw select {
    width:100%; background:transparent; outline:none;
    font-family:inherit; font-size:.9rem; font-weight:500;
    color:var(--cv-text); padding:14px 16px; border:none; resize:none;
  }
  .cu-iw input::placeholder,.cu-iw textarea::placeholder { color:var(--input-placeholder, rgba(245,240,232,.25)); font-weight:400; }
  .cu-iw select option { background:#141608; color:var(--cv-text); }

  .cu-label {
    display:flex; align-items:center; gap:7px;
    font-family:'Space Mono',monospace; font-size:.58rem; font-weight:700;
    letter-spacing:.2em; text-transform:uppercase; color:var(--cv-muted); margin-bottom:8px;
  }
  .cu-label-dot { width:4px; height:4px; border-radius:50%; background:#D4A843; flex-shrink:0; }

  /* submit button */
  .cu-submit {
    position:relative; overflow:hidden;
    width:100%; padding:20px 0; border:none; border-radius:8px; cursor:pointer;
    background:linear-gradient(135deg,#D4A843,#6BA84F);
    color:#0C0D08; font-family:inherit; font-size:1rem; font-weight:900;
    letter-spacing:.04em; box-shadow:0 8px 28px rgba(212,168,67,.28);
    transition:transform .2s, box-shadow .2s;
  }
  .cu-submit:hover { transform:translateY(-2px) scale(1.01); box-shadow:0 14px 38px rgba(212,168,67,.42); }
  .cu-submit:active { transform:scale(.98); }
  .cu-submit::after {
    content:''; position:absolute; top:-50%; left:-60%;
    width:220%; height:200%;
    background:linear-gradient(45deg,transparent,rgba(255,255,255,.16),transparent);
    transform:rotate(45deg); animation:cu-shine 3.2s ease-in-out infinite;
  }

  /* info card */
  .cu-info-card {
    background:var(--cv-bg2, rgba(20,22,8,.9)); border-radius:${T.radiusLg}px; padding:36px 32px;
    border:1px solid var(--cv-border); position:relative; overflow:hidden;
  }
  .cu-info-card::before {
    content:''; position:absolute; top:-60px; right:-60px;
    width:200px; height:200px; border-radius:50%;
    background:radial-gradient(circle,rgba(212,168,67,.14),transparent 70%); pointer-events:none;
  }
  .cu-info-item { display:flex; align-items:flex-start; gap:14px; margin-bottom:24px; }
  .cu-info-item:last-child { margin-bottom:0; }
  .cu-info-icon {
    width:38px; height:38px; border-radius:8px;
    background:rgba(212,168,67,.1); border:1px solid rgba(212,168,67,.25);
    display:flex; align-items:center; justify-content:center;
    color:#D4A843; flex-shrink:0; padding:9px;
    transition:background .3s, box-shadow .3s;
  }
  .cu-info-item:hover .cu-info-icon { background:rgba(212,168,67,.22); box-shadow:0 0 16px rgba(212,168,67,.25); }

  .cu-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

  /* buttons */
  .cu-btn-amber {
    background:linear-gradient(135deg,#D4A843,#A07A20);
    color:#0C0D08; font-weight:800; letter-spacing:.04em;
    transition:transform .2s, box-shadow .2s;
    text-decoration:none; display:inline-flex; align-items:center; gap:9px; cursor:pointer; border:none;
  }
  .cu-btn-amber:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(212,168,67,.4); }
  .cu-btn-outline {
    background:transparent; border:1px solid var(--cv-border); backdrop-filter:blur(8px);
    color:var(--cv-text); font-weight:700; letter-spacing:.02em;
    transition:transform .2s, border-color .2s, box-shadow .2s;
    text-decoration:none; display:inline-flex; align-items:center; gap:9px; cursor:pointer;
  }
  .cu-btn-outline:hover { transform:translateY(-2px); border-color:#D4A843; box-shadow:0 0 20px rgba(212,168,67,.18); }

  .cu-hours-row { display:flex; align-items:center; justify-content:space-between; padding:16px 0; border-bottom:1px solid var(--cv-border); }
  .cu-hours-row:last-child { border-bottom:none; }

  /* scanline */
  .cu-scan::after {
    content:''; position:absolute; left:0; right:0; height:80px; pointer-events:none; z-index:4;
    background:linear-gradient(transparent,rgba(212,168,67,.03),transparent);
    animation:cu-scanH 5s ease-in-out infinite;
  }

  @media(max-width:900px){
    .cu-hero-flex  { flex-direction:column !important; }
    .cu-hero-left  { padding:80px 24px 48px !important; flex:none !important; width:100% !important; }
    .cu-hero-right { height:240px !important; flex:none !important; width:100% !important; }
    .cu-grid-2     { grid-template-columns:1fr !important; }
    .cu-form-grid  { grid-template-columns:1fr !important; }
    .cu-cta-flex   { flex-direction:column !important; padding:48px 24px !important; }
    .cu-stats-strip{ padding:16px 20px !important; gap:16px !important; }
  }
  @media(max-width:600px){
    .cu-hero-left  { padding:68px 18px 40px !important; }
    .cu-hero-right { height:190px !important; }
    .cu-sec        { padding-left:20px !important; padding-right:20px !important; }
  }
`;

/* ============================================================================
   HOOKS
   ========================================================================== */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, [threshold]);
  return { ref, vis };
}

function Reveal({ children, cls = "cu-rv", delay = 0, style = {} }: { children: React.ReactNode; cls?: string; delay?: number; style?: React.CSSProperties }) {
  const { ref, vis } = useInView();
  return <div ref={ref} className={`${cls}${vis ? " in" : ""}`} style={{ animationDelay: `${delay}ms`, ...style }}>{children}</div>;
}

function SplitH({ children, style }: { children: string; style?: React.CSSProperties }) {
  const { ref, vis } = useInView(0.3);
  return (
    <h2 ref={ref} style={{ margin: 0, ...style }}>
      {children.split(" ").map((w, i) => (
        <span key={i} className="cu-wclip" style={{ marginRight: i < children.split(" ").length - 1 ? ".28em" : 0 }}>
          <span className={`cu-winn${vis ? " go" : ""}`} style={{ animationDelay: `${i * .09}s` }}>{w}</span>
        </span>
      ))}
    </h2>
  );
}

function LineDraw({ color, delay = 0 }: { color?: string; delay?: number }) {
  const { ref, vis } = useInView(0.5);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 28px" }}>
      <div className={`cu-ld${vis ? " go" : ""}`} style={{ height: 1, flex: 1, background: `linear-gradient(90deg,${color},transparent)`, animationDelay: `${delay}s` }} />
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, opacity: vis ? 1 : 0, transition: `opacity .3s ${delay + .5}s` }} />
    </div>
  );
}

function SectionTag({ idx, label }: { idx: string; label: string }) {
  const T = useAboutT();
  const { ref, vis } = useInView(0.5);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <span style={{ fontFamily: T.mono, fontSize: ".58rem", color: "var(--cv-muted)", letterSpacing: ".1em", opacity: vis ? 1 : 0, transition: "opacity .4s" }}>[{idx}]</span>
      <div className={`cu-ld${vis ? " go" : ""}`} style={{ width: 24, height: 1, background: `linear-gradient(90deg,var(--cv-accent),transparent)`, animationDelay: ".15s" }} />
      <span style={{ fontFamily: T.mono, fontSize: ".65rem", letterSpacing: ".3em", textTransform: "uppercase", color: "var(--cv-accent)", fontWeight: 700, opacity: vis ? 1 : 0, transition: "opacity .4s .3s" }}>{label}</span>
    </div>
  );
}

/* ============================================================================
   GRAIN BG
   ========================================================================== */
function GrainBg({ opacity = 0.045 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let raf = 0;
    const draw = () => {
      const W = canvas.parentElement?.clientWidth ?? 800, H = canvas.parentElement?.clientHeight ?? 600;
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      const img = ctx.createImageData(W, H);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255 | 0;
        img.data[i] = v; img.data[i+1] = Math.floor(v * .92); img.data[i+2] = Math.floor(v * .76); img.data[i+3] = Math.floor(opacity * 255);
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(raf);
  }, [opacity]);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", mixBlendMode: "overlay" }} />;
}

/* ============================================================================
   GLITCH TEXT
   ============================================================================ */
const GC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function GlitchText({ text, delay = 0, style = {} }: { text: string; delay?: number; style?: React.CSSProperties }) {
  const T = useAboutT();
  const [d, setD] = useState(() => text.split("").map(() => " "));
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const chars = text.split(""), rev = new Array(chars.length).fill(false); let f = 0;
      const tick = setInterval(() => {
        f++; setD(chars.map((ch, i) => { if (rev[i]) return ch; if (ch === " ") { rev[i] = true; return " "; } if (f > i*4+8) { rev[i]=true; return ch; } return GC[Math.floor(Math.random()*GC.length)]; }));
        if (f >= chars.length*4+12) { clearInterval(tick); setD(chars); setDone(true); }
      }, 42);
      return () => clearInterval(tick);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [text, delay]);
  return (
    <span style={{ ...style, fontVariantNumeric: "tabular-nums" }}>
      {d.map((ch, i) => <span key={i} style={{ display: "inline-block", color: !done && ch !== text[i] ? "var(--cv-accent)" : "inherit", transition: "color .08s", minWidth: ch === " " ? ".3em" : undefined }}>{ch === " " ? "\u00A0" : ch}</span>)}
    </span>
  );
}

/* ============================================================================
   ICONS
   ========================================================================== */
const svgP = { viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:1.6, strokeLinecap:"round" as const, strokeLinejoin:"round" as const, width:"100%", height:"100%" };
const IconPhone  = ()=><svg {...svgP}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82a19.79 19.79 0 01-3.07-8.65A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>;
const IconMail   = ()=><svg {...svgP}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>;
const IconMap    = ()=><svg {...svgP}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconClock  = ()=><svg {...svgP}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const IconCheck  = ()=><svg {...svgP}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>;
const IconBrands = ()=><svg {...svgP}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
const IconDeliv  = ()=><svg {...svgP}><path d="M3 7h11v8H3z"/><path d="M14 10h4l3 3v2h-7"/><circle cx="7.5" cy="16.5" r="1.6"/><circle cx="17.5" cy="16.5" r="1.6"/></svg>;
const IconStock  = ()=><svg {...svgP}><path d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M3 12l9 4 9-4"/></svg>;

/* ============================================================================
   DATA
   ========================================================================== */
const BRANDS = ["MRF","CEAT","APOLLO","JK TYRE","TVS","BIRLA TYRES","BALKRISHNA","PTL","KAMA KUHMO","SPEEDWAYS"];
const QUICK = [
  { icon:<IconBrands/>, val:"25+",      label:"Years Serving" },
  { icon:<IconStock/>,  val:"10K+",     label:"Tyres Fitted" },
  { icon:<IconDeliv/>,  val:"10+",      label:"Indian Brands" },
  { icon:<IconCheck/>,  val:"4.8★",     label:"Avg Rating" },
];

/* ============================================================================
   TICKER
   ========================================================================== */
function Ticker() {
  const T = useAboutT();
  const d = [...BRANDS, ...BRANDS];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid var(--cv-border)`, borderBottom: `1px solid var(--cv-border)`, padding: "14px 0", background: "var(--cv-bg, rgba(12,13,8,.9))" }}>
      <div className="cu-tick">
        {d.map((b, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 22, paddingRight: 40, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--cv-text, rgba(245,240,232,.2))", whiteSpace: "nowrap" }}>
            {b}<span style={{ width: 3, height: 3, borderRadius: "50%", background: `var(--cv-accent)99`, display: "inline-block" }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   HERO — diagonal split with big stacked type (different from About)
   Pattern: full-width BG image + oversized left-anchored text + right dark panel
   ========================================================================== */
function Hero() {
  const T = useAboutT();
  return (
    <section className="cu-scan" style={{ position: "relative", overflow: "hidden", background: "var(--cv-bg)", minHeight: "56vh" }}>
      <GrainBg opacity={.06} />

      {/* Full BG image — tinted */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(50%) brightness(.35) sepia(.25)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right,var(--cv-bg) 45%,var(--cv-bg) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom,var(--cv-bg) 0%,transparent 30%,transparent 70%,var(--cv-bg) 100%)` }} />
        {/* amber horizontal accent at 60% */}
        <div style={{ position: "absolute", top: "60%", left: 0, right: 0, height: 1, background: `linear-gradient(to right,var(--cv-accent)44,transparent 60%)`, pointerEvents: "none" }} />
      </div>

      {/* Content — bottom-anchored */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "clamp(72px,10vh,110px) clamp(28px,5vw,80px) clamp(56px,7vh,88px)", minHeight: "56vh", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>

        {/* breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .08, duration: .5 }}
          style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".32em", textTransform: "uppercase", color: "var(--cv-accent)", fontWeight: 700 }}>CTS Tyres</span>
          <span style={{ width: 20, height: 1, background: "var(--cv-accent)" }} />
          <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--cv-muted)" }}>About Us</span>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(to right,var(--cv-border),transparent)` }} />
          <span style={{ fontFamily: T.mono, fontSize: 10, color: "var(--cv-muted)" }}>Est. 1998</span>
        </motion.div>

        {/* Big stacked heading — alternating filled / outlined */}
        <div style={{ marginBottom: 32 }}>
          {[
            { word: "WHO WE",  filled: true },
            { word: "ARE.",    filled: false },
          ].map(({ word, filled }, wi) => (
            <div key={word} style={{ overflow: "hidden", lineHeight: .88 }}>
              <motion.div initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: .78, ease: [.22,1,.36,1], delay: .2 + wi * .15 }}>
                <GlitchText text={word} delay={.45 + wi * .2} style={{
                  fontFamily: T.display, fontWeight: 900,
                  fontSize: "clamp(3.8rem,9vw,8.5rem)",
                  letterSpacing: "-.04em", textTransform: "uppercase",
                  color: filled ? "var(--cv-text)" : "transparent",
                  WebkitTextStroke: filled ? undefined : `2px var(--cv-accent)`,
                }} />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6, duration: .6, ease: [.22,1,.36,1] }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 22 }}>
          <p style={{ fontFamily: T.body, fontSize: "clamp(.9rem,1.1vw,1.05rem)", color: "var(--cv-muted)", lineHeight: 1.72, maxWidth: 380, margin: 0, fontWeight: 300 }}>
            Maharashtra's trusted tyre specialists since 1998. Family-owned, expert-staffed, and committed to keeping every vehicle on the road safely.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to={ROUTES.tyres} className="cu-btn-amber" style={{ padding: "13px 26px", borderRadius: T.radius, fontSize: ".86rem", fontFamily: T.body }}>
              Browse Tyres →
            </Link>
            <Link to={ROUTES.contact} className="cu-btn-outline" style={{ padding: "13px 26px", borderRadius: T.radius, fontSize: ".86rem", fontFamily: T.body }}>
              Contact Us ↓
            </Link>
          </div>
        </motion.div>

        {/* Rotated side label */}
        <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%) rotate(90deg)", pointerEvents: "none" }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: ".32em", textTransform: "uppercase", color: `var(--cv-accent)22`, fontWeight: 700, whiteSpace: "nowrap" }}>CTS — ABOUT</span>
        </div>
      </div>

      {/* Bottom amber rule */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right,var(--cv-accent)66,var(--cv-green)44,transparent)`, zIndex: 3 }} />
    </section>
  );
}

/* ============================================================================
   QUICK STATS
   ========================================================================== */
function QuickStats() {
  const T = useAboutT();
  return (
    <div className="cu-stats-strip" style={{ background: "var(--cv-bg, rgba(12,13,8,.95))", borderBottom: `1px solid var(--cv-border)`, padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-around", flexWrap: "wrap", gap: 14 }}>
      {QUICK.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .1, duration: .4, ease: [.22,1,.36,1] }} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cv-accent)", border: `1px solid rgba(212,168,67,.3)`, borderRadius: 8, background: "rgba(212,168,67,.07)", padding: 8 }}>{s.icon}</div>
          <p style={{ fontFamily: T.mono, fontSize: ".95rem", fontWeight: 700, color: "var(--cv-accent)", margin: 0, lineHeight: 1 }}>{s.val}</p>
          <p style={{ fontFamily: T.mono, fontSize: ".58rem", color: "var(--cv-muted)", letterSpacing: ".12em", textTransform: "uppercase", margin: 0 }}>{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================================
   CONTACT SECTION — form + info
   ========================================================================== */
function ContactSection() {
  const T = useAboutT();
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    setTimeout(() => { setBusy(false); setSent(true); }, 1200);
  };

  const INFO = [
    { icon: <IconPhone/>,  label: "Phone",    value: COMPANY.phone ?? "+91 98765 43210", href: COMPANY.phoneHref ?? "tel:+91" },
    { icon: <IconMail/>,   label: "Email",    value: "hello@ctstyres.com", href: "mailto:hello@ctstyres.com" },
    { icon: <IconMap/>,    label: "Workshop", value: "123 Tyre Lane, Mumbai, MH 400001", href: "#" },
    { icon: <IconClock/>,  label: "Hours",    value: "Mon–Sat 8am–7pm · Sun 9am–5pm", href: null },
  ];

  return (
    <section id="contact-form" className="cu-sec" style={{ background: "var(--cv-bg2)", padding: "80px 48px 96px", position: "relative", overflow: "hidden" }}>
      <GrainBg opacity={.035} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(-45deg,rgba(212,168,67,.02) 0,rgba(212,168,67,.02) 1px,transparent 1px,transparent 28px)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 450, height: 450, borderRadius: "50%", background: `radial-gradient(circle,var(--cv-accent)0a,transparent 65%)`, filter: "blur(60px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Reveal style={{ marginBottom: 56 }}>
          <SectionTag idx="01" label="Contact Us" />
          <SplitH style={{ fontSize: "clamp(1.9rem,3.8vw,3.2rem)", fontWeight: 900, color: "var(--cv-text)", letterSpacing: "-.025em", lineHeight: .98, marginBottom: 14 }}>
            Let us find your perfect tyre
          </SplitH>
          <LineDraw color="var(--cv-accent)" />
        </Reveal>

        <div className="cu-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 32, alignItems: "start" }}>
          {/* Info card */}
          <Reveal cls="cu-rvL" delay={50}>
            <div className="cu-info-card">
              <p style={{ fontFamily: T.mono, fontSize: ".58rem", letterSpacing: ".28em", textTransform: "uppercase", color: "var(--cv-accent)", fontWeight: 700, margin: "0 0 22px", position: "relative", zIndex: 1 }}>Reach us directly</p>
              {INFO.map((item, i) => (
                <div key={i} className="cu-info-item" style={{ position: "relative", zIndex: 1 }}>
                  <div className="cu-info-icon">{item.icon}</div>
                  <div>
                    <p style={{ fontFamily: T.mono, fontSize: ".58rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--cv-muted)", margin: "0 0 4px" }}>{item.label}</p>
                    {item.href ? (
                      <a href={item.href} style={{ fontFamily: T.body, fontSize: ".9rem", color: "var(--cv-text)", fontWeight: 600, textDecoration: "none", lineHeight: 1.4, transition: "color .2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = T.amber)} onMouseLeave={e => (e.currentTarget.style.color = T.ink)}>
                        {item.value}
                      </a>
                    ) : (
                      <p style={{ fontFamily: T.body, fontSize: ".9rem", color: "var(--cv-text)", fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ height: 1, background: `linear-gradient(to right,var(--cv-accent)44,transparent)`, margin: "8px 0 18px", position: "relative", zIndex: 1 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 1 }}>
                {([["Browse Tyres", ROUTES.tyres], ["Our Services", ROUTES.services ?? "/services"], ["About Us", ROUTES.about ?? "/about"]] as [string, string][]).map(([label, href]) => (
                  <Link key={label} to={href} style={{ fontFamily: T.body, fontSize: ".86rem", color: "var(--cv-muted)", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, transition: "color .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.amber)} onMouseLeave={e => (e.currentTarget.style.color = T.inkDim)}>
                    <span style={{ fontFamily: T.mono, fontSize: ".65rem", color: "var(--cv-accent)" }}>→</span>{label}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal cls="cu-rvR" delay={110}>
            <div style={{ background: "var(--cv-bg2, rgba(20,22,8,.9))", borderRadius: T.radiusLg, border: `1px solid var(--cv-border)`, padding: "40px 36px" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 54, height: 54, borderRadius: "50%", background: T.gradMain, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", color: T.bg, padding: 13 }}><IconCheck /></div>
                  <h3 style={{ fontFamily: T.display, fontWeight: 900, fontSize: "1.4rem", color: "var(--cv-text)", margin: "0 0 10px", textTransform: "uppercase" }}>Message Sent!</h3>
                  <p style={{ fontFamily: T.body, fontSize: ".92rem", color: "var(--cv-muted)", margin: "0 0 22px", lineHeight: 1.6 }}>We'll get back to you within the same day. Thank you!</p>
                  <button className="cu-btn-outline" onClick={() => setSent(false)} style={{ padding: "11px 22px", borderRadius: T.radius, fontSize: ".86rem", fontFamily: T.body, border: `1px solid var(--cv-border)`, background: "rgba(245,240,232,.05)", cursor: "pointer" }}>Send Another</button>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <p style={{ fontFamily: T.mono, fontSize: ".6rem", letterSpacing: ".28em", textTransform: "uppercase", color: "var(--cv-accent)", fontWeight: 700, margin: "0 0 26px" }}>Send us a message</p>
                  <div className="cu-form-grid" style={{ marginBottom: 14 }}>
                    <div>
                      <div className="cu-label"><span className="cu-label-dot" />Name</div>
                      <div className="cu-iw"><input type="text" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                    </div>
                    <div>
                      <div className="cu-label"><span className="cu-label-dot" />Phone</div>
                      <div className="cu-iw"><input type="tel" placeholder="+91 xxxxx xxxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div className="cu-label"><span className="cu-label-dot" />Email</div>
                    <div className="cu-iw"><input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div className="cu-label"><span className="cu-label-dot" />Service Needed</div>
                    <div className="cu-iw">
                      <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                        <option value="">Select a service…</option>
                        {["Tyre Replacement","Wheel Balancing","Wheel Alignment","Tyre Rotation","Puncture Repair","Nitrogen Inflation","Tyre Inspection","Performance Tyres","Commercial / Fleet","General Enquiry"].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <div className="cu-label"><span className="cu-label-dot" />Message</div>
                    <div className="cu-iw"><textarea rows={4} placeholder="Tell us about your vehicle and what you need…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
                  </div>
                  <button type="submit" className="cu-submit" disabled={busy}>{busy ? "Sending…" : "Send Message →"}</button>
                  <p style={{ fontFamily: T.mono, fontSize: ".58rem", letterSpacing: ".1em", color: "var(--cv-muted)", textAlign: "center", marginTop: 12 }}>We respond within the same business day</p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   HOURS SECTION
   ========================================================================== */
function HoursSection() {
  const T = useAboutT();
  const days = [
    { day: "Monday – Friday", hours: "8:00 AM – 7:00 PM" },
    { day: "Saturday",        hours: "8:00 AM – 6:00 PM" },
    { day: "Sunday",          hours: "9:00 AM – 5:00 PM" },
  ];
  return (
    <section className="cu-sec" style={{ background: "var(--cv-bg)", padding: "72px 48px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(212,168,67,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,67,.03) 1px,transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Reveal style={{ marginBottom: 48 }}>
          <SectionTag idx="02" label="Opening Hours" />
          <SplitH style={{ fontSize: "clamp(1.9rem,3.6vw,3rem)", fontWeight: 900, color: "var(--cv-text)", letterSpacing: "-.025em", lineHeight: .98, marginBottom: 14 }}>
            Open every day for you
          </SplitH>
          <LineDraw color={T.greenBrt} />
        </Reveal>

        <div className="cu-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          {/* Hours table */}
          <Reveal cls="cu-rvL" delay={60}>
            <div style={{ background: "var(--cv-bg2, rgba(20,22,8,.9))", borderRadius: T.radiusLg, border: `1px solid var(--cv-border)`, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle,var(--cv-green-dark)20,transparent 70%)`, pointerEvents: "none" }} />
              {days.map((d, i) => (
                <div key={d.day} className="cu-hours-row" style={{ paddingBottom: i < days.length - 1 ? 16 : 0, marginBottom: i < days.length - 1 ? 0 : 0 }}>
                  <div>
                    <p style={{ fontFamily: T.display, fontWeight: 700, fontSize: ".95rem", color: "var(--cv-text)", margin: 0 }}>{d.day}</p>
                    <p style={{ fontFamily: T.mono, fontSize: ".7rem", color: "var(--cv-muted)", margin: "3px 0 0" }}>{d.hours}</p>
                  </div>
                  <span style={{ fontFamily: T.mono, fontSize: ".58rem", letterSpacing: ".12em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999, background: `rgba(107,168,79,.12)`, border: `1px solid rgba(107,168,79,.3)`, color: "var(--cv-green)" }}>Open</span>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: `linear-gradient(135deg,var(--cv-accent)0e,var(--cv-green-dark)0e)`, border: `1px solid var(--cv-border)` }}>
                <p style={{ fontFamily: T.mono, fontSize: ".58rem", color: "var(--cv-accent)", letterSpacing: ".18em", textTransform: "uppercase", margin: "0 0 5px", fontWeight: 700 }}>Walk-ins welcome</p>
                <p style={{ fontFamily: T.body, fontSize: ".86rem", color: "var(--cv-muted)", margin: 0, fontWeight: 300 }}>No appointment needed for most services. Call ahead for fleet or same-day service.</p>
              </div>
            </div>
          </Reveal>

          {/* Map card */}
          <Reveal cls="cu-rvR" delay={140}>
            <div style={{ background: "var(--cv-bg2, rgba(20,22,8,.9))", borderRadius: T.radiusLg, border: `1px solid var(--cv-border)`, overflow: "hidden" }}>
              {/* Map placeholder with grid */}
              <div
  style={{
    height: 320,
    overflow: "hidden",
    borderBottom: `1px solid var(--cv-border)`,
  }}
>
  <iframe
    title="CTS Tyres Location"
    src="https://maps.google.com/maps?q=Mumbai&t=&z=13&ie=UTF8&iwloc=&output=embed"
    width="100%"
    height="100%"
    style={{
      border: 0,
      display: "block",
    }}
    loading="lazy"
  />
</div>
        
              <div style={{ padding: "26px 28px 30px" }}>
                <p style={{ fontFamily: T.mono, fontSize: ".58rem", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--cv-accent)", fontWeight: 700, margin: "0 0 12px" }}>Our Location</p>
                <p style={{ fontFamily: T.display, fontWeight: 800, fontSize: "1rem", color: "var(--cv-text)", margin: "0 0 6px" }}>CTS Tyres Workshop</p>
                <p style={{ fontFamily: T.body, fontSize: ".88rem", color: "var(--cv-muted)", margin: "0 0 18px", lineHeight: 1.65, fontWeight: 300 }}>123 Tyre Lane, Industrial Area<br />Mumbai, Maharashtra 400001</p>
                <a href="#" className="cu-btn-outline" style={{ padding: "10px 18px", borderRadius: T.radius, fontSize: ".82rem", fontFamily: T.body, border: `1px solid var(--cv-border)`, background: "rgba(245,240,232,.04)" }}>Get Directions →</a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   CTA
   ========================================================================== */
function CtaSection() {
  const T = useAboutT();
  return (
    <section style={{ background: "var(--cv-bg2)", position: "relative", overflow: "hidden" }}>
      <GrainBg opacity={.05} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(90deg,rgba(212,168,67,.02) 0,rgba(212,168,67,.02) 1px,transparent 1px,transparent 80px)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-30%", left: "5%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle,var(--cv-accent)0e,transparent 70%)`, filter: "blur(50px)", animation: "cu-glow 7s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "5%", width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle,var(--cv-green-dark)18,transparent 70%)`, filter: "blur(50px)", animation: "cu-glow 9s ease-in-out infinite .5s", pointerEvents: "none" }} />

      <div className="cu-cta-flex" style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "72px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
        <Reveal cls="cu-rvL" style={{ maxWidth: 540 }}>
          <SectionTag idx="03" label="Expert help, free" />
          <motion.h2 initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .25, duration: .6, ease: [.22,1,.36,1] }}
            style={{ fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 900, color: "var(--cv-text)", margin: "0 0 10px", letterSpacing: "-.02em", lineHeight: 1.06, fontFamily: T.display, textTransform: "uppercase" }}>
            Not sure which tyre you need?
          </motion.h2>
          <LineDraw color={T.amber} delay={.3} />
          <p style={{ color: "var(--cv-muted)", fontSize: ".92rem", margin: 0, lineHeight: 1.65, fontWeight: 300 }}>Our specialists will assess your vehicle and find the perfect match — no jargon, just honest advice.</p>
        </Reveal>
        <Reveal delay={100} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a href={COMPANY.phoneHref ?? "tel:+91"} className="cu-btn-amber" style={{ padding: "14px 28px", borderRadius: T.radius, fontSize: ".9rem", fontFamily: T.body }}>
            <span style={{ fontFamily: T.mono }}>☎</span> Call Us Now
          </a>
          <Link to={ROUTES.tyres} className="cu-btn-outline" style={{ padding: "14px 28px", borderRadius: T.radius, fontSize: ".9rem", fontFamily: T.body }}>
            Browse Tyres →
          </Link>
        </Reveal>
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right,var(--cv-accent)66,var(--cv-green)44,transparent)` }} />
    </section>
  );
}

/* ============================================================================
   EXPORT
   ========================================================================== */
export default function ContactUs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const T = getAboutTokens(isDark);

  const cssVars: React.CSSProperties = {
    "--cv-bg":          isDark ? "#0C0D08"                      : "#F5F2EB",
    "--cv-bg2":         isDark ? "#141608"                      : "#FFFFFF",
    "--cv-text":        isDark ? "#F5F0E8"                      : "#1A1A14",
    "--cv-muted":       isDark ? "#8C8878"                      : "#6B6550",
    "--cv-border":      isDark ? "rgba(212,168,67,0.18)"        : "rgba(184,118,10,0.18)",
    "--cv-accent":      isDark ? "#D4A843"                      : "#B8760A",
    "--cv-accent-dim":  isDark ? "#A07A20"                      : "#8A5808",
    "--cv-green":       isDark ? "#6BA84F"                      : "#4D8B31",
    "--cv-green-dark":  isDark ? "#3D5A2E"                      : "#2D4A20",
    "--cv-rust":        isDark ? "#B84A2C"                      : "#A03820",
  } as React.CSSProperties;


  return (
    <AboutTheme.Provider value={T}>
      <div className="contact-root" style={{ fontFamily: T.body, minHeight: "100vh", overflowX: "hidden", WebkitFontSmoothing: "antialiased", ...cssVars, background: "var(--cv-bg)", color: "var(--cv-text)" }}>
        <style>{CSS}</style>
        <Hero />
        <Ticker />
        {/* <QuickStats /> */}
        {/* <ContactSection /> */}
        <HoursSection /> 
        {/* <CtaSection />   */}
      </div>
    </AboutTheme.Provider>
  );
}