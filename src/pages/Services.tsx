import { useState, useEffect, useLayoutEffect, useRef, useMemo, createContext, useContext } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { COMPANY } from "../config/site";
import { useTheme } from "../context/ThemeContext";
import type { i } from "framer-motion/client";

/* ============================================================================
   DESIGN TOKENS — computed per-theme
   ========================================================================== */
function getSTokens(isDark: boolean) {
  return {
    CYAN:     isDark ? "#C9A84C"                 : "#A8720A",
    CYAN_DIM: isDark ? "#A8872E"                 : "#8A5C08",
    PURPLE:   isDark ? "#8C6D2F"                 : "#6B5020",
    PINK:     isDark ? "#E8C46A"                 : "#D4A830",
    VOID:     isDark ? "#080604"                 : "#F0EBE0",
    DEEP:     isDark ? "#0E0A04"                 : "#E8E2D6",
    VOID_T:   isDark ? "rgba(8,6,4,0.88)"        : "rgba(240,235,224,0.92)",
    DEEP_T:   isDark ? "rgba(14,10,4,0.85)"      : "rgba(232,226,214,0.88)",
    BORDER:   isDark ? "rgba(201,168,76,0.2)"    : "rgba(168,114,10,0.20)",
    TEXT_LT:  isDark ? "#F5EDD8"                 : "#1A1508",
    TEXT_DIM: isDark ? "#8A7D63"                 : "#6B5C3A",
  };
}
/* Stable references used by sub-components at module scope */
const CYAN     = "#C9A84C";
const CYAN_DIM = "#A8872E";
const PURPLE   = "#8C6D2F";
const PINK     = "#E8C46A";
const VOID     = "#080604";
const DEEP     = "#0E0A04";
const VOID_T   = "rgba(8,6,4,0.88)";
const DEEP_T   = "rgba(14,10,4,0.85)";
const BORDER   = "rgba(201,168,76,0.2)";
const TEXT_LT  = "#F5EDD8";
const TEXT_DIM = "#8A7D63";
const MONO     = "'Space Mono', monospace";
const EASE     = [0.22, 1, 0.36, 1] as const;

/* ── Page-level theme context — provides reactive tokens to all sub-components ── */
type SvTokens = ReturnType<typeof getSTokens>;
const SvTheme = createContext<SvTokens>(getSTokens(true));
const useSvT  = () => useContext(SvTheme);

/* ============================================================================
   PLASMA BACKGROUND — theme-aware: dark canvas in dark mode, warm canvas in light
   ========================================================================== */
interface PlasmaBgProps {
  color?: string; speed?: number;
  direction?: "forward" | "reverse";
  scale?: number; opacity?: number;
  mouseInteractive?: boolean;
  style?: React.CSSProperties;
  isDark?: boolean;
}
function PlasmaBg({
  color = "#C9A84C", speed = 1, direction = "forward",
  scale = 1, opacity = 1, mouseInteractive = true, style,
  isDark = true,
}: PlasmaBgProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d")!;
    let rafId = 0;
    let t = 0;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const onMouse = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    if (mouseInteractive) window.addEventListener("mousemove", onMouse, { passive: true });

    // Generate stars
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.6 + 0.2,
    }));

    const dirMul = direction === "reverse" ? -1 : 1;

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      t += 0.004 * speed * dirMul;

      const W = canvas.width, H = canvas.height;
      if (!W || !H) return;

      const dark = isDarkRef.current;

      // Background — dark mode: near-black, light mode: warm cream
      ctx.fillStyle = dark ? "#080604" : "#F0EBE0";
      ctx.fillRect(0, 0, W, H);

      const mx = mouseInteractive ? mousePos.current.x : 0.5;
      const my = mouseInteractive ? mousePos.current.y : 0.5;

      // Aurora bands — stronger/more visible in dark, subtle in light
      const auroraColors = [
        { h: 35, s: 80, l: dark ? 28 : 55 },
        { h: 45, s: 70, l: dark ? 22 : 48 },
        { h: 30, s: 60, l: dark ? 18 : 42 },
      ];
      for (let i = 0; i < 3; i++) {
        const c = auroraColors[i];
        const yBase = (0.3 + i * 0.18 + Math.sin(t * 0.7 + i * 1.1) * 0.08 + (my - 0.5) * 0.06) * H;
        const xShift = (mx - 0.5) * W * 0.1;
        const grad = ctx.createLinearGradient(xShift, yBase - H * 0.22, xShift + W * 0.3, yBase + H * 0.22);
        const alpha = (dark ? 0.04 : 0.07) + Math.sin(t + i) * (dark ? 0.02 : 0.03);
        const finalAlpha = alpha * opacity;
        grad.addColorStop(0, `hsla(${c.h},${c.s}%,${c.l}%,0)`);
        grad.addColorStop(0.35, `hsla(${c.h},${c.s}%,${c.l}%,${finalAlpha})`);
        grad.addColorStop(0.65, `hsla(${c.h + 5},${c.s - 10}%,${c.l + 5}%,${finalAlpha * 0.7})`);
        grad.addColorStop(1, `hsla(${c.h},${c.s}%,${c.l}%,0)`);
        ctx.save();
        ctx.globalCompositeOperation = dark ? "screen" : "multiply";
        for (let band = 0; band < 2; band++) {
          ctx.beginPath();
          ctx.moveTo(-W * 0.1 + xShift, 0);
          for (let x = -W * 0.1; x <= W * 1.1; x += W * 0.04) {
            const wave = Math.sin(x / W * Math.PI * 2.5 + t * 1.2 + i * 0.9 + band) * H * 0.065
                       + Math.sin(x / W * Math.PI * 5 + t * 0.8 + i * 1.5) * H * 0.025;
            ctx.lineTo(x + xShift, yBase + wave + band * H * 0.14);
          }
          ctx.lineTo(W * 1.1 + xShift, H);
          ctx.lineTo(-W * 0.1 + xShift, H);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }
        ctx.restore();
      }

      // Sparkle dots — gold in dark, amber-warm in light
      ctx.save();
      ctx.globalCompositeOperation = dark ? "screen" : "multiply";
      for (const star of stars) {
        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * star.speed + star.twinkle));
        const a = twinkle * opacity * (dark ? 0.8 : 0.35);
        const starColor = dark
          ? `rgba(245,237,216,${a})`
          : `rgba(140,90,10,${a})`;
        const starGlow = dark
          ? `rgba(201,168,76,${a * 0.5})`
          : `rgba(168,114,10,${a * 0.4})`;
        const grd = ctx.createRadialGradient(star.x * W, star.y * H, 0, star.x * W, star.y * H, star.r * 2.5);
        grd.addColorStop(0, starColor);
        grd.addColorStop(0.4, starGlow);
        grd.addColorStop(1, dark ? `rgba(201,168,76,0)` : `rgba(168,114,10,0)`);
        ctx.beginPath();
        ctx.arc(star.x * W, star.y * H, star.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }
      ctx.restore();

      // Vignette — dark edges in dark mode, light warm fade in light mode
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.85);
      if (dark) {
        vig.addColorStop(0, "rgba(0,0,0,0)");
        vig.addColorStop(1, "rgba(0,0,0,0.55)");
      } else {
        vig.addColorStop(0, "rgba(240,235,224,0)");
        vig.addColorStop(1, "rgba(220,210,190,0.4)");
      }
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (mouseInteractive) window.removeEventListener("mousemove", onMouse);
      if (canvas.parentElement === container) container.removeChild(canvas);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", ...style }} />;
}

