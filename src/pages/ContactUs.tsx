import { useEffect, useRef, useState, createContext, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES, COMPANY } from "../config/site";
import { useTheme } from "../context/ThemeContext";

/* ============================================================================
   TOKENS — computed per-theme
   ========================================================================== */
function getCxTokens(isDark: boolean) {
  return {
    bg:           isDark ? "#0C0D08"               : "#F5F2EB",
    paper:        isDark ? "#F5F0E8"               : "#FFFFFF",
    ink:          isDark ? "#F5F0E8"               : "#1A1A14",
    inkDark:      isDark ? "#1A1B14"               : "#1A1A14",
    inkDim:       isDark ? "#8C8878"               : "#6B6550",
    amber:        isDark ? "#D4A843"               : "#B8760A",
    amberDim:     isDark ? "#A07A20"               : "#8A5808",
    green:        isDark ? "#3D5A2E"               : "#2D4A20",
    greenBrt:     isDark ? "#6BA84F"               : "#4D8B31",
    rust:         isDark ? "#B84A2C"               : "#A03820",
    hairline:     isDark ? "rgba(212,168,67,0.18)" : "rgba(184,118,10,0.18)",
    hairlineDark: isDark ? "rgba(26,27,20,0.15)"  : "rgba(26,26,14,0.12)",
    mono:         "'Space Mono',monospace",
    display:      "'Archivo',sans-serif",
    body:         "'Archivo',sans-serif",
  };
}

type CxTokens = ReturnType<typeof getCxTokens>;
const CxTheme = createContext<CxTokens>(getCxTokens(true));
const useCxT  = () => useContext(CxTheme);

