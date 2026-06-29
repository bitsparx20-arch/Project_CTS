import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useInView,
  type Variants,
} from "framer-motion";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { ROUTES } from "../config/site";
import { useTheme } from "../context/ThemeContext";

/* ─────────────── FAULTY TERMINAL BACKGROUND (inlined) ─────────────── */
const _vtx = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
const _frag = `
precision mediump float;
varying vec2 vUv;
uniform float iTime;
uniform vec3  iResolution;
uniform float uScale;
uniform vec2  uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3  uTint;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform float uBrightness;
float time;
float hash21(vec2 p){p=fract(p*234.56);p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){return sin(p.x*10.0)*sin(p.y*(3.0+sin(time*0.090909)))+0.2;}
mat2 rotate(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float fbm(vec2 p){
  p*=1.1;float f=0.0,amp=0.5*uNoiseAmp;
  mat2 m0=rotate(time*0.02);f+=amp*noise(p);p=m0*p*2.0;amp*=0.454545;
  mat2 m1=rotate(time*0.02);f+=amp*noise(p);p=m1*p*2.0;amp*=0.454545;
  mat2 m2=rotate(time*0.08);f+=amp*noise(p);return f;
}
float pattern(vec2 p,out vec2 q,out vec2 r){
  vec2 o1=vec2(1.0),o0=vec2(0.0);
  mat2 r01=rotate(0.1*time),r1=rotate(0.1);
  q=vec2(fbm(p+o1),fbm(r01*p+o1));
  r=vec2(fbm(r1*q+o0),fbm(q+o0));
  return fbm(p+r);
}
float digit(vec2 p){
  vec2 grid=uGridMul*15.0;
  vec2 s=floor(p*grid)/grid;
  p=p*grid;
  vec2 q,r;
  float intensity=pattern(s*0.1,q,r)*1.3-0.03;
  if(uUseMouse>0.5){
    vec2 mw=uMouse*uScale;
    float d=distance(s,mw);
    float mi=exp(-d*8.0)*uMouseStrength*10.0;
    intensity+=mi+sin(d*20.0-iTime*5.0)*0.1*mi;
  }
  if(uUsePageLoadAnimation>0.5){
    float cr=fract(sin(dot(s,vec2(12.9898,78.233)))*43758.5453);
    float cp=clamp((uPageLoadProgress-cr*0.8)/0.2,0.0,1.0);
    intensity*=smoothstep(0.0,1.0,cp);
  }
  p=fract(p);p*=uDigitSize;
  float px5=p.x*5.0,py5=(1.0-p.y)*5.0;
  float x=fract(px5),y=fract(py5);
  float i=floor(py5)-2.0,j=floor(px5)-2.0;
  float n=i*i+j*j,f=n*0.0625;
  float isOn=step(0.1,intensity-f);
  float brightness=isOn*(0.2+y*0.8)*(0.75+x*0.25);
  return step(0.0,p.x)*step(p.x,1.0)*step(0.0,p.y)*step(p.y,1.0)*brightness;
}
float onOff(float a,float b,float c){return step(c,sin(iTime+a*cos(iTime*b)))*uFlickerAmount;}
float displace(vec2 look){
  float y=look.y-mod(iTime*0.25,1.0);
  float window=1.0/(1.0+50.0*y*y);
  return sin(look.y*20.0+iTime)*0.0125*onOff(4.0,2.0,0.8)*(1.0+cos(iTime*60.0))*window;
}
vec3 getColor(vec2 p){
  float bar=step(mod(p.y+time*20.0,1.0),0.2)*0.4+1.0;
  bar*=uScanlineIntensity;
  float displacement=displace(p);
  p.x+=displacement;
  if(uGlitchAmount!=1.0)p.x+=displacement*(uGlitchAmount-1.0);
  float middle=digit(p);
  const float off=0.002;
  float sum=digit(p+vec2(-off,-off))+digit(p+vec2(0.0,-off))+digit(p+vec2(off,-off))+
            digit(p+vec2(-off,0.0))+digit(p+vec2(0.0,0.0))+digit(p+vec2(off,0.0))+
            digit(p+vec2(-off,off))+digit(p+vec2(0.0,off))+digit(p+vec2(off,off));
  return vec3(0.9)*middle+sum*0.1*vec3(1.0)*bar;
}
vec2 barrel(vec2 uv){vec2 c=uv*2.0-1.0;float r2=dot(c,c);c=(1.0+uCurvature*r2)*c;return c*0.5+0.5;}
void main(){
  time=iTime*0.333333;
  vec2 uv=vUv;
  if(uCurvature!=0.0)uv=barrel(uv);
  vec2 p=uv*uScale;
  vec3 col=getColor(p);
  if(uChromaticAberration!=0.0){
    vec2 ca=vec2(uChromaticAberration)/iResolution.xy;
    col.r=getColor(p+ca).r;col.b=getColor(p-ca).b;
  }
  col*=uTint;col*=uBrightness;
  if(uDither>0.0){float rnd=hash21(gl_FragCoord.xy);col+=(rnd-0.5)*(uDither*0.003922);}
  gl_FragColor=vec4(col,1.0);
}
`;
function _hexToRgb(hex: string): [number,number,number] {
  let h = hex.replace('#','').trim();
  if(h.length===3) h=h.split('').map(c=>c+c).join('');
  const n=parseInt(h,16);
  return [((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255];
}
interface TerminalBgProps {
  scale?:number; gridMul?:[number,number]; digitSize?:number; timeScale?:number;
  scanlineIntensity?:number; glitchAmount?:number; flickerAmount?:number; noiseAmp?:number;
  chromaticAberration?:number; dither?:number; curvature?:number; tint?:string;
  mouseReact?:boolean; mouseStrength?:number; brightness?:number; style?:React.CSSProperties;
}
function TerminalBg({
  scale=1, gridMul=[2,1], digitSize=1.5, timeScale=0.3,
  scanlineIntensity=0.3, glitchAmount=1, flickerAmount=1, noiseAmp=1,
  chromaticAberration=0, dither=0, curvature=0.2, tint='#ffffff',
  mouseReact=false, mouseStrength=0.2, brightness=1, style,
}: TerminalBgProps) {
  const ctnRef = useRef<HTMLDivElement>(null);
  const tintVec = useMemo(()=>_hexToRgb(tint),[tint]);
  const mouseRef = useRef({x:0.5,y:0.5});
  const smoothRef = useRef({x:0.5,y:0.5});
  const rafRef = useRef<number>(0);
  const loadStartRef = useRef<number>(0);
  const visibleRef = useRef(false);   // pause RAF when off-screen
  const lastFrameRef = useRef(0);     // 30fps cap
  const tOff = useMemo(()=>Math.random()*100,[]);

  useEffect(()=>{
    const ctn = ctnRef.current; if(!ctn) return;
    // Always use DPR=1 for background — no need for retina on decorative WebGL
    const renderer = new Renderer({ dpr: 1 });
    const gl = renderer.gl;
    gl.clearColor(0,0,0,1);
    // Force canvas onto its own GPU compositing layer to avoid scroll repaints
    (gl.canvas as HTMLCanvasElement).style.willChange = 'transform';
    (gl.canvas as HTMLCanvasElement).style.transform = 'translateZ(0)';
    (gl.canvas as HTMLCanvasElement).style.display = 'block';
    const geometry = new Triangle(gl);
    const program = new Program(gl,{
      vertex:_vtx, fragment:_frag,
      uniforms:{
        iTime:{value:0},
        iResolution:{value:new Color(gl.canvas.width,gl.canvas.height,gl.canvas.width/gl.canvas.height)},
        uScale:{value:scale}, uGridMul:{value:new Float32Array(gridMul)}, uDigitSize:{value:digitSize},
        uScanlineIntensity:{value:scanlineIntensity}, uGlitchAmount:{value:glitchAmount},
        uFlickerAmount:{value:flickerAmount}, uNoiseAmp:{value:noiseAmp},
        uChromaticAberration:{value:chromaticAberration}, uDither:{value:dither},
        uCurvature:{value:curvature},
        uTint:{value:new Color(tintVec[0],tintVec[1],tintVec[2])},
        uMouse:{value:new Float32Array([0.5,0.5])},
        uMouseStrength:{value:mouseStrength}, uUseMouse:{value:mouseReact?1:0},
        uPageLoadProgress:{value:0}, uUsePageLoadAnimation:{value:1},
        uBrightness:{value:brightness},
      }
    });
    const mesh = new Mesh(gl,{geometry,program});
    const resize=()=>{ renderer.setSize(ctn.offsetWidth,ctn.offsetHeight); program.uniforms.iResolution.value=new Color(gl.canvas.width,gl.canvas.height,gl.canvas.width/gl.canvas.height); };
    const ro = new ResizeObserver(resize); ro.observe(ctn); resize();

    // Pause rendering when section is scrolled off-screen
    const io = new IntersectionObserver((entries)=>{ visibleRef.current = entries[0].isIntersecting; }, { threshold: 0 });
    io.observe(ctn);

    const onMouse=(e:MouseEvent)=>{ const r=ctn.getBoundingClientRect(); mouseRef.current={x:(e.clientX-r.left)/r.width,y:1-(e.clientY-r.top)/r.height}; };
    if(mouseReact) ctn.addEventListener('mousemove',onMouse);

    const FRAME_BUDGET = 1000 / 30; // cap at 30fps — plenty for a background texture
    const update=(t:number)=>{
      rafRef.current=requestAnimationFrame(update);
      // Skip frame if section off-screen or 30fps budget not elapsed
      if(!visibleRef.current) return;
      if(t - lastFrameRef.current < FRAME_BUDGET) return;
      lastFrameRef.current = t;

      if(!loadStartRef.current) loadStartRef.current=t;
      program.uniforms.iTime.value=(t*0.001+tOff)*timeScale;
      program.uniforms.uPageLoadProgress.value=Math.min((t-loadStartRef.current)/2000,1);
      if(mouseReact){
        const s=smoothRef.current,m=mouseRef.current;
        s.x+=(m.x-s.x)*0.08; s.y+=(m.y-s.y)*0.08;
        const mu=program.uniforms.uMouse.value as Float32Array;
        mu[0]=s.x; mu[1]=s.y;
      }
      renderer.render({scene:mesh});
    };
    rafRef.current=requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);
    return()=>{
      cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect();
      if(mouseReact) ctn.removeEventListener('mousemove',onMouse);
      if(gl.canvas.parentElement===ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      loadStartRef.current=0;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return <div ref={ctnRef} style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0, ...style }}/>;
}

/* ─────────────── PLASMA FIELD (full-page ambient background) ─────────────── */
const _plasmaVtx = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
const _plasmaFrag = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;
  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y));
    p.z -= 4.;
    S = p;
    d = p.y-T;

    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }

  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

interface PlasmaBgProps {
  color?: string;
  speed?: number;
  direction?: "forward" | "reverse" | "pingpong";
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
  style?: React.CSSProperties;
}
function PlasmaBg({
  color = "#00F5FF", speed = 1, direction = "forward", scale = 1, opacity = 1,
  mouseInteractive = true, style,
}: PlasmaBgProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const customColorRgb = color ? _hexToRgb(color) : [1, 1, 1];
    const directionMultiplier = direction === "reverse" ? -1.0 : 1.0;

    const renderer = new Renderer({
      webgl: 2, alpha: true, antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    containerRef.current.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: _plasmaVtx,
      fragment: _plasmaFrag,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColorRgb) },
        uUseCustomColor: { value: 1.0 },
        uSpeed: { value: speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteractive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
      const mu = program.uniforms.uMouse.value as Float32Array;
      mu[0] = mousePos.current.x; mu[1] = mousePos.current.y;
    };
    if (mouseInteractive) window.addEventListener("mousemove", handleMouseMove);

    const setSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth; res[1] = gl.drawingBufferHeight;
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(containerRef.current);
    setSize();

    // Pause when off-screen (defensive — this is a fixed full-viewport layer so it's always visible,
    // but this guards against future use inside a scrollable section).
    const visible = { current: true };
    const io = new IntersectionObserver((entries) => { visible.current = entries[0].isIntersecting; }, { threshold: 0 });
    io.observe(containerRef.current);

    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible.current) return;
      let timeValue = (t - t0) * 0.001;
      if (direction === "pingpong") {
        const dur = 10;
        const seg = timeValue % (dur * 2);
        timeValue = seg > dur ? dur * 2 - seg : seg;
      }
      (program.uniforms.iTime as any).value = timeValue;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (mouseInteractive) window.removeEventListener("mousemove", handleMouseMove);
      try {
        if (containerRef.current && canvas.parentNode === containerRef.current) containerRef.current.removeChild(canvas);
      } catch { /* noop */ }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", ...style }} />;
}

/* ─────────────── CTS LOGO PALETTE — RED / ORANGE / CHARCOAL ─────────────── */
function getTyreTokens(isDark: boolean) {
  return {
    CYAN:     isDark ? "#D4A843"                 : "#B8760A",
    CYAN_DIM: isDark ? "#A8832E"                 : "#8A5808",
    PURPLE:   isDark ? "#C4973D"                 : "#A07820",
    PINK:     isDark ? "#E8C97A"                 : "#D4A830",
    NEON_GRN: isDark ? "#F5EEE8"                 : "#1A1A14",
    VOID:     isDark ? "#0D0D0D"                 : "#F0EBE0",
    DEEP:     isDark ? "#161616"                 : "#E8E2D5",
    VOID_T:   isDark ? "rgba(13,13,13,0.90)"     : "rgba(240,235,224,0.92)",
    DEEP_T:   isDark ? "rgba(22,22,22,0.88)"     : "rgba(232,226,213,0.88)",
    PANEL:    isDark ? "rgba(25,20,10,0.85)"     : "rgba(255,252,245,0.90)",
    BORDER:   isDark ? "rgba(212,168,67,0.25)"   : "rgba(184,118,10,0.22)",
    TEXT_LT:  isDark ? "#F5EEE8"                 : "#1A1508",
    TEXT_DIM: isDark ? "#9E9080"                 : "#6B5C3A",
  };
}
/* Module-level fallback used by sub-components at module scope */
const CYAN     = "#D4A843";
const CYAN_DIM = "#A8832E";
const PURPLE   = "#C4973D";
const PINK     = "#E8C97A";
const NEON_GRN = "#F5EEE8";
const VOID     = "#0D0D0D";
const DEEP     = "#161616";
const VOID_T   = "rgba(13,13,13,0.90)";
const DEEP_T   = "rgba(22,22,22,0.88)";
const PANEL    = "rgba(25,20,10,0.85)";
const BORDER   = "rgba(212,168,67,0.25)";
const TEXT_LT  = "#F5EEE8";
const TEXT_DIM = "#9E9080";
const MONO     = "'Space Mono', monospace";
const EASE     = [0.22, 1, 0.36, 1] as const;