/* ============================================================================
   GLOBAL STYLES
   ========================================================================== */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
  .sv-root *{ box-sizing:border-box; }

  @keyframes glowPulse   { 0%,100%{opacity:.35} 50%{opacity:.85} }
  @keyframes svTickerX   { from{transform:translateX(0);} to{transform:translateX(-50%);} }
  @keyframes svBounce    { 0%,100%{transform:translateY(0);} 50%{transform:translateY(5px);} }
  @keyframes shimmerText { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes particleDrift { 0%{transform:translateY(0) translateX(0);opacity:0} 10%{opacity:1} 90%{opacity:.6} 100%{transform:translateY(-80vh) translateX(20px);opacity:0} }
  @keyframes gradientText{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes lineDraw    { from{transform:scaleX(0);transform-origin:left center} to{transform:scaleX(1);transform-origin:left center} }
  @keyframes indexIn     { 0%{opacity:0;transform:translateX(-12px)} 60%{opacity:1;transform:translateX(2px)} 100%{opacity:1;transform:translateX(0)} }
  @keyframes wordReveal  { from{transform:translateY(108%);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes borderDraw  { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
  @keyframes imgEntryScale { from{transform:scale(1.1)} to{transform:scale(1)} }
  @keyframes tagSlideIn  { from{transform:translateX(-18px);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes textRevealUp{ from{transform:translateY(105%);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes cardCascade { 0%{opacity:0;transform:translateY(40px) scale(.94)} 60%{opacity:1;transform:translateY(-4px) scale(1.01)} 100%{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes goldSpin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes goldBeam    { 0%,100%{opacity:0;transform:translateX(-100%) skewX(-20deg)} 50%{opacity:.25;transform:translateX(200%) skewX(-20deg)} }

  .shimmer-text {
    background: linear-gradient(90deg, var(--cv-muted) 0%, var(--cv-accent) 40%, #fff 50%, var(--cv-accent) 60%, var(--cv-muted) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: shimmerText 3s linear infinite;
  }
  .animated-gradient-text {
    background: linear-gradient(90deg, var(--cv-accent), var(--cv-accent-2), var(--cv-accent-3), var(--cv-accent));
    background-size: 300% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: gradientText 4s linear infinite;
  }

  /* Scroll progress bar */
  .sv-scroll-track {
    position:fixed; left:18px; top:50%; transform:translateY(-50%);
    width:1px; height:120px; background:rgba(201,168,76,0.12);
    z-index:999; pointer-events:none;
  }
  .sv-scroll-fill {
    position:absolute; top:0; left:0; width:1px;
    background:linear-gradient(180deg,var(--cv-accent),var(--cv-accent-2));
    box-shadow:0 0 8px var(--cv-accent)99;
    transition:height .12s linear;
  }

  /* Section label */
  .section-index { opacity:0; }
  .section-index-active { animation:indexIn .55s cubic-bezier(.22,1,.36,1) forwards; }
  .line-draw { transform:scaleX(0); transform-origin:left center; }
  .line-draw-active { animation:lineDraw .9s cubic-bezier(.22,1,.36,1) forwards; }

  /* Word reveal heading */
  .word-reveal-wrap { overflow:hidden; display:inline-block; vertical-align:bottom; }
  .word-reveal-inner { display:inline-block; transform:translateY(108%); opacity:0; }
  .word-reveal-inner.active { animation:wordReveal .72s cubic-bezier(.22,1,.36,1) forwards; }

  /* Ticker */
  .sv-ticker-track { display:flex; animation:svTickerX 28s linear infinite; width:max-content; }
  .sv-ticker-track:hover { animation-play-state:paused; }

  /* Gallery item */
  .sv-gallery-item { cursor:default; }
  .sv-gallery-img { transition:transform .7s cubic-bezier(.25,.46,.45,.94); }
  .sv-gallery-item:hover .sv-gallery-img { transform:scale(1.05) !important; }
  .sv-gallery-item:hover .sv-gallery-frame { border-color:rgba(201,168,76,.5) !important; }
  .sv-gallery-item:hover .sv-gallery-title { color:var(--cv-accent) !important; }

  /* Service cards */
  .sv-service-card { transition:transform .35s cubic-bezier(.22,1,.36,1),border-color .3s,box-shadow .3s; }
  .sv-service-card:hover { transform:translateY(-6px) !important; }

  /* Gold light beam sweep on cards */
  .sv-service-card::after {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(105deg,transparent 40%,rgba(201,168,76,0.06) 50%,transparent 60%);
    transform:translateX(-100%); transition:transform .6s ease;
  }
  .sv-service-card:hover::after { transform:translateX(100%); }

  /* Neon button → Gold neon button */
  .sv-neon-btn {
    position:relative; overflow:hidden;
    background:linear-gradient(135deg,rgba(201,168,76,.12),rgba(140,109,47,.12));
    border:1px solid rgba(201,168,76,.5);
    color:var(--cv-accent); transition:all .25s ease;
    text-decoration:none; cursor:pointer;
  }
  .sv-neon-btn:hover {
    background:linear-gradient(135deg,rgba(201,168,76,.28),rgba(140,109,47,.28));
    box-shadow:0 0 28px rgba(201,168,76,.35),0 0 56px rgba(201,168,76,.15);
    border-color:var(--cv-accent); color:#F5EDD8;
  }
  .sv-neon-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent); transform:translateX(-100%); transition:transform .4s ease; }
  .sv-neon-btn:hover::after { transform:translateX(100%); }

  /* Gold CTA button */
  .sv-grad-btn {
    background:linear-gradient(135deg,var(--cv-accent),var(--cv-accent-dim));
    color:#0E0A04; font-weight:900; transition:transform .2s,box-shadow .2s;
    text-decoration:none; cursor:pointer; display:inline-flex; align-items:center; gap:10px;
    position:relative; overflow:hidden;
  }
  .sv-grad-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent); transform:translateX(-100%); animation:goldBeam 3s ease-in-out infinite 1s; }
  .sv-grad-btn:hover { transform:translateY(-2px); box-shadow:0 8px 36px rgba(201,168,76,.45); }

  /* Mobile responsive */
  @media(max-width:900px){
    .sv-hero-inner { flex-direction:column !important; min-height:auto !important; }
    .sv-hero-left  { padding:80px 24px 48px !important; }
    .sv-hero-right { height:240px !important; min-height:unset !important; }
    .sv-gallery-cols { grid-template-columns:1fr !important; }
    .sv-gallery-col-right { margin-top:0 !important; }
    .sv-cards-grid { grid-template-columns:1fr !important; }
    .sv-cards-grid > div:last-child { margin-top:0 !important; }
    .sv-cta-inner  { flex-direction:column !important; padding:48px 24px !important; }
    .sv-scroll-track { display:none; }
    .sv-stats-row  { flex-direction:column !important; gap:20px !important; padding:20px 24px !important; }
  }
  @media(max-width:600px){
    .sv-hero-left  { padding:72px 18px 40px !important; }
    .sv-hero-right { height:180px !important; }
    .sv-cards-grid { grid-template-columns:1fr !important; }
    .sv-cards-grid > div:last-child { margin-top:0 !important; }
    .sv-gallery-section { padding:56px 18px 72px !important; }
    .sv-cards-section  { padding:56px 18px 72px !important; }
  }

  @media(prefers-reduced-motion:reduce){
    .sv-service-card:hover { transform:none !important; }
    .sv-ticker-track { animation:none !important; }
  }
`;

/* ============================================================================
   HOOKS
   ========================================================================== */
function useInViewEntry(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useParallaxRef(speed = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, { yPercent: speed * -100, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
    return () => ctx.revert();
  }, [speed]);
  return ref;
}

/* ============================================================================
   SCROLL PROGRESS
   ========================================================================== */
function ScrollProgressLine() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="sv-scroll-track">
      <div className="sv-scroll-fill" style={{ height: `${pct}%` }} />
    </div>
  );
}

/* ============================================================================
   ANIMATED COMPONENTS (Tyres-style)
   ========================================================================== */
function AnimatedDivider({ color = CYAN, delay = 0 }: { color?: string; delay?: number }) {
  const { ref, visible } = useInViewEntry(0.5);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 32px" }}>
      <div
        className={`line-draw${visible ? " line-draw-active" : ""}`}
        style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color}, transparent)`, animationDelay: `${delay}s` }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={visible ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: delay + 0.5, duration: 0.3, ease: EASE }}
        style={{ width: 5, height: 5, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }}
      />
    </div>
  );
}

function SectionLabel({ index, label, delay = 0 }: { index: string; label: string; delay?: number }) {
  const { ref, visible } = useInViewEntry(0.5);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
      <span className={`section-index${visible ? " section-index-active" : ""}`}
        style={{ fontFamily: MONO, fontSize: ".62rem", fontWeight: 700, color: "var(--cv-muted)", letterSpacing: ".08em", animationDelay: `${delay}s` }}>
        [{index}]
      </span>
      <div className={`line-draw${visible ? " line-draw-active" : ""}`}
        style={{ width: 32, height: 1, background: `linear-gradient(90deg, var(--cv-accent), transparent)`, animationDelay: `${delay + 0.15}s` }} />
      <motion.span
        initial={{ opacity: 0, x: 8 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: delay + 0.3, duration: 0.4, ease: EASE }}
        style={{ fontFamily: MONO, fontSize: ".68rem", letterSpacing: ".3em", textTransform: "uppercase", color: "var(--cv-accent)", fontWeight: 700, textShadow: `0 0 12px var(--cv-accent)` }}>
        {label}
      </motion.span>
    </div>
  );
}

function SplitHeading({ children, style }: { children: string; style?: React.CSSProperties }) {
  const { ref, visible } = useInViewEntry(0.4);
  const words = children.split(" ");
  return (
    <h2 ref={ref} style={{ margin: 0, ...style }}>
      {words.map((word, i) => (
        <span key={i} className="word-reveal-wrap" style={{ marginRight: i < words.length - 1 ? "0.28em" : 0 }}>
          <span className={`word-reveal-inner${visible ? " active" : ""}`} style={{ animationDelay: `${i * 0.09}s` }}>
            {word}
          </span>
        </span>
      ))}
    </h2>
  );
}

function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInViewEntry();
  return (
    <div ref={ref} style={{ ...style, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: `opacity .65s cubic-bezier(.22,1,.36,1) ${delay}ms,transform .65s cubic-bezier(.22,1,.36,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ============================================================================
   PARTICLE FIELD
   ========================================================================== */
function SvParticleField({ isDark = true }: { isDark?: boolean }) {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 6, dur: Math.random() * 8 + 6,
      color: i % 3 === 0 ? CYAN : i % 3 === 1 ? PURPLE : PINK,
    })), []);

  // In light mode use more muted/amber particles so they're visible on warm bg
  const lightColors = ["#A8720A", "#8C6D2F", "#D4A830"];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const col = isDark ? p.color : lightColors[i % 3];
        return (
          <div key={p.id} style={{
            position: "absolute", bottom: "-10px", left: `${p.x}%`,
            width: p.size, height: p.size, borderRadius: "50%",
            background: col, boxShadow: `0 0 ${p.size * 3}px ${col}`,
            animation: `particleDrift ${p.dur}s ${p.delay}s linear infinite`, opacity: 0,
          }} />
        );
      })}
    </div>
  );
}

/* ============================================================================
   SERVICE DATA
   ========================================================================== */
interface Service { id: number; title: string; tagline: string; description: string; features: string[]; image: string; }
const services: Service[] = [
  { id:1,title:"Tyre Replacement",tagline:"Right fit. Every time.",description:"Full range of passenger, SUV, and commercial tyre replacements. We stock leading brands and help you pick the right compound, load rating, and size for your vehicle.",features:["All vehicle types","Brand-agnostic advice","Same-day fitment","Old tyre disposal"],image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80" },
  { id:2,title:"Wheel Balancing",tagline:"Smooth out every kilometre.",description:"Computer-aided dynamic balancing eliminates vibration at speed, reduces uneven tyre wear, and protects your suspension from unnecessary stress.",features:["Digital balancing machine","All wheel sizes","Post-fitment check","Highway-speed tested"],image:"https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&q=80" },
  { id:3,title:"Wheel Alignment",tagline:"Straight tracking. Less drag.",description:"3D laser alignment corrects camber, caster, and toe angles to manufacturer spec. Misaligned wheels wear tyres unevenly and hurt fuel economy.",features:["3D laser alignment","4-wheel geometry check","Steering adjustment","Print-out report"],image:"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80" },
  { id:4,title:"Tyre Rotation",tagline:"Even wear across all four.",description:"Regular rotation extends the life of your full tyre set by distributing wear patterns evenly across all four wheels.",features:["Drivetrain-specific patterns","Torque-verified re-fit","Inspection included","Every 8–10k km"],image:"https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=600&q=80" },
  { id:5,title:"Puncture Repair",tagline:"Back on the road in minutes.",description:"Industry-standard plug-and-patch repairs for repairable punctures. We assess every damage site honestly and show you your options.",features:["Plug & patch method","Valve stem check","Pressure reset","Honest assessment"],image:"https://images.unsplash.com/photo-1591293835940-934a7c4f2d9b?w=600&q=80" },
  { id:6,title:"Nitrogen Inflation",tagline:"Stable pressure. Longer life.",description:"Nitrogen-filled tyres hold pressure more consistently across temperature changes, improving fuel efficiency and tyre longevity.",features:["Purity-checked fill","Slower pressure loss","Better fuel economy","Ideal for long-haul"],image:"https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&q=80" },
  { id:7,title:"Tyre Inspection",tagline:"Know before you go.",description:"Comprehensive visual and depth inspection of tread wear, sidewall condition, age cracking, and bead seating. We flag issues early.",features:["Tread depth measurement","Age & crack assessment","Pressure check","Written report"],image:"https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=80" },
  { id:8,title:"Performance Tyres",tagline:"Spec-grade rubber.",description:"Sourcing and fitment of ultra-high-performance, run-flat, and track-day tyres. OEM specs, speed ratings, and load indexes handled correctly.",features:["UHP & run-flat range","OEM-spec fitment","TPMS reset","Track & road options"],image:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80" },
  { id:9,title:"Commercial & Fleet",tagline:"Keeping fleets moving.",description:"Dedicated servicing for trucks, vans, buses, and company fleets. Fleet accounts get priority bays, bulk pricing, and service logs.",features:["Fleet accounts","On-site visit options","Service history logs","Bulk pricing"],image:"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80" },
];

function ServiceIcon({ id, size = 20 }: { id: number; size?: number }) {
  const p = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, width: size, height: size };
  switch (id) {
    case 1: return <svg {...p}><path d="M3 8.5h12"/><path d="M12 5.5l3 3-3 3"/><path d="M21 15.5H9"/><path d="M12 12.5l-3 3 3 3"/></svg>;
    case 2: return <svg {...p}><path d="M12 4v15"/><path d="M6 20h12"/><path d="M4.5 6h15"/><path d="M4.5 6l-2.2 5a2.4 2.4 0 004.4 0z"/><path d="M19.5 6l-2.2 5a2.4 2.4 0 004.4 0z"/></svg>;
    case 3: return <svg {...p}><path d="M12 2.5v4"/><path d="M12 17.5v4"/><path d="M2.5 12h4"/><path d="M17.5 12h4"/><path d="M12 8a4 4 0 100 8 4 4 0 000-8z"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>;
    case 4: return <svg {...p}><path d="M20 12a8 8 0 11-2.3-5.6"/><path d="M20 4.5v3.2h-3.2"/></svg>;
    case 5: return <svg {...p}><path d="M20.5 4.2a3.6 3.6 0 01-4.8 4.8L5.8 19 4 17.2 14 7.3a3.6 3.6 0 014.8-4.8l-2.5 2.5 1.5 1.5 2.7-2.3z"/></svg>;
    case 6: return <svg {...p}><path d="M12 3.3c3.4 3.9 5.4 6.9 5.4 9.9a5.4 5.4 0 11-10.8 0c0-3 2-6 5.4-9.9z"/></svg>;
    case 7: return <svg {...p}><path d="M10.5 4a6 6 0 100 12 6 6 0 000-12z"/><path d="M20 20l-5.2-5.2"/></svg>;
    case 8: return <svg {...p}><path d="M4 16.5a8 8 0 0116 0"/><path d="M12 16.5l4-5"/><circle cx="12" cy="16.5" r="1.3" fill="currentColor" stroke="none"/></svg>;
    case 9: return <svg {...p}><path d="M3 7h11v8H3z"/><path d="M14 10h4l3 3v2h-7"/><path d="M7.5 18.4a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6z"/><path d="M17.5 18.4a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6z"/></svg>;
    default: return null;
  }
}

/* ============================================================================
   BRAND TICKER
   ========================================================================== */
const BRANDS = ["MRF","CEAT","APOLLO","JK TYRE","TVS","BIRLA TYRES","BALKRISHNA","PTL","KAMA KUHMO","SPEEDWAYS"];
function BrandTicker({ isDark = true }: { isDark?: boolean }) {
  const doubled = [...BRANDS, ...BRANDS];
  return (
    <div style={{
      overflow: "hidden",
      borderTop: `1px solid var(--cv-border)`,
      borderBottom: `1px solid var(--cv-border)`,
      padding: "18px 0",
      background: isDark ? `rgba(3,4,10,0.8)` : `rgba(232,226,214,0.9)`,
      backdropFilter: "blur(8px)",
    }}>
      <div className="sv-ticker-track">
        {doubled.map((b, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 28, paddingRight: 48,
            fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: isDark ? "rgba(232,244,255,0.22)" : "rgba(90,65,20,0.35)",
            whiteSpace: "nowrap",
          }}>
            {b}
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: `rgba(201,168,76,0.6)`, display: "inline-block" }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   HERO — half-height split: editorial left + Plasma right
   ========================================================================== */
function HeroSection({ isDark = true }: { isDark?: boolean }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--cv-bg)" }}>
      <div className="sv-hero-inner" style={{ display: "flex", alignItems: "stretch", minHeight: "52vh" }}>

        {/* LEFT — content */}
        <div className="sv-hero-left" style={{
          position: "relative", zIndex: 5,
          flex: "0 0 55%",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "clamp(64px,8vh,100px) clamp(28px,5vw,80px) clamp(48px,6vh,80px) clamp(40px,6vw,96px)",
          background: isDark
            ? `linear-gradient(to right, var(--cv-bg) 70%, rgba(3,4,10,0.88) 100%)`
            : `linear-gradient(to right, var(--cv-bg) 70%, rgba(240,235,224,0.88) 100%)`,
        }}>
          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .55, ease: EASE, delay: .06 }}
            style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <span style={{ width: 28, height: 1, background: `linear-gradient(to right,var(--cv-accent),var(--cv-accent-2))`, display: "block", flexShrink: 0 }} />
            <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--cv-accent)", fontWeight: 700, whiteSpace: "nowrap", textShadow: `0 0 12px var(--cv-accent)` }}>
              Our Services
            </span>
          </motion.div>

          {/* Heading */}
          <div style={{ overflow: "hidden", marginBottom: 4 }}>
            <motion.h1 initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: .72, ease: EASE, delay: .16 }}
              style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem,4.2vw,4rem)", lineHeight: .95, letterSpacing: "-0.035em", textTransform: "uppercase", color: "var(--cv-text)", margin: 0 }}>
              EVERY SERVICE
            </motion.h1>
          </div>
          <div style={{ overflow: "hidden", marginBottom: 28 }}>
            <motion.h1 initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: .72, ease: EASE, delay: .24 }}
              style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem,4.2vw,4rem)", lineHeight: .95, letterSpacing: "-0.035em", textTransform: "uppercase", margin: 0, background: `linear-gradient(to right,var(--cv-accent),var(--cv-accent-2))`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              YOUR TYRES NEED
            </motion.h1>
          </div>

          {/* Body */}
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: EASE, delay: .38 }}
            style={{ fontFamily: "'Archivo',sans-serif", fontSize: "clamp(.88rem,1.1vw,1rem)", color: "var(--cv-muted)", lineHeight: 1.72, maxWidth: 400, margin: "0 0 32px", fontWeight: 300 }}>
            Precision fitment, honest assessment, same-day turnaround — nine specialist services under one roof.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: EASE, delay: .48 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 32 }}>
            <a href="#services" className="sv-grad-btn"
              style={{ padding: "12px 28px", borderRadius: 8, fontSize: ".88rem", letterSpacing: ".025em", fontFamily: "'Archivo',sans-serif" }}>
              Explore Services
              <span style={{ fontFamily: MONO, animation: "svBounce 1.4s ease-in-out infinite", display: "inline-block" }}>↓</span>
            </a>
            <a href={COMPANY.phoneHref} className="sv-neon-btn"
              style={{ padding: "12px 28px", borderRadius: 8, fontFamily: "'Archivo',sans-serif", fontWeight: 700, fontSize: ".88rem", letterSpacing: ".025em" }}>
              <span style={{ fontFamily: MONO }}>☎</span> Book a Bay
            </a>
          </motion.div>

          {/* Mini stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, delay: .6 }}
            style={{ borderTop: `1px solid var(--cv-border)`, paddingTop: 20, display: "flex", gap: 28, flexWrap: "wrap" }}>
            {[{ val: "9", label: "Specialist services" }, { val: "10,000+", label: "Tyres in stock" }, { val: "Same day", label: "Turnaround" }].map(({ val, label }) => (
              <div key={val}>
                <div style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 900, fontSize: "clamp(.95rem,1.5vw,1.2rem)", lineHeight: 1, background: `linear-gradient(to right,var(--cv-accent),var(--cv-accent-2))`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{val}</div>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--cv-muted)", lineHeight: 1.5, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Watermark */}
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%) rotate(-90deg)", zIndex: 6, pointerEvents: "none" }}>
            <span style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.32em", textTransform: "uppercase", color: isDark ? "rgba(232,244,255,0.07)" : "rgba(90,65,20,0.07)", fontWeight: 700, whiteSpace: "nowrap" }}>
              CTS TYRES — WORKSHOP SERVICES
            </span>
          </div>
        </div>

        {/* RIGHT — Plasma background, fully theme-aware */}
        <div className="sv-hero-right" style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* Bleed fade on left edge — matches the page bg color so no hard cut */}
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: 0, width: 160,
            background: isDark
              ? `linear-gradient(to right, #080604, transparent)`
              : `linear-gradient(to right, #F0EBE0, transparent)`,
            zIndex: 2, pointerEvents: "none",
          }} />
          {/* Plasma — pass isDark so canvas bg colour matches page */}
          <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
            <PlasmaBg color={CYAN} speed={0.4} scale={1.1} opacity={isDark ? 0.55 : 0.75} direction="forward" mouseInteractive isDark={isDark} />
          </div>
          {/* Particles overlay */}
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", opacity: .7 }}>
            <SvParticleField isDark={isDark} />
          </div>
          {/* Top / bottom fades — match page bg */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, background: isDark ? `linear-gradient(to bottom,#080604,transparent)` : `linear-gradient(to bottom,#F0EBE0,transparent)`, zIndex: 4, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: isDark ? `linear-gradient(to bottom,transparent,#080604)` : `linear-gradient(to bottom,transparent,#F0EBE0)`, zIndex: 4, pointerEvents: "none" }} />
        </div>
      </div>

      {/* Bottom fade into ticker */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: isDark ? `linear-gradient(to bottom,transparent,#080604)` : `linear-gradient(to bottom,transparent,#F0EBE0)`, zIndex: 5, pointerEvents: "none" }} />
    </section>
  );
}

/* ============================================================================
   EDITORIAL GALLERY — staggered two-column grid
   ========================================================================== */
const SERVICE_DATES: Record<number, string> = { 1:"15.03.2024",2:"02.02.2024",3:"18.11.2023",4:"07.04.2024",5:"29.01.2024",6:"12.06.2023",7:"23.08.2023",8:"05.05.2024",9:"30.09.2023" };

function GalleryItem({ service, index, entranceDelay = 0 }: { service: Service; index: number; entranceDelay?: number }) {
  const { ref: wrapRef, visible } = useInViewEntry(0.1);
  const imgParallaxRef = useParallaxRef(0.10);
  const [hovered, setHovered] = useState(false);
  const date = SERVICE_DATES[service.id] ?? "01.01.2024";
  return (
    <article ref={wrapRef} className="sv-gallery-item"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(52px)", transition: `opacity .75s cubic-bezier(.22,1,.36,1) ${entranceDelay}ms,transform .75s cubic-bezier(.22,1,.36,1) ${entranceDelay}ms` }}>

      <div className="sv-gallery-frame" style={{ border: `1px solid ${hovered ? `var(--cv-accent)66` : "rgba(255,255,255,.1)"}`, borderRadius: 4, overflow: "hidden", position: "relative", aspectRatio: "4/5", background: "var(--cv-bg2)", transition: "border-color .35s" }}>
        <div ref={imgParallaxRef} style={{ position: "absolute", inset: "-15% 0", overflow: "hidden" }}>
          <img className="sv-gallery-img" src={service.image} alt={service.title} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform .7s cubic-bezier(.25,.46,.45,.94)" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.75) 0%,rgba(0,0,0,.1) 40%,transparent 70%)", pointerEvents: "none", zIndex: 1 }} />
        <span style={{ position: "absolute", top: 14, left: 14, zIndex: 2, fontFamily: MONO, fontSize: ".65rem", fontWeight: 700, letterSpacing: ".1em", color: "rgba(255,255,255,.4)" }}>
          [{String(index).padStart(2, "0")}]
        </span>
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, width: 32, height: 32, borderRadius: "50%", background: `var(--cv-accent)22`, border: `1px solid var(--cv-accent)44`, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cv-accent)", opacity: hovered ? 1 : 0, transition: "opacity .3s" }}>
          <ServiceIcon id={service.id} size={16} />
        </div>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: `linear-gradient(135deg,var(--cv-accent)12 0%,transparent 55%)`, opacity: hovered ? 1 : 0, transition: "opacity .4s", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right,var(--cv-accent),var(--cv-accent-2))`, zIndex: 2, opacity: hovered ? 1 : 0, transition: "opacity .3s" }} />
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginTop: 16, borderBottom: `1px solid var(--cv-border)`, paddingBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, minWidth: 0 }}>
          <span style={{ fontFamily: MONO, fontSize: ".68rem", fontWeight: 700, color: "var(--cv-muted)", letterSpacing: ".06em", flexShrink: 0 }}>
            [{String(index).padStart(2, "0")}]
          </span>
          <h3 className="sv-gallery-title" style={{ fontFamily: "'Archivo',sans-serif", fontSize: "clamp(.88rem,1.2vw,1rem)", fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: hovered ? "var(--cv-accent)" : "var(--cv-text)", margin: 0, transition: "color .3s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {service.title}
          </h3>
        </div>
        <span style={{ fontFamily: MONO, fontSize: ".65rem", color: "var(--cv-muted)", letterSpacing: ".05em", flexShrink: 0, whiteSpace: "nowrap", opacity: 0.5 }}>// {date}</span>
      </div>
      <p style={{ fontFamily: MONO, fontSize: ".62rem", color: "var(--cv-muted)", letterSpacing: ".1em", textTransform: "uppercase", margin: "10px 0 0", opacity: .6 }}>
        {service.tagline}
      </p>
    </article>
  );
}

function EditorialGallery() {
  const leftItems = services.filter((_, i) => i % 2 === 0);
  const rightItems = services.filter((_, i) => i % 2 !== 0);
  return (
    <section id="services" className="sv-gallery-section" style={{ background: "var(--cv-bg)", padding: "80px 48px 110px", position: "relative", overflow: "hidden" }}>
      {/* Grid texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(90deg,rgba(201,168,76,.015) 0,rgba(201,168,76,.015) 1px,transparent 1px,transparent 80px)`, pointerEvents: "none", zIndex: 0 }} />
      {/* Glow accent */}
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,var(--cv-accent)08,transparent 65%)`, filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ marginBottom: 72, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <SectionLabel index="01" label="What We Do" delay={0} />
              <SplitHeading style={{ fontSize: "clamp(1.9rem,3.8vw,3rem)", fontWeight: 900, color: "var(--cv-text)", letterSpacing: "-.025em", lineHeight: 1.02, marginBottom: 10 }}>
                Workshop-grade tyre care
              </SplitHeading>
              <AnimatedDivider color={CYAN} delay={0.3} />
            </div>
            <p style={{ color: "var(--cv-muted)", fontSize: ".92rem", lineHeight: 1.7, maxWidth: 340, margin: 0, fontWeight: 300 }}>
              Nine specialist services under one roof — precision fitment, honest assessment, <span className="shimmer-text" style={{ fontWeight: 700 }}>same-day turnaround.</span>
            </p>
          </div>
        </Reveal>

        <div className="sv-gallery-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
            {leftItems.map((s, i) => <GalleryItem key={s.id} service={s} index={s.id} entranceDelay={i * 80} />)}
          </div>
          <div className="sv-gallery-col-right" style={{ display: "flex", flexDirection: "column", gap: 64, marginTop: 200 }}>
            {rightItems.map((s, i) => <GalleryItem key={s.id} service={s} index={s.id} entranceDelay={i * 80 + 120} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   SERVICE CARDS — editorial two-column staggered layout
   ========================================================================== */
function ServiceCard({ service, index, entranceDelay = 0 }: { service: Service; index: number; entranceDelay?: number }) {
  const { ref: wrapRef, visible } = useInViewEntry(0.08);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      ref={wrapRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(52px)",
        transition: `opacity .75s cubic-bezier(.22,1,.36,1) ${entranceDelay}ms, transform .75s cubic-bezier(.22,1,.36,1) ${entranceDelay}ms`,
        cursor: "default",
      }}
    >
      {/* ── Image frame ── */}
      <div style={{
        position: "relative",
        border: `1px solid ${hovered ? `var(--cv-accent)70` : "var(--cv-border)"}`,
        overflow: "hidden",
        aspectRatio: "4/5",
        background: "var(--cv-bg2)",
        transition: "border-color .35s",
      }}>
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform .7s cubic-bezier(.25,.46,.45,.94)",
            filter: hovered ? "grayscale(0%) brightness(1.05)" : "grayscale(15%) brightness(0.9)",
          }}
        />

        {/* Dark gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 45%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />

        {/* Gold tint overlay on hover */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, var(--cv-accent)10 0%, transparent 55%)`, opacity: hovered ? 1 : 0, transition: "opacity .4s", pointerEvents: "none", zIndex: 1 }} />

        {/* Index badge — top left */}
        <span style={{
          position: "absolute", top: 14, left: 14, zIndex: 2,
          fontFamily: MONO, fontSize: ".65rem", fontWeight: 700,
          letterSpacing: ".1em", color: "rgba(245,237,216,0.45)",
        }}>
          [{String(index).padStart(2, "0")}]
        </span>

        {/* Icon badge — top right, appears on hover */}
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 2,
          width: 32, height: 32, borderRadius: "50%",
          background: `var(--cv-accent)28`, border: `1px solid var(--cv-accent)55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: CYAN, opacity: hovered ? 1 : 0, transition: "opacity .3s",
        }}>
          <ServiceIcon id={service.id} size={15} />
        </div>

        {/* Category pill — bottom left */}
        <div style={{ position: "absolute", bottom: 16, left: 14, zIndex: 2 }}>
          <span style={{
            fontFamily: MONO, fontSize: ".58rem", fontWeight: 700,
            letterSpacing: ".16em", textTransform: "uppercase",
            padding: "5px 12px", borderRadius: 4,
            background: `rgba(201,168,76,0.22)`,
            border: `1px solid var(--cv-accent)66`,
            color: "var(--cv-accent)",
            backdropFilter: "blur(8px)",
          }}>
            {service.tagline}
          </span>
        </div>

        {/* Gold bottom accent line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(to right, var(--cv-accent), var(--cv-accent-2))`,
          opacity: hovered ? 1 : 0, transition: "opacity .3s", zIndex: 2,
        }} />
      </div>

      {/* ── Meta row ── */}
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12,
        marginTop: 18,
        borderBottom: `1px solid var(--cv-border)`,
        paddingBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, minWidth: 0 }}>
          <span style={{ fontFamily: MONO, fontSize: ".68rem", fontWeight: 700, color: "var(--cv-muted)", letterSpacing: ".06em", flexShrink: 0 }}>
            [{String(index).padStart(2, "0")}]
          </span>
          <h3 style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: "clamp(.9rem, 1.3vw, 1.05rem)",
            fontWeight: 800, letterSpacing: ".03em", textTransform: "uppercase",
            color: hovered ? "var(--cv-accent)" : "var(--cv-text)",
            margin: 0, transition: "color .3s",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {service.title}
          </h3>
        </div>
        <span style={{ fontFamily: MONO, fontSize: ".62rem", color: "var(--cv-muted)", letterSpacing: ".05em", flexShrink: 0, whiteSpace: "nowrap", opacity: 0.5 }}>
          {service.features[0]}
        </span>
      </div>

      {/* ── Sub-meta ── */}
      <p style={{
        fontFamily: MONO, fontSize: ".6rem", color: "var(--cv-muted)",
        letterSpacing: ".12em", textTransform: "uppercase",
        margin: "10px 0 0", opacity: .65,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <ServiceIcon id={service.id} size={11} />
        {service.description.slice(0, 60).trim()}…
      </p>
    </article>
  );
}

