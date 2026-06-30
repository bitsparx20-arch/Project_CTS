import { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { ROUTES } from "../config/site";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

/* ============================================================================
   CTS TYRES — Cinematic Edition  v3.1
   FIX 1: Light mode text contrast in Anatomy section Phase 0
   FIX 2: Orbital spheres alignment (hub + satellites raised, SVG lines use % coords)
   ========================================================================== */

/* ---------- Theme Tokens ---------- */
function getT(isDark: boolean) {
  return {
    bg:           isDark ? "#080808"                    : "#F5F2EB",
    bg2:          isDark ? "#111111"                    : "#FFFFFF",
    panel:        isDark ? "rgba(17,17,17,0.82)"        : "rgba(255,255,255,0.88)",
    panelSolid:   isDark ? "#111111"                    : "#FFFFFF",
    panelDeep:    isDark ? "rgba(5,5,5,0.78)"          : "rgba(255,255,255,0.92)",
    panelGlass:   isDark ? "rgba(17,17,17,0.72)"       : "rgba(255,255,255,0.88)",
    hairline:     isDark ? "rgba(245,168,0,0.12)"      : "rgba(200,136,10,0.16)",
    hairlineSub:  isDark ? "rgba(255,255,255,0.08)"    : "rgba(0,0,0,0.08)",
    text:         isDark ? "#FFFFFF"                    : "#1A1A14",
    textSub:      isDark ? "rgba(255,255,255,0.72)"    : "rgba(26,26,20,0.72)",
    textDim:      isDark ? "rgba(255,255,255,0.45)"    : "rgba(26,26,20,0.45)",
    muted:        isDark ? "#B0B0B0"                    : "#4A4030",
    accent:       isDark ? "#F5A800"                    : "#C8880A",
    accentSoft:   isDark ? "#FFB830"                    : "#E09A10",
    accentGlow:   isDark ? "rgba(245,168,0,0.40)"      : "rgba(200,136,10,0.28)",
    gradCyan:     isDark ? "#F5A800"                    : "#C8880A",
    gradPink:     isDark ? "#D4D4D4"                    : "#888888",
    gradPurple:   isDark ? "#A0A0A0"                    : "#777777",
    gradAccent:   isDark
      ? "linear-gradient(to right, #F5A800, #FFD060, #F5A800)"
      : "linear-gradient(to right, #C8880A, #E8A820, #C8880A)",
    silver:       isDark ? "#C8C8C8"                    : "#888888",
    silverDark:   isDark ? "#787878"                    : "#555555",
    overlayTop:   isDark ? "rgba(5,5,5,0.8)"           : "rgba(245,242,235,0.6)",
    overlayImg:   isDark ? "rgba(0,0,0,0.6)"           : "rgba(245,242,235,0.5)",
    overlayImgHvy:isDark ? "rgba(0,0,0,0.85)"          : "rgba(245,242,235,0.7)",
    overlayFadeR: isDark
      ? "linear-gradient(to right, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.82) 48%, rgba(5,5,5,0.45) 100%)"
      : "linear-gradient(to right, rgba(245,242,235,0.97) 0%, rgba(245,242,235,0.82) 48%, rgba(245,242,235,0.45) 100%)",
    overlayFadeT: isDark
      ? "linear-gradient(to top, rgba(5,5,5,0.8), transparent 60%)"
      : "linear-gradient(to top, rgba(245,242,235,0.8), transparent 60%)",
    ctaBg:        isDark ? "#0D0C08"                    : "#F5F2EB",
    badgeBg:      isDark ? "rgba(17,17,17,0.72)"       : "rgba(255,255,255,0.88)",
    inputBg:      isDark ? "rgba(5,5,5,0.6)"           : "rgba(245,242,235,0.8)",
    isDark,
    radius: 8,
    radiusLg: 16,
    display: "'Aspekta', 'Oswald', sans-serif",
    body: "'Aspekta', 'Manrope', sans-serif",
  };
}
const T = getT(true);

type HomeTokens = ReturnType<typeof getT>;
const HomeTheme = createContext<HomeTokens>(getT(true));
const useHomeT  = () => useContext(HomeTheme);

/* ---------- Data ---------- */
type Fit = { brand: string; model: string; tyre: string };

const TYRE_DATA: Fit[] = [
  { brand: "Audi", model: "A4", tyre: "Continental ProContact TX" },
  { brand: "Audi", model: "e-tron", tyre: "Continental CrossContact LX Sport" },
  { brand: "BMW", model: "3 Series", tyre: "Bridgestone Turanza T001" },
  { brand: "BMW", model: "i4", tyre: "Pirelli Cinturato P7" },
  { brand: "Chevrolet", model: "Bolt EV", tyre: "Michelin Energy Saver A/S" },
  { brand: "Chevrolet", model: "Silverado", tyre: "Goodyear Wrangler DuraTrac" },
  { brand: "Dodge", model: "Charger", tyre: "Pirelli P Zero Nero All Season" },
  { brand: "Ford", model: "Mustang", tyre: "Pirelli P Zero" },
  { brand: "Ford", model: "Mustang Mach-E", tyre: "Continental CrossContact LX Sport" },
  { brand: "Honda", model: "Civic", tyre: "Goodyear Assurance All-Season" },
  { brand: "Hyundai", model: "Elantra", tyre: "Kumho Solus TA31" },
  { brand: "Hyundai", model: "Ioniq 5", tyre: "Michelin Primacy Tour A/S" },
  { brand: "Jeep", model: "Wrangler", tyre: "BFGoodrich All-Terrain T/A KO2" },
  { brand: "Kia", model: "EV6", tyre: "Michelin Primacy Tour A/S" },
  { brand: "Kia", model: "Sorento", tyre: "Hankook Dynapro HP2" },
  { brand: "Mazda", model: "CX-5", tyre: "Toyo A23" },
  { brand: "Mercedes-Benz", model: "C-Class", tyre: "Michelin Primacy MXM4" },
  { brand: "Nissan", model: "Altima", tyre: "Bridgestone Ecopia EP422 Plus" },
  { brand: "Nissan", model: "Leaf", tyre: "Bridgestone Ecopia EP422 Plus" },
  { brand: "Rivian", model: "R1T", tyre: "Pirelli Scorpion All Terrain Plus" },
  { brand: "Subaru", model: "Outback", tyre: "Yokohama Geolandar G91F" },
  { brand: "Tesla", model: "Model 3", tyre: "Michelin Primacy MXM4" },
  { brand: "Tesla", model: "Model S", tyre: "Michelin Pilot Sport 4S" },
  { brand: "Toyota", model: "Camry", tyre: "Michelin Premier A/S" },
  { brand: "Volkswagen", model: "Golf", tyre: "Continental ContiProContact" },
];

const BRANDS = ["MRF","CEAT","Apollo","JK Tyre","TVS","Birla Tyres","Balkrishna","PTL","Kama Kuhmo","Speedways"];

const CATEGORIES = [
  { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", title: "Passenger", desc: "Smooth, fuel-efficient tyres for everyday cars and effortless city comfort." },
  { image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80", title: "SUV & 4x4", desc: "Built for bigger vehicles and tougher terrain — confident on-road and off." },
  { image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80", title: "Truck & Van", desc: "Heavy-duty performance for commercial fleets and the longest hauls." },
  { image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80", title: "Performance", desc: "High-speed rubber engineered for sports cars and track-day precision." },
  { image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80", title: "All-Season", desc: "One tyre for rain, sun and light snow — year-round, no compromise." },
  { image: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=80", title: "Run-Flat", desc: "Keep driving even after a puncture — safety without the stop." },
];

const WHY = [
  { stat: "10,000+", title: "Tyres in Stock", desc: "A vast range across every premium brand, so you always find your exact fit." },
  { stat: "Certified", title: "Expert Fitment", desc: "Trained technicians match the right tyre to your vehicle, budget and driving style." },
  { stat: "24h", title: "Next-Day Delivery", desc: "Order today and have your tyres delivered and ready to fit tomorrow." },
];

const STATS = [
  { target: 10000, suffix: "+", label: "Tyres in stock" },
  { target: 10, suffix: "+", label: "Indian brands" },
  { target: 24, suffix: "h", label: "Average delivery" },
  { target: 50000, suffix: "+", label: "Happy drivers" },
];

const REVIEWS = [
  { text: "Great selection and lightning-fast delivery. Found the exact tyres I needed in minutes.", author: "Rahul M., Mumbai" },
  { text: "Helpful team, fair prices. My go-to for everything tyre-related. Highly recommended.", author: "Priya S., Pune" },
  { text: "Effortless website and the tyres arrived the very next day. Genuinely impressed.", author: "Amir K., Delhi" },
  { text: "Best tyre shop in the city. The staff actually know their stuff and prices are unbeatable.", author: "Sneha R., Bangalore" },
  { text: "Quick installation, premium quality. I won't go anywhere else now.", author: "Vikram T., Chennai" },
];

const CUBE_FACES = [
  { image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80", label: "PERFORMANCE" },
  { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", label: "PRECISION" },
  { image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80", label: "ENDURANCE" },
  { image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80", label: "VELOCITY" },
];

const uniq = (a: string[]) => Array.from(new Set(a));

function useIsMobile(breakpoint = 860) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

/* ============================================================================
   ANIMATED BUTTON
   ========================================================================== */
type BtnVariant = "primary" | "secondary" | "solid";

function AnimatedButton({
  href, onClick, variant = "primary", color, glow, size = "md", children, style, className = "",
}: {
  href?: string;
  onClick?: () => void;
  variant?: BtnVariant;
  color?: string;
  glow?: string;
  size?: "md" | "sm";
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const T = useHomeT();
  const ref = useRef<HTMLElement | null>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const mx = useSpring(0, { stiffness: 250, damping: 20, mass: 0.4 });
  const my = useSpring(0, { stiffness: 250, damping: 20, mass: 0.4 });
  const rx = useSpring(0, { stiffness: 220, damping: 20, mass: 0.4 });
  const ry = useSpring(0, { stiffness: 220, damping: 20, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    mx.set(px * 9); my.set(py * 7); ry.set(px * 11); rx.set(py * -11);
  };
  const handleLeave = () => { mx.set(0); my.set(0); rx.set(0); ry.set(0); };
  const handleClick = (e: React.MouseEvent) => {
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setRipples((rs) => [...rs, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
      setTimeout(() => setRipples((rs) => rs.filter((rp) => rp.id !== id)), 620);
    }
    onClick?.();
  };

  const base: React.CSSProperties = {
    position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center",
    justifyContent: "center", gap: 8, textDecoration: "none", cursor: "pointer",
    fontWeight: 700, fontFamily: "inherit",
    fontSize: size === "sm" ? 14 : 15,
    padding: size === "sm" ? "13px 24px" : "15px 28px",
    borderRadius: T.radius, border: "none", color: "#fff",
    WebkitTapHighlightColor: "transparent", willChange: "transform",
  };

  let variantStyle: React.CSSProperties = {};
  if (variant === "primary") {
    variantStyle = { background: "linear-gradient(to right,#F5A800,#FFB830,#C47800,#F5A800)", backgroundSize: "300% 100%", color: "#0D0C08" };
  } else if (variant === "secondary") {
    variantStyle = { background: T.panelGlass, border: `1px solid ${T.hairlineSub}`, backdropFilter: "blur(8px)", color: T.text };
  } else {
    variantStyle = { background: color || T.accent, boxShadow: `0 10px 28px ${glow || "rgba(0,0,0,0.4)"}` };
  }

  const Comp = (href ? motion.a : motion.button) as any;

  return (
    <Comp
      ref={ref}
      href={href}
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={`cts-anim-btn cts-anim-btn--${variant} ${className}`}
      style={{ ...base, ...variantStyle, x: mx, y: my, rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", ...style }}
    >
      <span className="cts-anim-btn-shine" />
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="cts-anim-btn-ripple"
          style={{ left: r.x, top: r.y }}
          initial={{ scale: 0, opacity: 0.55 }}
          animate={{ scale: 5.5, opacity: 0 }}
          transition={{ duration: 0.62, ease: "easeOut" }}
        />
      ))}
      <span style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: 8 }}>{children}</span>
    </Comp>
  );
}

/* ============================================================================
   STAR FIELD
   ========================================================================== */
function generateStarShadows(n: number): string {
  let v = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFFFFF`;
  for (let i = 2; i <= n; i++) {
    const r = Math.random();
    const c = r > 0.85 ? "#F5A800" : r > 0.80 ? "#FFD060" : "#FFFFFF";
    v += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px ${c}`;
  }
  return v;
}

function StarField({ speed = 1, isDark = true }: { speed?: number; isDark?: boolean }) {
  const shadowsSmall  = useMemo(() => generateStarShadows(700), []);
  const shadowsMedium = useMemo(() => generateStarShadows(200), []);
  const shadowsBig    = useMemo(() => generateStarShadows(100), []);
  const base: React.CSSProperties = { position: "absolute", left: 0, top: 0, background: "transparent", pointerEvents: "none" };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: isDark ? 1 : 0.10, pointerEvents: "none", transition: "opacity 0.4s ease" }}>
      <style>{`@keyframes ctsStarScroll{from{transform:translateY(0);}to{transform:translateY(-2000px);}}`}</style>
      <div style={{ ...base, width: 1, height: 1, zIndex: 2, boxShadow: shadowsSmall, animation: `ctsStarScroll ${50 / speed}s linear infinite` }}>
        <div style={{ position: "absolute", top: 2000, width: 1, height: 1, background: "transparent", boxShadow: shadowsSmall }} />
      </div>
      <div style={{ ...base, width: 2, height: 2, zIndex: 2, boxShadow: shadowsMedium, animation: `ctsStarScroll ${100 / speed}s linear infinite` }}>
        <div style={{ position: "absolute", top: 2000, width: 2, height: 2, background: "transparent", boxShadow: shadowsMedium }} />
      </div>
      <div style={{ ...base, width: 3, height: 3, zIndex: 2, boxShadow: shadowsBig, animation: `ctsStarScroll ${30 / speed}s linear infinite` }}>
        <div style={{ position: "absolute", top: 2000, width: 3, height: 3, background: "transparent", boxShadow: shadowsBig }} />
      </div>
    </div>
  );
}

/* ============================================================================
   WIREFRAME SPHERE
   ========================================================================== */
function WireframeSphere({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: mouseX, y: mouseY });
  const stateRef = useRef<any>(null);

  useEffect(() => { mouseRef.current = { x: mouseX, y: mouseY }; }, [mouseX, mouseY]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = 4.8;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    const geo = new THREE.IcosahedronGeometry(1.8, 3);
    const solidMat = new THREE.MeshBasicMaterial({ color: 0x050508, transparent: true, opacity: 0.92, side: THREE.FrontSide });
    const solidMesh = new THREE.Mesh(geo.clone(), solidMat);
    solidMesh.scale.setScalar(0.982);
    scene.add(solidMesh);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xC8A040, wireframe: true, transparent: true, opacity: 0.55 });
    const wireMesh = new THREE.Mesh(geo, wireMat);
    scene.add(wireMesh);
    const positions = geo.attributes.position;
    const unique = new Map<string, THREE.Vector3>();
    for (let i = 0; i < positions.count; i++) {
      const v = new THREE.Vector3(positions.getX(i), positions.getY(i), positions.getZ(i));
      const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
      if (!unique.has(key)) unique.set(key, v);
    }
    const verts = Array.from(unique.values());
    const allPos = new Float32Array(verts.length * 3);
    verts.forEach((v, i) => { allPos[i * 3] = v.x; allPos[i * 3 + 1] = v.y; allPos[i * 3 + 2] = v.z; });
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(allPos.slice(), 3));
    const dotMat = new THREE.PointsMaterial({ color: 0xC8A040, size: 0.022, sizeAttenuation: true, transparent: true, opacity: 0.6 });
    const dots = new THREE.Points(dotGeo, dotMat);
    wireMesh.add(dots);
    const brightIdxs = verts.filter((_, i) => i % 3 === 0);
    const brightPos = new Float32Array(brightIdxs.length * 3);
    brightIdxs.forEach((v, i) => { brightPos[i * 3] = v.x; brightPos[i * 3 + 1] = v.y; brightPos[i * 3 + 2] = v.z; });
    const brightGeo = new THREE.BufferGeometry();
    brightGeo.setAttribute("position", new THREE.BufferAttribute(brightPos, 3));
    const brightMat = new THREE.PointsMaterial({ color: 0xFFD060, size: 0.065, sizeAttenuation: true, transparent: true, opacity: 1.0 });
    const brightDots = new THREE.Points(brightGeo, brightMat);
    wireMesh.add(brightDots);
    const ringGeo = new THREE.TorusGeometry(1.82, 0.012, 8, 120);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xF5A800, transparent: true, opacity: 0.0 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    scene.add(ringMesh);
    const outerGeo = new THREE.SphereGeometry(2.05, 32, 32);
    const outerMat = new THREE.MeshBasicMaterial({ color: 0xF5A800, transparent: true, opacity: 0.025, side: THREE.BackSide });
    const outerGlow = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerGlow);
    stateRef.current = { renderer, scene, camera, wireMesh, solidMesh, ringMesh, outerGlow, dots, brightDots };
    let t = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.007;
      const { x, y } = mouseRef.current;
      wireMesh.rotation.y += 0.0045;
      wireMesh.rotation.x += 0.0008;
      wireMesh.rotation.y += (x - 0.5) * 0.012;
      wireMesh.rotation.x += (y - 0.5) * 0.007;
      solidMesh.rotation.copy(wireMesh.rotation);
      const breathe = 1 + Math.sin(t * 0.9) * 0.022;
      wireMesh.scale.setScalar(breathe);
      solidMesh.scale.setScalar(breathe * 0.982);
      ringMesh.rotation.y = wireMesh.rotation.y * 0.6;
      const ringPulse = 0.55 + Math.sin(t * 1.4) * 0.35;
      (ringMesh.material as THREE.MeshBasicMaterial).opacity = ringPulse;
      (outerGlow.material as THREE.MeshBasicMaterial).opacity = 0.02 + Math.sin(t * 0.8) * 0.015;
      (brightDots.material as THREE.PointsMaterial).opacity = 0.75 + Math.sin(t * 2.2) * 0.25;
      (brightDots.material as THREE.PointsMaterial).size = 0.055 + Math.sin(t * 1.7) * 0.018;
      renderer.render(scene, camera);
    };
    animate();
    const handleResize = () => {
      const W2 = el.clientWidth, H2 = el.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <div style={{ position: "absolute", left: "5%", right: "5%", top: "46%", height: 6, background: "linear-gradient(90deg, transparent 5%, rgba(245,168,0,0.0) 20%, rgba(245,168,0,0.95) 50%, rgba(245,168,0,0.0) 80%, transparent 95%)", filter: "blur(3px)", pointerEvents: "none", animation: "ctsGlowPulse 2.4s ease-in-out infinite", zIndex: 4 }} />
      <div style={{ position: "absolute", left: "0", right: "0", top: "34%", height: 120, background: "linear-gradient(90deg, transparent 5%, rgba(245,168,0,0.08) 30%, rgba(245,168,0,0.22) 50%, rgba(245,168,0,0.08) 70%, transparent 95%)", filter: "blur(18px)", pointerEvents: "none", animation: "ctsGlowPulse 2.4s ease-in-out infinite", zIndex: 3 }} />
    </div>
  );
}

/* ============================================================================
   GLITCH TEXT
   ========================================================================== */
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function GlitchText({ text, delay = 0, className = "", style = {} }: {
  text: string; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  const T = useHomeT();
  const [displayed, setDisplayed] = useState(() => text.split("").map(() => " "));
  const [done, setDone] = useState(false);

  useEffect(() => {
    let startTimeout: ReturnType<typeof setTimeout>;
    startTimeout = setTimeout(() => {
      const chars = text.split("");
      const revealed = new Array(chars.length).fill(false);
      let frame = 0;
      const totalFrames = chars.length * 4 + 12;
      const tick = setInterval(() => {
        frame++;
        setDisplayed(chars.map((ch, i) => {
          if (revealed[i]) return ch;
          if (ch === " ") { revealed[i] = true; return " "; }
          if (frame > (i * 4 + 8)) { revealed[i] = true; return ch; }
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }));
        if (frame >= totalFrames) {
          clearInterval(tick);
          setDisplayed(chars);
          setDone(true);
        }
      }, 45);
      return () => clearInterval(tick);
    }, delay * 1000);
    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return (
    <span className={className} style={{ ...style, fontVariantNumeric: "tabular-nums" }}>
      {displayed.map((ch, i) => (
        <span key={i} style={{ display: "inline-block", color: !done && ch !== text[i] ? T.gradCyan : "inherit", transition: "color 0.1s", minWidth: ch === " " ? "0.3em" : undefined }}>
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

/* ============================================================================
   VERTICAL TICKER
   ========================================================================== */
const TICKER_ITEMS = ["MRF","CEAT","APOLLO","JK TYRE","TVS","BIRLA TYRES","BALKRISHNA","PTL","KAMA KUHMO","SPEEDWAYS","INDIAN BRANDS","MADE IN INDIA"];

function VerticalTicker() {
  const T = useHomeT();
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="cts-vertical-ticker" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 56, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", pointerEvents: "none", zIndex: 6 }}>
      <motion.div
        animate={{ y: ["0%", "-50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", flexDirection: "column", gap: 28 }}
      >
        {items.map((item, i) => (
          <div key={i} style={{ fontFamily: T.display, fontWeight: 900, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.12)", writingMode: "vertical-rl", transform: "rotate(180deg)", whiteSpace: "nowrap" }}>
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ============================================================================
   3D ROLODEX CUBE
   ========================================================================== */
function RolodexCube({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <div style={{ width: "min(48vh,420px)", height: "min(48vh,420px)", perspective: "2000px", perspectiveOrigin: "50% 50%", flexShrink: 0 }}>
      <motion.div
        animate={{ rotateX: [0, 360], rotateY: (mouseX - 0.5) * -14 }}
        transition={{ rotateX: { duration: 18, repeat: Infinity, ease: "linear" }, rotateY: { duration: 0.8, ease: "easeOut" } }}
        style={{ width: "100%", height: "100%", transformStyle: "preserve-3d", position: "relative" }}
      >
        <div className="cts-cube-face" style={{ transform: "rotateX(0deg) translateZ(min(24vh,210px))" }}>
          <img src={CUBE_FACES[0].image} alt={CUBE_FACES[0].label} className="cts-cube-img" />
          <div className="cts-cube-overlay" />
          <span className="cts-cube-label">{CUBE_FACES[0].label}</span>
        </div>
        <div className="cts-cube-face" style={{ transform: "rotateX(-90deg) translateZ(min(24vh,210px))" }}>
          <img src={CUBE_FACES[1].image} alt={CUBE_FACES[1].label} className="cts-cube-img" />
          <div className="cts-cube-overlay" />
          <span className="cts-cube-label">{CUBE_FACES[1].label}</span>
        </div>
        <div className="cts-cube-face" style={{ transform: "rotateX(-180deg) translateZ(min(24vh,210px))" }}>
          <img src={CUBE_FACES[2].image} alt={CUBE_FACES[2].label} className="cts-cube-img" />
          <div className="cts-cube-overlay" />
          <span className="cts-cube-label">{CUBE_FACES[2].label}</span>
        </div>
        <div className="cts-cube-face" style={{ transform: "rotateX(90deg) translateZ(min(24vh,210px))" }}>
          <img src={CUBE_FACES[3].image} alt={CUBE_FACES[3].label} className="cts-cube-img" />
          <div className="cts-cube-overlay" />
          <span className="cts-cube-label">{CUBE_FACES[3].label}</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================================================
   PARTICLE SYSTEM
   ========================================================================== */
interface Particle {
  id: number; x: number; y: number; size: number; opacity: number;
  depth: number; duration: number; delay: number; type: "dot" | "ring" | "cross";
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: 2 + Math.random() * 5, opacity: 0.04 + Math.random() * 0.18,
    depth: Math.random(), duration: 4 + Math.random() * 8,
    delay: Math.random() * 6,
    type: (["dot", "ring", "cross"] as const)[Math.floor(Math.random() * 3)],
  }));
}

const PARTICLES = generateParticles(28);

function ParticleField({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const T = useHomeT();
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {PARTICLES.map((p) => {
        const px = p.x + (mouseX - 0.5) * p.depth * 30;
        const py = p.y + (mouseY - 0.5) * p.depth * 20;
        return (
          <motion.div
            key={p.id}
            animate={{ x: `${px}vw`, y: `${py}vh`, opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{ x: { duration: 0.6, ease: "easeOut" }, y: { duration: 0.6, ease: "easeOut" }, opacity: { duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }, scale: { duration: p.duration * 0.8, repeat: Infinity, delay: p.delay, ease: "easeInOut" } }}
            style={{ position: "absolute", left: 0, top: 0, width: p.size, height: p.size, borderRadius: p.type !== "cross" ? "50%" : 1, background: p.type === "ring" ? "transparent" : T.gradCyan, border: p.type === "ring" ? `1px solid ${T.gradCyan}` : "none", boxShadow: p.type === "dot" ? `0 0 ${p.size * 2}px ${T.gradCyan}` : "none" }}
          />
        );
      })}
    </div>
  );
}

/* ============================================================================
   SPEED LINES
   ========================================================================== */
function SpeedLines() {
  const T = useHomeT();
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", opacity: 0.05 }}>
      {Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * 360;
        const len = 140 + Math.random() * 180;
        return (
          <motion.div
            key={i}
            animate={{ scaleX: [0, 1, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: 2.5 + Math.random() * 3, repeat: Infinity, delay: i * 0.4 + Math.random() * 2, ease: "easeInOut" }}
            style={{ position: "absolute", left: "60%", top: "45%", width: len, height: 1, background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`, transformOrigin: "left center", transform: `rotate(${angle}deg)` }}
          />
        );
      })}
    </div>
  );
}

/* ============================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 9999, background: "linear-gradient(to right, #F5A800, #FFD060, #F5A800)", transformOrigin: "0%", scaleX }}
    />
  );
}

/* ============================================================================
   CLIP REVEAL
   ========================================================================== */
function ClipReveal({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setRevealed(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ clipPath: "inset(100% 0% 0% 0%)", y: 40 }}
        animate={revealed ? { clipPath: "inset(0% 0% 0% 0%)", y: 0 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ============================================================================
   FADE REVEAL
   ========================================================================== */
function FadeReveal({ children, delay = 0, direction = "up", style = {} }: {
  children: React.ReactNode; delay?: number;
  direction?: "up" | "left" | "right"; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setRevealed(true); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const initial = direction === "up" ? { opacity: 0, y: 48 }
    : direction === "left" ? { opacity: 0, x: -48 }
    : { opacity: 0, x: 48 };
  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={revealed ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================================
   KINETIC DIAGONAL STRIP
   ========================================================================== */
function KineticStrip() {
  const T = useHomeT();
  const ITEMS = [
    { num: "10,000+", label: "Tyres in Stock" },
    { num: "10+", label: "Indian Brands" },
    { num: "24h", label: "Fast Delivery" },
    { num: "50K+", label: "Happy Drivers" },
    { num: "Since '98", label: "Trusted Heritage" },
  ];
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div style={{ position: "relative", zIndex: 5, overflow: "hidden", background: "#F5A800", transform: "skewY(-2deg)", margin: "0 0" }}>
      <div style={{ transform: "skewY(2deg)", padding: "20px 0" }}>
        <div style={{ display: "flex", width: "max-content", gap: 0, animation: "ctsMarquee 22s linear infinite", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 12, marginBottom: 12 }}>
          {doubled.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "0 32px", whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: T.display, fontWeight: 900, fontSize: "clamp(20px,2.4vw,30px)", color: "#0D0C08", letterSpacing: "-0.02em" }}>{item.num}</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.55)" }}>{item.label}</span>
              <span style={{ color: "rgba(0,0,0,0.25)", fontSize: 18 }}>·</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", width: "max-content", gap: 0, animation: "ctsMarqueeR 28s linear infinite", paddingTop: 0 }}>
          {doubled.reverse().map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "0 32px", whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: T.display, fontWeight: 900, fontSize: "clamp(14px,1.6vw,20px)", color: "rgba(0,0,0,0.45)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</span>
              <span style={{ color: "rgba(0,0,0,0.22)", fontSize: 14 }}>—</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   TYRE HERO STRIP
   ========================================================================== */
function TyreHeroStrip() {
  const T = useHomeT();
  const isDark = T.isDark;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const textX = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 5, height: "clamp(320px,50vw,600px)", overflow: "hidden", margin: "0" }}>
      <motion.div style={{ position: "absolute", inset: "-15%", y: imgY }}>
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85" alt="Tyre close-up" style={{ width: "100%", height: "130%", objectFit: "cover", filter: "grayscale(60%) contrast(1.2)", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: T.isDark ? "linear-gradient(to right, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.55) 40%, rgba(8,8,8,0.3) 70%, rgba(8,8,8,0.8) 100%)" : "linear-gradient(to right, rgba(245,242,235,0.92) 0%, rgba(245,242,235,0.55) 40%, rgba(245,242,235,0.3) 70%, rgba(245,242,235,0.8) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: T.isDark ? "linear-gradient(to bottom, rgba(8,8,8,0.4) 0%, transparent 30%, transparent 70%, rgba(8,8,8,0.6) 100%)" : "linear-gradient(to bottom, rgba(245,242,235,0.4) 0%, transparent 30%, transparent 70%, rgba(245,242,235,0.6) 100%)" }} />
      </motion.div>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(to bottom, transparent, #F5A800, transparent)" }} />
      <motion.div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", x: textX, opacity }}>
        <div style={{ padding: "0 clamp(24px,7vw,100px)", maxWidth: 900 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#F5A800", fontWeight: 700, marginBottom: 16 }}>Engineering Excellence</div>
          <h2 style={{ fontFamily: T.display, fontWeight: 900, fontSize: "clamp(32px,6vw,88px)", textTransform: "uppercase", lineHeight: 0.95, color: "#fff", margin: "0 0 20px" }}>
            GRIP.<br />CONTROL.<br /><span style={{ color: "#F5A800" }}>CONFIDENCE.</span>
          </h2>
          <p style={{ fontSize: "clamp(16px,1.5vw,20px)", color: "rgba(255,255,255,0.85)", maxWidth: 440, lineHeight: 1.7, fontWeight: 400 }}>Every tyre in our range is precision-matched to your vehicle, road, and driving style.</p>
        </div>
      </motion.div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(245,168,0,0.4), transparent)" }} />
    </div>
  );
}

/* ============================================================================
   3D WHEEL (pure CSS)
   ========================================================================== */
function Wheel({ spin = 11, float = 7, reverse = false, caliper = false }:
  { spin?: number; float?: number; reverse?: boolean; caliper?: boolean }) {
  return (
    <div style={{ width: "100%", height: "100%", animation: `ctsBob ${float}s ease-in-out infinite` }}>
      <div className="cts-tyre">
        <div className="cts-tread" />
        <div className="cts-rim" style={{ animation: `${reverse ? "ctsSpinR" : "ctsSpin"} ${spin}s linear infinite` }}>
          <div className="cts-spokes" />
          {caliper && <div className="cts-caliper" />}
          <div className="cts-hub" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   COUNTER
   ========================================================================== */
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const T = useHomeT();
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && !done.current) {
          done.current = true;
          const dur = 1900, t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / dur);
            const e = 1 - Math.pow(1 - p, 3);
            setVal(Math.floor(target * e));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return (
    <div ref={ref} style={{ fontFamily: T.display, fontWeight: 900, fontSize: "clamp(32px,5vw,62px)", lineHeight: 1, background: T.gradAccent, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
      {val.toLocaleString("en-US")}{suffix}
    </div>
  );
}

/* ============================================================================
   TYRE SVG
   ========================================================================== */
const LAYERS = [
  { id: "assembled", name: "Complete Tyre", short: "Fully Assembled", desc: "Every layer working in harmony — 5 distinct components engineered to deliver grip, comfort, and durability across every road surface.", accentColor: "#F5A800", borderColor: "rgba(245,168,0,0.4)", icon: "○" },
  { id: "tread", name: "Tread", short: "01 — Tread", desc: "The road-contact surface. Deep circumferential grooves channel water away from the contact patch, while lateral sipes bite into loose or wet surfaces.", accentColor: "#FFD060", borderColor: "rgba(224,168,36,0.4)", icon: "⊟" },
  { id: "belt", name: "Steel Belts", short: "02 — Steel Belts", desc: "Two crossed layers of high-tensile steel cord bonded directly beneath the tread. They stabilise the footprint under load and at speed.", accentColor: "#6BA84F", borderColor: "rgba(107,168,79,0.4)", icon: "⊞" },
  { id: "sidewall", name: "Sidewall", short: "03 — Sidewall", desc: "Flexible rubber reinforced with textile cords. The sidewall absorbs road shocks, protects the internal structure, and carries all tyre markings.", accentColor: "#C8A040", borderColor: "rgba(200,160,64,0.4)", icon: "◎" },
  { id: "bead", name: "Bead", short: "04 — Bead", desc: "Bundles of high-tensile steel wire wrapped in rubber. The bead locks the tyre firmly onto the wheel rim, maintaining an airtight seal.", accentColor: "#D4A843", borderColor: "rgba(212,168,67,0.4)", icon: "●" },
  { id: "liner", name: "Inner Liner", short: "05 — Inner Liner", desc: "A smooth halobutyl rubber layer bonded to the inside of the carcass. It replaces the traditional inner tube in tubeless tyres.", accentColor: "#A07A20", borderColor: "rgba(160,122,32,0.4)", icon: "◉" },
] as const;

const LAYER_OFFSETS = [0, -88, -56, -32, -16, 10] as const;

function TyreSVG({ activeLayer }: { activeLayer: number }) {
  const layerColors = [
    { fill: "#1e1e22", stroke: "#555", rx: 148, ry: 42, id: "tread" },
    { fill: "#162016", stroke: "#4a7a30", rx: 136, ry: 34, id: "belt" },
    { fill: "#181820", stroke: "#8a6820", rx: 124, ry: 27, id: "sidewall" },
    { fill: "#120e1e", stroke: "#a08030", rx: 110, ry: 20, id: "bead" },
    { fill: "#1a0e14", stroke: "#7a6010", rx: 96, ry: 14, id: "liner" },
  ];

  const getLayerY = (layerIndex: number) => {
    if (activeLayer === 0) return 0;
    const explodedY = LAYER_OFFSETS[layerIndex + 1];
    if (layerIndex < activeLayer) return explodedY;
    return 0;
  };

  return (
    <svg viewBox="-180 -180 360 360" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <defs>
        <radialGradient id="rimGradEV" cx="38%" cy="32%" r="62%">
          <stop offset="0%" stopColor="#d0d4d9" /><stop offset="55%" stopColor="#72787f" /><stop offset="100%" stopColor="#22242a" />
        </radialGradient>
        <radialGradient id="hubGradEV" cx="36%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#c8ccd1" /><stop offset="70%" stopColor="#44484e" /><stop offset="100%" stopColor="#1e2024" />
        </radialGradient>
        <filter id="glowEV"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="activeGlow"><feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <ellipse cx="0" cy="148" rx="120" ry="10" fill="rgba(0,0,0,0.4)" />
      {[...layerColors].reverse().map((layer, revIdx) => {
        const idx = layerColors.length - 1 - revIdx;
        const layerNum = idx + 1;
        const isActive = activeLayer === layerNum;
        const accentColor = LAYERS[layerNum]?.accentColor ?? "#555";
        const yOff = getLayerY(idx);
        return (
          <motion.g key={layer.id} animate={{ y: yOff }} transition={{ type: "spring", stiffness: 80, damping: 22 }}>
            {isActive && <ellipse cx="0" cy="0" rx={layer.rx + 18} ry={layer.ry + 12} fill={`${accentColor}08`} stroke={accentColor} strokeWidth="1.5" strokeDasharray="6 4" filter="url(#activeGlow)" opacity="0.7" />}
            <ellipse cx="0" cy="0" rx={layer.rx} ry={layer.ry} fill={layer.fill} stroke={isActive ? accentColor : layer.stroke} strokeWidth={isActive ? 2 : 1} filter={isActive ? "url(#glowEV)" : undefined} />
          </motion.g>
        );
      })}
      <ellipse cx="0" cy="0" rx="88" ry="25" fill="url(#rimGradEV)" stroke="#3a3d42" strokeWidth="1.5" />
      <ellipse cx="0" cy="0" rx="28" ry="8" fill="url(#hubGradEV)" stroke="#2a2d32" strokeWidth="1" />
    </svg>
  );
}

/* ============================================================================
   LAYER IMAGES
   ========================================================================== */
const LAYER_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85",
  "https://images.unsplash.com/photo-1477823986828-5aff156284aa?w=900&q=85",
  "https://images.unsplash.com/photo-1567789884554-0b844b597180?w=900&q=85",
  "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&q=85",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=85",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=85",
];

/* ============================================================================
   EXPLODED TYRE VIEW — MOBILE
   ========================================================================== */
function ExplodedTyreViewMobile() {
  const T = useHomeT();
  return (
    <section id="anatomy" style={{ position: "relative", zIndex: 5, background: T.bg, borderTop: `1px solid ${T.hairline}`, padding: "60px 20px" }}>
      <p style={{ color: T.gradCyan, fontWeight: 700, letterSpacing: "0.3em", fontSize: 11, margin: "0 0 10px", textTransform: "uppercase" }}>Tyre Anatomy</p>
      <h2 style={{ margin: "0 0 10px", fontFamily: T.display, fontWeight: 900, fontSize: "clamp(28px,7vw,44px)", textTransform: "uppercase", lineHeight: 1.06, color: T.text }}>
        5 Components.<br />1 Perfect Tyre.
      </h2>
      <p style={{ fontSize: 16, lineHeight: 1.65, color: T.isDark ? "#C0C0C0" : "#3A3020", fontWeight: 400, margin: "0 0 28px" }}>Every layer engineered to work with the next.</p>
      <div style={{ width: "100%", height: 200, borderRadius: 14, overflow: "hidden", marginBottom: 24, position: "relative" }}>
        <img src={LAYER_IMAGES[0]} alt="Tyre" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: T.overlayFadeT }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {LAYERS.slice(1).map((layer) => (
          <div key={layer.id} style={{ padding: "16px 18px", borderRadius: 12, background: T.panel, border: `1px solid ${layer.accentColor}30`, backdropFilter: "blur(8px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 18, color: layer.accentColor }}>{layer.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: layer.accentColor }}>{layer.short}</span>
            </div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: T.isDark ? "#C0C0C0" : "#3A3020", fontWeight: 400 }}>{layer.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================================
   EXPLODED TYRE VIEW — DESKTOP
   FIX 1: Phase 0 text contrast in light mode — added frosted backdrop + dark text colours
   ========================================================================== */
function ExplodedTyreViewDesktop() {
  const T = useHomeT();
  const isDark = T.isDark;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState(0);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v < 0.1) { setPhase(0); setActiveLayer(0); }
      else if (v < 0.78) {
        setPhase(1);
        setActiveLayer(Math.min(5, Math.max(1, Math.ceil(((v - 0.1) / 0.68) * 5))));
      } else { setPhase(2); setActiveLayer(0); }
    });
    return unsub;
  }, [scrollYProgress]);

  const activeLayerData = activeLayer > 0 ? LAYERS[activeLayer as 1|2|3|4|5] : LAYERS[0];
  const imgIndex = phase === 1 && activeLayer > 0 ? activeLayer : 0;

  return (
    <section ref={sectionRef} id="anatomy" style={{ position: "relative", height: "700vh", background: T.bg, borderTop: `1px solid ${T.hairline}` }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Full-BG image */}
        <AnimatePresence>
          <motion.div
            key={`bg-img-${imgIndex}`}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, zIndex: 0 }}
          >
            <img src={LAYER_IMAGES[imgIndex]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0, background: T.overlayFadeR }} />
            <motion.div
              animate={{ opacity: phase === 1 ? 0.25 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, transparent 40%, ${activeLayerData.accentColor}33 100%)`, mixBlendMode: "screen" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Grain overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", opacity: 0.4, pointerEvents: "none" }} />

        {/* Split grid */}
        <div style={{ position: "relative", zIndex: 10, height: "100%", display: "grid", gridTemplateColumns: "52% 48%" }}>

          {/* ══ LEFT ══ */}
          <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>

            {/* ── PHASE 0 — FIX 1: added frosted glass backdrop in light mode + forced dark text ── */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "100%",
              display: "flex", flexDirection: "column", justifyContent: "center",
              padding: "0 clamp(28px,5vw,72px)",
              /* FIX: frosted backdrop so text is always legible in light mode */
              background: T.isDark ? "transparent" : "rgba(245,242,235,0.72)",
              backdropFilter: T.isDark ? "none" : "blur(6px)",
              WebkitBackdropFilter: T.isDark ? "none" : "blur(6px)",
              opacity: phase === 0 ? 1 : 0,
              pointerEvents: phase === 0 ? "auto" : "none",
              transition: "opacity 0.3s ease",
              zIndex: phase === 0 ? 2 : 0,
            }}>
              <p style={{ color: T.gradCyan, fontWeight: 700, letterSpacing: "0.32em", fontSize: 11, margin: "0 0 14px", textTransform: "uppercase" }}>Anatomy of a Tyre</p>
              {/* FIX: forced dark text in light mode */}
              <h2 style={{ margin: "0 0 28px", fontSize: "clamp(32px,4vw,62px)", lineHeight: 1.0, fontFamily: T.display, fontWeight: 900, textTransform: "uppercase", color: T.isDark ? T.text : "#1A1A14" }}>
                Engineering<br />Inside<br />Every Tyre
              </h2>
              <p style={{ fontSize: "clamp(16px,1.5vw,20px)", lineHeight: 1.75, color: T.isDark ? "#C8C8C8" : "#3A3020", margin: "0 0 36px", fontWeight: 400, maxWidth: 400 }}>
                {LAYERS[0].desc}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 22, height: 34, borderRadius: 11, border: `1.5px solid ${T.hairline}`, display: "flex", justifyContent: "center", paddingTop: 6 }}>
                  <span style={{ width: 3, height: 6, borderRadius: 2, background: T.gradCyan, animation: "ctsScrollDot 1.8s ease-in-out infinite" }} />
                </div>
                {/* FIX: darker label text in light mode */}
                <span style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: T.isDark ? "#C0C0C0" : "#4A3828" }}>Scroll to disassemble</span>
              </div>
            </div>

            {/* ── PHASE 1: layer detail ── */}
            <div style={{
              position: "absolute", top: 0, left: "clamp(28px,5vw,72px)", right: 0, height: "100%",
              display: "flex", flexDirection: "column", justifyContent: "center",
              opacity: phase === 1 && activeLayer > 0 ? 1 : 0,
              pointerEvents: phase === 1 && activeLayer > 0 ? "auto" : "none",
              transition: "opacity 0.25s ease",
              zIndex: phase === 1 ? 2 : 0,
            }}>
              <div style={{ width: 52, height: 3, borderRadius: 2, background: activeLayerData.accentColor, marginBottom: 18, transition: "background 0.3s" }} />
              <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.34em", textTransform: "uppercase", color: activeLayerData.accentColor, transition: "color 0.3s" }}>
                {activeLayerData.short}
              </p>
              <div style={{ overflow: "hidden", marginBottom: 28 }}>
                <h3 style={{ margin: 0, fontFamily: T.display, fontWeight: 900, fontSize: "clamp(36px,5.2vw,72px)", textTransform: "uppercase", lineHeight: 0.95, color: T.text, display: "block" }}>
                  {activeLayerData.name}
                </h3>
              </div>
              <div style={{ padding: "22px 26px", borderRadius: T.radiusLg, background: T.panelDeep, backdropFilter: "blur(20px)", border: `1px solid ${activeLayerData.borderColor}`, maxWidth: 480, boxShadow: `0 0 40px ${activeLayerData.accentColor}18`, transition: "border-color 0.3s, box-shadow 0.3s" }}>
<p style={{ margin: 0, fontSize: "clamp(16px,1.4vw,18px)", lineHeight: 1.8, color: T.text, fontWeight: 400 }}>{activeLayerData.desc}</p>
              </div>
              <div style={{ marginTop: 28, display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 999, background: `${activeLayerData.accentColor}18`, border: `1px solid ${activeLayerData.accentColor}44`, transition: "all 0.3s" }}>
                <span style={{ fontSize: 16, color: activeLayerData.accentColor }}>{activeLayerData.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: activeLayerData.accentColor }}>Layer {activeLayer} of 5</span>
              </div>
            </div>

            {/* ── PHASE 2: assembled ── */}
            <div style={{
              position: "absolute", top: 0, left: "clamp(28px,5vw,72px)", right: 0, height: "100%",
              display: "flex", flexDirection: "column", justifyContent: "center",
              opacity: phase === 2 ? 1 : 0,
              pointerEvents: phase === 2 ? "auto" : "none",
              transition: "opacity 0.3s ease",
              zIndex: phase === 2 ? 2 : 0,
            }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
                {LAYERS.slice(1).map((l) => (
                  <div key={l.id} style={{ padding: "5px 12px", borderRadius: 999, background: `${l.accentColor}1a`, border: `1px solid ${l.accentColor}55`, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: l.accentColor }}>
                    {l.name}
                  </div>
                ))}
              </div>
              <p style={{ color: T.gradCyan, fontWeight: 700, letterSpacing: "0.3em", fontSize: 11, margin: "0 0 12px", textTransform: "uppercase" }}>5 Components · 1 Perfect Tyre</p>
              <div style={{ overflow: "hidden", marginBottom: 22 }}>
                <h3 style={{ margin: 0, fontFamily: T.display, fontWeight: 900, fontSize: "clamp(32px,4.5vw,62px)", textTransform: "uppercase", lineHeight: 1.0, color: T.text }}>
                  Assembled.<br />Ready to Roll.
                </h3>
              </div>
              <p style={{ fontSize: "clamp(16px,1.4vw,18px)", lineHeight: 1.75, color: T.isDark ? "#C0C0C0" : "#3A3020", maxWidth: 420, margin: "0 0 28px", fontWeight: 400 }}>
                Every layer engineered to work with the next. Together, they deliver the grip, comfort, and safety you depend on — every road, every drive.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6BA84F", boxShadow: "0 0 10px #6BA84F", display: "block" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#6BA84F" }}>All 5 Systems Locked</span>
              </div>
            </div>
          </div>

          {/* ══ RIGHT ══ */}
          <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: "2%", bottom: "2%", width: "28%", height: "36%", borderRadius: "50%", background: `radial-gradient(circle, ${activeLayerData.accentColor}22, transparent 65%)`, filter: "blur(40px)", pointerEvents: "none", transition: "background 0.4s", opacity: phase === 1 ? 0.7 : 0.2 }} />
            {(() => {
              const positions = [
                { top: "6%",  right: "2%",  w: 190, h: 130 },
                { top: "22%", right: "2%",  w: 175, h: 118 },
                { top: "38%", right: "2%",  w: 182, h: 122 },
                { top: "54%", right: "2%",  w: 170, h: 115 },
                { top: "70%", right: "2%",  w: 178, h: 118 },
              ];
              return LAYERS.slice(1).map((layer, i) => {
                const pos = positions[i];
                const isActive = i + 1 === activeLayer;
                const visible = phase === 1;
                return (
                  <div key={`fcard-${layer.id}`} style={{ position: "absolute", top: pos.top, right: pos.right, width: pos.w, height: pos.h, borderRadius: 12, overflow: "hidden", border: `1.5px solid ${isActive && visible ? layer.accentColor : T.hairlineSub}`, boxShadow: isActive && visible ? `0 0 28px ${layer.accentColor}55, 0 12px 40px rgba(0,0,0,0.4)` : "0 4px 14px rgba(0,0,0,0.18)", opacity: visible ? (isActive ? 1 : 0.28) : 0, transform: visible ? (isActive ? "scale(1)" : "scale(0.93)") : "scale(0.93)", zIndex: isActive && visible ? 20 : 8, transition: "opacity 0.25s ease, transform 0.25s ease, border-color 0.3s, box-shadow 0.3s", pointerEvents: visible ? "auto" : "none" }}>
                    <img src={LAYER_IMAGES[i + 1]} alt={layer.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: isActive ? "grayscale(10%) contrast(1.1)" : "grayscale(85%)", transition: "filter 0.4s ease" }} />
                    <div style={{ position: "absolute", inset: 0, background: isActive && visible ? "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 60%, transparent)" : T.overlayImg }} />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: isActive && visible ? layer.accentColor : "transparent", transition: "background 0.3s" }} />
                    <div style={{ position: "absolute", bottom: 10, left: 12, right: 8 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: isActive && visible ? layer.accentColor : T.muted, marginBottom: 2 }}>{layer.short}</div>
                      <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 13, textTransform: "uppercase", color: isActive && visible ? "#fff" : T.muted }}>{layer.name}</div>
                    </div>
                  </div>
                );
              });
            })()}
            <div style={{ position: "absolute", inset: "5%", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr 1fr", gap: 6, borderRadius: 16, overflow: "hidden", zIndex: phase === 2 ? 15 : 0, opacity: phase === 2 ? 1 : 0, transition: "opacity 0.4s ease", pointerEvents: phase === 2 ? "auto" : "none" }}>
              {LAYERS.slice(1).map((l, i) => (
                <div key={l.id} style={{ position: "relative", overflow: "hidden", borderRadius: 8, gridColumn: i === 0 ? "1 / 3" : "auto" }}>
                  <img src={LAYER_IMAGES[i + 1]} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(30%) contrast(1.05)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }} />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: l.accentColor }} />
                  <div style={{ position: "absolute", bottom: 8, left: 10 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: l.accentColor }}>{l.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <motion.div
              animate={{ opacity: phase === 2 ? 0 : phase === 1 ? 0.75 : 1, scale: phase === 1 ? 0.9 : 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", bottom: "5%", right: "3%", width: "min(150px,15vw)", height: "min(150px,15vw)", zIndex: 2 }}
            >
              <TyreSVG activeLayer={phase === 1 ? activeLayer : 0} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExplodedTyreView() {
  const isMobile = useIsMobile();
  return isMobile ? <ExplodedTyreViewMobile /> : <ExplodedTyreViewDesktop />;
}

/* ============================================================================
   WHY CTS — ORBITAL PLANET LAYOUT
   FIX 2: Raised hub + satellites so they sit inside 100vh panel.
          SVG lines now use viewBox="0 0 100 100" matching % positions exactly.
   ========================================================================== */

const WHY_PLANETS = [
  { stat: "10,000+", label: "Tyres in Stock", desc: "Every premium brand, every size — always in stock, always ready.", accent: "#F5A800", c1: "#1a1100", c2: "#2a1a00", c3: "#F5A800", size: 200 },
  { stat: "Certified", label: "Expert Fitment", desc: "Trained technicians match the exact rubber to your ride and road.", accent: "#B0B0B0", c1: "#1a1a1a", c2: "#252525", c3: "#B0B0B0", size: 160 },
  { stat: "24h", label: "Next-Day Delivery", desc: "Order before midnight — tyres delivered and ready to fit by tomorrow.", accent: "#FFC040", c1: "#1a1200", c2: "#221800", c3: "#FFC040", size: 180 },
];

const HUB = { size: 280, c1: "#0f0e08", c2: "#1e1a0c", c3: "#F5A800" };

function TyreSphere({ size, c1, c2, c3, accent, label, stat, progress }:
  { size: number; c1: string; c2: string; c3: string; accent: string; label?: string; stat?: string; desc?: string; progress: number }) {
  const T = useHomeT();
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: "relative", width: size, height: size }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <motion.div
        animate={{ opacity: hovered ? 0.7 : 0.22, scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.5 }}
        style={{ position: "absolute", inset: -size * 0.1, borderRadius: "50%", background: `radial-gradient(circle, ${accent}44 0%, transparent 70%)`, filter: `blur(${size * 0.14}px)`, pointerEvents: "none" }}
      />
      <svg style={{ position: "absolute", inset: -size * 0.18, pointerEvents: "none", overflow: "visible" }} width={size * 1.36} height={size * 1.36} viewBox={`0 0 ${size * 1.36} ${size * 1.36}`}>
        <ellipse cx={size * 0.68} cy={size * 0.68} rx={size * 0.63} ry={size * 0.18} fill="none" stroke={`${accent}28`} strokeWidth="0.8" />
        <ellipse cx={size * 0.68} cy={size * 0.68} rx={size * 0.63} ry={size * 0.42} fill="none" stroke={`${accent}18`} strokeWidth="0.6" transform={`rotate(-25 ${size * 0.68} ${size * 0.68})`} />
      </svg>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, ${c3}55 0%, ${c2} 45%, ${c1} 82%)`,
        border: `1px solid ${accent}35`,
        boxShadow: `inset -${size*0.05}px -${size*0.04}px ${size*0.15}px rgba(0,0,0,0.75), inset ${size*0.04}px ${size*0.04}px ${size*0.1}px ${c3}22, 0 ${size*0.06}px ${size*0.22}px rgba(0,0,0,0.65)`,
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
      }}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: `${10 + i * 18}%`, top: "10%", width: "1px", height: "80%", background: `linear-gradient(to bottom, transparent, ${accent}15, transparent)`, transform: `rotate(${-15 + i * 8}deg)`, transformOrigin: "50% 0", pointerEvents: "none" }} />
        ))}
        <div style={{ position: "absolute", top: "10%", left: "18%", width: "26%", height: "16%", borderRadius: "50%", background: "rgba(255,255,255,0.14)", filter: "blur(4px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 50% 80%, rgba(0,0,0,0.45) 0%, transparent 60%)", pointerEvents: "none" }} />
        {label && (
          <motion.div
            animate={{ opacity: progress > 0.3 ? 1 : 0, scale: progress > 0.3 ? 1 : 0.7 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", zIndex: 2, padding: `0 ${size * 0.1}px` }}
          >
            {stat && (
              <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: `${Math.round(size * 0.19)}px`, lineHeight: 1, background: `linear-gradient(160deg, #fff 30%, ${accent} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: `${Math.round(size * 0.04)}px`, letterSpacing: "-0.02em" }}>
                {stat}
              </div>
            )}
            <div style={{ fontSize: `${Math.round(size * 0.07)}px`, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: accent, opacity: 0.9, lineHeight: 1.2 }}>
              {label}
            </div>
          </motion.div>
        )}
        {!label && (
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: `${Math.round(size * 0.13)}px`, letterSpacing: "0.22em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", lineHeight: 1, marginBottom: 4 }}>CTS</div>
            <div style={{ width: "100%", height: 1, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, marginBottom: 4 }} />
            <div style={{ fontSize: `${Math.round(size * 0.055)}px`, letterSpacing: "0.3em", color: `${accent}bb`, textTransform: "uppercase", fontWeight: 600 }}>Tyres</div>
          </div>
        )}
      </div>
    </div>
  );
}

const ORBITAL_STARS = Array.from({ length: 80 }, (_, i) => (
  <div key={i} style={{ position: "absolute", left: `${(i * 137.5) % 100}%`, top: `${(i * 97.3) % 100}%`, width: i % 5 === 0 ? 2 : 1, height: i % 5 === 0 ? 2 : 1, borderRadius: "50%", background: "rgba(255,255,255,0.4)", opacity: 0.3 + (i % 3) * 0.2 }} />
));

function WhyCtsMobile() {
  const T = useHomeT();
  return (
    <section id="whycts" style={{ position: "relative", zIndex: 5, padding: "60px 20px", background: T.bg, scrollMarginTop: 80 }}>
      <p style={{ color: T.gradCyan, fontWeight: 700, letterSpacing: "0.3em", fontSize: 11, margin: "0 0 10px", textTransform: "uppercase" }}>Why CTS</p>
      <h2 style={{ margin: "0 0 28px", fontFamily: T.display, fontWeight: 900, fontSize: "clamp(28px,7vw,44px)", textTransform: "uppercase", lineHeight: 1.06, color: T.text }}>
        Built on Trust<br />&amp; Performance
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {WHY_PLANETS.map((p, i) => (
          <div key={i} style={{ padding: "22px 20px", borderRadius: 14, background: T.panel, border: `1px solid ${p.accent}35`, backdropFilter: "blur(8px)" }}>
            <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: "clamp(30px,7vw,44px)", background: `linear-gradient(130deg,#fff 30%,${p.accent} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", lineHeight: 1, marginBottom: 6 }}>{p.stat}</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: p.accent, marginBottom: 10 }}>{p.label}</div>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: T.isDark ? "#C0C0C0" : "#3A3020", fontWeight: 400 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================================
   WHY CTS DESKTOP — FIX 2
   Hub: ly 30 → 22   |   Satellites: ly 72/80/72 → 60/68/60
   SVG lines: viewBox="0 0 100 100" with lx/ly used directly as % coords
   ========================================================================== */
function WhyCtsDesktop() {
  const T = useHomeT();

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const [progress, setProgress] = useState(0);
  const [activePlanet, setActivePlanet] = useState<number | null>(null);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setProgress(v);
      if (v < 0.25) setActivePlanet(null);
      else if (v < 0.5) setActivePlanet(0);
      else if (v < 0.75) setActivePlanet(1);
      else setActivePlanet(2);
    });
  }, [scrollYProgress]);

  const planetThresholds = [0.2, 0.38, 0.55];
  const hubProgress = Math.min(1, progress / 0.15);

  /* ── FIX 3: true centre alignment ── */
  // The left column is 60% of viewport wide, 100vh tall.
  // We use a viewBox="0 0 60 100" matching that aspect so lx/ly are in "col-percent" coords.
  // Hub at lx:30, ly:26 = horizontally centred in the 60-unit-wide box (30/60 = 50%),
  // vertically in the upper third. Satellites spread symmetrically around centre.
  const HUB_LOCAL  = { lx: 30, ly: 26 };
  const PLANETS_LOCAL = [
    { ...WHY_PLANETS[0], lx:  8, ly: 66 },  // left satellite
    { ...WHY_PLANETS[1], lx: 30, ly: 74 },  // centre satellite
    { ...WHY_PLANETS[2], lx: 52, ly: 66 },  // right satellite
  ];

  return (
    <section ref={sectionRef} id="whycts" className="cts-orbital-section" style={{ position: "relative", height: "500vh", scrollMarginTop: 80 }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: T.bg, display: "grid", gridTemplateColumns: "60% 40%" }}>

        {/* ── LEFT: orbital canvas ── */}
        <div className="cts-orbital-left" style={{ position: "relative", overflow: "hidden", height: "100%" }}>

          {/* Deep space bg */}
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 90% 70% at 50% 40%, ${T.isDark ? "rgba(30,8,8,0.85)" : "rgba(240,235,224,0.6)"} 0%, transparent 75%)` }} />
          {ORBITAL_STARS}

          {/* ── FIX 3: SVG viewBox="0 0 60 100" matches 60%-wide column aspect ratio ── */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            viewBox="0 0 60 100"
            preserveAspectRatio="none"
          >
            <defs>
              {PLANETS_LOCAL.map((p, i) => (
                <linearGradient
                  key={i} id={`lineGrad${i}`}
                  x1={`${HUB_LOCAL.lx}`} y1={`${HUB_LOCAL.ly}`}
                  x2={`${p.lx}`} y2={`${p.ly}`}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor={HUB.c3} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={p.accent} stopOpacity="0.3" />
                </linearGradient>
              ))}
            </defs>
            {PLANETS_LOCAL.map((planet, i) => {
              const t = planetThresholds[i];
              const lineProgress = Math.min(1, Math.max(0, (progress - t + 0.05) / 0.18));
              const hx = HUB_LOCAL.lx, hy = HUB_LOCAL.ly;
              const px = planet.lx,    py = planet.ly;
              const cx1 = hx + (px - hx) * 0.3;
              const cy1 = hy + (py - hy) * 0.55;
              const cx2 = hx + (px - hx) * 0.7;
              const cy2 = hy + (py - hy) * 0.75;
              return (
                <motion.path
                  key={i}
                  d={`M ${hx} ${hy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${px} ${py}`}
                  fill="none"
                  stroke={`url(#lineGrad${i})`}
                  strokeWidth="0.4"
                  strokeDasharray="2 3"
                  strokeLinecap="round"
                  animate={{ opacity: lineProgress }}
                  transition={{ duration: 0.4 }}
                />
              );
            })}
          </svg>

          {/* Hub sphere */}
          <motion.div
            animate={{ opacity: hubProgress, scale: 0.7 + hubProgress * 0.3, y: (1 - hubProgress) * -60 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", left: `${HUB_LOCAL.lx}%`, top: `${HUB_LOCAL.ly}%`, transform: "translate(-50%, -50%)", zIndex: 8 }}
          >
            <TyreSphere size={HUB.size} c1={HUB.c1} c2={HUB.c2} c3={HUB.c3} accent={HUB.c3} progress={hubProgress} />
          </motion.div>

          {/* Satellite planets */}
          {PLANETS_LOCAL.map((planet, i) => {
            const t = planetThresholds[i];
            const pct = Math.min(1, Math.max(0, (progress - t) / 0.2));
            const isActive = activePlanet === i;
            return (
              <motion.div
                key={planet.label}
                animate={{ opacity: pct, scale: 0.6 + pct * 0.4, y: (1 - pct) * 80 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "absolute", left: `${planet.lx}%`, top: `${planet.ly}%`, transform: "translate(-50%, -50%)", zIndex: isActive ? 10 : 5 }}
              >
                {isActive && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.3 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, ${planet.accent}55, transparent 70%)`, pointerEvents: "none" }}
                  />
                )}
                <TyreSphere
                  size={planet.size} c1={planet.c1} c2={planet.c2} c3={planet.c3}
                  accent={planet.accent} label={planet.label} stat={planet.stat}
                  desc={planet.desc} progress={pct}
                />
              </motion.div>
            );
          })}

          {/* Dot indicators */}
          <div style={{ position: "absolute", left: 32, bottom: 36, display: "flex", gap: 8, alignItems: "center", zIndex: 20 }}>
            {WHY_PLANETS.map((p, i) => (
              <div key={i} style={{ width: activePlanet === i ? 24 : 7, height: 7, borderRadius: 999, background: activePlanet === i ? p.accent : T.hairlineSub, transition: "all 0.35s ease", boxShadow: activePlanet === i ? `0 0 10px ${p.accent}` : "none" }} />
            ))}
          </div>
        </div>

        {/* ── RIGHT: heading + detail panel ── */}
        <div className="cts-orbital-right" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(40px,6vw,80px) clamp(36px,5vw,64px)", borderLeft: `1px solid ${T.hairline}`, position: "relative", zIndex: 20, minHeight: 0 }}>
          <motion.div animate={{ opacity: hubProgress, x: (1 - hubProgress) * 30 }}>
            <p style={{ color: T.gradCyan, fontWeight: 700, letterSpacing: "0.3em", fontSize: 11, margin: "0 0 14px", textTransform: "uppercase" }}>Why CTS</p>
            <h2 style={{ margin: "0 0 20px", fontFamily: T.display, fontWeight: 900, fontSize: "clamp(26px,3.2vw,48px)", textTransform: "uppercase", lineHeight: 1.06, color: T.text }}>
              Built on Trust<br />&amp; Performance
            </h2>
            <div style={{ width: 48, height: 3, borderRadius: 2, background: T.accent, marginBottom: 28 }} />
          </motion.div>

          <AnimatePresence mode="wait">
            {activePlanet !== null ? (
              <motion.div
                key={activePlanet}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "flex", flexDirection: "column", gap: 0 }}
              >
                <div style={{ width: 44, height: 3, borderRadius: 2, background: WHY_PLANETS[activePlanet].accent, marginBottom: 16 }} />
                <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: WHY_PLANETS[activePlanet].accent }}>
                  {String(activePlanet + 1).padStart(2, "0")} — {WHY_PLANETS[activePlanet].label}
                </p>
                <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: "clamp(36px,4.5vw,58px)", lineHeight: 1, background: `linear-gradient(130deg, ${T.text} 30%, ${WHY_PLANETS[activePlanet].accent} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 18 }}>
                  {WHY_PLANETS[activePlanet].stat}
                </div>
                <p style={{ margin: "0 0 24px", fontSize: "clamp(16px,1.5vw,18px)", lineHeight: 1.72, color: T.isDark ? "#C8C8C8" : "#3A3020", fontWeight: 400, maxWidth: 340 }}>
                  {WHY_PLANETS[activePlanet].desc}
                </p>
                <AnimatedButton href="#finder" variant="solid" color={WHY_PLANETS[activePlanet].accent} glow={`${WHY_PLANETS[activePlanet].accent}44`} size="sm" style={{ width: "fit-content" }}>
                  Find My Tyre →
                </AnimatedButton>
              </motion.div>
            ) : (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: hubProgress }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <p style={{ fontSize: "clamp(16px,1.5vw,19px)", lineHeight: 1.75, color: T.isDark ? "#C8C8C8" : "#3A3020", fontWeight: 400, margin: 0 }}>
                  Three pillars that separate CTS from the rest — scroll to explore each one.
                </p>
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} style={{ marginTop: 24, fontSize: 14, letterSpacing: "0.2em", color: T.isDark ? "#C0C0C0" : "#4A3828", textTransform: "uppercase" }}>
                  ↓ keep scrolling
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function WhyCtsOrbitalSection() {
  const isMobile = useIsMobile();
  return isMobile ? <WhyCtsMobile /> : <WhyCtsDesktop />;
}

/* ============================================================================
   CATEGORY CARD SWAP SECTION
   ========================================================================== */
const CARD_COLORS = ["#F5A800", "#888888", "#FFC040", "#F5A800", "#888888", "#FFC040"];
const CAT_CARD_W = 400;
const CAT_CARD_H = 320;
const CAT_OFFSET_X = 24;
const CAT_OFFSET_Y = 18;
const CAT_VISIBLE = 4;

function CategoryCardSwapSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const T = useHomeT();
  const [order, setOrder] = useState<number[]>(CATEGORIES.map((_, i) => i));
  const [exiting, setExiting] = useState<number | null>(null);
  const paused = useRef(false);
  const activeIdx = order[0];
  const accent = CARD_COLORS[activeIdx % CARD_COLORS.length];

  const doSwap = useCallback(() => {
    if (paused.current) return;
    setOrder((prev) => {
      const [first, ...rest] = prev;
      setExiting(first);
      setTimeout(() => {
        setOrder([...rest, first]);
        setExiting(null);
      }, 420);
      return prev;
    });
  }, []);

  useEffect(() => {
    const id = setInterval(doSwap, 3500);
    return () => clearInterval(id);
  }, [doSwap]);

  const containerW = CAT_CARD_W + CAT_OFFSET_X * (CAT_VISIBLE - 1) + 32;
  const containerH = CAT_CARD_H + CAT_OFFSET_Y * (CAT_VISIBLE - 1) + 32;

  return (
    <section id="categories" style={{ position: "relative", zIndex: 5, scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(40px,7vw,90px) clamp(20px,5vw,40px) 40px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20 }}>
          <div style={{ maxWidth: 620 }}>
            <p style={{ color: T.gradCyan, fontWeight: 700, letterSpacing: "0.3em", fontSize: 12, margin: "0 0 14px", textTransform: "uppercase" }}>Our Range</p>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,4.6vw,58px)", lineHeight: 1.04, fontFamily: T.display, fontWeight: 900, textTransform: "uppercase" }}>Shop by Category</h2>
          </div>
          <p style={{ fontSize: 17, color: T.isDark ? "#C8C8C8" : "#3A3020", maxWidth: 360, lineHeight: 1.55, margin: 0, fontWeight: 400 }}>
            From everyday comfort to track-grade performance — precision-matched rubber for every machine.
          </p>
        </div>
      </div>

      <div className="cts-cat-grid" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,40px) clamp(60px,8vw,100px)", display: "grid", gridTemplateColumns: `${containerW}px 1fr`, gap: "clamp(32px,5vw,80px)", alignItems: "center" }}>
        <div className="cts-cat-card-stack" style={{ position: "relative", width: containerW, height: containerH, flexShrink: 0 }}
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
        >
          {[...order].reverse().map((catIdx) => {
            const slotIdx = order.indexOf(catIdx);
            const isExiting = exiting === catIdx;
            const isVisible = slotIdx < CAT_VISIBLE;
            const cat = CATEGORIES[catIdx];
            const a = CARD_COLORS[catIdx % CARD_COLORS.length];
            const targetX = slotIdx * CAT_OFFSET_X;
            const targetY = (CAT_VISIBLE - 1 - slotIdx) * CAT_OFFSET_Y;
            const targetScale = 1 - slotIdx * 0.04;
            const targetOpacity = isVisible ? 1 - slotIdx * 0.04 : 0;

            return (
              <motion.div
                key={catIdx}
                style={{ position: "absolute", bottom: 0, left: 0, width: CAT_CARD_W, height: CAT_CARD_H, borderRadius: 18, overflow: "hidden", cursor: slotIdx === 0 ? "default" : "pointer", boxShadow: slotIdx === 0 ? `0 28px 70px rgba(0,0,0,0.75), 0 0 0 1px ${a}22` : "0 12px 40px rgba(0,0,0,0.5)" }}
                animate={isExiting ? {
                  x: -CAT_CARD_W * 0.55, y: CAT_CARD_H * 0.3, opacity: 0, scale: 0.88,
                  transition: { duration: 0.38, ease: [0.4, 0, 1, 1] },
                } : {
                  x: targetX, y: -targetY, scale: targetScale, opacity: targetOpacity,
                  zIndex: CAT_VISIBLE - slotIdx + (isExiting ? -1 : 0),
                  transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
                }}
                onClick={() => {
                  if (slotIdx > 0) {
                    setOrder((prev) => {
                      const without = prev.filter((x) => x !== catIdx);
                      return [catIdx, ...without];
                    });
                  }
                }}
              >
                <img src={cat.image} alt={cat.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: slotIdx === 0 ? "grayscale(50%)" : "grayscale(90%)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${a}, transparent 70%)` }} />
                <div style={{ position: "absolute", top: 18, left: 18, width: 38, height: 38, borderRadius: "50%", background: a, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.display, fontWeight: 700, fontSize: 13, color: "#fff", boxShadow: `0 0 16px ${a}99` }}>
                  {String(catIdx + 1).padStart(2, "0")}
                </div>
                {slotIdx === 0 && (
                  <div style={{ position: "absolute", bottom: 20, left: 20, fontFamily: T.display, fontWeight: 900, fontSize: "clamp(20px,2.6vw,32px)", textTransform: "uppercase", color: "#fff", lineHeight: 1, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
                    {cat.title}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeIdx} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ width: 52, height: 3, borderRadius: 2, background: accent }} />
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: accent }}>
                {String(activeIdx + 1).padStart(2, "0")} — {CATEGORIES[activeIdx].title}
              </p>
              <h3 style={{ margin: 0, fontFamily: T.display, fontWeight: 900, fontSize: "clamp(28px,4vw,56px)", textTransform: "uppercase", lineHeight: 1.04, color: T.text }}>
                {CATEGORIES[activeIdx].title}
              </h3>
              <p style={{ margin: 0, fontSize: "clamp(16px,1.5vw,19px)", lineHeight: 1.75, color: T.isDark ? "#C8C8C8" : "#3A3020", maxWidth: 400, fontWeight: 400 }}>
                {CATEGORIES[activeIdx].desc}
              </p>
              <div style={{ marginTop: 4 }}>
                <AnimatedButton onClick={() => navigate(ROUTES.tyres)} variant="solid" color={accent} glow={`${accent}55`} size="sm">
                  Browse {CATEGORIES[activeIdx].title} →
                </AnimatedButton>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                {CATEGORIES.map((_, di) => (
                  <button key={di} onClick={() => { setOrder((prev) => { const without = prev.filter((x) => x !== di); return [di, ...without]; }); }} style={{ width: di === activeIdx ? 22 : 6, height: 6, borderRadius: 999, border: "none", cursor: "pointer", padding: 0, background: di === activeIdx ? accent : "rgba(255,255,255,0.18)", transition: "all 0.3s ease" }} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cts-cat-grid { grid-template-columns: 1fr !important; justify-items: center; }
          .cts-cat-card-stack { width: 100% !important; max-width: 400px; height: auto !important; min-height: ${containerH}px; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================================
   TYRE PARTS WHEEL
   ========================================================================== */
const TYRE_PARTS = [
  { id: "valve", label: "Valve", icon: "▼", desc: "Controls air pressure", angle: 85, lineEnd: 0.72, side: "right" as const },
  { id: "tread", label: "Tread", icon: "⊟", desc: "Road contact surface", angle: 148, lineEnd: 0.88, side: "left" as const },
  { id: "sidewall", label: "Sidewall", icon: "◎", desc: "Absorbs road shocks", angle: 200, lineEnd: 0.82, side: "left" as const },
  { id: "innerliner", label: "Inner Liner", icon: "○", desc: "Replaces inner tube", angle: 255, lineEnd: 0.68, side: "left" as const },
  { id: "steelbelt", label: "Steel Belt", icon: "⊞", desc: "High-tensile stability", angle: 335, lineEnd: 0.78, side: "right" as const },
  { id: "beadwire", label: "Bead Wire", icon: "●", desc: "Locks tyre to rim", angle: 30, lineEnd: 0.62, side: "right" as const },
];

function TyrePartsWheel() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(true);
  const NUM_TREAD = 52, NUM_SPOKES = 6;
  const CX = 250, CY = 250;
  const TYRE_OR = 215, TYRE_IR = 155;
  const RIM_OR = 152, RIM_IR = 58;
  const HUB_R = 16;

  const toPoint = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }} onClick={() => setSpinning(s => !s)}>
      <div style={{ position: "absolute", inset: "-20%", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,168,0,0.30) 0%, rgba(245,168,0,0.08) 44%, transparent 68%)", filter: "blur(60px)", animation: "ctsGlowPulse 3s ease-in-out infinite", pointerEvents: "none" }} />
      <svg viewBox="-120 -60 740 620" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <filter id="tw-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="tw-ringGlow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="tw-hubGlow" x="-100%" y="-100%" width="400%" height="400%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <radialGradient id="tw-tyreFill" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1c1c1c" /><stop offset="100%" stopColor="#060606" /></radialGradient>
          <radialGradient id="tw-rimFill" cx="40%" cy="36%" r="62%"><stop offset="0%" stopColor="#252525" /><stop offset="60%" stopColor="#121212" /><stop offset="100%" stopColor="#060606" /></radialGradient>
        </defs>
        <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: spinning ? "ctsSpinW 9s linear infinite" : "none", transition: "animation 0.3s" }}>
          <circle cx={CX} cy={CY} r={TYRE_OR} fill="url(#tw-tyreFill)" />
          <circle cx={CX} cy={CY} r={TYRE_IR} fill="#080808" />
          {Array.from({ length: NUM_TREAD }, (_, i) => {
            const angle = (i / NUM_TREAD) * 2 * Math.PI;
            const isMajor = i % 4 === 0;
            const ir = isMajor ? TYRE_IR + 5 : TYRE_IR + 9;
            const or2 = isMajor ? TYRE_OR - 5 : TYRE_OR - 13;
            return <line key={i} x1={CX + ir * Math.cos(angle)} y1={CY + ir * Math.sin(angle)} x2={CX + or2 * Math.cos(angle)} y2={CY + or2 * Math.sin(angle)} stroke={isMajor ? "#F5A800" : "#8A5A00"} strokeWidth={isMajor ? 3.5 : 2} strokeLinecap="round" opacity={isMajor ? 0.9 : 0.5} filter={isMajor ? "url(#tw-glow)" : undefined} />;
          })}
          <circle cx={CX} cy={CY} r={TYRE_IR + 20} fill="none" stroke="#C47800" strokeWidth="1.2" strokeDasharray="7 9" strokeLinecap="round" opacity={0.3} />
          <circle cx={CX} cy={CY} r={RIM_OR} fill="url(#tw-rimFill)" />
          <circle cx={CX} cy={CY} r={RIM_OR} fill="none" stroke="#F5A800" strokeWidth="2" opacity={0.65} filter="url(#tw-ringGlow)" />
          {Array.from({ length: NUM_SPOKES }, (_, i) => {
            const a = (i / NUM_SPOKES) * 2 * Math.PI;
            const x1 = CX + HUB_R * 1.6 * Math.cos(a), y1 = CY + HUB_R * 1.6 * Math.sin(a);
            const x2 = CX + (RIM_OR - 9) * Math.cos(a), y2 = CY + (RIM_OR - 9) * Math.sin(a);
            return <g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFB000" strokeWidth={11} strokeLinecap="round" opacity={0.18} filter="url(#tw-glow)" /><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F5A800" strokeWidth={5} strokeLinecap="round" opacity={0.95} filter="url(#tw-glow)" /></g>;
          })}
          {Array.from({ length: NUM_SPOKES }, (_, i) => {
            const a = ((i + 0.5) / NUM_SPOKES) * 2 * Math.PI;
            const br = RIM_IR + 22;
            return <circle key={i} cx={CX + br * Math.cos(a)} cy={CY + br * Math.sin(a)} r={5} fill="#C9A84C" opacity={0.75} />;
          })}
          <circle cx={CX} cy={CY} r={HUB_R + 9} fill="#141414" stroke="#F5A800" strokeWidth="2" opacity={0.85} filter="url(#tw-hubGlow)" />
          <circle cx={CX} cy={CY} r={HUB_R} fill="#F5A800" filter="url(#tw-hubGlow)" />
          <circle cx={CX} cy={CY} r={HUB_R * 0.42} fill="#FFD080" opacity={0.9} />
        </g>
        <circle cx={CX} cy={CY} r={TYRE_OR + 7} fill="none" stroke="#F5A800" strokeWidth="2.5" opacity={0.45} filter="url(#tw-ringGlow)" style={{ animation: "ctsGlowPulse 2.4s ease-in-out infinite" }} />
        <circle cx={CX} cy={CY} r={TYRE_OR + 22} fill="none" stroke="#F5A800" strokeWidth="1" opacity={0.18} style={{ animation: "ctsGlowPulse 3.8s ease-in-out infinite 0.6s" }} />
        {TYRE_PARTS.map((part) => {
          const isHov = hovered === part.id;
          const edgePt = toPoint(part.angle, TYRE_OR + 4);
          const midPt = toPoint(part.angle, TYRE_OR + 42);
          const cardR = TYRE_OR + 118;
          const cardPt = toPoint(part.angle, cardR);
          const cardW = 110, cardH = 52;
          const cardX = part.side === "right" ? cardPt.x + 6 : cardPt.x - cardW - 6;
          const cardY = cardPt.y - cardH / 2;
          const lineEndX = part.side === "right" ? cardX : cardX + cardW;
          const lineEndY = cardPt.y;
          return (
            <g key={part.id} onMouseEnter={() => setHovered(part.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              <polyline points={`${edgePt.x},${edgePt.y} ${midPt.x},${midPt.y} ${lineEndX},${lineEndY}`} fill="none" stroke={isHov ? "#FFC040" : "#F5A800"} strokeWidth={isHov ? 1.8 : 1.2} strokeDasharray="4 5" strokeLinecap="round" opacity={isHov ? 0.9 : 0.5} />
              <circle cx={edgePt.x} cy={edgePt.y} r={isHov ? 5 : 3.5} fill={isHov ? "#FFC040" : "#F5A800"} filter={isHov ? "url(#tw-glow)" : undefined} opacity={isHov ? 1 : 0.7} />
              <rect x={cardX} y={cardY} width={cardW} height={cardH} rx={8} fill={isHov ? "rgba(245,168,0,0.18)" : "rgba(20,10,10,0.82)"} stroke={isHov ? "#FFC040" : "rgba(245,168,0,0.45)"} strokeWidth={isHov ? 1.5 : 1} />
              <text x={cardX + (part.side === "right" ? 16 : cardW - 16)} y={cardY + 19} textAnchor="middle" fill={isHov ? "#FFD060" : "#F5A800"} fontSize="14" fontWeight="bold">{part.icon}</text>
              <text x={cardX + (part.side === "right" ? 30 : 8)} y={cardY + 18} fill={isHov ? "#FFFFFF" : "#CCCCCC"} fontSize="11" fontWeight="700" fontFamily="'Oswald', sans-serif" letterSpacing="0.06em">{part.label.toUpperCase()}</text>
              <text x={cardX + (part.side === "right" ? 30 : 8)} y={cardY + 33} fill={isHov ? "rgba(255,180,180,0.9)" : "rgba(150,100,100,0.8)"} fontSize="9" fontFamily="'Manrope', sans-serif">{part.desc}</text>
            </g>
          );
        })}
        <text x={CX} y={CY + 8} textAnchor="middle" fill="rgba(245,168,0,0.35)" fontSize="10" fontFamily="'Oswald', sans-serif" letterSpacing="0.18em">C T S</text>
      </svg>
      <div style={{ position: "absolute", bottom: "-8%", left: "50%", transform: "translateX(-50%)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,168,0,0.4)", whiteSpace: "nowrap", pointerEvents: "none" }}>
        click to pause · hover parts
      </div>
    </div>
  );
}

/* ============================================================================
   TYRE HERO STRIP 2
   ========================================================================== */
function TyreHeroStrip2() {
  const T = useHomeT();
  const isDark = T.isDark;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textX = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 5, height: "clamp(260px,40vw,480px)", overflow: "hidden" }}>
      <motion.div style={{ position: "absolute", inset: "-15%", y: imgY }}>
        <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=85" alt="Performance car" style={{ width: "100%", height: "130%", objectFit: "cover", filter: "grayscale(55%) contrast(1.15)", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: T.isDark ? "linear-gradient(to left, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.55) 40%, rgba(8,8,8,0.2) 70%, rgba(8,8,8,0.7) 100%)" : "linear-gradient(to left, rgba(245,242,235,0.92) 0%, rgba(245,242,235,0.55) 40%, rgba(245,242,235,0.2) 70%, rgba(245,242,235,0.7) 100%)" }} />
      </motion.div>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(to bottom, transparent, #F5A800, transparent)" }} />
      <motion.div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", x: textX, opacity }}>
        <div style={{ padding: "0 clamp(24px,7vw,100px)", maxWidth: 740, textAlign: "right" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#F5A800", fontWeight: 700, marginBottom: 14 }}>Performance Range</div>
          <h2 style={{ fontFamily: T.display, fontWeight: 900, fontSize: "clamp(28px,5vw,72px)", textTransform: "uppercase", lineHeight: 0.95, color: "#fff", margin: "0 0 18px" }}>
            DRIVEN BY<br /><span style={{ color: "#F5A800" }}>PERFORMANCE.</span>
          </h2>
          <p style={{ fontSize: "clamp(16px,1.5vw,19px)", color: "rgba(255,255,255,0.85)", maxWidth: 400, lineHeight: 1.7, fontWeight: 400, marginLeft: "auto" }}>
            High-speed rubber engineered for sports cars and precision track-day driving.
          </p>
        </div>
      </motion.div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(245,168,0,0.4), transparent)" }} />
    </div>
  );
}

/* ============================================================================
   HOME — main page component
   ========================================================================== */
export default function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const T = useMemo(() => getT(isDark), [isDark]);

  const [mouseX, setMouseX] = useState(0.5);
  const [mouseY, setMouseY] = useState(0.5);
  const mouseXSpring = useSpring(0.5, { stiffness: 60, damping: 25 });
  const mouseYSpring = useSpring(0.5, { stiffness: 60, damping: 25 });

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let mx = 0, my = 0, sy = 0, raf = 0;
    const frame = () => {
      raf = 0;
      const els = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"));
      els.forEach((el) => {
        const sp = parseFloat(el.dataset.speed || "0.12");
        const dp = parseFloat(el.dataset.depth || "24");
        const base = el.dataset.base || "";
        el.style.transform = `${base} translate3d(${(mx * dp).toFixed(1)}px, ${(sy * sp + my * dp).toFixed(1)}px, 0)`;
      });
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onScroll = () => { sy = window.scrollY || 0; queue(); };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      setMouseX(e.clientX / window.innerWidth);
      setMouseY(e.clientY / window.innerHeight);
      mouseXSpring.set(e.clientX / window.innerWidth);
      mouseYSpring.set(e.clientY / window.innerHeight);
      queue();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    frame();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mouseXSpring, mouseYSpring]);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [tyre, setTyre] = useState("");
  const allBrands = useMemo(() => uniq(TYRE_DATA.map((d) => d.brand)).sort(), []);
  const models = useMemo(() => (brand ? uniq(TYRE_DATA.filter((d) => d.brand === brand).map((d) => d.model)).sort() : []), [brand]);
  const tyres = useMemo(() => (brand && model ? uniq(TYRE_DATA.filter((d) => d.brand === brand && d.model === model).map((d) => d.tyre)).sort() : []), [brand, model]);

  const [cur, setCur] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCur((c) => (c + 1) % REVIEWS.length), 4600);
    return () => clearInterval(id);
  }, [cur]);

  const labelKicker: React.CSSProperties = {
    color: T.gradCyan, fontWeight: 700, letterSpacing: "0.3em",
    fontSize: 12, margin: "0 0 14px", textTransform: "uppercase",
  };

  const h2: React.CSSProperties = {
    margin: 0, fontSize: "clamp(28px,4.6vw,58px)", lineHeight: 1.04,
    fontFamily: T.display, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.005em",
  };

  const cssVars: React.CSSProperties = {
    "--cv-bg":             isDark ? "#080808"                    : "#F5F2EB",
    "--cv-text":           isDark ? "#FFFFFF"                    : "#1A1A14",
    "--cv-muted":          isDark ? "#8A8A8A"                    : "#6B6550",
    "--cv-accent":         isDark ? "#F5A800"                    : "#C8880A",
    "--cv-hairline":       isDark ? "rgba(245,168,0,0.12)"      : "rgba(200,136,10,0.16)",
    "--cts-panel-glass":   isDark ? "rgba(17,17,17,0.72)"       : "rgba(255,255,255,0.88)",
    "--cts-panel":         isDark ? "rgba(17,17,17,0.82)"       : "rgba(255,255,255,0.92)",
    "--cts-hairline-sub":  isDark ? "rgba(255,255,255,0.08)"    : "rgba(0,0,0,0.08)",
    "--cts-surface":       isDark ? "rgba(255,255,255,0.04)"    : "rgba(0,0,0,0.04)",
    "--cts-text-sub":      isDark ? "rgba(255,255,255,0.65)"    : "rgba(26,26,20,0.65)",
  } as React.CSSProperties;

  return (
    <HomeTheme.Provider value={T}>
    <div
      ref={rootRef}
      data-home-root=""
      style={{ position: "relative", minHeight: "100vh", overflowX: "clip", color: T.text, fontFamily: T.body, background: T.bg, ...cssVars }}
    >
      <ScrollProgressBar />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Aspekta:wght@300;500;700;900&family=Oswald:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes ctsSpin{to{transform:rotate(360deg);}}
        @keyframes ctsSpinR{to{transform:rotate(-360deg);}}
        @keyframes ctsBob{0%,100%{transform:translateY(0) rotateZ(0deg);}50%{transform:translateY(-18px) rotateZ(1.5deg);}}
        @keyframes ctsGlowPulse{0%,100%{opacity:.45;transform:scale(1);}50%{opacity:.85;transform:scale(1.12);}}
        @keyframes ctsScrollDot{0%{transform:translateY(0);opacity:0;}30%{opacity:1;}80%{transform:translateY(20px);opacity:0;}100%{opacity:0;}}
        @keyframes ctsMarquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        @keyframes ctsRingExpand{0%{transform:scale(0.6);opacity:0.8;}100%{transform:scale(2.2);opacity:0;}}
        @keyframes ctsScanLine{0%{transform:translateY(-100%);}100%{transform:translateY(200vh);}}
        @keyframes ctsFlicker{0%,95%,100%{opacity:1;}96%{opacity:0.85;}97%{opacity:1;}98%{opacity:0.9;}}
        @keyframes ctsCrosshairRotate{to{transform:rotate(360deg);}}
        @keyframes ctsGradientShift{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
        @keyframes ctsSpinW{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes ctsMarqueeR{from{transform:translateX(-50%);}to{transform:translateX(0);}}
        *{box-sizing:border-box;}

        .cts-tyre{position:relative;width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 38% 30%,#44444a 0%,#1c1c20 40%,#050505 73%);box-shadow:inset 0 0 44px rgba(0,0,0,.92),inset 10px 12px 34px rgba(255,255,255,.05),0 50px 90px rgba(0,0,0,.65);}
        .cts-tread{position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(#050505 0 5deg,#1a1a1f 5deg 10deg);-webkit-mask:radial-gradient(circle,transparent 0 71%,#000 72%);mask:radial-gradient(circle,transparent 0 71%,#000 72%);opacity:.92;}
        .cts-rim{position:absolute;inset:23%;border-radius:50%;background:conic-gradient(from 90deg,#dfe3e8,#80868e,#f1f4f7,#6b7077,#cdd1d6,#7a7f86,#eaedf0,#74797f,#dfe3e8);box-shadow:inset 0 0 20px rgba(0,0,0,.55),0 0 0 3px #050505,inset 0 0 0 6px rgba(255,255,255,.16);}
        .cts-spokes{position:absolute;inset:7%;border-radius:50%;background:repeating-conic-gradient(rgba(10,10,12,0) 0 24deg,rgba(5,5,5,.88) 30deg 36deg);-webkit-mask:radial-gradient(circle,#000 0 58%,transparent 60%);mask:radial-gradient(circle,#000 0 58%,transparent 60%);}
        .cts-hub{position:absolute;inset:38%;border-radius:50%;background:radial-gradient(circle at 40% 34%,#d3d7dc,#4a4e54 68%,#26282c);box-shadow:0 0 0 4px rgba(5,5,5,.92),inset 0 0 11px rgba(0,0,0,.6);}
        .cts-caliper{position:absolute;inset:30%;border-radius:50%;background:conic-gradient(from 200deg,transparent 0 70%,#F5A800 72% 88%,transparent 90%);-webkit-mask:radial-gradient(circle,transparent 0 64%,#000 66% 78%,transparent 80%);mask:radial-gradient(circle,transparent 0 64%,#000 66% 78%,transparent 80%);opacity:.8;}

        .cts-cube-face{position:absolute;width:100%;height:100%;overflow:hidden;border:1px solid rgba(255,255,255,0.1);backface-visibility:hidden;}
        .cts-cube-img{width:100%;height:100%;object-fit:cover;display:block;}
        .cts-cube-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(5,5,5,0.3),rgba(5,5,5,0.6));}
        .cts-cube-label{position:absolute;bottom:20px;left:0;right:0;text-align:center;font-family:'Aspekta','Oswald',sans-serif;font-weight:700;font-size:clamp(16px,2.2vw,24px);letter-spacing:0.2em;color:#fff;text-transform:uppercase;}

        .cts-scan-line{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(245,168,0,0.2),transparent);animation:ctsScanLine 8s linear infinite;pointer-events:none;z-index:2;}
        .cts-flicker{animation:ctsFlicker 8s ease-in-out infinite;}

        .cts-grad-btn{position:relative;overflow:hidden;background:linear-gradient(to right,#F5A800,#FFB830,#C47800,#F5A800);background-size:300% 100%;animation:ctsGradientShift 6s ease infinite;transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease;color:#0D0C08!important;}
        .cts-grad-btn:hover{transform:scale(1.04) translateY(-2px);box-shadow:0 20px 50px rgba(245,168,0,0.45);}

        .cts-anim-btn{will-change:transform;}
        .cts-anim-btn-shine{position:absolute;top:0;left:-60%;width:35%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,0.45),transparent);transform:skewX(-18deg);transition:left .65s cubic-bezier(.22,1,.36,1);pointer-events:none;z-index:1;}
        .cts-anim-btn:hover .cts-anim-btn-shine{left:130%;}
        .cts-anim-btn-ripple{position:absolute;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.55);transform:translate(-50%,-50%);pointer-events:none;z-index:1;}
        .cts-anim-btn--primary{animation:ctsGradientShift 5s ease infinite;}
        .cts-anim-btn--primary:hover{box-shadow:0 18px 46px rgba(245,168,0,0.45);}
        .cts-anim-btn--secondary{transition:border-color .3s ease,box-shadow .3s ease;}
        .cts-anim-btn--secondary:hover{border-color:rgba(245,168,0,0.5);box-shadow:0 0 26px rgba(245,168,0,0.18);}
        .cts-anim-btn--solid{transition:filter .3s ease;}
        .cts-anim-btn--solid:hover{filter:brightness(1.1);}
        .cts-review-nav{transition:transform .3s cubic-bezier(.22,1,.36,1),border-color .3s ease,box-shadow .3s ease;}
        .cts-review-nav:hover{transform:scale(1.1);border-color:rgba(245,168,0,0.5);box-shadow:0 0 20px rgba(245,168,0,0.25);}

        .cts-finder-grid{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;align-items:end;}
        .cts-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
        .cts-nav-links{display:flex;align-items:center;gap:34px;}
        .cts-card{transition:transform .4s cubic-bezier(.22,1,.36,1),box-shadow .4s ease;}
        .cts-card:hover{transform:translateY(-8px);box-shadow:0 30px 60px rgba(0,0,0,.5);}
        .cts-cta-btns{display:flex;flex-wrap:wrap;gap:14px;}
        .cts-hero-content{position:relative;z-index:5;max-width:720px;}
        .cts-hero-mobile-visual{display:none;}
        .cts-scroll-indicator{display:flex;}

        @media(max-width:860px){
          .cts-nav-links{display:none;}
          .cts-finder-grid{grid-template-columns:1fr;gap:10px;}
          .cts-finder-btn{width:100%;height:52px;}
          .cts-stats-grid{grid-template-columns:repeat(2,1fr);}
          .cts-hero-section{flex-direction:column;justify-content:center;padding-top:100px!important;padding-bottom:40px!important;gap:40px!important;}
          .cts-hero-content{max-width:100%!important;text-align:center;}
          .cts-hero-cta-row{justify-content:center;}
          .cts-scroll-indicator{display:none;}
          .cts-cta-wheel{display:none!important;}
          .cts-cube-wrap{display:none!important;}
          .cts-vertical-ticker{display:none!important;}
          .cts-hero-mobile-visual{display:flex!important;}
          .cts-hero-section{padding-left:20px!important;padding-right:20px!important;}
          .cts-orbital-section > div{grid-template-columns:1fr!important;height:auto!important;}
          .cts-orbital-left{display:none!important;}
          .cts-orbital-right{border-left:none!important;padding:40px 24px!important;}
          .cts-cat-grid{grid-template-columns:1fr!important;justify-items:center;}
          .cts-cta-inner{flex-direction:column!important;}
        }
        @media(max-width:560px){
          .cts-stats-grid{grid-template-columns:repeat(2,1fr);gap:10px;}
          .cts-cta-btns{flex-direction:column;}
          .cts-cta-btns a,.cts-cta-btns button{width:100%;text-align:center;justify-content:center;}
          .cts-review-panel{padding:28px 20px!important;}
          .cts-review-nav{width:38px!important;height:38px!important;font-size:16px!important;}
          .cts-hero-headline{white-space:normal!important;line-height:1.05!important;}
          .cts-hero-section{min-height:unset!important;padding-bottom:60px!important;}
        }
        @media(max-width:380px){
          .cts-stats-grid{grid-template-columns:1fr;}
          .cts-hero-cta-row{flex-direction:column;align-items:center;}
          .cts-hero-cta-row a,.cts-hero-cta-row button{width:100%;justify-content:center;}
        }
      `}</style>

      {/* ══ HERO ══ */}
      <motion.section
        ref={heroRef}
        className="cts-hero-section"
        style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "clamp(96px,14vh,140px) clamp(20px,6vw,80px) clamp(28px,5vh,48px) clamp(76px,7vw,96px)", overflow: "hidden", gap: "clamp(24px,4vw,60px)", perspective: "2000px", perspectiveOrigin: "50% 50%" }}
      >
        <div className="cts-scan-line" />
        <VerticalTicker />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: isDark ? "radial-gradient(ellipse at 65% 40%, #1A1500 0%, #0D0B00 35%, #080808 75%, #050505 100%)" : "radial-gradient(ellipse at 65% 40%, #EDE5CE 0%, #E8DFC5 35%, #F0EBE0 75%, #F5F2EB 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}>
          <StarField speed={1} isDark={isDark} />
        </div>
        <motion.div
          animate={{ x: (mouseX - 0.5) * -20, y: (mouseY - 0.5) * 14 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ position: "absolute", right: "5%", top: "15%", zIndex: 1, width: "42vw", height: "42vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,168,0,0.09) 0%, rgba(245,168,0,0.03) 45%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }}
        />
        <motion.div
          animate={{ x: (mouseX - 0.5) * -18, y: (mouseY - 0.5) * -12 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ position: "absolute", inset: "-10%", pointerEvents: "none", opacity: 0.025, zIndex: 3, backgroundImage: "linear-gradient(rgba(245,168,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(245,168,0,0.8) 1px, transparent 1px)", backgroundSize: "80px 80px" }}
        />
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", background: isDark ? "linear-gradient(90deg, rgba(8,8,8,0.72) 0%, rgba(8,8,8,0.3) 50%, rgba(8,8,8,0.1) 100%)" : "linear-gradient(90deg, rgba(245,242,235,0.72) 0%, rgba(245,242,235,0.3) 50%, rgba(245,242,235,0.1) 100%)" }} />

        <motion.div className="cts-hero-content" style={{ opacity: heroOpacity, flex: "1 1 auto", minWidth: 0, position: "relative", zIndex: 5 }}>
          <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: T.badgeBg, backdropFilter: "blur(12px)", border: `1px solid ${T.hairline}`, marginBottom: 20 }}>
            <motion.span animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: "50%", background: T.gradCyan, boxShadow: `0 0 10px ${T.gradCyan}`, display: "block" }} />
            <span style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: isDark ? "#C8C8C8" : "#4A3828", fontWeight: 700 }}>Premium Tyres · Trusted Since 1998</span>
          </motion.div>

          <div style={{ overflow: "hidden" }}>
            {[{ text: "Every Road.", delay: 0.6 }, { text: "Every Vehicle.", delay: 1.0 }].map((line) => (
              <motion.div key={line.text} initial={{ opacity: 0, y: 80, rotateX: -25 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.9, delay: line.delay * 0.4, ease: [0.22, 1, 0.36, 1] }} className="cts-hero-headline" style={{ display: "block", fontFamily: T.display, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(28px,6.4vw,92px)", lineHeight: 0.98, color: T.text, transformStyle: "preserve-3d", whiteSpace: "nowrap" }}>
                <GlitchText text={line.text.toUpperCase()} delay={line.delay} />
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, x: -60, skewX: -8 }} animate={{ opacity: 1, x: 0, skewX: 0 }} transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }} className="cts-flicker cts-hero-headline" style={{ display: "block", fontFamily: T.display, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(28px,6.4vw,92px)", lineHeight: 0.98, whiteSpace: "nowrap", color: T.accent }}>
              <GlitchText text="EVERY TYRE." delay={1.4} />
            </motion.div>
          </div>

          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ margin: "24px 0 0", fontSize: "clamp(16px,1.5vw,20px)", lineHeight: 1.7, color: isDark ? "#C8C8C8" : "#3A3020", maxWidth: 460, fontWeight: 400 }}>
            Thousands of premium tyres in stock, expert fitment advice, and next-day delivery. Engineered grip for the way you drive.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }} className="cts-hero-cta-row" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 28, position: "relative" }}>
            <motion.div animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.15, 1] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", left: 0, top: "50%", width: 180, height: 80, transform: "translateY(-50%)", background: "radial-gradient(circle, rgba(245,168,0,0.25), transparent 70%)", filter: "blur(20px)", pointerEvents: "none", zIndex: 0 }} />
            <AnimatedButton href="#finder" variant="primary">
              Find My Tyres <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
            </AnimatedButton>
            <AnimatedButton href="#categories" variant="secondary">Explore Range</AnimatedButton>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }} style={{ display: "flex", gap: 28, marginTop: 32, flexWrap: "wrap" }}>
            {[{ num: "10K+", label: "Tyres" }, { num: "10+", label: "Brands" }, { num: "24h", label: "Delivery" }].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 + i * 0.1 }} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: T.display, fontWeight: 900, fontSize: 22, color: T.text, lineHeight: 1 }}>{s.num}</span>
                <span style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: isDark ? "#B8B8B8" : "#4A3828" }}>{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="cts-cube-wrap" style={{ position: "relative", flexShrink: 0, width: "clamp(280px,38vw,480px)", height: "clamp(280px,38vw,480px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <RolodexCube mouseX={mouseX} mouseY={mouseY} />
        </div>

        <div className="cts-hero-mobile-visual" style={{ display: "none", position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.7 }}><StarField speed={0.6} /></div>
          <div style={{ position: "absolute", top: "5%", right: "-20%", width: "70vw", height: "70vw", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(245,168,0,0.14) 0%, transparent 65%)", filter: "blur(40px)", animation: "ctsGlowPulse 5s ease-in-out infinite" }} />
        </div>

        <div className="cts-scroll-indicator" style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 5, flexDirection: "column", alignItems: "center", gap: 9 }}>
          <div style={{ width: 22, height: 36, borderRadius: 12, border: `1.5px solid ${T.hairline}`, display: "flex", justifyContent: "center", paddingTop: 7 }}>
            <span style={{ width: 3, height: 7, borderRadius: 2, background: T.gradCyan, animation: "ctsScrollDot 1.8s ease-in-out infinite" }} />
          </div>
          <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: isDark ? "#B8B8B8" : "#4A3828" }}>Scroll</span>
        </div>
      </motion.section>

      {/* ══ EXPLODED TYRE ══ */}
      <ExplodedTyreView />

      {/* ══ BRAND MARQUEE ══ */}
      <section id="brands" style={{ position: "relative", zIndex: 5, padding: "8px 0 36px", borderTop: `1px solid ${T.hairline}`, borderBottom: `1px solid ${T.hairline}`, overflow: "hidden" }}>
        <FadeReveal>
          <p style={{ textAlign: "center", fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", color: isDark ? "#B8B8B8" : "#4A3828", margin: "26px 0 22px", fontWeight: 700 }}>India's finest tyre makers — all under one roof</p>
        </FadeReveal>
        <div style={{ display: "flex", width: "max-content", gap: 50, paddingLeft: 50, animation: "ctsMarquee 26s linear infinite" }}>
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} style={{ fontFamily: T.display, fontWeight: 700, fontSize: "clamp(18px,2.4vw,34px)", letterSpacing: "0.04em", color: T.text, opacity: 0.3, whiteSpace: "nowrap", textTransform: "uppercase" }}>{b}</span>
          ))}
        </div>
      </section>

      {/* ══ KINETIC STRIP ══ */}
      <KineticStrip />

      {/* ══ CATEGORIES ══ */}
      <CategoryCardSwapSection navigate={navigate} />

      {/* ══ WHY CTS ══ */}
      <WhyCtsOrbitalSection />

      {/* ══ STRIP 2 ══ */}
      <TyreHeroStrip2 />

      {/* ══ REVIEWS ══ */}
      <section id="reviews" style={{ position: "relative", zIndex: 5, maxWidth: 900, margin: "0 auto", padding: "clamp(50px,8vw,110px) clamp(20px,5vw,40px)", textAlign: "center", scrollMarginTop: 80 }}>
        <ClipReveal><p style={labelKicker}>Testimonials</p></ClipReveal>
        <ClipReveal delay={0.1}><h2 style={{ ...h2, marginBottom: 44 }}>What Drivers Say</h2></ClipReveal>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <button className="cts-review-nav" onClick={() => setCur((c) => (c - 1 + REVIEWS.length) % REVIEWS.length)} aria-label="Previous" style={{ flexShrink: 0, width: 46, height: 46, borderRadius: "50%", border: `1px solid ${T.hairline}`, background: T.panelGlass, color: T.text, fontSize: 18, cursor: "pointer", backdropFilter: "blur(10px)" }}>←</button>
          <AnimatePresence mode="wait">
            <motion.div key={cur} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="cts-review-panel" style={{ flex: 1, maxWidth: 620, padding: "clamp(28px,5vw,44px) clamp(20px,4vw,38px)", borderRadius: T.radiusLg, background: T.panelGlass, backdropFilter: "blur(16px)", border: `1px solid ${T.hairline}`, boxShadow: "0 30px 70px rgba(0,0,0,.45)", minHeight: 210, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 18, letterSpacing: 4, marginBottom: 18, background: T.gradAccent, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>★★★★★</div>
              <p style={{ margin: "0 0 20px", fontSize: "clamp(16px,2.2vw,22px)", lineHeight: 1.5, fontWeight: 500, color: T.text }}>"{REVIEWS[cur].text}"</p>
              <div style={{ fontSize: 15, letterSpacing: "0.14em", textTransform: "uppercase", color: isDark ? "#C8C8C8" : "#4A3828", fontWeight: 700 }}>{REVIEWS[cur].author}</div>
            </motion.div>
          </AnimatePresence>
          <button className="cts-review-nav" onClick={() => setCur((c) => (c + 1) % REVIEWS.length)} aria-label="Next" style={{ flexShrink: 0, width: 46, height: 46, borderRadius: "50%", border: `1px solid ${T.hairline}`, background: T.panelGlass, color: T.text, fontSize: 18, cursor: "pointer", backdropFilter: "blur(10px)" }}>→</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 28 }}>
          {REVIEWS.map((_, i) => (
            <button key={i} onClick={() => setCur(i)} style={{ width: i === cur ? 24 : 8, height: 8, borderRadius: 999, border: "none", cursor: "pointer", background: i === cur ? T.gradCyan : "rgba(255,255,255,0.22)", transition: "all .3s ease", padding: 0 }} />
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,40px) clamp(50px,8vw,110px)" }}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 18, padding: "clamp(40px,7vw,84px) clamp(24px,6vw,72px)", background: "#0D0C08", border: "1px solid rgba(245,168,0,0.12)", boxShadow: "0 40px 90px rgba(0,0,0,.55)" }}>
          <div style={{ position: "absolute", right: "20%", top: "50%", transform: "translate(50%,-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,168,0,0.35) 0%, transparent 65%)", filter: "blur(80px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: "10%", bottom: "-20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,168,0,0.12) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />
          <div className="cts-cta-inner" style={{ position: "relative" }}>
            <motion.div className="cts-cta-wheel" animate={{ rotateY: (mouseX - 0.5) * -16, x: (mouseX - 0.5) * -20 }} transition={{ duration: 0.7, ease: "easeOut" }} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "clamp(140px,20vw,280px)", height: "clamp(140px,20vw,280px)", opacity: 0.85, pointerEvents: "none" }}>
              <Wheel spin={11} float={6} caliper />
            </motion.div>
            <div style={{ maxWidth: 620 }}>
              <p style={labelKicker}>Get Rolling</p>
              <h2 style={{ ...h2, color: "#fff", marginBottom: 16 }}>Ready to Roll on the Best?</h2>
              <p style={{ margin: "0 0 30px", fontSize: "clamp(17px,1.7vw,21px)", lineHeight: 1.55, color: "rgba(255,255,255,0.88)", maxWidth: 480, fontWeight: 400 }}>
                Get a personalised tyre recommendation and a free fitment quote in under two minutes. No pressure, just expert grip.
              </p>
              <div className="cts-cta-btns">
                <AnimatedButton href="#finder" variant="primary">
                  Get My Recommendation <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
                </AnimatedButton>
                <AnimatedButton onClick={() => navigate(ROUTES.contact)} variant="secondary">Talk to an Expert</AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
    </HomeTheme.Provider>
  );
}