/* ============================================================================
   GLOBAL CSS
   ========================================================================== */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
  .cx-root *{ box-sizing:border-box; }
  ::selection{ background:#D4A843; color:#0C0D08; }

  @keyframes cx-up    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
  @keyframes cx-left  { from{opacity:0;transform:translateX(-22px)} to{opacity:1;transform:none} }
  @keyframes cx-right { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:none} }
  @keyframes cx-scale { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
  @keyframes cx-glow  { 0%,100%{opacity:.28} 50%{opacity:.8} }
  @keyframes cx-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes cx-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes cx-shine { 0%{left:-60%} 100%{left:110%} }
  @keyframes cx-count { from{opacity:0;transform:scale(.7) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes cx-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes cx-rail  { from{transform:translateY(0)} to{transform:translateY(-50%)} }
  @keyframes cx-draw  { from{stroke-dashoffset:1000} to{stroke-dashoffset:0} }

  /* reveal */
  .cx-rv { opacity:0; }
  .cx-rv.on  { animation:cx-up    .7s cubic-bezier(.22,1,.36,1) both; }
  .cx-rvL.on { animation:cx-left  .7s cubic-bezier(.22,1,.36,1) both; }
  .cx-rvR.on { animation:cx-right .7s cubic-bezier(.22,1,.36,1) both; }
  .cx-rvS.on { animation:cx-scale .7s cubic-bezier(.22,1,.36,1) both; }

  /* vertical rail ticker */
  .cx-vrail { display:flex; flex-direction:column; gap:32px; animation:cx-rail 22s linear infinite; }

  /* form inputs — underline only, no box */
  .cx-field {
    border:none;
    border-bottom:1.5px solid rgba(26,27,20,0.18);
    border-radius:0;
    background:transparent;
    outline:none;
    font-family:'Archivo',sans-serif;
    font-size:1rem;
    font-weight:500;
    color:var(--cv-text-dark);
    padding:14px 0;
    width:100%;
    transition:border-color .25s;
    -webkit-appearance:none;
    appearance:none;
    box-shadow:none;
  }
  .cx-field:focus { border-color:#D4A843; }
  .cx-field::placeholder { color:rgba(26,27,20,.35); font-weight:400; }
  .cx-field-wrap { position:relative; margin-bottom:28px; }
  .cx-field-wrap::after {
    content:''; position:absolute; bottom:0; left:0; width:0; height:1.5px;
    background:#D4A843; transition:width .35s cubic-bezier(.22,1,.36,1);
  }
  .cx-field-wrap:focus-within::after { width:100%; }
  .cx-flabel {
    display:block; font-family:'Space Mono',monospace; font-size:.58rem;
    font-weight:700; letter-spacing:.22em; text-transform:uppercase;
    color:rgba(26,27,20,.4); margin-bottom:4px;
  }
  .cx-field select { cursor:pointer; }
  .cx-field option { background:#F5F0E8; color:#1A1B14; }

  /* submit */
  .cx-submit {
    position:relative; overflow:hidden;
    background:#1A1B14; color:#D4A843;
    border:none; cursor:pointer; font-family:'Archivo',sans-serif;
    font-size:.92rem; font-weight:800; letter-spacing:.06em;
    padding:18px 0; width:100%; border-radius:2px;
    transition:background .25s, color .25s, box-shadow .25s;
  }
  .cx-submit:hover { background:#D4A843; color:#1A1B14; box-shadow:0 8px 28px rgba(212,168,67,.35); }
  .cx-submit:disabled { opacity:.6; cursor:not-allowed; }
  .cx-submit::after {
    content:''; position:absolute; top:-50%; left:-60%;
    width:200%; height:200%;
    background:linear-gradient(45deg,transparent,rgba(255,255,255,.12),transparent);
    transform:rotate(45deg); animation:cx-shine 3s ease-in-out infinite;
  }

  /* bento cards */
  .cx-bento {
    border:1px solid rgba(26,27,20,.1); border-radius:2px;
    transition:border-color .25s, box-shadow .3s, transform .3s cubic-bezier(.22,1,.36,1);
    cursor:default;
  }
  .cx-bento:hover { border-color:rgba(212,168,67,.5); box-shadow:0 16px 48px rgba(212,168,67,.1); transform:translateY(-3px); }

  .cx-cursor { display:inline-block; animation:cx-blink 1.1s step-end infinite; }
  .cx-ring { animation:cx-spin 12s linear infinite; }
  .cx-stat-num.on { animation:cx-count .55s cubic-bezier(.22,1,.36,1) both; }

  .cx-nav-pill {
    font-family:'Space Mono',monospace; font-size:.6rem; font-weight:700;
    letter-spacing:.16em; text-transform:uppercase; padding:7px 14px;
    border-radius:999px; border:1px solid rgba(212,168,67,.25);
    color:rgba(245,240,232,.45); background:transparent; cursor:pointer;
    transition:all .2s ease;
  }
  .cx-nav-pill.active, .cx-nav-pill:hover {
    border-color:#D4A843; color:#D4A843; background:rgba(212,168,67,.08);
  }

  /* ── HERO ────────────────────────────────────────────────────── */
  .cx-hero-grid {
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:0;
    align-items:center;
  }
  .cx-hero-left  { padding-right:48px; }
  .cx-hero-right {
    display:flex; flex-direction:column; gap:14px;
    padding-left:48px;
    border-left:1px solid var(--cv-border);
  }

  /* ── BENTO ───────────────────────────────────────────────────── */
  .cx-bento-row {
    display:grid;
    grid-template-columns:2fr 1fr 1fr;
    grid-template-rows:auto auto;
    gap:16px;
  }
  .cx-bento-tall { grid-row:1 / 3; }

  /* ── FORM ────────────────────────────────────────────────────── */
  .cx-form-sec {
    display:grid;
    grid-template-columns:1fr 1.2fr;
    min-height:80vh;
  }
  .cx-form-cols {
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:0 24px;
  }

  /* ── HOURS ───────────────────────────────────────────────────── */
  .cx-bar {
    display:flex;
    gap:10px;
    align-items:stretch;
  }

  /* ── FOOTER ROW ──────────────────────────────────────────────── */
  .cx-footer-row {
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:24px;
    flex-wrap:wrap;
  }

  /* ── VERTICAL RAIL ───────────────────────────────────────────── */
  .cx-rail-col { display:block; }

  /* ══════════════════════════════════════════════════════════════
     RESPONSIVE — 960px (tablet)
     ══════════════════════════════════════════════════════════════ */
  @media(max-width:960px) {
    .cx-rail-col { display:none !important; }
    .cx-hero-grid { grid-template-columns:1fr !important; }
    .cx-hero-left { padding-right:0 !important; }
    .cx-hero-right {
      padding-left:0 !important;
      border-left:none !important;
      border-top:1px solid var(--cv-border);
      padding-top:32px;
      margin-top:8px;
    }
    .cx-hero-num { font-size:clamp(5rem,18vw,10rem) !important; }
    .cx-bento-row { grid-template-columns:1fr 1fr !important; grid-template-rows:auto !important; }
    .cx-bento-tall { grid-row:auto !important; grid-column:1 / -1 !important; }
    .cx-form-sec { grid-template-columns:1fr !important; min-height:auto !important; }
    .cx-form-cols { grid-template-columns:1fr 1fr !important; }
    .cx-bar { flex-wrap:wrap !important; gap:8px !important; }
    .cx-bar > * { flex:1 1 calc(25% - 8px) !important; min-width:80px !important; }
  }

  /* ══════════════════════════════════════════════════════════════
     RESPONSIVE — 600px (mobile)
     ══════════════════════════════════════════════════════════════ */
  @media(max-width:600px) {
    .cx-bento-row { grid-template-columns:1fr !important; }
    .cx-form-cols { grid-template-columns:1fr !important; }
    .cx-bar > * { flex:1 1 calc(50% - 8px) !important; min-width:100px !important; }
    .cx-footer-row { flex-direction:column !important; align-items:flex-start !important; gap:16px !important; }
    .cx-sec-pad { padding-left:20px !important; padding-right:20px !important; }
    .cx-hero-pad { padding-left:20px !important; padding-right:20px !important; padding-top:72px !important; }
    .cx-hero-vline { display:none !important; }
    .cx-hero-hline { display:none !important; }
  }
`;

/* ============================================================================
   HOOKS
   ========================================================================== */
function useOnScreen(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, [threshold]);
  return { ref, on };
}

function Rev({ children, cls = "cx-rv", delay = 0, style = {} }: { children: React.ReactNode; cls?: string; delay?: number; style?: React.CSSProperties }) {
  const { ref, on } = useOnScreen();
  return <div ref={ref} className={`${cls}${on ? " on" : ""}`} style={{ animationDelay: `${delay}ms`, ...style }}>{children}</div>;
}

/* ============================================================================
   COUNT-UP
   ========================================================================== */
function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const t0 = performance.now(), dur = 1600;
        const tick = (t: number) => { const p = Math.min(1, (t - t0) / dur); setN(Math.floor(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick); io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el); return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n.toLocaleString("en-US")}{suffix}</span>;
}

/* ============================================================================
   ICONS
   ========================================================================== */
const svgP = { viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:1.6, strokeLinecap:"round" as const, strokeLinejoin:"round" as const };
const IPhone  = ()=><svg {...svgP} width={20} height={20}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 01-.001 1.2 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>;
const IMail   = ()=><svg {...svgP} width={20} height={20}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>;
const IPin    = ()=><svg {...svgP} width={20} height={20}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IClock  = ()=><svg {...svgP} width={20} height={20}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const IArrow  = ()=><svg {...svgP} width={16} height={16}><path d="M7 17l5-5-5-5"/><path d="M4 12h8"/></svg>;
const ICheck  = ()=><svg {...svgP} width={22} height={22}><path d="M20 6L9 17l-5-5"/></svg>;

/* ============================================================================
   VERTICAL RAIL
   ========================================================================== */
const RAIL_ITEMS = ["WHEEL ALIGNMENT","BALANCING","FITMENT","INSPECTION","ROTATION","REPLACEMENT","NITROGEN","PERFORMANCE","FLEET","PUNCTURE REPAIR"];
function VerticalRail() {
  const T = useCxT();
  const doubled = [...RAIL_ITEMS, ...RAIL_ITEMS];
  return (
    <div className="cx-rail-col" style={{ position:"fixed", left:0, top:0, bottom:0, width:40, overflow:"hidden", zIndex:50, pointerEvents:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div className="cx-vrail">
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily:T.mono, fontSize:8, fontWeight:700, letterSpacing:".3em", textTransform:"uppercase", color:"rgba(212,168,67,.18)", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   HERO
   ========================================================================== */
function Hero() {
  const T = useCxT();
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 1000); return () => clearInterval(id); }, []);
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false });

  return (
    <section style={{ position:"relative", background:"var(--cv-bg)", overflow:"hidden", minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <div className="cx-hero-hline" style={{ position:"absolute", top:"50%", left:40, right:0, height:1, background:`linear-gradient(to right,var(--cv-accent)55,transparent 80%)`, pointerEvents:"none", zIndex:1 }}/>
      <div className="cx-hero-vline" style={{ position:"absolute", left:"48%", top:0, bottom:0, width:1, background:`linear-gradient(to bottom,transparent,var(--cv-accent)33 30%,var(--cv-accent)33 70%,transparent)`, pointerEvents:"none", zIndex:1 }}/>
      <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(circle, rgba(212,168,67,.12) 1px, transparent 1px)`, backgroundSize:"40px 40px", pointerEvents:"none", zIndex:0 }}/>
      <div style={{ position:"absolute", bottom:"-20%", left:"10%", width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle,var(--cv-accent)18,transparent 65%)`, filter:"blur(60px)", animation:"cx-glow 6s ease-in-out infinite", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"-10%", right:"5%", width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle,var(--cv-green)12,transparent 65%)`, filter:"blur(70px)", animation:"cx-glow 8s ease-in-out infinite .6s", pointerEvents:"none" }}/>

      <div
        className="cx-hero-pad cx-hero-grid"
        style={{
          position:"relative", zIndex:2, flex:1,
          padding:"clamp(80px,10vh,120px) clamp(20px,5vw,72px) clamp(56px,6vh,88px) clamp(20px,4vw,56px)",
        }}
      >
        {/* LEFT */}
        <div className="cx-hero-left">
          <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:.06,duration:.5,ease:[.22,1,.36,1]}}
            style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:T.amber, animation:"cx-pulse 2s ease-in-out infinite" }}/>
            <span style={{ fontFamily:T.mono, fontSize:10, letterSpacing:".35em", textTransform:"uppercase", color:"var(--cv-accent)", fontWeight:700 }}>Contact CTS Tyres</span>
          </motion.div>

          <div style={{ position:"relative", marginBottom:8 }}>
            <motion.div initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.14,duration:.7,ease:[.22,1,.36,1]}}>
              <span className="cx-hero-num" style={{ fontFamily:T.display, fontWeight:900, fontSize:"clamp(5rem,16vw,16rem)", lineHeight:.82, letterSpacing:"-.06em", color:"transparent", WebkitTextStroke:`1.5px var(--cv-accent)`, display:"block" }}>01</span>
            </motion.div>
            <div className="cx-ring" style={{ position:"absolute", top:"50%", left:"12%", transform:"translate(-50%,-50%)", width:"min(200px,22vw)", height:"min(200px,22vw)", borderRadius:"50%", border:`1px dashed rgba(212,168,67,.22)`, pointerEvents:"none" }}/>
          </div>

          <div style={{ overflow:"hidden", marginBottom:6 }}>
            <motion.h1 initial={{y:"105%"}} animate={{y:0}} transition={{delay:.22,duration:.72,ease:[.22,1,.36,1]}}
              style={{ fontFamily:T.display, fontWeight:900, fontSize:"clamp(1.8rem,4.5vw,4rem)", lineHeight:.95, letterSpacing:"-.035em", textTransform:"uppercase", color:"var(--cv-text)", margin:0 }}>
              GET IN TOUCH
            </motion.h1>
          </div>
          <div style={{ overflow:"hidden", marginBottom:28 }}>
            <motion.h1 initial={{y:"105%"}} animate={{y:0}} transition={{delay:.3,duration:.72,ease:[.22,1,.36,1]}}
              style={{ fontFamily:T.display, fontWeight:900, fontSize:"clamp(1.8rem,4.5vw,4rem)", lineHeight:.95, letterSpacing:"-.035em", textTransform:"uppercase", color:"var(--cv-accent)", margin:0 }}>
              WITH US.<span className="cx-cursor" style={{ color:T.greenBrt }}>_</span>
            </motion.h1>
          </div>

          <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.42,duration:.55,ease:[.22,1,.36,1]}}
            style={{ fontFamily:T.body, fontSize:"clamp(.88rem,1.1vw,1.02rem)", color:"var(--cv-muted)", lineHeight:1.72, maxWidth:360, margin:"0 0 32px", fontWeight:300 }}>
            Walk in without an appointment, send a message, or call — we respond the same day.
          </motion.p>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.55,duration:.5}}
            style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"8px 16px", border:`1px solid var(--cv-border)`, borderRadius:999, background:"rgba(212,168,67,.06)" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:T.greenBrt, animation:"cx-pulse 1.5s ease-in-out infinite" }}/>
            <span style={{ fontFamily:T.mono, fontSize:".65rem", color:"var(--cv-accent)", letterSpacing:".14em" }}>LIVE · {timeStr} IST</span>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="cx-hero-right">
          {[
            { icon:<IPhone/>, label:"Call us", value:COMPANY.phone??"98765 43210", sub:"Mon–Sun · Same day response", href:COMPANY.phoneHref??"tel:+91", delay:0.28 },
            { icon:<IMail/>,  label:"Email",   value:"hello@ctstyres.com", sub:"Response within hours", href:"mailto:hello@ctstyres.com", delay:0.36 },
            { icon:<IPin/>,   label:"Visit us", value:"123 Tyre Lane, Mumbai", sub:"MH 400001 · Walk-ins welcome", href:"#", delay:0.44 },
            { icon:<IClock/>, label:"Hours",   value:"Mon–Sat 8am–7pm", sub:"Sunday 9am–5pm", href:null, delay:0.52 },
          ].map((card) => (
            <motion.div key={card.label} initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} transition={{delay:card.delay,duration:.55,ease:[.22,1,.36,1]}}>
              {card.href ? (
                <a href={card.href} style={{ textDecoration:"none", display:"block" }}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor=T.amber)}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor=T.hairline)}>
                  <ContactCard icon={card.icon} label={card.label} value={card.value} sub={card.sub} />
                </a>
              ) : (
                <ContactCard icon={card.icon} label={card.label} value={card.value} sub={card.sub} />
              )}
            </motion.div>
          ))}

          <motion.a initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.62,duration:.5,ease:[.22,1,.36,1]}}
            href="#form" className="cx-submit" style={{ display:"block", textAlign:"center", textDecoration:"none", marginTop:4 }}>
            Send a Message →
          </motion.a>
        </div>
      </div>

      <div style={{ position:"absolute", bottom:0, left:40, right:0, height:2, background:`linear-gradient(to right,var(--cv-accent)88,var(--cv-green)44,transparent)`, zIndex:3 }}/>
    </section>
  );
}