function ServiceCardsSection() {
  const leftItems  = services.filter((_, i) => i % 2 === 0);
  const rightItems = services.filter((_, i) => i % 2 !== 0);

  return (
    <section id="services" className="sv-cards-section" style={{ background: "var(--cv-bg)", padding: "80px 48px 110px", position: "relative", overflow: "hidden" }}>
      {/* Subtle vertical grid lines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(90deg, rgba(201,168,76,.018) 0, rgba(201,168,76,.018) 1px, transparent 1px, transparent 80px)`, pointerEvents: "none", zIndex: 0 }} />
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "-8%", right: "-4%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, var(--cv-accent)0a, transparent 65%)`, filter: "blur(70px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <Reveal>
          <div style={{ marginBottom: 72, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <SectionLabel index="02" label="All Services" delay={0} />
              <SplitHeading style={{ fontSize: "clamp(1.9rem,3.8vw,3rem)", fontWeight: 900, color: "var(--cv-text)", letterSpacing: "-.025em", lineHeight: 1.02, marginBottom: 10 }}>
                Every service in detail
              </SplitHeading>
              <AnimatedDivider color={CYAN} delay={0.3} />
            </div>
            <p style={{ color: "var(--cv-muted)", fontSize: ".92rem", lineHeight: 1.7, maxWidth: 340, margin: 0, fontWeight: 300 }}>
              Pick your service below — or walk in and our team will assess what you need.
            </p>
          </div>
        </Reveal>

        {/* Two-column staggered grid */}
        <div className="sv-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 52px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>
            {leftItems.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={s.id} entranceDelay={i * 90} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 72, marginTop: 220 }}>
            {rightItems.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={s.id} entranceDelay={i * 90 + 140} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   CTA SECTION
   ========================================================================== */
function CtaSection({ isDark = true }: { isDark?: boolean }) {
  return (
    <section style={{ background: "var(--cv-bg2)", position: "relative", overflow: "hidden" }}>
      {/* Plasma ambient */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: isDark ? 0.3 : 0.18, pointerEvents: "none" }}>
        <PlasmaBg color={CYAN} speed={0.25} scale={1.3} opacity={isDark ? 0.4 : 0.6} direction="reverse" mouseInteractive={false} isDark={isDark} />
      </div>
      {/* Grid lines */}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,transparent 0,transparent 79px,rgba(201,168,76,.012) 80px)", pointerEvents: "none", zIndex: 1 }} />
      {/* Glow orbs */}
      <div style={{ position: "absolute", top: "-40%", left: "8%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle,var(--cv-accent)14,transparent 70%)`, pointerEvents: "none", filter: "blur(40px)", animation: "glowPulse 6s ease-in-out infinite", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "10%", width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle,var(--cv-accent-2)14,transparent 70%)`, pointerEvents: "none", filter: "blur(40px)", animation: "glowPulse 8s ease-in-out infinite .5s", zIndex: 1 }} />

      <motion.div className="sv-cta-inner"
        initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }}
        transition={{ duration: .6, ease: EASE }}
        style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "72px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>

        <div style={{ maxWidth: 520 }}>
          <SectionLabel index="03" label="Expert help, free of charge" delay={0} />
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: .25, duration: .6, ease: EASE }}
            style={{ fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 900, color: "var(--cv-text)", margin: "0 0 8px", letterSpacing: "-.02em", lineHeight: 1.06, fontFamily: "'Archivo',sans-serif" }}>
            Need a tyre check today?
          </motion.h2>
          <AnimatedDivider color={CYAN} delay={0.4} />
          <p style={{ color: "var(--cv-muted)", fontSize: ".95rem", margin: "0 0 28px", lineHeight: 1.65, fontWeight: 300, fontFamily: "'Archivo',sans-serif" }}>
            Walk in or book a bay — our techs will assess, advise, and get you back on the road.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href={COMPANY.phoneHref} className="sv-grad-btn"
              style={{ padding: "14px 28px", borderRadius: 8, fontSize: ".9rem", letterSpacing: ".02em", fontFamily: "'Archivo',sans-serif" }}>
              <span style={{ fontFamily: MONO }}>☎</span> Call Us Now
            </a>
            <a href="#services" className="sv-neon-btn"
              style={{ padding: "14px 28px", borderRadius: 8, fontFamily: "'Archivo',sans-serif", fontWeight: 700, fontSize: ".9rem", letterSpacing: ".02em" }}>
              Browse Services
            </a>
          </div>
        </div>

        {/* Right stat stack */}
        <Reveal delay={150}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[["9", "Specialist services"], ["Same day", "Turnaround guaranteed"], ["10,000+", "Tyres in stock"]].map(([val, label]) => (
              <div key={label} style={{
                padding: "16px 24px", borderRadius: 14,
                background: isDark ? "rgba(3,4,10,0.6)" : "rgba(240,235,224,0.7)",
                backdropFilter: "blur(16px)",
                border: `1px solid var(--cv-border)`,
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <div style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 900, fontSize: "clamp(1.2rem,2vw,1.6rem)", lineHeight: 1, background: `linear-gradient(to right,var(--cv-accent),var(--cv-accent-2))`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", flexShrink: 0, minWidth: 56 }}>{val}</div>
                <div style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 700, fontSize: ".88rem", color: "var(--cv-text)" }}>{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}

/* ============================================================================
   MAIN EXPORT
   ========================================================================== */
export default function Services() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cssVars: React.CSSProperties = {
    "--cv-bg":        isDark ? "#080604"               : "#F0EBE0",
    "--cv-bg2":       isDark ? "#0E0A04"               : "#E8E2D5",
    "--cv-bg-t":      isDark ? "rgba(8,6,4,0.88)"      : "rgba(240,235,224,0.92)",
    "--cv-bg2-t":     isDark ? "rgba(14,10,4,0.85)"    : "rgba(232,226,213,0.88)",
    "--cv-text":      isDark ? "#F5EDD8"               : "#1A1508",
    "--cv-muted":     isDark ? "#8A7D63"               : "#6B5C3A",
    "--cv-border":    isDark ? "rgba(201,168,76,0.2)"  : "rgba(168,114,10,0.20)",
    "--cv-accent":    isDark ? "#C9A84C"               : "#A8720A",
    "--cv-accent-dim":isDark ? "#A8872E"               : "#8A5C08",
    "--cv-accent-2":  isDark ? "#8C6D2F"               : "#6B5020",
    "--cv-accent-3":  isDark ? "#E8C46A"               : "#D4A830",
  } as React.CSSProperties;

  const svTokens = getSTokens(isDark);

  return (
    <SvTheme.Provider value={svTokens}>
      <div className="sv-root" style={{ fontFamily: "'Archivo',sans-serif", minHeight: "100vh", overflowX: "hidden", WebkitFontSmoothing: "antialiased", ...cssVars, background: "var(--cv-bg)", color: "var(--cv-text)" }}>
        <style>{globalStyles}</style>

        {/* Page-wide Plasma background — dark mode only, hidden in light */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: isDark ? 1 : 0, transition: "opacity .4s" }}>
          <PlasmaBg color={CYAN} speed={0.3} scale={1.2} opacity={0.35} direction="forward" mouseInteractive isDark={isDark} />
        </div>

        <ScrollProgressLine />

        <div style={{ position: "relative", zIndex: 1 }}>
          <HeroSection isDark={isDark} />
          <BrandTicker isDark={isDark} />
          <ServiceCardsSection />
          <CtaSection isDark={isDark} />
        </div>
      </div>
    </SvTheme.Provider>
  );
}