/* ─────────────── GLOBAL STYLES ─────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
  .tyres-root *{ box-sizing:border-box; }

  @keyframes glowPulse   { 0%,100%{opacity:.35} 50%{opacity:.9} }
  @keyframes gridPan     { from{transform:translateY(0)} to{transform:translateY(80px)} }
  @keyframes scanline    { from{top:-100%} to{top:100%} }
  @keyframes glitch1     { 0%,100%{clip-path:inset(0 0 95% 0)} 20%{clip-path:inset(30% 0 50% 0)} 40%{clip-path:inset(60% 0 10% 0)} 60%{clip-path:inset(5% 0 80% 0)} 80%{clip-path:inset(75% 0 5% 0)} }
  @keyframes glitch2     { 0%,100%{clip-path:inset(80% 0 0 0);transform:translateX(-4px)} 25%{clip-path:inset(0 0 70% 0);transform:translateX(4px)} 50%{clip-path:inset(40% 0 40% 0);transform:translateX(-3px)} 75%{clip-path:inset(65% 0 20% 0);transform:translateX(2px)} }
  @keyframes orbitRing   { from{transform:rotateX(72deg) rotateZ(0deg)} to{transform:rotateX(72deg) rotateZ(360deg)} }
  @keyframes floatY      { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-18px)} }
  @keyframes marqueeScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .marquee-track {
    display:flex;
    align-items:center;
    width:max-content;
    animation: marqueeScroll 42s linear infinite;
  }
  .marquee-track:hover { animation-play-state: paused; }
  @keyframes neonFlicker { 0%,19%,21%,23%,25%,54%,56%,100%{text-shadow:0 0 8px var(--cv-accent),0 0 20px var(--cv-accent),0 0 40px var(--cv-accent)} 20%,24%,55%{text-shadow:none} }
  @keyframes borderFlow  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes particleDrift { 0%{transform:translateY(0) translateX(0);opacity:0} 10%{opacity:1} 90%{opacity:.6} 100%{transform:translateY(-100vh) translateX(30px);opacity:0} }
  @keyframes spinTyre    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes holoPulse   { 0%,100%{box-shadow:0 0 18px var(--cv-accent),inset 0 0 18px var(--cv-accent)} 50%{box-shadow:0 0 36px var(--cv-accent),inset 0 0 28px var(--cv-accent)} }
  @keyframes dataStream  { from{background-position:0 0} to{background-position:0 200px} }

  /* ── TEXT ANIMATIONS ── */
  @keyframes typewriter  { from{width:0;border-right:2px solid var(--cv-accent)} to{width:100%;border-right:2px solid transparent} }
  @keyframes gradientText{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes floatText   { 0%,100%{transform:translateY(0px) rotate(-1deg)} 50%{transform:translateY(-6px) rotate(1deg)} }
  @keyframes revealUp    { from{transform:translateY(110%);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes shimmerText { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes letterBounce{ 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-10px)} }
  @keyframes pulseBright { 0%,100%{opacity:.7;letter-spacing:.04em} 50%{opacity:1;letter-spacing:.12em} }
  @keyframes countUp     { from{transform:scale(.6);opacity:0} to{transform:scale(1);opacity:1} }

  .animated-gradient-text {
    background: linear-gradient(90deg, var(--cv-accent), var(--cv-accent-2), var(--cv-accent-3), var(--cv-accent));
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientText 4s linear infinite;
  }
  .shimmer-text {
    background: linear-gradient(90deg, var(--cv-muted) 0%, var(--cv-accent) 40%, #fff 50%, var(--cv-accent) 60%, var(--cv-muted) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerText 3s linear infinite;
  }
  .float-text { animation: floatText 4s ease-in-out infinite; display:inline-block; }
  .pulse-label { animation: pulseBright 2.5s ease-in-out infinite; }
  .reveal-clip { overflow:hidden; }
  .reveal-clip > span { display:inline-block; animation: revealUp .7s cubic-bezier(0.22,1,0.36,1) forwards; }

  /* Neon grid floor */
  .neon-grid {
    background-image:
      linear-gradient(rgba(212,168,67,.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,168,67,.06) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridPan 8s linear infinite;
  }

  /* Scanline overlay */
  .scanlines::before {
    content:''; position:absolute; inset:0; pointer-events:none; z-index:5;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.08) 2px, rgba(0,0,0,.08) 4px);
  }
  .scanlines::after {
    content:''; position:absolute; left:0; right:0; height:120px; pointer-events:none; z-index:6;
    background: linear-gradient(transparent, rgba(212,168,67,.04), transparent);
    animation: scanline 4s ease-in-out infinite;
  }

  /* Glitch text */
  .glitch-wrap { position:relative; display:inline-block; }
  .glitch-wrap::before, .glitch-wrap::after {
    content: attr(data-text); position:absolute; inset:0;
    color: var(--cv-accent); font-size: inherit; font-weight: inherit;
  }
  .glitch-wrap::before { animation: glitch1 3.5s infinite; color: var(--cv-accent-3); left:2px; }
  .glitch-wrap::after  { animation: glitch2 3.5s infinite 0.1s; color: var(--cv-accent); left:-2px; }

  /* Holographic card */
  .holo-card { animation: holoPulse 3s ease-in-out infinite; }

  /* Quick view */
  .quick-view-overlay {
    position:absolute; bottom:0; left:0; right:0;
    background: linear-gradient(135deg, rgba(0,245,255,.88), rgba(139,92,246,.88));
    color:#fff; text-align:center; padding:13px 0;
    font-family:${MONO}; font-size:.68rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
    transform:translateY(100%); transition:transform .28s cubic-bezier(0.22,1,0.36,1); z-index:4;
    text-shadow: 0 0 12px rgba(255,255,255,.6);
  }
  .tyre-product-card:hover .quick-view-overlay { transform:translateY(0); }

  /* ── EDITORIAL / REFERENCE-SITE ANIMATIONS ── */

  /* Horizontal rule line draw from left */
  @keyframes lineDraw {
    from { transform: scaleX(0); transform-origin: left center; }
    to   { transform: scaleX(1); transform-origin: left center; }
  }
  .line-draw {
    transform: scaleX(0);
    transform-origin: left center;
  }
  .line-draw-active {
    animation: lineDraw 0.9s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  /* Numbered index label flicker-in */
  @keyframes indexIn {
    0%   { opacity:0; transform: translateX(-12px); }
    60%  { opacity:1; transform: translateX(2px); }
    100% { opacity:1; transform: translateX(0); }
  }
  .section-index {
    opacity: 0;
  }
  .section-index-active {
    animation: indexIn 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  /* Clip-reveal heading — each word slides up from clip */
  @keyframes wordReveal {
    from { transform: translateY(108%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  .word-reveal-wrap { overflow: hidden; display: inline-block; vertical-align: bottom; }
  .word-reveal-inner {
    display: inline-block;
    transform: translateY(108%);
    opacity: 0;
  }
  .word-reveal-inner.active {
    animation: wordReveal 0.72s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  /* Scroll progress sidebar */
  @keyframes progressGrow {
    from { height: 0%; }
    to   { height: var(--progress-h, 0%); }
  }
  .scroll-progress-track {
    position: fixed; left: 18px; top: 50%; transform: translateY(-50%);
    width: 1px; height: 120px; background: rgba(212,168,67,0.12);
    z-index: 999; pointer-events: none;
  }
  .scroll-progress-fill {
    position: absolute; top: 0; left: 0; width: 1px;
    background: linear-gradient(180deg, var(--cv-accent), var(--cv-accent-2));
    box-shadow: 0 0 6px var(--cv-accent);
    transition: height 0.12s linear;
  }
  @media(max-width:900px){ .scroll-progress-track { display:none; } }

  /* Staggered offset grid — rules live in the BRAND CARD ASYMMETRIC ROW block below */

  /* Stats counter pop */
  @keyframes counterPop {
    0%   { transform: scale(0.5) translateY(10px); opacity:0; }
    70%  { transform: scale(1.12) translateY(-2px); opacity:1; }
    100% { transform: scale(1) translateY(0); opacity:1; }
  }
  .stat-value-anim { opacity:0; }
  .stat-value-anim.active {
    animation: counterPop 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  /* Section entrance — big heading wipe */
  @keyframes headingWipe {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0% 0 0); }
  }
  .heading-wipe {
    clip-path: inset(0 100% 0 0);
  }
  .heading-wipe.active {
    animation: headingWipe 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  /* ── mschristensen-style CARD ANIMATIONS ── */

  /* Scroll-triggered line border draw */
  @keyframes borderDraw {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0% 0 0); }
  }

  /* Text reveal from clip */
  @keyframes textRevealUp {
    from { transform: translateY(105%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  /* Image scale-in on card entry */
  @keyframes imgEntryScale {
    from { transform: scale(1.12); }
    to   { transform: scale(1.0);  }
  }

  /* Tag slide-in */
  @keyframes tagSlideIn {
    from { transform: translateX(-18px); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }

  /* Overlay panel rise */
  .ms-card-overlay {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(3,4,10,0.96) 0%, rgba(3,4,10,0.7) 60%, transparent 100%);
    padding: 22px 20px 18px;
    transform: translateY(30px);
    opacity: 0;
    transition: transform 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.38s ease;
    pointer-events: none;
  }
  .ms-card-img-wrap:hover .ms-card-overlay { transform: translateY(0); opacity: 1; }

  /* Image inside card animates in on view */
  .ms-card-in-view .ms-card-img {
    animation: imgEntryScale 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  /* Stagger children when parent is in view */
  .ms-card-in-view .ms-tag  { animation: tagSlideIn   0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .ms-card-in-view .ms-title { animation: textRevealUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .ms-card-in-view .ms-meta  { animation: textRevealUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.06s both; }
  .ms-card-in-view .ms-body  { animation: textRevealUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
  .ms-card-in-view .ms-cta   { animation: textRevealUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.16s both; }
  .ms-card-in-view .ms-price { animation: textRevealUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.08s both; }

  /* Entry border line draw */
  .ms-card-border-line {
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--cv-accent), var(--cv-accent-2));
    clip-path: inset(0 100% 0 0);
    transition: none;
  }
  .ms-card-in-view .ms-card-border-line {
    animation: borderDraw 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
  }

  /* Hover image overlay text rise */
  .tyre-product-card:hover .ms-hover-panel { transform: translateY(0); opacity: 1; }
  .ms-hover-panel {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 14px 16px 12px;
    background: linear-gradient(to top, var(--cv-bg2) 0%, var(--cv-bg2) 60%, transparent 100%);
    transform: translateY(14px);
    opacity: 0;
    transition: transform 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.32s ease;
    pointer-events: none; z-index: 5;
  }

  /* Brand card hover detail rise */
  .brand-hover-panel {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 12px 16px 10px;
    background: linear-gradient(to top, rgba(3,4,10,0.9) 0%, transparent 100%);
    transform: translateY(10px);
    opacity: 0;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease;
    pointer-events: none; z-index: 5; border-radius: 0 0 16px 16px;
  }



  /* Neon button */
  .neon-btn {
    position:relative; overflow:hidden;
    background: rgba(212,168,67,0.10);
    border: 1px solid rgba(212,168,67,0.4);
    color: #D4A843; transition: all .25s ease;
  }
  .neon-btn:hover {
    background: rgba(212,168,67,0.20);
    box-shadow: 0 0 24px rgba(212,168,67,0.35);
    border-color: #D4A843;
    color: var(--cv-text);
  }
  .neon-btn::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent);
    transform:translateX(-100%); transition:transform .4s ease;
  }
  .neon-btn:hover::after { transform:translateX(100%); }

  /* Brand editorial gallery */
  .brand-gallery-item:hover .brand-gallery-frame{ border-color: rgba(200,18,31,.55) !important; }
  .brand-gallery-img{ transition: transform .7s cubic-bezier(.25,.46,.45,.94); transform-origin: center center; }
  .brand-gallery-item:hover .brand-gallery-img{ transform: scale(1.05) !important; }
  .brand-gallery-item:hover .brand-gallery-title{ color: #E2474F !important; }

  .brand-gallery-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 36px;
    align-items: start;
  }
  @media(max-width:900px){
    .brand-gallery-cols { grid-template-columns: 1fr !important; }
    .brand-gallery-col-right { margin-top: 0 !important; }
  }

  /* Tyre image */
  .tyre-img-wrap {
    position:relative; background: var(--cv-bg2);
    border-bottom:1px solid var(--cv-border);
    display:flex; align-items:center; justify-content:center;
    height:210px; overflow:hidden; border-radius:16px 16px 0 0;
  }
  .tyre-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; }
  .tyre-img-fallback { display:flex; align-items:center; justify-content:center; width:100%; height:100%; background:var(--cv-bg2); }

  /* ── EDITORIAL TYRE CARD ── */
  .ed-card {
    background: transparent;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Framed image container — thin border like reference */
  .ed-img-frame {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.12);
    background: #080C14;
    aspect-ratio: 4 / 3;
  }
  .ed-img-frame img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.4s ease;
    filter: brightness(0.88) saturate(0.95);
  }
  .ed-card:hover .ed-img-frame img {
    transform: scale(1.05);
    filter: brightness(1.0) saturate(1.08);
  }

  /* Corner bracket lines on hover (reference: thin white border accent) */
  .ed-img-frame::before, .ed-img-frame::after {
    content: '';
    position: absolute;
    width: 20px; height: 20px;
    z-index: 4; pointer-events: none;
    transition: all 0.3s ease;
    opacity: 0;
  }
  .ed-img-frame::before {
    top: 10px; left: 10px;
    border-top: 1.5px solid rgba(212,168,67,0.7);
    border-left: 1.5px solid rgba(212,168,67,0.7);
  }
  .ed-img-frame::after {
    bottom: 10px; right: 10px;
    border-bottom: 1.5px solid rgba(212,168,67,0.7);
    border-right: 1.5px solid rgba(212,168,67,0.7);
  }
  .ed-card:hover .ed-img-frame::before,
  .ed-card:hover .ed-img-frame::after { opacity: 1; width: 28px; height: 28px; }

  /* Badge — top-left inside frame */
  .ed-badge {
    position: absolute; top: 14px; left: 14px; z-index: 3;
    font-family: 'Space Mono', monospace;
    font-size: .56rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
    padding: 4px 9px; border-radius: 3px;
    backdrop-filter: blur(8px);
    transition: opacity 0.2s ease;
  }

  /* Hover overlay — brand + size rises from bottom */
  .ed-hover-info {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 4;
    padding: 28px 16px 14px;
    background: linear-gradient(to top, rgba(3,4,10,0.94) 0%, transparent 100%);
    transform: translateY(8px);
    opacity: 0;
    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease;
    pointer-events: none;
  }
  .ed-card:hover .ed-hover-info { transform: translateY(0); opacity: 1; }

  /* Caption row — editorial style: [N]  TITLE  // DATE */
  .ed-caption {
    display: flex;
    align-items: baseline;
    gap: 0;
    padding: 14px 2px 0;
    border-top: 1px solid rgba(255,255,255,0.07);
    margin-top: 1px;
  }
  .ed-index {
    font-family: 'Space Mono', monospace;
    font-size: .62rem; font-weight: 700;
    color: rgba(122,155,181,0.7);
    letter-spacing: .04em;
    flex-shrink: 0;
    min-width: 38px;
    transition: color 0.2s ease;
  }
  .ed-card:hover .ed-index { color: var(--cv-accent); }
  .ed-title {
    font-family: 'Space Mono', monospace;
    font-size: .72rem; font-weight: 700;
    color: var(--cv-text);
    letter-spacing: .06em; text-transform: uppercase;
    flex: 1;
    padding: 0 10px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    transition: color 0.2s ease;
  }
  .ed-card:hover .ed-title { color: #fff; }
  .ed-date {
    font-family: 'Space Mono', monospace;
    font-size: .62rem; font-weight: 400;
    color: rgba(122,155,181,0.55);
    letter-spacing: .04em;
    flex-shrink: 0;
    white-space: nowrap;
  }

  /* Price tag — subtle, below caption */
  .ed-price-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 2px 0;
    margin-top: 2px;
  }

  /* Fallback icon container */
  .ed-fallback {
    display: flex; align-items: center; justify-content: center;
    width: 100%; height: 100%; background: #080C14;
  }

  .tyre-product-card, .brand-card-grid > * { touch-action:pan-y; }

  /* ── FILTER CHIP STAGGER ── */
  @keyframes chipSlideIn {
    from { opacity:0; transform: translateY(14px) scale(0.88); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }
  .filter-chip { opacity:0; }
  .filter-chip.chip-visible {
    animation: chipSlideIn 0.42s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  /* ── COUNT BAR WIPE ── */
  @keyframes countBarIn {
    from { opacity:0; transform: translateX(-18px); }
    to   { opacity:1; transform: translateX(0); }
  }
  .count-bar { opacity:0; }
  .count-bar.bar-visible {
    animation: countBarIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
  }

  /* ── TYRE CARD DRAMATIC CASCADE ── */
  @keyframes cardCascade {
    0%   { opacity:0; transform: translateY(40px) scale(0.94); }
    60%  { opacity:1; transform: translateY(-4px) scale(1.01); }
    100% { opacity:1; transform: translateY(0) scale(1); }
  }

  /* Staggered offset grid — handled via Framer Motion translateY in BrandCard */
  /* Tablet 2-col: no offsets */
  @media(max-width:1024px){
    .brand-card-grid > *:nth-child(n)   { margin-top: 0px !important; }
  }
  /* Mobile 1-col: no offsets */
  @media(max-width:580px){
    .brand-card-grid > *:nth-child(n)   { margin-top: 0px !important; }
  }

  /* ── SORT ROW SLIDE-DOWN ── */
  @keyframes sortRowIn {
    from { opacity:0; transform: translateY(-10px); }
    to   { opacity:1; transform: translateY(0); }
  }
  .sort-row { opacity:0; }
  .sort-row.sort-visible {
    animation: sortRowIn 0.45s cubic-bezier(0.22,1,0.36,1) 0.35s forwards;
  }

  /* ── Staggered gallery two-column responsive ── */
  @media(max-width:900px){
    .tyre-gallery-cols { grid-template-columns: 1fr !important; }
    .tyre-gallery-col-right { margin-top: 0 !important; }
  }

  /* ══════════════ RESPONSIVE BREAKPOINTS ══════════════ */

  /* ── Tablet (≤900px) ── */
  @media(max-width:900px){
    .tyre-hero  { padding:48px 24px 40px !important; min-height:auto !important; max-height:none !important; }
    .tyre-hero-grid {
      flex-direction:column-reverse !important;
      align-items:center !important;
      text-align:center !important;
      gap:32px !important;
      padding:40px 28px 36px !important;
    }
    .tyre-hero-grid > div:first-child { max-width:100% !important; }
    .tyre-hero-visual {
      width: min(68vw, 340px) !important;
      height: min(68vw, 340px) !important;
      flex-shrink: 0 !important;
    }
    .tyre-hero-badge, .tyre-hero-ctas, .tyre-hero-stats { justify-content:center !important; }
    .tyre-hero-ctas { display:flex !important; justify-content:center !important; flex-wrap:wrap !important; gap:10px !important; }
    .tyre-hero-stats { justify-content:center !important; gap:20px !important; }

    #brands     { padding:60px 24px 64px !important; }
    #tires      { padding:56px 24px 64px !important; }
    .tyre-cta-inner { padding:50px 24px !important; }

    /* Brand gallery single column */
    .brand-gallery-cols { grid-template-columns: 1fr !important; }
    .brand-gallery-col-right { margin-top: 0 !important; }

    /* Brand card grid: 2 columns on tablet */
    .brand-card-grid { grid-template-columns: 1fr 1fr !important; }
    .brand-card-grid > *:nth-child(n) { margin-top: 0px !important; }

    /* Filter chips wrap properly */
    .filter-chips-wrap { flex-wrap:wrap !important; overflow-x:visible !important; }

    /* Sort row stacks */
    .sort-row-inner { flex-direction:column !important; align-items:flex-start !important; gap:10px !important; }
  }

  /* ── Mobile (≤600px) ── */
  @media(max-width:600px){
    .tyre-hero  { padding:40px 16px 32px !important; min-height:auto !important; }
    .tyre-hero-grid {
      flex-direction:column !important;
      padding:32px 20px 28px !important;
      gap:24px !important;
      text-align:left !important;
      align-items:flex-start !important;
    }
    /* Show a smaller illustration above text on mobile */
    .tyre-hero-visual {
      width: min(80vw, 280px) !important;
      height: min(80vw, 280px) !important;
      align-self: center !important;
    }
    .tyre-hero-ctas { justify-content:flex-start !important; }
    .tyre-hero-stats { justify-content:flex-start !important; gap:16px !important; flex-wrap:wrap !important; }

    .tyre-stats { padding:16px 16px !important; }
    #brands     { padding:40px 16px 48px !important; }
    #tires      { padding:36px 16px 48px !important; }
    .tyre-cta-inner {
      padding:40px 18px !important;
      flex-direction:column !important;
      align-items:flex-start !important;
    }

    /* 2-col product grid on small mobile */
    .tyre-product-grid { grid-template-columns:1fr 1fr !important; gap:28px 12px !important; }
    .tyre-img-wrap { height:140px !important; }

    /* Brand cards single column */
    .brand-card-grid { grid-template-columns: 1fr !important; }
    .brand-card-grid > *:nth-child(n) { margin-top: 0px !important; }

    /* Section headers smaller */
    .section-header-title { font-size:clamp(1.4rem,5vw,1.9rem) !important; }

    /* Scroll progress line — hide on mobile (touch scroll) */
    .scroll-progress-track { display:none !important; }

    /* CTA buttons full-width on small screens */
    .tyre-cta-inner a, .tyre-cta-inner div > a {
      width:100% !important;
      text-align:center !important;
      justify-content:center !important;
    }

    /* Filter chips: horizontal scroll on mobile */
    .filter-chips-wrap {
      flex-wrap:nowrap !important;
      overflow-x:auto !important;
      -webkit-overflow-scrolling:touch !important;
      padding-bottom:6px !important;
      scrollbar-width:none !important;
    }
    .filter-chips-wrap::-webkit-scrollbar { display:none !important; }

    /* Sort row stacks vertically */
    .sort-row-inner { flex-direction:column !important; align-items:flex-start !important; gap:10px !important; }
    .sort-row-inner select { width:100% !important; }

    /* Touch-friendly chip size */
    .filter-chips-wrap button { min-height:40px !important; padding:8px 14px !important; white-space:nowrap !important; }

    /* Caption text ellipsis on small cards */
    .ed-caption { padding:10px 2px 0 !important; }
    .ed-title { font-size:.65rem !important; }
    .ed-index, .ed-date { font-size:.58rem !important; }

    /* Stagger offset disabled on mobile */
    .tyre-gallery-col-right { margin-top:0 !important; }
  }

  /* ── Extra-small (≤380px) ── */
  @media(max-width:380px){
    .tyre-product-grid { grid-template-columns:1fr !important; }
    .tyre-img-wrap { height:190px !important; }
    .tyre-hero-visual { width:90vw !important; height:90vw !important; }
  }
`;

const fadeUp: Variants = {
  hidden: { opacity:0, y:22 },
  visible: { opacity:1, y:0, transition:{ duration:0.6, ease:EASE } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition:{ staggerChildren:0.09 } },
};

/* ─────────────── PARTICLE FIELD ─────────────── */
function ParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 6,
      dur: Math.random() * 8 + 6,
      color: i % 3 === 0 ? CYAN : i % 3 === 1 ? PURPLE : PINK,
    })), []);

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:1 }}>
      {particles.map((p) => (
        <div key={p.id} style={{
          position:"absolute", bottom:"-10px", left:`${p.x}%`,
          width:p.size, height:p.size, borderRadius:"50%",
          background:p.color, boxShadow:`0 0 ${p.size*3}px ${p.color}`,
          animation:`particleDrift ${p.dur}s ${p.delay}s linear infinite`,
          opacity:0,
        }} />
      ))}
    </div>
  );
}

/* ─────────────── SCROLL PROGRESS SIDEBAR ─────────────── */
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
    <div className="scroll-progress-track">
      <div className="scroll-progress-fill" style={{ height: `${pct}%` }} />
    </div>
  );
}

/* ─────────────── ANIMATED SECTION DIVIDER ─────────────── */
function AnimatedDivider({ color = CYAN, delay = 0 }: { color?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} style={{ display:"flex", alignItems:"center", gap:12, margin:"0 0 32px" }}>
      <div
        className={`line-draw${inView ? " line-draw-active" : ""}`}
        style={{
          height:1, flex:1,
          background:`linear-gradient(90deg, ${color}, transparent)`,
          animationDelay:`${delay}s`,
        }}
      />
      <motion.div
        initial={{ opacity:0, scale:0 }}
        animate={inView ? { opacity:1, scale:1 } : {}}
        transition={{ delay: delay + 0.5, duration: 0.3, ease: [0.22,1,0.36,1] }}
        style={{ width:5, height:5, borderRadius:"50%", background:color, boxShadow:`0 0 8px ${color}` }}
      />
    </div>
  );
}

/* ─────────────── SECTION INDEX LABEL ─────────────── */
function SectionLabel({ index, label, delay = 0 }: { index: string; label: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
      <span
        className={`section-index${inView ? " section-index-active" : ""}`}
        style={{
          fontFamily:MONO, fontSize:".62rem", fontWeight:700, color: "var(--cv-muted)",
          letterSpacing:".08em", animationDelay:`${delay}s`,
        }}
      >
        [{index}]
      </span>
      <div
        className={`line-draw${inView ? " line-draw-active" : ""}`}
        style={{
          width:32, height:1,
          background:`linear-gradient(90deg, var(--cv-accent), transparent)`,
          animationDelay:`${delay + 0.15}s`,
        }}
      />
      <motion.span
        initial={{ opacity:0, x:8 }}
        animate={inView ? { opacity:1, x:0 } : {}}
        transition={{ delay: delay + 0.3, duration: 0.4, ease: [0.22,1,0.36,1] }}
        style={{ fontFamily:MONO, fontSize:".68rem", letterSpacing:".3em", textTransform:"uppercase", color:"var(--cv-accent)", fontWeight:700, textShadow:`0 0 12px var(--cv-accent)` }}
      >
        {label}
      </motion.span>
    </div>
  );
}

/* ─────────────── SPLIT HEADING (word clip-reveal) ─────────────── */
function SplitHeading({ children, style }: { children: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const words = children.split(" ");
  return (
    <h2 ref={ref} style={{ margin:0, ...style }}>
      {words.map((word, i) => (
        <span key={i} className="word-reveal-wrap" style={{ marginRight: i < words.length - 1 ? "0.28em" : 0 }}>
          <span
            className={`word-reveal-inner${inView ? " active" : ""}`}
            style={{ animationDelay: `${i * 0.09}s` }}
          >
            {word}
          </span>
        </span>
      ))}
    </h2>
  );
}

/* ─────────────── NEON ORBIT RING ─────────────── */
function OrbitRing({ size = 280, color = CYAN, opacity = 0.15 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <div style={{
      width:size, height:size, position:"absolute",
      border:`1.5px solid ${color}`,
      borderRadius:"50%",
      boxShadow:`0 0 20px ${color}44`,
      transform:"rotateX(72deg) rotateZ(0deg)",
      animation:`orbitRing ${14}s linear infinite`,
      opacity,
      pointerEvents:"none",
    }} />
  );
}

/* ─────────────── TYRE IMAGE + PEXELS HELPERS ─────────────── */
const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=700`;

const TYRE_PRODUCT_IMAGES: Record<string, string> = {
  "MRF":        pexels(20303832),
  "CEAT":       pexels(31574041),
  "Apollo":     pexels(14667455),
  "JK Tyre":    pexels(6453051),
  "TVS":        pexels(116676),
  "Birla Tyres":pexels(364305),
  "Balkrishna": pexels(3399937),
  "PTL":        pexels(14700339),
  "Kama Kuhmo": pexels(9941648),
  "Speedways":  pexels(30139872),
};

const BRAND_ACCENTS: Record<string, string> = {
  "MRF":"#E31837","CEAT":"#FFA500","Apollo":"#003087",
  "JK Tyre":"#FFCC00","TVS":"#00529C","Birla Tyres":"#E60026",
  "Balkrishna":"#F58220","PTL":"#005BAC","Kama Kuhmo":"#E30613","Speedways":"#39FF14",
};

/* ─────────────── HOLOGRAPHIC TYRE ICON ─────────────── */
const FallbackTyreIcon = ({ brand }: { brand: string }) => {
  const accent = BRAND_ACCENTS[brand] ?? CYAN;
  const spokes = [0,45,90,135,180,225,270,315];
  const treads = [0,30,60,90,120,150,180,210,240,270,300,330];
  return (
    <svg viewBox="0 0 200 200" width="130" height="130" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" style={{ filter:`drop-shadow(0 0 12px ${accent}88)` }}>
      <circle cx="100" cy="100" r="92" fill="#060c1c" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="var(--cv-accent)" strokeWidth=".8" strokeDasharray="3 5" opacity=".4"/>
      {treads.map((deg) => {
        const r = deg*Math.PI/180;
        return <line key={deg}
          x1={100+70*Math.cos(r)} y1={100+70*Math.sin(r)}
          x2={100+88*Math.cos(r)} y2={100+88*Math.sin(r)}
          stroke={accent} strokeWidth="5" strokeLinecap="round" opacity=".7"/>;
      })}
      <circle cx="100" cy="100" r="60" fill="#030609" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="var(--cv-accent)" strokeWidth=".6" opacity=".3"/>
      <circle cx="100" cy="100" r="42" fill="#060c1c" />
      {spokes.map((deg) => {
        const r = deg*Math.PI/180;
        return <line key={deg}
          x1={100+26*Math.cos(r)} y1={100+26*Math.sin(r)}
          x2={100+40*Math.cos(r)} y2={100+40*Math.sin(r)}
          stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity=".85"/>;
      })}
      <circle cx="100" cy="100" r="18" fill={accent} opacity=".9"/>
      <circle cx="100" cy="100" r="7" fill="var(--cv-accent)" opacity=".35"/>
    </svg>
  );
};

/* ─────────────── BRAND DATA ─────────────── */
interface TyreBrand {
  name:string; origin:string; founded:string;
  description:string; speciality:string;
  modelCount:number; logo:string; accentColor:string;
}

const TYRE_BRANDS: TyreBrand[] = [
  { name:"MRF",         origin:"India (Chennai)",    founded:"1946", description:"India's largest tyre manufacturer and a global brand. MRF powers everything from racing cars to cricket bats, trusted by Sachin Tendulkar and F1 teams.",        speciality:"Performance & Racing",   modelCount:5, logo:"mrf",         accentColor:"#E31837" },
  { name:"CEAT",        origin:"India (Mumbai)",     founded:"1958", description:"Born in Italy, bred in India — CEAT delivers tyres for every road condition. Official partner of BCCI and trusted by millions of Indian commuters.",               speciality:"All-Road Mastery",       modelCount:2, logo:"ceat",        accentColor:"#FFA500" },
  { name:"Apollo",      origin:"India (Gurugram)",   founded:"1972", description:"India's second-largest tyre brand with a global presence across 100+ countries. Apollo makes tyres for passenger cars, trucks, and F1 logistics fleets.",         speciality:"Touring & Commercial",   modelCount:3, logo:"apollo",      accentColor:"#003087" },
  { name:"JK Tyre",     origin:"India (New Delhi)",  founded:"1974", description:"Pioneer of radial tyre technology in India. JK Tyre is the first Indian brand to enter Formula Racing and supplies OEM tyres to Maruti Suzuki and Toyota.",       speciality:"Radial & F1 Tech",       modelCount:4, logo:"jktyre",      accentColor:"#FFCC00" },
  { name:"TVS",         origin:"India (Chennai)",    founded:"1977", description:"Backed by the legendary TVS Group, this brand dominates two-wheeler tyres in India, trusted by millions of bikes on Indian roads daily.",                          speciality:"Two-Wheeler Expert",     modelCount:2, logo:"tvs",         accentColor:"#00529C" },
  { name:"Birla Tyres", origin:"India (Kolkata)",    founded:"1919", description:"Part of the Aditya Birla Group — one of India's oldest conglomerates. Birla Tyres offers robust solutions for agriculture, OTR, and passenger vehicles.",         speciality:"Agri & OTR Tyres",       modelCount:1, logo:"birla",       accentColor:"#E60026" },
  { name:"Balkrishna",  origin:"India (Mumbai)",     founded:"1987", description:"BKT is India's global success story — dominating off-highway tyre markets in 130+ countries. Sponsor of La Liga, BWF, and European Rugby.",                        speciality:"Off-Highway & Agri",     modelCount:1, logo:"balkrishna",  accentColor:"#F58220" },
  { name:"PTL",         origin:"India (Punjab)",     founded:"1981", description:"Punjab Tractors Limited tyres — renowned for heavy-duty agriculture and tractor tyres engineered for the tough terrain of North Indian farmlands.",                  speciality:"Tractor & Farm",         modelCount:1, logo:"ptl",         accentColor:"#005BAC" },
  { name:"Kama Kuhmo",  origin:"India (Delhi)",      founded:"2007", description:"A joint venture bringing Korean Kumho technology to India. Kama Kuhmo produces passenger and light truck tyres with cutting-edge compound science.",                 speciality:"Sport Touring",          modelCount:1, logo:"kamakuhmo",   accentColor:"#E30613" },
  { name:"Speedways",   origin:"India (Rajasthan)",  founded:"1993", description:"India's rising off-road and industrial tyre brand. Speedways manufactures specialty tyres for mining, construction, and agricultural sectors across South Asia.",    speciality:"Industrial & Off-Road",  modelCount:1, logo:"speedways",   accentColor:"#39FF14" },
];

/* ─────────────── BRAND LOGOS (Indian Brands) ─────────────── */
const BrandLogo = ({ brand, accent }: { brand:string; accent:string }) => {
  const shared = { width:64, height:64 };
  switch(brand){
    case "mrf": return(
      <svg viewBox="0 0 64 64" {...shared} aria-label="MRF">
        <circle cx="32" cy="32" r="26" fill="none" stroke={accent} strokeWidth={4}/>
        <text x="32" y="27" textAnchor="middle" fill={accent} fontSize="10" fontWeight="bold" fontFamily="monospace">MRF</text>
        <path d="M 18 36 L 26 28 L 32 34 L 38 28 L 46 36" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>);
    case "ceat": return(
      <svg viewBox="0 0 64 64" {...shared} aria-label="CEAT">
        <circle cx="32" cy="32" r="26" fill="none" stroke={accent} strokeWidth={4}/>
        <path d="M 46 24 A 18 18 0 1 0 46 40" fill="none" stroke={accent} strokeWidth={4.5} strokeLinecap="round"/>
        <circle cx="46" cy="32" r="4" fill={accent}/>
      </svg>);
    case "apollo": return(
      <svg viewBox="0 0 64 64" {...shared} aria-label="Apollo">
        <circle cx="32" cy="32" r="26" fill="none" stroke={accent} strokeWidth={4}/>
        <path d="M 20 46 L 32 18 L 44 46" fill="none" stroke={accent} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round"/>
        <path d="M 23 38 L 41 38" stroke={accent} strokeWidth={3} strokeLinecap="round"/>
        <circle cx="32" cy="18" r="4" fill={accent}/>
      </svg>);
    case "jktyre": return(
      <svg viewBox="0 0 64 64" {...shared} aria-label="JK Tyre">
        <circle cx="32" cy="32" r="26" fill="none" stroke={accent} strokeWidth={4}/>
        <line x1="20" y1="18" x2="20" y2="40" stroke={accent} strokeWidth={4.5} strokeLinecap="round"/>
        <path d="M 20 40 Q 26 52 32 40" fill="none" stroke={accent} strokeWidth={4} strokeLinecap="round"/>
        <line x1="38" y1="18" x2="38" y2="46" stroke={accent} strokeWidth={4.5} strokeLinecap="round"/>
        <path d="M 38 32 L 48 18" stroke={accent} strokeWidth={4} strokeLinecap="round"/>
        <path d="M 38 32 L 48 46" stroke={accent} strokeWidth={4} strokeLinecap="round"/>
      </svg>);
    case "tvs": return(
      <svg viewBox="0 0 64 64" {...shared} aria-label="TVS">
        <circle cx="32" cy="32" r="26" fill="none" stroke={accent} strokeWidth={4}/>
        <line x1="16" y1="20" x2="48" y2="20" stroke={accent} strokeWidth={4.5} strokeLinecap="round"/>
        <line x1="32" y1="20" x2="32" y2="48" stroke={accent} strokeWidth={4.5} strokeLinecap="round"/>
        <path d="M 22 32 L 32 48 L 42 32" fill="none" stroke={accent} strokeWidth={3} strokeLinejoin="round"/>
      </svg>);
    case "birla": return(
      <svg viewBox="0 0 64 64" {...shared} aria-label="Birla Tyres">
        <circle cx="32" cy="32" r="26" fill="none" stroke={accent} strokeWidth={4}/>
        {[18,25,32,39,46].map((y,i)=>(
          <line key={i} x1={18} y1={y} x2={46} y2={y}
            stroke={accent} strokeWidth={i===2?4:2.5} strokeLinecap="round" opacity={i===2?1:.6}/>
        ))}
      </svg>);
    case "balkrishna": return(
      <svg viewBox="0 0 64 64" {...shared} aria-label="Balkrishna">
        <circle cx="32" cy="32" r="26" fill="none" stroke={accent} strokeWidth={4}/>
        <path d="M 18 46 L 32 18 L 46 46 Z" fill="none" stroke={accent} strokeWidth={3.5} strokeLinejoin="round"/>
        <line x1="22" y1="38" x2="42" y2="38" stroke={accent} strokeWidth={3} strokeLinecap="round"/>
        <circle cx="32" cy="32" r="4" fill={accent}/>
      </svg>);
    case "ptl": return(
      <svg viewBox="0 0 64 64" {...shared} aria-label="PTL">
        <circle cx="32" cy="32" r="26" fill="none" stroke={accent} strokeWidth={4}/>
        <line x1="18" y1="20" x2="18" y2="46" stroke={accent} strokeWidth={4.5} strokeLinecap="round"/>
        <path d="M 18 20 Q 38 20 38 29 Q 38 38 18 38" fill="none" stroke={accent} strokeWidth={4} strokeLinecap="round"/>
      </svg>);
    case "kamakuhmo": return(
      <svg viewBox="0 0 64 64" {...shared} aria-label="Kama Kuhmo">
        <circle cx="32" cy="32" r="26" fill="none" stroke={accent} strokeWidth={4}/>
        <path d="M 18 46 L 18 18 L 32 32 L 46 18 L 46 46" fill="none" stroke={accent} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>);
    case "speedways": return(
      <svg viewBox="0 0 64 64" {...shared} aria-label="Speedways">
        <circle cx="32" cy="32" r="26" fill="none" stroke={accent} strokeWidth={4}/>
        <path d="M 46 22 L 26 32 L 46 42" fill="none" stroke={accent} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="18" y1="22" x2="18" y2="42" stroke={accent} strokeWidth={4.5} strokeLinecap="round"/>
      </svg>);
    default: return(
      <svg viewBox="0 0 64 64" {...shared}>
        <circle cx="32" cy="32" r="26" fill="none" stroke={accent} strokeWidth={4}/>
        <circle cx="32" cy="32" r="8" fill={accent}/>
      </svg>);
  }
};

/* ─────────────── STAR ROW ─────────────── */
const StarRow = ({ rating }: { rating:number }) => {
  const full = Math.floor(rating);
  const half = rating%1 >= 0.5;
  return(
    <div style={{ display:"flex", gap:2 }}>
      {[...Array(5)].map((_,i)=>{
        const fill = i<full||(i===full&&half) ? CYAN : "#1a2a3a";
        return(
          <svg key={i} viewBox="0 0 24 24" width="13" height="13" fill={fill} aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      })}
    </div>
  );
};

/* ─────────────── TYRE DATA ─────────────── */
interface Tire { brand:string; model:string; size:string; rating:number; reviews:number; price:number; badge:string; badgeColor:string; }
const TIRES: Tire[] = [
  { brand:"MRF",         model:"ZLX",                    size:"205/55 R16", rating:4.6, reviews:124, price:5800,  badge:"Best Seller", badgeColor:CYAN    },
  { brand:"MRF",         model:"REVZ-C2",                size:"225/45 R17", rating:4.7, reviews:86,  price:7200,  badge:"Best Seller", badgeColor:CYAN    },
  { brand:"CEAT",        model:"SecuraDrive",            size:"195/65 R15", rating:4.4, reviews:67,  price:4900,  badge:"In Stock",    badgeColor:"var(--cv-muted)"},
  { brand:"CEAT",        model:"Crossdrive",             size:"215/60 R16", rating:4.2, reviews:43,  price:5600,  badge:"New Arrival", badgeColor:PURPLE  },
  { brand:"Apollo",      model:"Alnac 4G",               size:"185/65 R14", rating:4.3, reviews:55,  price:3900,  badge:"In Stock",    badgeColor:"var(--cv-muted)"},
  { brand:"Apollo",      model:"Apterra H/T",            size:"265/70 R17", rating:4.5, reviews:38,  price:8200,  badge:"Best Seller", badgeColor:CYAN    },
  { brand:"JK Tyre",     model:"Vectra",                 size:"195/55 R15", rating:4.1, reviews:29,  price:4400,  badge:"In Stock",    badgeColor:"var(--cv-muted)"},
  { brand:"TVS",         model:"ATT Sport",              size:"120/80-17",  rating:3.9, reviews:41,  price:1800,  badge:"New Arrival", badgeColor:PURPLE  },
  { brand:"Balkrishna",  model:"AT 651",                 size:"265/75 R16", rating:4.8, reviews:62,  price:10400, badge:"Best Seller", badgeColor:CYAN    },
  { brand:"Speedways",   model:"Grip Master",            size:"215/65 R16", rating:4.0, reviews:18,  price:3600,  badge:"New Arrival", badgeColor:PURPLE  },
];
type SortKey = "top"|"low"|"high"|"new";

/* ─────────────── MARQUEE BAR ─────────────── */
const MARQUEE_ITEMS = [
  { text: "Made in India · Driven Worldwide", strong: false },
  { text: "MRF — India's No.1 Tyre", strong: true },
  { text: "Free Fitting Included", strong: false },
  { text: "10 Indian Brands", strong: true },
  { text: "24h Hyperfast Delivery", strong: false },
  { text: "MRF ReVZ-C2 Now In Stock", strong: true },
  { text: "BKT AT 651 — Off-Road King", strong: false },
  { text: "Apollo Apterra Series", strong: true },
  { text: "CEAT SecuraDrive", strong: false },
];
function MarqueeBar() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return(
    <div style={{ background:"var(--cv-bg2-t)", overflow:"hidden", padding:"13px 0", borderBottom:`1px solid var(--cv-border)`, position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(90deg, var(--cv-bg2) 0%, transparent 6%, transparent 94%, var(--cv-bg2) 100%)`, zIndex:2, pointerEvents:"none" }}/>
      <div className="marquee-track">
        {doubled.map((item,i)=>(
          <span key={i} style={{ display:"inline-flex", alignItems:"center", whiteSpace:"nowrap" }}>
            <span style={{
              fontFamily:MONO, fontSize:".68rem", fontWeight:700,
              color: item.strong ? "var(--cv-accent)" : "var(--cv-muted)",
              letterSpacing:".08em",
            }}>{item.text}</span>
            <span style={{ margin:"0 28px", width:3, height:3, borderRadius:"50%", background:"rgba(122,155,181,0.4)", flexShrink:0 }}/>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   EXPLODED VIEW TYRE HERO
   ─── How it works ───────────────────────────────────────────
   The hero is normal-flow (no 250vh hack).  We track raw
   window.scrollY with a useEffect and derive a 0-1 progress
   value from 0 → 600px of scroll.  That value drives all
   animation via inline lerp — no useTransform hooks-in-loops,
   no sticky jank, no blank white sections.

   Phase 0 → 0.3  : parts explode outward, text fades in
   Phase 0.3 → 0.65: parts hold at orbit, hero fully visible
   Phase 0.65 → 1  : parts fly back and lock into tyre
   ─────────────────────────────────────────────────────────── */

const PARTS_DEF = [
  { id:"tread",    label:"Tread",        color:"#C8121F", ex:-185, ey:-140 },
  { id:"sidewall", label:"Sidewall",     color:"#D4A843", ex: 185, ey:-120 },
  { id:"bead",     label:"Bead Wire",    color:"#E2474F", ex: 170, ey: 155 },
  { id:"rim",      label:"Rim",          color:"#F5C842", ex:-170, ey: 155 },
  { id:"valve",    label:"Valve",        color:"#D4A843", ex:   0, ey:-210 },
  { id:"belt",     label:"Steel Belt",   color:"#C8121F", ex: 220, ey:   0 },
  { id:"liner",    label:"Inner Liner",  color:"#9A8880", ex:-220, ey:   0 },
] as const;

/* lerp helper */
const lerp = (a:number, b:number, t:number) => a + (b - a) * Math.max(0, Math.min(1, t));
/* easeInOut */
const ease = (t:number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

/* Part SVG icons */
function TyrePart({ id, color, size=32 }: { id:string; color:string; size?:number }) {
  const s = { fill:"none", stroke:color, strokeWidth:2.2, strokeLinecap:"round" as const, strokeLinejoin:"round" as const };
  switch(id) {
    case "tread":    return <svg width={size} height={size} viewBox="0 0 40 40"><rect x="4" y="15" width="32" height="10" rx="2" {...s}/><line x1="10" y1="11" x2="10" y2="29" {...s}/><line x1="20" y1="9" x2="20" y2="31" {...s}/><line x1="30" y1="11" x2="30" y2="29" {...s}/></svg>;
    case "sidewall": return <svg width={size} height={size} viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="16" ry="16" {...s}/><ellipse cx="20" cy="20" rx="9" ry="9" {...s}/></svg>;
    case "bead":     return <svg width={size} height={size} viewBox="0 0 40 40"><circle cx="20" cy="20" r="7" fill={color} opacity=".7"/><circle cx="20" cy="20" r="12" {...s} strokeDasharray="3 3"/></svg>;
    case "rim":      return <svg width={size} height={size} viewBox="0 0 40 40"><circle cx="20" cy="20" r="13" {...s}/><circle cx="20" cy="20" r="4" fill={color} opacity=".7"/>{[0,60,120,180,240,300].map(a=><line key={a} x1={20+4*Math.cos(a*Math.PI/180)} y1={20+4*Math.sin(a*Math.PI/180)} x2={20+12*Math.cos(a*Math.PI/180)} y2={20+12*Math.sin(a*Math.PI/180)} {...s}/>)}</svg>;
    case "valve":    return <svg width={size} height={size} viewBox="0 0 40 40"><rect x="17" y="8" width="6" height="17" rx="3" fill={color} opacity=".85"/><circle cx="20" cy="29" r="4" fill={color}/></svg>;
    case "belt":     return <svg width={size} height={size} viewBox="0 0 40 40"><path d="M6 20 Q20 8 34 20" {...s}/><path d="M6 20 Q20 32 34 20" {...s}/><line x1="6" y1="20" x2="34" y2="20" {...s} strokeDasharray="4 3"/></svg>;
    case "liner":    return <svg width={size} height={size} viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="13" ry="13" fill={color} opacity=".12"/><ellipse cx="20" cy="20" rx="13" ry="13" {...s} strokeDasharray="2 4"/></svg>;
    default:         return null;
  }
}

/* The assembled centre tyre graphic — crimson/gold theme */
function CentreTyre({ spin }: { spin: number }) {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" style={{ filter:"drop-shadow(0 0 24px rgba(212,168,67,0.6))", display:"block" }}>
      {/* Dark tyre body */}
      <circle cx="100" cy="100" r="94" fill="var(--cv-bg)"/>
      {/* Outer tyre ring */}
      <circle cx="100" cy="100" r="92" fill="none" stroke="#D4A843" strokeWidth="10" opacity="0.35"/>
      {/* Tread blocks — gold */}
      {Array.from({length:20},(_,i)=>{ const a=i*(360/20)*Math.PI/180; return <line key={i} x1={100+78*Math.cos(a)} y1={100+78*Math.sin(a)} x2={100+90*Math.cos(a)} y2={100+90*Math.sin(a)} stroke="#D4A843" strokeWidth="5" strokeLinecap="round" opacity="0.8"/>; })}
      {/* Sidewall amber ring */}
      <circle cx="100" cy="100" r="74" fill="none" stroke="#C4973D" strokeWidth="1.5" opacity="0.4" strokeDasharray="6 4"/>
      {/* Inner dark zone */}
      <circle cx="100" cy="100" r="58" fill="#0A0A0A"/>
      {/* Rim (spins) */}
      <g style={{ transformOrigin:"100px 100px", transform:`rotate(${spin}deg)`, transition:"transform 0.04s linear" }}>
        <circle cx="100" cy="100" r="52" fill="var(--cv-bg)" stroke="#C4973D" strokeWidth="1.2" opacity="0.65"/>
        {[0,60,120,180,240,300].map(a => <line key={a}
          x1={100+14*Math.cos(a*Math.PI/180)} y1={100+14*Math.sin(a*Math.PI/180)}
          x2={100+49*Math.cos(a*Math.PI/180)} y2={100+49*Math.sin(a*Math.PI/180)}
          stroke="#C4973D" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/>)}
        {/* Centre hub — gold */}
        <circle cx="100" cy="100" r="13" fill="#D4A843" opacity="0.95"/>
        <circle cx="100" cy="100" r="6"  fill="#0A0A0A" opacity="0.98"/>
        {/* Gold accent dots between spokes */}
        {[30,90,150,210,270,330].map(a => <circle key={a} cx={100+36*Math.cos(a*Math.PI/180)} cy={100+36*Math.sin(a*Math.PI/180)} r="2.5" fill="#E8C97A" opacity="0.6"/>)}
      </g>
      {/* Belt ring */}
      <circle cx="100" cy="100" r="65" fill="none" stroke="#D4A843" strokeWidth="1" strokeDasharray="5 6" opacity="0.22"/>
      {/* Valve stem dot */}
      <circle cx="100" cy="10" r="3.5" fill="#C4973D" opacity="0.85" style={{ transformOrigin:"100px 100px", transform:`rotate(${spin}deg)` }}/>
    </svg>
  );
}

/* Individual animated part — receives computed position */
function ExplodedPart({ part, x, y, opacity, scale, labelOpacity }: {
  part: typeof PARTS_DEF[number];
  x:number; y:number; opacity:number; scale:number; labelOpacity:number;
}) {
  return (
    <div style={{
      position:"absolute", left:"50%", top:"50%",
      transform:`translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`,
      opacity, zIndex:10, transition:"none",
      display:"flex", flexDirection:"column", alignItems:"center", gap:5,
      pointerEvents:"none",
    }}>
      <div style={{ padding:9, borderRadius:12, background:`${part.color}18`, border:`1px solid ${part.color}55`, backdropFilter:"blur(8px)", boxShadow:`0 0 20px ${part.color}44` }}>
        <TyrePart id={part.id} color={part.color} size={30}/>
      </div>
      <span style={{ opacity:labelOpacity, fontFamily:MONO, fontSize:".5rem", letterSpacing:".12em", textTransform:"uppercase", color:part.color, whiteSpace:"nowrap", textShadow:`0 0 8px ${part.color}` }}>
        {part.label}
      </span>
    </div>
  );
}

/* ─────────────── BREAKDOWN ILLUSTRATION (animated) ─────────────── */
function BreakdownIllustration() {
  return (
    <motion.div
      className="tyre-hero-visual"
      initial={{ opacity:0, x:40 }}
      animate={{ opacity:1, x:0 }}
      transition={{ duration:0.8, delay:0.3, ease:[0.22,1,0.36,1] }}
      style={{ flexShrink:0, width:"min(42vw,440px)", height:"min(42vw,440px)", position:"relative" }}
      className="tyre-hero-visual"
    >
      <svg
        viewBox="0 0 440 440"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width:"100%", height:"100%", overflow:"visible" }}
      >
        <defs>
          <radialGradient id="bgGlow2" cx="50%" cy="70%" r="50%">
            <stop offset="0%" stopColor="#D4A843" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="var(--cv-bg)" stopOpacity="0"/>
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <style>{`
            @keyframes carWobble2    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
            @keyframes floatPerson2  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
            @keyframes speechPop2    { 0%,100%{transform:scale(1) translateY(0)} 45%{transform:scale(1.04) translateY(-3px)} }
            @keyframes batteryBlink2 { 0%,48%{opacity:1} 50%,98%{opacity:0.25} 100%{opacity:1} }
            @keyframes flameDance2   { 0%,100%{transform:scaleY(1) rotate(-3deg);transform-origin:50% 100%} 50%{transform:scaleY(1.25) rotate(4deg);transform-origin:50% 100%} }
          `}</style>
        </defs>

        <rect width="440" height="440" fill="url(#bgGlow2)" rx="20"/>

        {/* ── Ground ── */}
        <line x1="20" y1="360" x2="420" y2="360" stroke="#D4A843" strokeWidth="1.2" strokeOpacity="0.2"/>

        {/* ── Speech bubble (top-right area) ── */}
        <g style={{ animation:"speechPop2 2.8s ease-in-out infinite", transformOrigin:"280px 130px" }}>
          {/* Bubble body */}
          <rect x="178" y="30" width="210" height="118" rx="22" fill="#FFDEC9" stroke="#E0C0A0" strokeWidth="1.5"/>
          {/* Bubble tail pointing down-left toward person head */}
          <path d="M 230 148 L 258 170 L 210 148 Z" fill="#FFDEC9"/>
          {/* Battery shell */}
          <rect x="196" y="55" width="160" height="68" rx="10" fill="none" stroke="#2A1A0A" strokeWidth="3"/>
          {/* Battery tip nub */}
          <rect x="356" y="71" width="12" height="36" rx="4" fill="#2A1A0A"/>
          {/* Low charge fill */}
          <rect x="200" y="59" width="46" height="60" rx="7" fill="#D4A843" style={{ animation:"batteryBlink2 1.3s ease-in-out infinite" }}/>
          {/* Lightning bolt */}
          <path d="M 286 62 L 270 90 L 282 90 L 266 122 L 290 88 L 276 88 Z" fill="#2A1A0A" opacity="0.85"/>
        </g>

        {/* ── Car body ── */}
        <g style={{ animation:"carWobble2 3.6s ease-in-out infinite", transformOrigin:"200px 300px" }}>
          {/* Car silhouette — tilted slightly via transform */}
          <g transform="translate(30, 240) rotate(-3, 185, 80)">
            {/* Main body */}
            <rect x="10" y="55" width="250" height="88" rx="10" fill="#181818" stroke="#D4A843" strokeWidth="1.8" strokeOpacity="0.65"/>
            {/* Roof */}
            <path d="M 40 55 L 68 14 L 188 14 L 212 55 Z" fill="#1E1E1E" stroke="#D4A843" strokeWidth="1.5" strokeOpacity="0.55"/>
            {/* Windscreen */}
            <path d="M 74 18 L 96 52 L 180 52 L 198 18 Z" fill="#D4A843" fillOpacity="0.07" stroke="#D4A843" strokeWidth="0.8" strokeOpacity="0.3"/>
            {/* Door seam */}
            <line x1="120" y1="57" x2="120" y2="142" stroke="#D4A843" strokeWidth="0.8" strokeOpacity="0.3"/>
            {/* Side window */}
            <rect x="22" y="62" width="90" height="40" rx="5" fill="#D4A843" fillOpacity="0.05" stroke="#D4A843" strokeWidth="0.7" strokeOpacity="0.25"/>
            {/* Headlight */}
            <rect x="224" y="78" width="30" height="18" rx="4" fill="#D4A843" fillOpacity="0.12" stroke="#D4A843" strokeWidth="1.2" strokeOpacity="0.5"/>
            <circle cx="239" cy="87" r="6" fill="#D4A843" fillOpacity="0.55" filter="url(#softGlow)"/>
            {/* Grill lines */}
            {[0,7,14].map(dy=><line key={dy} x1="225" y1={100+dy} x2="252" y2={100+dy} stroke="#D4A843" strokeWidth="1" strokeOpacity="0.4"/>)}

            {/* Flat tyre — left (squished oval) */}
            <g transform="translate(58, 140)">
              <ellipse cx="0" cy="8" rx="34" ry="16" fill="#222" stroke="#D4A843" strokeWidth="1.5" strokeOpacity="0.55"/>
              <ellipse cx="0" cy="4" rx="16" ry="10" fill="#2E2E2E" stroke="#D4A843" strokeWidth="1" strokeOpacity="0.35"/>
              {[-22,-14,-6,6,14,22].map(x=><line key={x} x1={x} y1="-6" x2={x} y2="16" stroke="#D4A843" strokeWidth="0.9" strokeOpacity="0.22"/>)}
            </g>

            {/* Normal tyre — right */}
            <g transform="translate(200, 136)">
              <circle cx="0" cy="0" r="28" fill="#1A1A1A" stroke="#D4A843" strokeWidth="1.5" strokeOpacity="0.55"/>
              <circle cx="0" cy="0" r="15" fill="#242424" stroke="#D4A843" strokeWidth="1" strokeOpacity="0.35"/>
              {[0,60,120,180,240,300].map(a=><line key={a}
                x1={9*Math.cos(a*Math.PI/180)} y1={9*Math.sin(a*Math.PI/180)}
                x2={13*Math.cos(a*Math.PI/180)} y2={13*Math.sin(a*Math.PI/180)}
                stroke="#D4A843" strokeWidth="2" strokeOpacity="0.65" strokeLinecap="round"/>)}
            </g>
          </g>
        </g>

        {/* ── Person standing next to car (right side) ── */}
        <g style={{ animation:"floatPerson2 3s ease-in-out infinite", transformOrigin:"340px 280px" }}>
          {/* Legs */}
          <rect x="318" y="295" width="18" height="58" rx="6" fill="#4A6FA5"/>
          <rect x="342" y="295" width="18" height="58" rx="6" fill="#3D5E8C"/>
          {/* Shoes */}
          <ellipse cx="327" cy="354" rx="16" ry="7" fill="#1A1A1A"/>
          <ellipse cx="351" cy="354" rx="16" ry="7" fill="#1A1A1A"/>
          {/* Body / torso */}
          <rect x="310" y="230" width="60" height="68" rx="14" fill="#4A7A3C"/>
          {/* Pocket detail */}
          <rect x="325" y="254" width="16" height="20" rx="4" fill="#3D6632"/>
          {/* Left arm (resting on car) */}
          <path d="M 312 248 Q 288 260 282 275" stroke="#F5D5B8" strokeWidth="12" strokeLinecap="round" fill="none"/>
          {/* Right arm (holding phone) */}
          <path d="M 368 248 Q 385 260 382 278" stroke="#F5D5B8" strokeWidth="12" strokeLinecap="round" fill="none"/>
          {/* Phone */}
          <rect x="374" y="272" width="16" height="24" rx="4" fill="#222" stroke="#D4A843" strokeWidth="1.2" strokeOpacity="0.7"/>
          <rect x="376" y="274" width="12" height="16" rx="2" fill="#D4A843" fillOpacity="0.35"/>
          {/* Neck */}
          <rect x="326" y="218" width="20" height="16" rx="5" fill="#F5D5B8"/>
          {/* Head */}
          <ellipse cx="336" cy="204" rx="26" ry="26" fill="#F5D5B8"/>
          {/* Hair */}
          <path d="M 310 196 Q 336 174 362 196 L 362 190 Q 336 165 310 190 Z" fill="#2A1A0A"/>
          {/* Eyes — looking at phone */}
          <circle cx="328" cy="207" r="3" fill="#2A1A0A"/>
          <circle cx="344" cy="207" r="3" fill="#2A1A0A"/>
        </g>

        {/* ── Flame (bottom-left near flat tyre) ── */}
        <g transform="translate(58, 316)" style={{ animation:"flameDance2 0.75s ease-in-out infinite" }}>
          <path d="M 0 38 Q -10 20 0 0 Q 10 14 18 5 Q 12 22 22 20 Q 14 34 0 38 Z" fill="#C4500A"/>
          <path d="M 0 38 Q -5 24 2 12 Q 8 20 13 12 Q 9 26 15 24 Q 10 33 0 38 Z" fill="#D4A843"/>
          {/* Screwdriver handle */}
          <rect x="-5" y="36" width="10" height="26" rx="4" fill="#888" transform="rotate(-18)"/>
          <rect x="-4" y="60" width="8" height="5" rx="1" fill="#555" transform="rotate(-18)"/>
        </g>

        {/* ── Particle dots ── */}
        {[[55,180],[110,140],[330,200],[390,300],[60,320]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="2.5" fill="#D4A843" fillOpacity={0.3+i*0.08}/>
        ))}

        {/* ── Caption ── */}
        <text x="220" y="400" textAnchor="middle" fontFamily="'Space Mono',monospace" fontSize="10.5" fill="#D4A843" fillOpacity="0.45" letterSpacing="3.5">ROADSIDE RESCUE</text>
      </svg>
    </motion.div>
  );
}

function Hero() {
  return (
    <header className="tyre-hero" style={{
      position:"relative",
      overflow:"hidden",
      background:"var(--cv-bg2)",
    }}>
      {/* Background layers */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
        {/* Charcoal base gradient */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,var(--cv-bg2) 0%,var(--cv-bg) 100%)" }}/>
        {/* Gold glow left */}
        <div style={{ position:"absolute", left:"-8%", top:"10%", width:"40vw", height:"40vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(212,168,67,0.18),transparent 65%)", filter:"blur(72px)", animation:"glowPulse 6s ease-in-out infinite" }}/>
        {/* Amber glow right */}
        <div style={{ position:"absolute", right:"-4%", bottom:"8%", width:"32vw", height:"32vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(196,151,61,0.13),transparent 65%)", filter:"blur(72px)", animation:"glowPulse 8s ease-in-out infinite 1.5s" }}/>
        {/* Subtle gold grid texture */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(90deg,rgba(212,168,67,0.04) 0,rgba(212,168,67,0.04) 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,rgba(212,168,67,0.04) 0,rgba(212,168,67,0.04) 1px,transparent 1px,transparent 80px)" }}/>
        {/* Bottom fade */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 55%,var(--cv-bg2) 100%)" }}/>
      </div>

      <ParticleField />

      {/* ═══ HERO LAYOUT ═══ */}
      <div className="tyre-hero-grid" style={{
        position:"relative", zIndex:5,
        maxWidth:1280, width:"100%", margin:"0 auto",
        padding:"clamp(56px,7vh,88px) clamp(32px,5vw,80px) clamp(40px,5vh,64px)",
        display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between",
        minHeight:"50vh", gap:40,
      }}>

        {/* ── Text column ── */}
        <div style={{ maxWidth:620, width:"100%", minWidth:0 }}>

          {/* Headline */}
          <div style={{ overflow:"hidden" }}>
            <motion.h1 initial={{ y:"108%" }} animate={{ y:"0%" }} transition={{ duration:0.72, delay:0.1, ease:EASE }}
              style={{ margin:0, fontFamily:"'Archivo',sans-serif", fontWeight:900, fontSize:"clamp(1.8rem,3.6vw,3.6rem)", lineHeight:0.94, letterSpacing:"-0.03em", textTransform:"uppercase", color:"var(--cv-text)" }}>
              Every Tyre
            </motion.h1>
          </div>
          <div style={{ overflow:"hidden", marginBottom:8 }}>
            <motion.h1 initial={{ y:"108%" }} animate={{ y:"0%" }} transition={{ duration:0.72, delay:0.2, ease:EASE }}
              style={{ margin:0, fontFamily:"'Archivo',sans-serif", fontWeight:900, fontSize:"clamp(1.8rem,3.6vw,3.6rem)", lineHeight:0.94, letterSpacing:"-0.03em", textTransform:"uppercase", color:"#D4A843" }}>
              Your Car Deserves
            </motion.h1>
          </div>

          {/* Gold accent rule */}
          <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:0.8, delay:0.4, ease:EASE }}
            style={{ height:2, width:80, background:"linear-gradient(90deg,#D4A843,#C4973D)", borderRadius:2, marginBottom:16, transformOrigin:"left" }}/>

          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.42, ease:EASE }}
            style={{ margin:"0 0 20px", fontSize:"clamp(.85rem,1.1vw,0.95rem)", lineHeight:1.6, color:"var(--cv-muted)", maxWidth:460 }}>
            Every major Indian brand, expert fitment advice and 24-hour delivery — engineered grip for the way you actually drive.
          </motion.p>

          {/* CTAs */}
          <motion.div className="tyre-hero-ctas" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.54, ease:EASE }}
            style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
            <motion.a href="#tires" whileHover={{ y:-3, scale:1.03 }} whileTap={{ scale:.96 }}
              style={{ display:"inline-flex", alignItems:"center", gap:9, background:"linear-gradient(135deg,#D4A843,#A8832E)", color:"#1A1508", padding:"12px 24px", borderRadius:6, fontWeight:900, fontSize:".85rem", textDecoration:"none", letterSpacing:".03em", boxShadow:"0 0 28px rgba(212,168,67,0.45)" }}>
              Browse Tyres →
            </motion.a>
            <motion.a href="#brands" whileHover={{ y:-3, scale:1.03 }} whileTap={{ scale:.96 }}
              style={{ display:"inline-flex", alignItems:"center", gap:9, padding:"12px 24px", borderRadius:6, fontWeight:700, fontSize:".85rem", textDecoration:"none", letterSpacing:".03em", cursor:"pointer", background:"rgba(212,168,67,0.10)", border:"1px solid rgba(212,168,67,0.40)", color:"#D4A843", backdropFilter:"blur(8px)" }}>
              Browse Brands
            </motion.a>
          </motion.div>
        </div>

        {/* ── Hero Image ── */}
        <motion.div
          className="tyre-hero-visual"
          initial={{ opacity:0, x:40 }}
          animate={{ opacity:1, x:0 }}
          transition={{ duration:0.8, delay:0.3, ease:[0.22,1,0.36,1] }}
          style={{
            flexShrink:0, width:"min(42vw,440px)", position:"relative",
            display:"flex", alignItems:"center", justifyContent:"center",
            overflow:"hidden",
            maskImage:"linear-gradient(to bottom, black 0%, black 72%, transparent 95%)",
            WebkitMaskImage:"linear-gradient(to bottom, black 0%, black 72%, transparent 95%)",
          }}
        >
          <img
            src="data:image/webp;base64,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"
            alt="Premium Tyres for Every Drive"
            style={{
              width:"100%",
              height:"auto",
              display:"block",
              objectFit:"contain",

            }}
          />
        </motion.div>
      </div>

      {/* Bottom accent rule */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(212,168,67,0.5),rgba(196,151,61,0.35),transparent)", zIndex:6 }}/>
    </header>
  );
}


/* ─────────────── BRAND GALLERY ITEM — Services editorial style ─────────────── */
function BrandGalleryItem({ brand, index, entranceDelay = 0, onSelect }: { brand:TyreBrand; index:number; entranceDelay?:number; onSelect:(n:string)=>void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapRef, { once: true, amount: 0.12 });
  const imgParallaxRef = useScrollParallax(0.10);
  const [hovered, setHovered] = useState(false);

  const src = TYRE_PRODUCT_IMAGES[brand.name];

  return (
    <article
      ref={wrapRef}
      className="brand-gallery-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(brand.name)}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(48px)",
        transition: `opacity .75s cubic-bezier(.22,1,.36,1) ${entranceDelay}ms, transform .75s cubic-bezier(.22,1,.36,1) ${entranceDelay}ms`,
        cursor: "pointer",
      }}
    >
      {/* ── Outer mat frame (double-border effect like reference) ── */}
      <div
        className="brand-gallery-frame"
        style={{
          border: `1px solid ${hovered ? `${brand.accentColor}88` : "rgba(255,255,255,.18)"}`,
          borderRadius: 2,
          padding: 10,
          background: "var(--cv-bg)",
          transition: "border-color .35s ease",
          position: "relative",
        }}
      >
        {/* ── Inner framed image ── */}
        <div style={{
          border: `1px solid ${hovered ? `${brand.accentColor}55` : "rgba(255,255,255,.10)"}`,
          borderRadius: 1,
          overflow: "hidden",
          position: "relative",
          aspectRatio: "3/2",
          background: "var(--cv-bg2)",
          transition: "border-color .35s ease",
        }}>
          {/* Parallax image wrapper */}
          <div
            ref={imgParallaxRef}
            style={{ position:"absolute", inset:"-15% 0", overflow:"hidden" }}
          >
            {src ? (
              <img
                className="brand-gallery-img"
                src={src}
                alt={brand.name}
                loading="lazy"
                style={{
                  width:"100%", height:"100%", objectFit:"cover", display:"block",
                  transform: hovered ? "scale(1.05)" : "scale(1)",
                  filter: hovered ? "brightness(0.95) saturate(1.1)" : "brightness(0.72) saturate(0.85)",
                  transition: "transform .7s cubic-bezier(.25,.46,.45,.94), filter .4s ease",
                }}
              />
            ) : (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"100%", height:"100%", background: "var(--cv-bg2)" }}>
                <FallbackTyreIcon brand={brand.name}/>
              </div>
            )}
          </div>

          {/* Dark vignette */}
          <div style={{
            position:"absolute", inset:0,
            background:"linear-gradient(to top, rgba(3,4,10,.75) 0%, rgba(3,4,10,.1) 40%, transparent 70%)",
            pointerEvents:"none", zIndex:1,
          }}/>

          {/* Corner index badge */}
          <span style={{
            position:"absolute", top:14, left:14, zIndex:2,
            fontFamily:MONO, fontSize:".68rem", fontWeight:700,
            letterSpacing:".1em", color:"rgba(255,255,255,.5)",
          }}>[{String(index).padStart(2,"0")}]</span>

          {/* Speciality badge — bottom left */}
          <span style={{
            position:"absolute", bottom:14, left:14, zIndex:3,
            fontFamily:MONO, fontSize:".58rem", fontWeight:700,
            letterSpacing:".1em", textTransform:"uppercase",
            padding:"4px 10px", borderRadius:999,
            background:`${brand.accentColor}22`, color:brand.accentColor,
            border:`1px solid ${brand.accentColor}55`,
          }}>
            {brand.speciality}
          </span>

          {/* Hover accent tint */}
          <div style={{
            position:"absolute", inset:0, zIndex:1,
            background:`linear-gradient(135deg, ${brand.accentColor}22 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0,
            transition:"opacity .4s ease",
            pointerEvents:"none",
          }}/>
        </div>
      </div>

      {/* ── Caption row ── */}
      <div style={{
        display:"flex", alignItems:"baseline", justifyContent:"space-between",
        gap:12, marginTop:18,
        borderBottom:`1px solid rgba(255,255,255,.07)`,
        paddingBottom:14,
      }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:16, minWidth:0 }}>
          <span style={{
            fontFamily:MONO, fontSize:".7rem", fontWeight:700,
            color:"rgba(255,255,255,.3)", letterSpacing:".06em", flexShrink:0,
          }}>[{String(index).padStart(2,"0")}]</span>
          <h3
            className="brand-gallery-title"
            style={{
              fontFamily:"Archivo, sans-serif",
              fontSize:"clamp(.9rem,1.2vw,1.05rem)",
              fontWeight:800, letterSpacing:".04em", textTransform:"uppercase",
              color: hovered ? brand.accentColor : "rgba(255,255,255,.88)",
              margin:0, transition:"color .3s ease",
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
            }}
          >{brand.name}</h3>
        </div>
        <span style={{
          fontFamily:MONO, fontSize:".68rem",
          color:"rgba(255,255,255,.28)",
          letterSpacing:".05em", flexShrink:0, whiteSpace:"nowrap",
        }}>Est. {brand.founded}</span>
      </div>

      {/* Tagline / origin below caption */}
      <p style={{
        fontFamily:MONO, fontSize:".65rem",
        color:"rgba(255,255,255,.28)",
        letterSpacing:".1em", textTransform:"uppercase",
        margin:"10px 0 0",
      }}>{brand.origin} · {brand.speciality}</p>
    </article>
  );
}

function BrandEditorialGallery({ brands, onSelect }: { brands:TyreBrand[]; onSelect:(n:string)=>void }) {
  const leftItems  = brands.filter((_, i) => i % 2 === 0);
  const rightItems = brands.filter((_, i) => i % 2 === 1);
  return (
    <div className="brand-gallery-cols">
      {/* Left column */}
      <div style={{ display:"flex", flexDirection:"column", gap:32 }}>
        {leftItems.map((b, i) => (
          <BrandGalleryItem
            key={b.name}
            brand={b}
            index={brands.indexOf(b) + 1}
            entranceDelay={i * 80}
            onSelect={onSelect}
          />
        ))}
      </div>
      {/* Right column — staggered down */}
      <div
        className="brand-gallery-col-right"
        style={{ display:"flex", flexDirection:"column", gap:32, marginTop:120 }}
      >
        {rightItems.map((b, i) => (
          <BrandGalleryItem
            key={b.name}
            brand={b}
            index={brands.indexOf(b) + 1}
            entranceDelay={i * 80 + 120}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────── BRAND CARD — TiltedCard physics (kept for reference, unused) ─────────────── */
const CARD_SPRING: Parameters<typeof useSpring>[1] = { damping:30, stiffness:100, mass:2 };

function BrandCard({ brand, index, onSelect }: { brand:TyreBrand; index:number; onSelect:(n:string)=>void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapRef, { once: true, amount: 0.18 });

  /* --- TiltedCard-style motion values --- */
  const rotateX   = useSpring(useMotionValue(0), CARD_SPRING);
  const rotateY   = useSpring(useMotionValue(0), CARD_SPRING);
  const scale     = useSpring(1, CARD_SPRING);
  const tooltipX  = useMotionValue(0);
  const tooltipY  = useMotionValue(0);
  const tooltipOp = useSpring(0, { stiffness:300, damping:28 });
  const captionRot= useSpring(0, { stiffness:350, damping:30, mass:1 });
  const [lastOffY, setLastOffY] = useState(0);
  const [hovered,  setHovered]  = useState(false);

  /* Glare follows cursor exactly like TiltedCard overlay */
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glare  = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0,245,255,0.18) 0%, rgba(139,92,246,0.08) 40%, rgba(0,0,0,0) 70%)`;

  const AMPLITUDE = 14;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - r.left - r.width  / 2;
    const offsetY = e.clientY - r.top  - r.height / 2;

    rotateX.set((offsetY / (r.height / 2)) * -AMPLITUDE);
    rotateY.set((offsetX / (r.width  / 2)) *  AMPLITUDE);

    /* cursor tooltip position (local coords) */
    tooltipX.set(e.clientX - r.left);
    tooltipY.set(e.clientY - r.top);

    /* glare position as percentage */
    glareX.set(((e.clientX - r.left) / r.width)  * 100);
    glareY.set(((e.clientY - r.top)  / r.height) * 100);

    /* caption wobble based on vertical velocity */
    const vel = offsetY - lastOffY;
    captionRot.set(-vel * 0.6);
    setLastOffY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(1.04);
    tooltipOp.set(1);
    setHovered(true);
  }

  function handleMouseLeave() {
    rotateX.set(0); rotateY.set(0); scale.set(1);
    tooltipOp.set(0); captionRot.set(0);
    glareX.set(50); glareY.set(50);
    setHovered(false);
  }

  return (
    /* Fade-in wrapper — spring cascade entrance, align-self:start prevents grid stretch */
    <motion.div
      ref={wrapRef}
      initial={{ opacity:0, y:52, scale:0.91 }}
      animate={isInView ? { opacity:1, y:0, scale:1 } : { opacity:0, y:52, scale:0.91 }}
      transition={{
        duration:.7, ease:EASE, delay: index * 0.09,
        scale: { type:"spring", stiffness:220, damping:20, delay: index * 0.09 + 0.05 },
      }}
      className={isInView ? "ms-card-in-view" : ""}
      style={{ perspective:900, alignSelf:"start" }}
    >
      {/* ── Numbered index badge (top-right, outside card, fades in) ── */}
      <motion.span
        initial={{ opacity:0, y:-8 }}
        animate={isInView ? { opacity:1, y:0 } : {}}
        transition={{ delay: index * 0.09 + 0.35, duration:0.4, ease:[0.22,1,0.36,1] }}
        style={{
          position:"absolute", top:-10, right:4, zIndex:20,
          fontFamily:MONO, fontSize:".55rem", fontWeight:700,
          color: "var(--cv-muted)", letterSpacing:".08em",
          pointerEvents:"none",
        }}
      >
        [{String(index + 1).padStart(2,"0")}]
      </motion.span>

      {/* ── The actual 3D card ── */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(brand.name)}
        style={{
          rotateX, rotateY, scale,
          transformStyle:"preserve-3d",
          willChange:"transform",
          background: hovered
            ? `linear-gradient(135deg, rgba(0,245,255,.09), rgba(139,92,246,.09))`
            : "var(--cv-panel)",
          border:`1.5px solid ${hovered ? brand.accentColor+"88" : "var(--cv-border)"}`,
          borderRadius:18, padding:"28px 24px 24px",
          display:"flex", flexDirection:"column", cursor:"pointer",
          boxShadow: hovered
            ? `0 0 0 1px ${brand.accentColor}22, 0 0 40px ${brand.accentColor}22, 0 32px 64px rgba(0,0,0,.55)`
            : `0 2px 20px rgba(0,0,0,.3)`,
          transition:"background .3s, border-color .3s, box-shadow .3s",
          position:"relative", overflow:"hidden",
        }}
      >
        {/* ── mschristensen border-draw line ── */}
        <div className="ms-card-border-line" />

        {/* ── Glare layer (translateZ so it floats above content in 3-D) ── */}
        <motion.div
          aria-hidden
          style={{
            position:"absolute", inset:0, pointerEvents:"none", zIndex:10,
            background:glare,
            opacity: hovered ? 1 : 0,
            transition:"opacity .3s",
            transform:"translateZ(20px)",
          }}
        />

        {/* ── Corner accent glow ── */}
        <div style={{
          position:"absolute", top:-30, right:-30, width:120, height:120,
          borderRadius:"50%",
          background:`radial-gradient(circle,${brand.accentColor}44,transparent 70%)`,
          opacity: hovered ? 1 : 0, transition:"opacity .3s", pointerEvents:"none",
          transform:"translateZ(0)",
        }}/>

        {/* ── Logo box — pops forward in Z-space ── */}
        <motion.div style={{
          position:"relative", zIndex:1,
          width:80, height:80,
          background: hovered ? `${brand.accentColor}12` : "rgba(0,0,0,.3)",
          borderRadius:14,
          display:"flex", alignItems:"center", justifyContent:"center",
          marginBottom:18,
          border:`1px solid ${hovered ? brand.accentColor+"55" : "var(--cv-border)"}`,
          transition:"all .3s",
          flexShrink:0,
          transform:"translateZ(30px)",
          boxShadow: hovered ? `0 0 20px ${brand.accentColor}44` : "none",
        }}>
          <BrandLogo brand={brand.logo} accent={brand.accentColor}/>
        </motion.div>

        {/* ── Speciality badge — floats at Z=20px ── */}
        <span className="ms-tag" style={{
          position:"relative", zIndex:1, alignSelf:"flex-start",
          fontFamily:MONO, fontSize:".58rem", fontWeight:700,
          letterSpacing:".1em", textTransform:"uppercase",
          padding:"4px 10px", borderRadius:999,
          background:`${brand.accentColor}18`, color:brand.accentColor,
          border:`1px solid ${brand.accentColor}44`,
          marginBottom:10,
          transform:"translateZ(20px)",
          display:"inline-block",
        }}>
          {brand.speciality}
        </span>

        {/* ── Text content ── */}
        <div className="reveal-clip" style={{ overflow:"hidden" }}>
          <h3 className="ms-title" style={{
            position:"relative", zIndex:1,
            fontSize:"1.2rem", fontWeight:900, letterSpacing:"-.02em",
            color: hovered ? "var(--cv-text)" : "#b0c8e0", margin:"0 0 4px",
            transition:"color .3s", transform:"translateZ(12px)",
          }}>{brand.name}</h3>
        </div>

        <div className="reveal-clip" style={{ overflow:"hidden" }}>
          <p className="ms-meta" style={{
            position:"relative", zIndex:1, fontFamily:MONO,
            fontSize:".63rem", color: hovered ? brand.accentColor : "var(--cv-muted)",
            margin:"0 0 12px", letterSpacing:".04em", transition:"color .3s",
            transform:"translateZ(8px)",
          }}>{brand.origin} · Est. {brand.founded}</p>
        </div>

        <div className="reveal-clip" style={{ overflow:"hidden" }}>
          <p className="ms-body" style={{
            position:"relative", zIndex:1,
            fontSize:".82rem", lineHeight:1.65, color: "var(--cv-muted)",
            margin:"0 0 18px", flexGrow:1, transform:"translateZ(4px)",
          }}>{brand.description}</p>
        </div>

        <div style={{
          position:"relative", zIndex:1,
          display:"flex", alignItems:"center", gap:8,
          marginBottom:16, paddingBottom:16,
          borderBottom:`1px solid ${hovered ? brand.accentColor+"33" : "var(--cv-border)"}`,
          transform:"translateZ(4px)",
        }}>
          <span style={{ fontFamily:MONO, fontSize:".68rem", color: "var(--cv-muted)" }}>
            <strong style={{ color: hovered ? brand.accentColor : "var(--cv-text)", fontSize:".88rem" }}>{brand.modelCount}</strong> models available
          </span>
        </div>

        {/* ── CTA button — highest Z ── */}
        <motion.button
          className="ms-cta"
          onClick={e=>{ e.stopPropagation(); onSelect(brand.name); }}
          whileTap={{ scale:.95 }}
          style={{
            position:"relative", zIndex:1,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            padding:"11px 0", borderRadius:8,
            fontSize:".74rem", fontWeight:800, letterSpacing:".06em", textTransform:"uppercase",
            border:`1.5px solid ${hovered ? brand.accentColor : "var(--cv-border)"}`,
            color: hovered ? "var(--cv-bg)" : "var(--cv-muted)",
            background: hovered ? brand.accentColor : "transparent",
            cursor:"pointer", transition:"all .25s",
            fontFamily:"'Archivo',sans-serif", width:"100%",
            boxShadow: hovered ? `0 0 24px ${brand.accentColor}55` : undefined,
            transform:"translateZ(18px)",
          }}>
          View Tyres →
        </motion.button>
      </motion.div>

      {/* ── Cursor-following tooltip (sits outside 3D card to avoid clipping) ── */}
      <motion.div
        className="brand-tooltip"
        style={{
          x: tooltipX, y: tooltipY,
          opacity: tooltipOp,
          rotate: captionRot,
          position:"absolute", top:0, left:0, pointerEvents:"none",
          background:"rgba(6,12,28,0.92)",
          border:`1px solid ${brand.accentColor}55`,
          backdropFilter:"blur(10px)",
          borderRadius:6, padding:"5px 12px",
          fontFamily:MONO, fontSize:".68rem", fontWeight:700,
          color: brand.accentColor,
          letterSpacing:".08em", textTransform:"uppercase",
          whiteSpace:"nowrap", zIndex:50,
          boxShadow:`0 0 16px ${brand.accentColor}44`,
        }}
      >
        {brand.name} · {brand.speciality}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────── GSAP IMAGE PARALLAX ─────────────── */
function useScrollParallax(speed = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * -100,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, [speed]);
  return ref;
}

/* ─────────────── TYRE EDITORIAL CARD — Services gallery style ─────────────── */
function TyreCard({ tire, index, entranceDelay = 0 }: { tire:Tire; index:number; entranceDelay?:number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapRef, { once: true, amount: 0.1 });
  const imgParallaxRef = useScrollParallax(0.10);
  const [errored, setErrored] = useState(false);
  const [hovered, setHovered] = useState(false);

  const src = TYRE_PRODUCT_IMAGES[tire.brand];
  const priceStr = `₹${tire.price.toLocaleString("en-IN")}`;
  const badgeColor = tire.badge==="Best Seller" ? "var(--cv-accent)" : tire.badge==="New Arrival" ? "var(--cv-accent-2)" : "var(--cv-muted)";

  return (
    <motion.article
      ref={wrapRef}
      layout
      className="ed-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity:0, y:52 }}
      animate={isInView ? { opacity:1, y:0 } : { opacity:0, y:52 }}
      exit={{ opacity:0, y:20 }}
      transition={{ duration:.7, ease:EASE, delay: entranceDelay / 1000 }}
    >
      {/* ── Outer mat frame (double-border effect) ── */}
      <div style={{
        border: `1px solid ${hovered ? "rgba(0,245,255,0.55)" : "rgba(255,255,255,0.18)"}`,
        borderRadius: 2,
        padding: 10,
        background: "var(--cv-bg)",
        transition: "border-color .35s ease",
        position: "relative",
      }}>
        {/* ── Inner framed image ── */}
        <div
          className="ed-img-frame"
          style={{
            border: `1px solid ${hovered ? "rgba(0,245,255,0.35)" : "rgba(255,255,255,0.08)"}`,
            transition: "border-color .35s ease",
            aspectRatio: "3/2",
          }}
        >
          {/* GSAP parallax wrapper */}
          <div
            ref={imgParallaxRef}
            style={{ position:"absolute", inset:"-15% 0", overflow:"hidden" }}
          >
            {src && !errored ? (
              <img
                src={src}
                alt={`${tire.brand} ${tire.model}`}
                loading="lazy"
                onError={() => setErrored(true)}
                style={{
                  width:"100%", height:"100%", objectFit:"cover", display:"block",
                  transform: hovered ? "scale(1.06)" : "scale(1)",
                  filter: hovered ? "brightness(1.0) saturate(1.1)" : "brightness(0.82) saturate(0.9)",
                  transition: "transform .7s cubic-bezier(.25,.46,.45,.94), filter .4s ease",
                }}
              />
            ) : (
              <div className="ed-fallback"><FallbackTyreIcon brand={tire.brand}/></div>
            )}
          </div>

          {/* Dark vignette gradient */}
          <div style={{
            position:"absolute", inset:0, zIndex:1,
            background:"linear-gradient(to top, rgba(3,4,10,.7) 0%, rgba(3,4,10,.1) 40%, transparent 70%)",
            pointerEvents:"none",
          }}/>

          {/* Badge top-left */}
          <span className="ed-badge" style={{
            background:`${badgeColor}1A`, color:badgeColor, border:`1px solid ${badgeColor}44`, zIndex:3,
          }}>
            {tire.badge}
          </span>

          {/* Index top-right */}
          <span style={{
            position:"absolute", top:14, right:14, zIndex:3,
            fontFamily:MONO, fontSize:".62rem", fontWeight:700,
            color:"rgba(255,255,255,0.38)", letterSpacing:".06em", pointerEvents:"none",
          }}>
            [{String(index+1).padStart(2,"0")}]
          </span>

          {/* Hover cyan tint overlay */}
          <div style={{
            position:"absolute", inset:0, zIndex:2,
            background:`linear-gradient(135deg, rgba(0,245,255,.14) 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity .4s ease",
            pointerEvents:"none",
          }}/>

          {/* Hover info — brand + size + price rises from bottom */}
          <div className="ed-hover-info" style={{ zIndex:4 }}>
            <p style={{ fontFamily:MONO, fontSize:".6rem", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--cv-accent)", margin:"0 0 4px", textShadow:`0 0 10px var(--cv-accent)` }}>
              {tire.brand}
            </p>
            <p style={{ fontFamily:MONO, fontSize:".7rem", fontWeight:700, color:"rgba(255,255,255,0.9)", margin:0, letterSpacing:".04em" }}>
              {tire.size} · {priceStr} / tyre
            </p>
          </div>
        </div>
      </div>

      {/* ── Caption row: [N]  MODEL NAME  // BRAND — identical layout to Services ── */}
      <div
        className="ed-caption"
        style={{ borderBottom:`1px solid rgba(255,255,255,0.06)`, paddingBottom:13 }}
      >
        <span className="ed-index" style={{ color: hovered ? "var(--cv-accent)" : undefined }}>
          [{String(index+1).padStart(2,"0")}]
        </span>
        <span className="ed-title" style={{ color: hovered ? "#fff" : "var(--cv-text)" }}>
          {tire.model}
        </span>
        <span className="ed-date">// {tire.brand.toUpperCase()}</span>
      </div>

      {/* ── Tagline / price sub-row ── */}
      <div className="ed-price-row">
        <span style={{ fontFamily:MONO, fontSize:".68rem", fontWeight:700, color: "var(--cv-text)", letterSpacing:".02em" }}>
          {priceStr}
          <span style={{ fontWeight:400, color: "var(--cv-muted)", fontSize:".6rem", marginLeft:4 }}>/ tyre</span>
        </span>
        <span style={{ fontFamily:MONO, fontSize:".6rem", color: "var(--cv-muted)", letterSpacing:".04em", display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ color:"var(--cv-accent)" }}>★</span> {tire.rating}
          <span style={{ color:"rgba(122,155,181,.35)", margin:"0 2px" }}>·</span>
          <span style={{ color:"var(--cv-text)", fontSize:".56rem" }}>✓ Free fit</span>
        </span>
      </div>
    </motion.article>
  );
}

/* ─────────────── STAGGERED EDITORIAL TYRE GALLERY — mirrors Services page ─────────────── */
function TyreGallery({ tires }: { tires: Tire[] }) {
  // Split into two columns: left = even indices (0,2,4,…), right = odd (1,3,5,…)
  const leftItems  = tires.filter((_, i) => i % 2 === 0);
  const rightItems = tires.filter((_, i) => i % 2 === 1);

  return (
    <div style={{ position:"relative" }}>
      {/* Decorative grid lines — same as Services EditorialGallery */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
        backgroundImage:`repeating-linear-gradient(90deg, rgba(212,168,67,.018) 0, rgba(212,168,67,.018) 1px, transparent 1px, transparent 80px)`,
      }}/>

      <div
        style={{
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 48px",
          alignItems:"start", position:"relative", zIndex:1,
        }}
        className="tyre-gallery-cols"
      >
        {/* Left column — starts at top */}
        <div style={{ display:"flex", flexDirection:"column", gap:36 }}>
          {leftItems.map((tire, i) => (
            <TyreCard
              key={tire.model}
              tire={tire}
              index={tires.indexOf(tire)}
              entranceDelay={i * 80}
            />
          ))}
        </div>

        {/* Right column — offset ~120px down */}
        <div
          className="tyre-gallery-col-right"
          style={{ display:"flex", flexDirection:"column", gap:36, marginTop:120 }}
        >
          {rightItems.map((tire, i) => (
            <TyreCard
              key={tire.model}
              tire={tire}
              index={tires.indexOf(tire)}
              entranceDelay={i * 80 + 120}
            />
          ))}
        </div>
      </div>

      {/* Empty state */}
      {tires.length === 0 && (
        <div style={{ textAlign:"center", padding:"80px 20px", color: "var(--cv-muted)" }}>
          <p style={{ fontFamily:MONO, fontSize:".9rem", margin:0 }}>No tyres match this filter.</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────── FILTER CHIPS WITH STAGGER ANIMATION ─────────────── */
function FilterChips({
  brandList, brandFilter, setBrandFilter,
}: {
  brandList: string[];
  brandFilter: string;
  setBrandFilter: (b: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="filter-chips-wrap"
      style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:28 }}
    >
      {brandList.map((b, i) => {
        const active = b === brandFilter;
        return (
          <motion.button
            key={b}
            type="button"
            onClick={() => setBrandFilter(b)}
            initial={{ opacity:0, y:14, scale:0.88 }}
            animate={inView ? { opacity:1, y:0, scale:1 } : {}}
            transition={{ delay: i * 0.05, duration: 0.42, ease: [0.22,1,0.36,1] }}
            whileHover={{ scale:1.06, y:-2 }}
            whileTap={{ scale:.93 }}
            style={{
              fontFamily:MONO, fontSize:".7rem", fontWeight:700, letterSpacing:".04em",
              padding:"9px 18px", borderRadius:active ? 8 : 999, cursor:"pointer",
              background:active ? "var(--cv-accent)" : "var(--cv-panel)",
              color:active ? "var(--cv-bg)" : "var(--cv-muted)",
              border:`1px solid ${active ? "var(--cv-accent)" : "var(--cv-border)"}`,
              transition:"all .2s ease",
              boxShadow:active ? `0 0 20px var(--cv-accent)` : undefined,
              position:"relative",
            }}
          >
            {b==="All" ? "All Brands" : b}
            {active && (
              <motion.span
                layoutId="chipDot"
                style={{
                  position:"absolute", bottom:-7, left:"50%",
                  transform:"translateX(-50%)",
                  width:5, height:5, borderRadius:"50%",
                  background:"var(--cv-accent)", display:"block", boxShadow:`0 0 8px var(--cv-accent)`,
                }}
                transition={{ type:"spring", stiffness:400, damping:28 }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

/* ─────────────── SORT ROW WITH SLIDE-IN ANIMATION ─────────────── */
function SortRow({
  sort, setSort, count,
}: {
  sort: string;
  setSort: (s: string) => void;
  count: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div
      ref={ref}
      style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:16, marginBottom:28, paddingBottom:18,
        borderBottom:`1px solid var(--cv-border)`,
      }}
      className="sort-row-inner"
    >
      <motion.p
        initial={{ opacity:0, x:-18 }}
        animate={inView ? { opacity:1, x:0 } : {}}
        transition={{ delay:0.15, duration:0.5, ease:[0.22,1,0.36,1] }}
        style={{ fontFamily:MONO, fontSize:".78rem", color: "var(--cv-muted)", margin:0 }}
      >
        Showing{" "}
        <motion.strong
          initial={{ opacity:0, scale:0.5 }}
          animate={inView ? { opacity:1, scale:1 } : {}}
          transition={{ delay:0.35, type:"spring", stiffness:300, damping:18 }}
          style={{ color:"var(--cv-accent)" }}
        >
          {count}
        </motion.strong>{" "}
        of 10,000+ tyres
      </motion.p>

      <motion.select
        value={sort}
        onChange={e => setSort(e.target.value)}
        initial={{ opacity:0, x:18 }}
        animate={inView ? { opacity:1, x:0 } : {}}
        transition={{ delay:0.2, duration:0.5, ease:[0.22,1,0.36,1] }}
        style={{
          padding:"10px 14px", fontSize:".82rem", fontWeight:600,
          fontFamily:"'Archivo',sans-serif",
          border:`1px solid var(--cv-border)`, borderRadius:8,
          background: "var(--cv-panel)", color: "var(--cv-text)", outline:"none", cursor:"pointer",
        }}
      >
        <option value="top">Sort: Top Rated</option>
        <option value="low">Sort: Price Low → High</option>
        <option value="high">Sort: Price High → Low</option>
        <option value="new">Sort: Newest</option>
      </motion.select>
    </div>
  );
}

/* ─────────────── MAIN PAGE ─────────────── */
export default function Tyres() {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const TT = getTyreTokens(isDark);
  const selectedTyreBrand = location.state?.brand;

  // CSS custom properties — all sub-components inherit via var()
  const cssVars: React.CSSProperties = {
    "--cv-bg":         isDark ? "#0D0D0D"                : "#F0EBE0",
    "--cv-bg2":        isDark ? "#161616"                : "#E8E2D5",
    "--cv-bg-t":       isDark ? "rgba(13,13,13,0.90)"   : "rgba(240,235,224,0.92)",
    "--cv-bg2-t":      isDark ? "rgba(22,22,22,0.88)"   : "rgba(232,226,213,0.88)",
    "--cv-panel":      isDark ? "rgba(25,20,10,0.85)"   : "rgba(255,252,245,0.90)",
    "--cv-text":       isDark ? "#F5EEE8"               : "#1A1508",
    "--cv-muted":      isDark ? "#9E9080"               : "#6B5C3A",
    "--cv-border":     isDark ? "rgba(212,168,67,0.25)" : "rgba(184,118,10,0.22)",
    "--cv-accent":     isDark ? "#D4A843"               : "#B8760A",
    "--cv-accent-dim": isDark ? "#A8832E"               : "#8A5808",
    "--cv-accent-2":   isDark ? "#C4973D"               : "#A07820",
    "--cv-accent-3":   isDark ? "#E8C97A"               : "#D4A830",
  } as React.CSSProperties;
  const [sort, setSort] = useState<SortKey>("top");
  const [brandFilter, setBrandFilter] = useState<string>(selectedTyreBrand ?? "All");
  const brandList = useMemo(()=>["All",...TYRE_BRANDS.map(b=>b.name)],[]);
  const sortedTires = useMemo(()=>{
    const copy=[...TIRES].filter(t=>brandFilter==="All"||t.brand===brandFilter);
    switch(sort){
      case "low":  return copy.sort((a,b)=>a.price-b.price);
      case "high": return copy.sort((a,b)=>b.price-a.price);
      case "new":  return copy.sort((a,b)=>Number(b.badge==="New Arrival")-Number(a.badge==="New Arrival"));
      default:     return copy.sort((a,b)=>b.rating-a.rating);
    }
  },[sort, brandFilter]);
  const handleBrandSelect = (name:string)=>{ setBrandFilter(name); setTimeout(()=>document.getElementById("tires")?.scrollIntoView({ behavior:"smooth" }),80); };


  return(
    <div className="tyres-root" style={{ fontFamily:"'Archivo',system-ui,sans-serif", minHeight:"100vh", WebkitFontSmoothing:"antialiased", position:"relative", ...cssVars, background:"var(--cv-bg)", color:"var(--cv-text)" }}>
      <style>{styles}</style>

      {/* ── PAGE-WIDE PLASMA BACKGROUND ── */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity: isDark ? 1 : 0 }}>
        <PlasmaBg color="#D4A843" speed={0.25} scale={1.15} opacity={0.25} direction="forward" mouseInteractive />
      </div>

      <ScrollProgressLine/>

      {/* Everything below sits in its own positioned layer so it always paints above the fixed Plasma background. */}
      <div style={{ position:"relative", zIndex:1 }}>

      {/* ── HERO ── */}
      <Hero />

      {/* ── BRANDS ── */}
      <section id="brands" style={{ background:"var(--cv-bg2-t)", padding:"80px 40px 88px", position:"relative", overflow:"hidden" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:2 }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true, amount:.3 }}
            style={{ marginBottom:48, display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <SectionLabel index="01" label="Our Indian Partners" delay={0} />
              <SplitHeading style={{ fontSize:"clamp(1.9rem,3.6vw,2.8rem)", fontWeight:900, color: "var(--cv-text)", letterSpacing:"-.025em", lineHeight:1.02, marginBottom:10 }}>
                World-Class Indian Tyre Brands
              </SplitHeading>
              <AnimatedDivider color={CYAN} delay={0.3} />
              <p style={{ color: "var(--cv-muted)", fontSize:".95rem", marginTop:0, maxWidth:440 }}>We stock every major <span className="shimmer-text" style={{ fontWeight:700 }}>Indian brand</span> — from track-day performers to all-terrain legends.</p>
            </div>
            <motion.span
              initial={{ opacity:0, x:20 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }}
              transition={{ delay:0.5, duration:0.5, ease:[0.22,1,0.36,1] }}
              style={{ fontFamily:MONO, fontSize:".72rem", color: "var(--cv-muted)", letterSpacing:".05em" }}
            >{TYRE_BRANDS.length} brands · {TIRES.length} featured models</motion.span>
          </motion.div>
          <BrandEditorialGallery brands={TYRE_BRANDS} onSelect={handleBrandSelect}/>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="tires" style={{ background:"var(--cv-bg-t)", padding:"72px 40px 88px", position:"relative" }}>
        <div style={{ position:"absolute", bottom:"5%", left:"5%", width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle,var(--cv-accent),transparent 65%)`, filter:"blur(80px)", pointerEvents:"none", zIndex:1 }}/>
        <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:2 }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true, amount:.4 }} style={{ marginBottom:30 }}>
            <SectionLabel index="02" label="Browse" delay={0} />
            <SplitHeading style={{ fontSize:"clamp(1.9rem,3.6vw,2.8rem)", fontWeight:900, color: "var(--cv-text)", letterSpacing:"-.025em", lineHeight:1.02 }}>
              {brandFilter==="All" ? "All Tyres" : `${brandFilter} Tyres`}
            </SplitHeading>
            <AnimatedDivider color={CYAN} delay={0.2} />
          </motion.div>

          {/* Filter chips — stagger animated */}
          <FilterChips brandList={brandList} brandFilter={brandFilter} setBrandFilter={setBrandFilter} />

          {/* Sort row — slide-in animated */}
          <SortRow sort={sort} setSort={s => setSort(s as SortKey)} count={sortedTires.length} />

          <motion.div layout className="tyre-product-grid">
            <AnimatePresence mode="popLayout">
              <TyreGallery tires={sortedTires} />
            </AnimatePresence>
          </motion.div>
          {sortedTires.length===0 && (
            <div style={{ textAlign:"center", padding:"60px 20px", color: "var(--cv-muted)" }}>
              <p style={{ fontFamily:MONO, fontSize:".9rem", margin:0 }}>No tyres match this filter.</p>
            </div>
          )}
        </div>
      </section>
      </div>
    </div>
  );
}