function ContactCard({ icon, label, value, sub }: { icon:React.ReactNode; label:string; value:string; sub:string }) {
  const T = useCxT();
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"16px 18px", background:"var(--cv-bg2, rgba(20,22,8,.8))", border:`1px solid var(--cv-border)`, borderRadius:6, backdropFilter:"blur(8px)", transition:"border-color .25s, background .25s" }}>
      <div style={{ width:38, height:38, borderRadius:8, background:`rgba(212,168,67,.1)`, border:`1px solid rgba(212,168,67,.22)`, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--cv-accent)", flexShrink:0 }}>{icon}</div>
      <div style={{ minWidth:0 }}>
        <p style={{ fontFamily:T.mono, fontSize:".56rem", letterSpacing:".2em", textTransform:"uppercase", color:"var(--cv-muted)", margin:"0 0 3px" }}>{label}</p>
        <p style={{ fontFamily:T.display, fontWeight:700, fontSize:".92rem", color:"var(--cv-text)", margin:"0 0 2px", letterSpacing:"-.01em", wordBreak:"break-word" }}>{value}</p>
        <p style={{ fontFamily:T.mono, fontSize:".6rem", color:"rgba(140,136,120,.6)", margin:0, letterSpacing:".06em" }}>{sub}</p>
      </div>
    </div>
  );
}

