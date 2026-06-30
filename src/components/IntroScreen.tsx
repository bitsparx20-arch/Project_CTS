import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroScreenProps {
  onEnter: () => void;
}

/* ---------- viewport size hook (handles SSR + resize + orientation) ---------- */
function useViewportSize() {
  const [size, setSize] = useState(() => ({
    width: typeof document !== "undefined" ? document.documentElement.clientWidth : 1280,
    height: typeof document !== "undefined" ? document.documentElement.clientHeight : 800,
  }));

  useEffect(() => {
    const update = () =>
      setSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return size;
}

/* ---------- Starfield Canvas ---------- */
function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let stars: { x: number; y: number; r: number; o: number; speed: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fewer stars on small screens for performance
      const count = w < 600 ? 130 : 220;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.3 + Math.random() * 1.4,
        o: 0.15 + Math.random() * 0.65,
        speed: 0.0008 + Math.random() * 0.002,
      }));
    };

    let t = 0;
    const draw = () => {
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight;
      ctx.clearRect(0, 0, w, h);
      t += 0.012;
      stars.forEach((s) => {
        const flicker = s.o * (0.7 + 0.3 * Math.sin(t * s.speed * 1000 + s.x));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${flicker})`;
        ctx.fill();
      });
      animFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

/* ---------- SVG Gear ---------- */
// cx/cy = screen coords of gear CENTER (relative to parent anchor)
function Gear({
  size,
  teeth,
  cx,
  cy,
  duration,
  direction = 1,
  opacity = 1,
}: {
  size: number;
  teeth: number;
  cx: number; // center x relative to parent
  cy: number; // center y relative to parent
  duration: number;
  direction?: 1 | -1;
  opacity?: number;
}) {
  const r = size / 2;
  const innerR = r * 0.68;
  const toothH = r * 0.13;
  const hubR = r * 0.17;
  const spokeW = r * 0.085;

  const buildPath = () => {
    const segs: string[] = [];
    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2 - Math.PI / 2;
      const next = ((i + 1) / teeth) * Math.PI * 2 - Math.PI / 2;
      const mid = (angle + next) / 2;
      const half = (next - angle) * 0.32;

      const ox1 = Math.cos(angle + half) * (r + toothH);
      const oy1 = Math.sin(angle + half) * (r + toothH);
      const ox2 = Math.cos(mid) * (r + toothH);
      const oy2 = Math.sin(mid) * (r + toothH);
      const ox3 = Math.cos(next - half) * (r + toothH);
      const oy3 = Math.sin(next - half) * (r + toothH);
      const ix = Math.cos(next) * r;
      const iy = Math.sin(next) * r;

      if (i === 0) {
        segs.push(`M ${Math.cos(angle) * r} ${Math.sin(angle) * r}`);
      }
      segs.push(`L ${ox1} ${oy1} L ${ox2} ${oy2} L ${ox3} ${oy3} L ${ix} ${iy}`);
    }
    segs.push("Z");
    return segs.join(" ");
  };

  const spokes = Array.from({ length: 3 }, (_, i) => {
    const a = (i / 3) * Math.PI * 2;
    return {
      x1: Math.cos(a) * hubR,
      y1: Math.sin(a) * hubR,
      x2: Math.cos(a) * innerR * 0.82,
      y2: Math.sin(a) * innerR * 0.82,
    };
  });

  const pad = toothH + 4;
  const svgSize = size + pad * 2;
  const gearFill = "#2a220e";
  const gearStroke = "#6b5a2e";

  return (
    <motion.svg
      width={svgSize}
      height={svgSize}
      // viewBox centered on 0,0 — gear SVG coords are origin-centered
      viewBox={`${-r - pad} ${-r - pad} ${svgSize} ${svgSize}`}
      style={{
        position: "absolute",
        // Place so that the SVG origin (gear center) lands exactly at cx, cy
        left: cx - svgSize / 2,
        top: cy - svgSize / 2,
        overflow: "visible",
        opacity,
      }}
      animate={{ rotate: direction === 1 ? 360 : -360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <path d={buildPath()} fill={gearFill} stroke={gearStroke} strokeWidth={1.2} />
      <circle cx={0} cy={0} r={innerR} fill="#1e1a0c" stroke={gearStroke} strokeWidth={1} />
      {spokes.map((s, i) => (
        <line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={gearStroke}
          strokeWidth={spokeW}
          strokeLinecap="round"
        />
      ))}
      <circle cx={0} cy={0} r={hubR} fill={gearFill} stroke={gearStroke} strokeWidth={1.2} />
      <circle cx={0} cy={0} r={hubR * 0.42} fill="#111" />
    </motion.svg>
  );
}

/* ---------- Nebula glow BG ---------- */
function NebulaGlow() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: "60vw",
          height: "60vh",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(20,40,80,0.55) 0%, rgba(10,20,50,0.3) 45%, transparent 75%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: "90vw",
          height: "80vh",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(80,55,10,0.18) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}

/* ============================================================================
   MAIN INTRO SCREEN
   ========================================================================== */
export default function IntroScreen({ onEnter }: IntroScreenProps) {
  const [phase, setPhase] = useState<"idle" | "zooming">("idle");
  const [hovered, setHovered] = useState(false);
  const { width: vw, height: vh } = useViewportSize();

  const isMobile = vw < 640;
  const isSmallMobile = vw < 380;

  const handleEnter = () => {
    if (phase !== "idle") return;
    setPhase("zooming");
    setTimeout(onEnter, 900);
  };

  // Portal scales with the smaller viewport dimension so it always fits,
  // with separate tighter caps for mobile so the flanking gears never
  // get clipped off-screen.
  const minDim = Math.min(vw, vh);
  const portalSizeNum = isMobile
    ? Math.min(vw * 0.6, minDim * 0.5, 260)
    : Math.min(vw * 0.42, 380);
  const portalSize = `${portalSizeNum}px`;

  const p = portalSizeNum; // centre gear & portal diameter
  const lg = p * (isMobile ? 0.6 : 0.72); // large flanking gear diameter (smaller ratio on mobile to avoid clipping)
  const sm = p * (isMobile ? 0.34 : 0.42); // small corner gear diameter

  // Gap between meshing gears (small positive = slight overlap like real gears)
  const mesh = p * 0.02;

  // Horizontal center of left/right large gears
  const lgX = p / 2 + lg / 2 - mesh;

  // Vertical center of large gears (same as centre gear = 0)
  const lgY = 0;

  // Small gears sit below & outside the large gears
  const smX = lgX + lg / 2 + sm / 2 - mesh;
  const smY = lg * 0.35;

  // Hide flanking gears entirely on very small screens where they'd
  // overflow / clutter the layout, keep just the centre gear + portal.
  const showFlankingGears = !isMobile;

  return (
    <AnimatePresence>
      {phase !== "zooming" || true ? (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100dvh",
            zIndex: 9999,
            background: "#080704",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <StarfieldCanvas />
          <NebulaGlow />

          {/* ── GEAR CLUSTER — zero-size div anchored to exact screen centre ── */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 0,
              height: 0,
            }}
          >
            {/* Centre gear (behind portal) */}
            <Gear size={p} teeth={38} duration={30} direction={1} opacity={0.9} cx={0} cy={0} />

            {showFlankingGears && (
              <>
                {/* Left large gear */}
                <Gear size={lg} teeth={28} duration={22} direction={-1} opacity={0.82} cx={-lgX} cy={lgY} />
                {/* Right large gear */}
                <Gear size={lg} teeth={28} duration={22} direction={-1} opacity={0.82} cx={lgX} cy={lgY} />
                {/* Left small gear */}
                <Gear size={sm} teeth={16} duration={13} direction={1} opacity={0.72} cx={-smX} cy={smY} />
                {/* Right small gear */}
                <Gear size={sm} teeth={16} duration={13} direction={1} opacity={0.72} cx={smX} cy={smY} />
              </>
            )}
          </div>

          {/* ── PORTAL RING ──────────────────────────────────────── */}
          <motion.div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: portalSize,
              height: portalSize,
              maxWidth: "78vw",
              maxHeight: "78vw",
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: hovered
                ? "2px solid rgba(230,185,60,0.95)"
                : "2px solid rgba(210,170,60,0.82)",
              boxShadow: hovered
                ? "0 0 80px 20px rgba(200,155,30,0.38), 0 0 30px 6px rgba(200,155,30,0.28), inset 0 0 40px 8px rgba(200,155,30,0.14)"
                : "0 0 40px 8px rgba(180,135,20,0.22), 0 0 16px 3px rgba(180,135,20,0.18), inset 0 0 20px 2px rgba(180,135,20,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
            animate={
              phase === "zooming" ? { scale: 12, opacity: 0 } : { scale: 1, opacity: 1 }
            }
            transition={
              phase === "zooming"
                ? { duration: 0.85, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0.4 }
            }
            onClick={handleEnter}
            onTap={handleEnter}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
          >
            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.35 }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse at center, rgba(210,190,100,0.08) 0%, transparent 70%)",
              }}
            />

            <motion.div
              animate={{ opacity: phase === "zooming" ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                userSelect: "none",
                padding: isSmallMobile ? "0 6px" : "0 12px",
                textAlign: "center",
                maxWidth: "100%",
              }}
            >
              {/* CTS wordmark */}
              <div style={{ marginBottom: isMobile ? 6 : 10 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    justifyContent: "center",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      width: isSmallMobile ? 14 : 22,
                      height: 1,
                      background: "linear-gradient(to right, transparent, rgba(210,170,60,0.7))",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Oswald','Aspekta',sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(11px, 4.2vw, 18px)",
                      letterSpacing: "0.18em",
                      color: "rgba(230,200,100,0.95)",
                      textTransform: "uppercase",
                      lineHeight: 1,
                    }}
                  >
                    CTS
                  </span>
                  <div
                    style={{
                      width: isSmallMobile ? 14 : 22,
                      height: 1,
                      background: "linear-gradient(to left, transparent, rgba(210,170,60,0.7))",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: "'Oswald','Aspekta',sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(7px, 2.4vw, 11px)",
                    letterSpacing: "0.32em",
                    color: "rgba(210,175,80,0.75)",
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  TYRES
                </div>
              </div>

              <div
                style={{
                  width: isSmallMobile ? 28 : 40,
                  height: 1,
                  background: "rgba(210,170,60,0.35)",
                  marginBottom: isMobile ? 8 : 12,
                }}
              />

              <div
                style={{
                  fontFamily: "'Oswald','Aspekta',sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(8px, 3vw, 14px)",
                  letterSpacing: "0.2em",
                  color: "rgba(220,195,120,0.88)",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                DRIVEN BEYOND
              </div>

              <div
                style={{
                  fontFamily: "'Oswald','Aspekta',sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(13px, 5vw, 26px)",
                  letterSpacing: "0.12em",
                  color: "rgba(235,205,100,1)",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  marginBottom: isMobile ? 8 : 14,
                }}
              >
                LIMITS
              </div>

              {!isSmallMobile && (
                <motion.div
                  animate={{ letterSpacing: hovered ? "0.24em" : "0.18em" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    fontFamily: "'Oswald','Aspekta',sans-serif",
                    fontWeight: 300,
                    fontSize: "clamp(6px, 1.8vw, 10px)",
                    letterSpacing: "0.18em",
                    color: "rgba(200,175,90,0.65)",
                    textTransform: "uppercase",
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  STEP INTO OUR WORLD
                </motion.div>
              )}

              <motion.div
                animate={{
                  y: hovered ? [0, 4, 0] : [0, 2, 0],
                  opacity: hovered ? 0.9 : 0.5,
                }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
              >
                <svg width="14" height="9" viewBox="0 0 16 10" fill="none">
                  <path
                    d="M1 1L8 8L15 1"
                    stroke="rgba(210,175,70,0.8)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg width="14" height="9" viewBox="0 0 16 10" fill="none" style={{ marginTop: -4 }}>
                  <path
                    d="M1 1L8 8L15 1"
                    stroke="rgba(210,175,70,0.45)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── FADE-OUT OVERLAY on zoom ── */}
          <AnimatePresence>
            {phase === "zooming" && (
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.15 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#050505",
                  zIndex: 20,
                  pointerEvents: "none",
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