/* ============================================================================
   FORM VALIDATION HELPERS
   ========================================================================== */
const MAX_MESSAGE_WORDS = 50;

function isValidName(v: string) {
  return v.trim().length > 0;
}
function isValidPhone(v: string) {
  const digits = v.replace(/\D/g, "");
  return digits.length === 10;
}
function isValidEmail(v: string) {
  // requires something@something.something
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
function wordCount(v: string) {
  const trimmed = v.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}
function clampToWordLimit(v: string, limit: number) {
  const words = v.split(/\s+/);
  if (words.length <= limit) return v;
  // keep original spacing as much as possible by rejoining first `limit` words
  return words.slice(0, limit).join(" ");
}

/* Field border color logic:
   - not touched yet -> default subtle border
   - touched + valid  -> green
   - touched + empty/invalid -> red
   For optional-looking fields we still apply the same rule once touched,
   since validity is what determines color (not "required"-ness). */
function fieldBorderColor(touched: boolean, valid: boolean, defaultColor: string) {
  if (!touched) return defaultColor;
  return valid ? "#3DA854" : "#D43B3B";
}

/* ============================================================================
   FORM SECTION
   ========================================================================== */
function FormSection() {
  const T = useCxT();
  const [step, setStep] = useState<"form"|"sent">("form");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", email:"", service:"", message:"", vehicle:"" });
  const [touched, setTouched] = useState({ name:false, phone:false, email:false });

  const up = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    if (k === "message") {
      setForm(prev => ({ ...prev, message: clampToWordLimit(value, MAX_MESSAGE_WORDS) }));
      return;
    }
    setForm(prev => ({ ...prev, [k]: value }));
  };

  const markTouched = (k: keyof typeof touched) => () => setTouched(prev => ({ ...prev, [k]: true }));

  const nameValid  = isValidName(form.name);
  const phoneValid = isValidPhone(form.phone);
  const emailValid = isValidEmail(form.email);
  const msgWords    = wordCount(form.message);

  const defaultBorder = "rgba(26,27,20,0.18)";
  const nameBorder  = fieldBorderColor(touched.name,  nameValid,  defaultBorder);
  const phoneBorder = fieldBorderColor(touched.phone, phoneValid, defaultBorder);
  const emailBorder = fieldBorderColor(touched.email, emailValid, defaultBorder);

  const canSubmit = nameValid && phoneValid && emailValid;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // mark everything touched so any unfixed errors show up
    setTouched({ name:true, phone:true, email:true });
    if (!canSubmit) return;
    setBusy(true);
    setTimeout(() => { setBusy(false); setStep("sent"); }, 1400);
  };

  return (
    <section id="form" style={{ position:"relative", overflow:"hidden" }}>
      <div className="cx-form-sec">

        {/* LEFT — dark panel */}
        <div style={{ background:T.inkDark, position:"relative", overflow:"hidden", padding:"clamp(40px,6vw,64px) clamp(20px,4vw,52px)", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(circle,rgba(212,168,67,.1) 1px,transparent 1px)`, backgroundSize:"36px 36px", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:"-20%", left:"-10%", width:350, height:350, borderRadius:"50%", background:`radial-gradient(circle,var(--cv-accent)18,transparent 70%)`, filter:"blur(50px)", pointerEvents:"none" }}/>

          <div style={{ position:"relative", zIndex:1 }}>
            <p style={{ fontFamily:T.mono, fontSize:".58rem", letterSpacing:".32em", textTransform:"uppercase", color:"var(--cv-accent)", margin:"0 0 24px" }}>[ 02 ] — Message Us</p>
            <h2 style={{ fontFamily:T.display, fontWeight:900, fontSize:"clamp(2rem,4vw,3.8rem)", lineHeight:.92, letterSpacing:"-.04em", color:"var(--cv-text)", textTransform:"uppercase", margin:"0 0 24px" }}>
              Send us<br/>a message<span style={{ color:"var(--cv-accent)" }}>.</span>
            </h2>
            <div style={{ width:48, height:2, background:T.amber, marginBottom:24 }}/>
            <p style={{ fontFamily:T.body, fontSize:".95rem", color:"rgba(245,240,232,.5)", lineHeight:1.72, margin:"0 0 36px", fontWeight:300, maxWidth:320 }}>
              Fill in the form and we'll get back to you the same business day with an expert recommendation.
            </p>

            {[["01","Fill the form","30 seconds"],["02","We review it","Same day"],["03","We call back","Expert advice"]].map(([n, title, sub]) => (
              <div key={n} style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:`rgba(212,168,67,.12)`, border:`1px solid rgba(212,168,67,.3)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontFamily:T.mono, fontSize:".58rem", color:"var(--cv-accent)", fontWeight:700 }}>{n}</span>
                </div>
                <div>
                  <p style={{ fontFamily:T.display, fontWeight:700, fontSize:".88rem", color:"var(--cv-text)", margin:0 }}>{title}</p>
                  <p style={{ fontFamily:T.mono, fontSize:".58rem", color:"rgba(212,168,67,.55)", margin:0, letterSpacing:".1em" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ position:"relative", zIndex:1, display:"flex", gap:20, flexWrap:"wrap", paddingTop:24, borderTop:`1px solid rgba(212,168,67,.12)`, marginTop:24 }}>
            {[["4.8★","Google Reviews"],["10K+","Happy Drivers"],["Same Day","Turnaround"]].map(([v, l]) => (
              <div key={l}>
                <p style={{ fontFamily:T.display, fontWeight:900, fontSize:"1rem", color:"var(--cv-accent)", margin:"0 0 2px" }}>{v}</p>
                <p style={{ fontFamily:T.mono, fontSize:".55rem", color:"rgba(245,240,232,.35)", letterSpacing:".12em", textTransform:"uppercase", margin:0 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — form panel */}
        <div style={{ background:"var(--cv-paper)", padding:"clamp(40px,6vw,64px) clamp(20px,4vw,52px)", display:"flex", flexDirection:"column", justifyContent:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-10%", right:"-10%", width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle,rgba(212,168,67,.08),transparent 65%)`, filter:"blur(40px)", pointerEvents:"none" }}/>

          <AnimatePresence mode="wait">
            {step === "sent" ? (
              <motion.div key="sent" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:.4}} style={{ textAlign:"center", padding:"40px 20px", position:"relative", zIndex:1 }}>
                <div style={{ width:64, height:64, borderRadius:"50%", background:T.inkDark, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", color:"var(--cv-accent)" }}>
                  <ICheck/>
                </div>
                <h3 style={{ fontFamily:T.display, fontWeight:900, fontSize:"1.6rem", color:"var(--cv-text-dark)", margin:"0 0 10px", textTransform:"uppercase" }}>Message Received!</h3>
                <p style={{ fontFamily:T.body, fontSize:".95rem", color:"var(--cv-muted, rgba(26,27,20,.55))", margin:"0 0 28px", lineHeight:1.6 }}>We'll call or email you back within the same business day.</p>
                <button className="cx-submit" onClick={() => { setStep("form"); setForm({ name:"", phone:"", email:"", service:"", message:"", vehicle:"" }); setTouched({ name:false, phone:false, email:false }); }} style={{ maxWidth:240, margin:"0 auto" }}>Send Another →</button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}} onSubmit={submit} style={{ position:"relative", zIndex:1 }}>
                <p style={{ fontFamily:T.mono, fontSize:".6rem", letterSpacing:".28em", textTransform:"uppercase", color:"var(--cv-accent)", fontWeight:700, margin:"0 0 28px" }}>Your Details</p>

                <div className="cx-form-cols">
                  <div className="cx-field-wrap">
                    <label className="cx-flabel">Full Name</label>
                    <input
                      className="cx-field"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={up("name")}
                      onBlur={markTouched("name")}
                      style={{ borderBottomColor: nameBorder }}
                      required
                    />
                    {touched.name && !nameValid && (
                      <span style={{ fontFamily:T.mono, fontSize:".56rem", color:"#D43B3B", letterSpacing:".05em" }}>Please enter your name</span>
                    )}
                  </div>
                  <div className="cx-field-wrap">
                    <label className="cx-flabel">Phone</label>
                    <input
                      className="cx-field"
                      type="tel"
                      placeholder="+91 xxxxx xxxxx"
                      value={form.phone}
                      onChange={up("phone")}
                      onBlur={markTouched("phone")}
                      style={{ borderBottomColor: phoneBorder }}
                    />
                    {touched.phone && !phoneValid && (
                      <span style={{ fontFamily:T.mono, fontSize:".56rem", color:"#D43B3B", letterSpacing:".05em" }}>Enter a valid 10-digit number</span>
                    )}
                  </div>
                  <div className="cx-field-wrap">
                    <label className="cx-flabel">Email</label>
                    <input
                      className="cx-field"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={up("email")}
                      onBlur={markTouched("email")}
                      style={{ borderBottomColor: emailBorder }}
                      required
                    />
                    {touched.email && !emailValid && (
                      <span style={{ fontFamily:T.mono, fontSize:".56rem", color:"#D43B3B", letterSpacing:".05em" }}>Enter a valid email address</span>
                    )}
                  </div>
                  <div className="cx-field-wrap">
                    <label className="cx-flabel">Vehicle</label>
                    <input className="cx-field" type="text" placeholder="e.g. Honda City 2022" value={form.vehicle} onChange={up("vehicle")}/>
                  </div>
                </div>

                <div className="cx-field-wrap">
                  <label className="cx-flabel">Service Needed</label>
                  <select className="cx-field" value={form.service} onChange={up("service")}>
                    <option value="">Select a service…</option>
                    {["Tyre Replacement","Wheel Balancing","Wheel Alignment","Tyre Rotation","Puncture Repair","Nitrogen Inflation","Tyre Inspection","Performance Tyres","Commercial / Fleet","Not sure — need advice"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div className="cx-field-wrap">
                  <label className="cx-flabel">Message</label>
                  <textarea
                    className="cx-field"
                    rows={3}
                    placeholder="Tell us anything else — tyre size, budget, urgency…"
                    value={form.message}
                    onChange={up("message")}
                    style={{ resize:"none" }}
                  />
                  <div style={{ display:"flex", justifyContent:"flex-end", marginTop:4 }}>
                    <span style={{ fontFamily:T.mono, fontSize:".56rem", letterSpacing:".05em", color: msgWords >= MAX_MESSAGE_WORDS ? "#D43B3B" : "rgba(26,27,20,.4)" }}>
                      {msgWords}/{MAX_MESSAGE_WORDS} words
                    </span>
                  </div>
                </div>

                <button type="submit" className="cx-submit" disabled={busy}>{busy ? "Sending…" : "Send Message →"}</button>
                <p style={{ fontFamily:T.mono, fontSize:".56rem", letterSpacing:".1em", color:"var(--cv-muted, rgba(26,27,20,.35))", textAlign:"center", marginTop:12 }}>We respond within the same business day</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   BENTO INFO GRID
   ========================================================================== */
function BentoSection() {
  const T = useCxT();
  const services = ["Tyre Replacement","Wheel Balancing","3D Alignment","Rotation","Puncture Repair","Nitrogen Fill","Inspection","Performance","Fleet"];
  return (
    <section className="cx-sec-pad" style={{ background:"var(--cv-paper)", position:"relative", overflow:"hidden", padding:"80px 56px 88px" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:`repeating-linear-gradient(60deg,rgba(26,27,20,.05) 0,rgba(26,27,20,.05) 1px,transparent 1px,transparent 32px)`, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle,rgba(212,168,67,.12),transparent 65%)`, filter:"blur(50px)", pointerEvents:"none", animation:"cx-glow 7s ease-in-out infinite" }}/>

      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:1 }}>
        <Rev style={{ marginBottom:52 }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <p style={{ fontFamily:T.mono, fontSize:".6rem", letterSpacing:".32em", textTransform:"uppercase", color:"var(--cv-accent)", fontWeight:700, margin:"0 0 10px" }}>[ 03 ] — What We Offer</p>
              <h2 style={{ fontFamily:T.display, fontWeight:900, fontSize:"clamp(2rem,4vw,3.4rem)", color:"var(--cv-text-dark)", letterSpacing:"-.03em", lineHeight:.95, margin:0, textTransform:"uppercase" }}>
                Every service<br/>under one roof
              </h2>
            </div>
            <p style={{ fontFamily:T.body, fontSize:".95rem", color:"var(--cv-muted, rgba(26,27,20,.55))", maxWidth:320, margin:0, lineHeight:1.7, fontWeight:300 }}>
              Nine specialist services — walk in or book ahead. Same-day turnaround on most jobs.
            </p>
          </div>
          <div style={{ width:"100%", height:1, background:`linear-gradient(to right,var(--cv-accent)66,transparent)`, marginTop:28 }}/>
        </Rev>

        <div className="cx-bento-row">
          <Rev cls="cx-rvL" style={{}}>
            <div className="cx-bento cx-bento-tall" style={{ background:"var(--cv-bg2)", border:`1px solid var(--cv-border)`, padding:"40px 36px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", bottom:-60, right:-60, width:220, height:220, borderRadius:"50%", background:`radial-gradient(circle,var(--cv-accent)18,transparent 70%)`, pointerEvents:"none" }}/>
              <p style={{ fontFamily:T.mono, fontSize:".58rem", letterSpacing:".28em", textTransform:"uppercase", color:"var(--cv-accent)", margin:"0 0 20px" }}>All Services</p>
              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {services.map((s, i) => (
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 0", borderBottom:`1px solid rgba(212,168,67,.1)` }}>
                    <span style={{ fontFamily:T.mono, fontSize:".58rem", color:"rgba(212,168,67,.4)", minWidth:24 }}>{String(i+1).padStart(2,"0")}</span>
                    <span style={{ fontFamily:T.display, fontWeight:600, fontSize:".92rem", color:"var(--cv-text)" }}>{s}</span>
                    <div style={{ flex:1 }}/>
                    <span style={{ color:"rgba(212,168,67,.35)", fontSize:".7rem" }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          </Rev>

          <Rev delay={80}>
            <div className="cx-bento" style={{ background:T.amber, padding:"32px 28px", position:"relative", overflow:"hidden" }}>
              <p style={{ fontFamily:T.mono, fontSize:".58rem", letterSpacing:".22em", textTransform:"uppercase", color:"var(--cv-text-dark)", opacity:.6, margin:"0 0 12px" }}>Trusted Since</p>
              <div style={{ fontFamily:T.display, fontWeight:900, fontSize:"clamp(3rem,6vw,5rem)", color:"var(--cv-text-dark)", lineHeight:.9, letterSpacing:"-.04em", marginBottom:8 }}>
                <Count to={12} suffix="+"/>
              </div>
              <p style={{ fontFamily:T.display, fontWeight:700, fontSize:".95rem", color:"var(--cv-text-dark)", margin:0, letterSpacing:"-.01em", textTransform:"uppercase" }}>Years of Excellence</p>
            </div>
          </Rev>

          <Rev delay={140}>
            <div className="cx-bento" style={{ background:T.green, color:"#fff", padding:"32px 28px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(245,240,232,.06)", pointerEvents:"none" }}/>
              <p style={{ fontFamily:T.mono, fontSize:".58rem", letterSpacing:".22em", textTransform:"uppercase", color:"rgba(255,255,255,0.7)", margin:"0 0 12px" }}>In Stock</p>
              <div style={{ fontFamily:T.display, fontWeight:900, fontSize:"clamp(3rem,6vw,5rem)", color:"#fff", lineHeight:.9, letterSpacing:"-.04em", marginBottom:8 }}>
                <Count to={10000} suffix="+"/>
              </div>
              <p style={{ fontFamily:T.display, fontWeight:700, fontSize:".95rem", color:"#fff", margin:0, letterSpacing:"-.01em", textTransform:"uppercase" }}>Tyres Ready Now</p>
            </div>
          </Rev>

          <Rev delay={200}>
            <div className="cx-bento" style={{ background:"rgba(26,27,20,.04)", border:`1px solid var(--cv-border-dark)`, padding:"28px 26px" }}>
              <p style={{ fontFamily:T.mono, fontSize:".58rem", letterSpacing:".22em", textTransform:"uppercase", color:"var(--cv-accent)", margin:"0 0 10px" }}>Indian Brands</p>
              <div style={{ fontFamily:T.display, fontWeight:900, fontSize:"clamp(2.4rem,5vw,4.2rem)", color:"var(--cv-text-dark)", lineHeight:.9, letterSpacing:"-.04em", marginBottom:8 }}>
                <Count to={10} suffix="+"/>
              </div>
              <p style={{ fontFamily:T.mono, fontSize:".62rem", color:"var(--cv-muted, rgba(26,27,20,.45))", margin:0 }}>MRF · CEAT · Apollo · JK ·<br/>TVS · Birla & more</p>
            </div>
          </Rev>

          <Rev delay={260}>
            <div className="cx-bento" style={{ background:T.rust, color:"#fff", padding:"28px 26px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", bottom:-30, right:-30, width:90, height:90, borderRadius:"50%", background:"rgba(245,240,232,.08)", pointerEvents:"none" }}/>
              <p style={{ fontFamily:T.mono, fontSize:".58rem", letterSpacing:".22em", textTransform:"uppercase", color:"rgba(245,240,232,.65)", margin:"0 0 10px" }}>No Appointment?</p>
              <p style={{ fontFamily:T.display, fontWeight:900, fontSize:"1.1rem", color:"#fff", margin:"0 0 8px", letterSpacing:"-.01em", textTransform:"uppercase", lineHeight:1.2 }}>Walk-ins<br/>Always Welcome</p>
              <Link to={ROUTES.contact ?? "#"} style={{ fontFamily:T.mono, fontSize:".6rem", color:"rgba(255,255,255,0.7)", textDecoration:"none", letterSpacing:".1em" }}>Visit us today →</Link>
            </div>
          </Rev>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   HOURS STRIP
   ========================================================================== */
function HoursStrip() {
  const T = useCxT();
  const days = [
    { day:"Mon", full:"Monday",    h:"8:00 – 19:00" },
    { day:"Tue", full:"Tuesday",   h:"8:00 – 19:00" },
    { day:"Wed", full:"Wednesday", h:"8:00 – 19:00" },
    { day:"Thu", full:"Thursday",  h:"8:00 – 19:00" },
    { day:"Fri", full:"Friday",    h:"8:00 – 19:00" },
    { day:"Sat", full:"Saturday",  h:"8:00 – 18:00" },
    { day:"Sun", full:"Sunday",    h:"9:00 – 17:00" },
  ];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <section className="cx-sec-pad" style={{ background:"var(--cv-bg)", borderTop:`1px solid var(--cv-border)`, padding:"56px 56px 60px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(circle,rgba(212,168,67,.08) 1px,transparent 1px)`, backgroundSize:"40px 40px", pointerEvents:"none" }}/>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:1 }}>
        <Rev style={{ marginBottom:36 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <p style={{ fontFamily:T.mono, fontSize:".6rem", letterSpacing:".32em", textTransform:"uppercase", color:"var(--cv-accent)", margin:0 }}>[ 04 ] — Opening Hours</p>
            <div style={{ flex:1, height:1, background:`linear-gradient(to right,var(--cv-border),transparent)`, minWidth:20 }}/>
            <p style={{ fontFamily:T.mono, fontSize:".6rem", color:"var(--cv-muted)", margin:0 }}>Walk-ins welcome</p>
          </div>
        </Rev>

        <div className="cx-bar">
          {days.map((d, i) => (
            <Rev key={d.day} delay={i * 55} style={{ flex:1, minWidth:0 }}>
              <div style={{
                padding:"20px 14px 18px", borderRadius:4, textAlign:"center",
                background: i === todayIdx ? T.amber : "var(--cv-bg2, rgba(20,22,8,.85))",
                border:`1px solid ${i === todayIdx ? T.amber : T.hairline}`,
                transition:"all .25s",
              }}>
                <p style={{ fontFamily:T.mono, fontSize:".62rem", letterSpacing:".14em", textTransform:"uppercase", color: i === todayIdx ? T.inkDark : T.inkDim, margin:"0 0 6px", fontWeight:700 }}>{d.day}</p>
                <p style={{ fontFamily:T.display, fontWeight:800, fontSize:".85rem", color: i === todayIdx ? T.inkDark : T.ink, margin:"0 0 4px", lineHeight:1.1 }}>{d.h.split("–")[0]}</p>
                <p style={{ fontFamily:T.mono, fontSize:".58rem", color: i === todayIdx ? "rgba(26,27,20,.55)" : T.inkDim, margin:0 }}>→ {d.h.split("–")[1]?.trim()}</p>
                {i === todayIdx && <div style={{ marginTop:8, fontFamily:T.mono, fontSize:".52rem", letterSpacing:".18em", color:"var(--cv-text-dark)", background:"var(--cv-surface, rgba(26,27,20,.15))", padding:"3px 8px", borderRadius:999, display:"inline-block" }}>TODAY</div>}
              </div>
            </Rev>
          ))}
        </div>

        <Rev style={{ marginTop:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:20, padding:"18px 24px", background:"var(--cv-bg2, rgba(20,22,8,.8))", border:`1px solid var(--cv-border)`, borderRadius:6, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, color:"var(--cv-accent)", minWidth:0, flex:1 }}>
              <IPin/><span style={{ fontFamily:T.display, fontWeight:700, fontSize:".9rem", color:"var(--cv-text)", wordBreak:"break-word" }}>123 Tyre Lane, Industrial Area, Mumbai MH 400001</span>
            </div>
            <a href="#" style={{ fontFamily:T.mono, fontSize:".6rem", letterSpacing:".14em", textTransform:"uppercase", color:"var(--cv-accent)", textDecoration:"none", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
              Get Directions <IArrow/>
            </a>
          </div>
        </Rev>
      </div>
    </section>
  );
}

/* ============================================================================
   FOOTER CTA
   ========================================================================== */
function FooterCta() {
  const T = useCxT();
  return (
    <section className="cx-sec-pad" style={{ background:"var(--cv-paper)", padding:"48px 56px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:`repeating-linear-gradient(60deg,rgba(26,27,20,.04) 0,rgba(26,27,20,.04) 1px,transparent 1px,transparent 32px)`, pointerEvents:"none" }}/>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div className="cx-footer-row">
          <div>
            <p style={{ fontFamily:T.mono, fontSize:".58rem", letterSpacing:".28em", textTransform:"uppercase", color:"var(--cv-accent)", margin:"0 0 6px" }}>[ 05 ] — Still have questions?</p>
            <h2 style={{ fontFamily:T.display, fontWeight:900, fontSize:"clamp(1.4rem,2.8vw,2.2rem)", color:"var(--cv-text-dark)", margin:0, letterSpacing:"-.02em", textTransform:"uppercase" }}>
              Our experts are ready.
            </h2>
          </div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <a href={COMPANY.phoneHref??"tel:+91"} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 26px", background:T.inkDark, color:"var(--cv-accent)", fontFamily:T.display, fontWeight:800, fontSize:".88rem", letterSpacing:".03em", textDecoration:"none", borderRadius:2, transition:"background .2s, box-shadow .2s" }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLAnchorElement).style.background=T.amber; (e.currentTarget as HTMLAnchorElement).style.color=T.inkDark; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLAnchorElement).style.background="var(--cv-bg)"; (e.currentTarget as HTMLAnchorElement).style.color=T.amber; }}>
              <IPhone/> Call Now
            </a>
            <Link to={ROUTES.tyres} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 26px", background:"transparent", color:"var(--cv-text-dark)", fontFamily:T.display, fontWeight:700, fontSize:".88rem", letterSpacing:".03em", textDecoration:"none", borderRadius:2, border:`1px solid rgba(26,27,20,.25)`, transition:"border-color .2s" }}
              onMouseEnter={e=>((e.currentTarget as HTMLAnchorElement).style.borderColor=T.amber)}
              onMouseLeave={e=>((e.currentTarget as HTMLAnchorElement).style.borderColor="var(--cv-border)")}>
              Browse Tyres →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   EXPORT
   ========================================================================== */
export default function ContactUs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const TT = getCxTokens(isDark);

  const cssVars: React.CSSProperties = {
    "--cv-bg":          isDark ? "#0C0D08"               : "#F5F2EB",
    "--cv-bg2":         isDark ? "#141608"               : "#FFFFFF",
    "--cv-paper":       isDark ? "#F5F0E8"               : "#FFFFFF",
    "--cv-text":        isDark ? "#F5F0E8"               : "#1A1A14",
    "--cv-text-dark":   isDark ? "#1A1B14"               : "#1A1A14",
    "--cv-muted":       isDark ? "#8C8878"               : "#6B6550",
    "--cv-border":      isDark ? "rgba(212,168,67,0.18)" : "rgba(184,118,10,0.18)",
    "--cv-border-dark": isDark ? "rgba(26,27,20,0.15)"  : "rgba(26,26,14,0.12)",
    "--cv-accent":      isDark ? "#D4A843"               : "#B8760A",
    "--cv-accent-dim":  isDark ? "#A07A20"               : "#8A5808",
    "--cv-green":       isDark ? "#6BA84F"               : "#4D8B31",
    "--cv-green-dark":  isDark ? "#3D5A2E"               : "#2D4A20",
    "--cv-rust":        isDark ? "#B84A2C"               : "#A03820",
    "--cv-surface":     isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
  } as React.CSSProperties;

  return (
    <CxTheme.Provider value={TT}>
      <div className="cx-root" style={{ fontFamily:TT.body, minHeight:"100vh", overflowX:"hidden", WebkitFontSmoothing:"antialiased", ...cssVars, background:"var(--cv-bg)", color:"var(--cv-text)" }}>
        <style>{CSS}</style>
        <VerticalRail/>
        <Hero/>
        <FormSection/>
        <BentoSection/>
        <HoursStrip/>
        <FooterCta/>
      </div>
    </CxTheme.Provider>
  );
}