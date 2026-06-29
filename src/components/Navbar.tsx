import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { NAV_LINKS, ROUTES } from "../config/site";
import { useTheme } from "../context/ThemeContext";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "currentColor", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }} aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "currentColor", fill: "currentColor", strokeWidth: 0 }} aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { closeMenu(); }, [location.pathname]);

  // Dynamic colour tokens so the injected <style> re-evaluates on theme change
  const bgScrolled   = isDark ? "rgba(5,5,5,0.92)"       : "rgba(250,247,240,0.96)";
  const navBorder    = isDark ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.08)";
  const hairline     = isDark ? "rgba(245,168,0,0.18)"    : "rgba(200,136,10,0.20)";
  const linkColor    = isDark ? "rgba(255,255,255,0.72)"  : "rgba(26,26,20,0.70)";
  const linkActive   = isDark ? "#ffffff"                 : "#1A1A14";
  const drawerBg     = isDark ? "rgba(5,5,5,0.97)"        : "rgba(250,247,240,0.98)";
  const gradCyan     = isDark ? "#F5A800"                 : "#C8880A";
  const gradPink     = isDark ? "#D4D4D4"                 : "#888888";
  const accent       = isDark ? "#F5A800"                 : "#C8880A";
  const hamBg        = isDark ? "#ffffff"                 : "#1A1A14";
  const rowSep       = isDark ? "rgba(255,255,255,0.05)"  : "rgba(0,0,0,0.05)";

  const toggleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.18)"}`,
    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    color: isDark ? "#ffffff" : "#1A1A14",
    cursor: "pointer",
    flexShrink: 0,
    padding: 0,
    transition: "background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s",
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap');

    .cts-nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      transition: background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease;
    }
    .cts-nav.is-top {
      background: transparent;
      border-bottom: 1px solid transparent;
      backdrop-filter: none;
    }
    .cts-nav.is-scrolled {
      background: ${bgScrolled};
      border-bottom: 1px solid ${navBorder};
      backdrop-filter: blur(18px) saturate(160%);
      -webkit-backdrop-filter: blur(18px) saturate(160%);
    }
    .cts-nav-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 clamp(20px,4vw,56px);
      height: 76px;
      display: flex;
      align-items: center;
      gap: 0;
    }
    .cts-nav-logo {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      text-decoration: none;
    }
    .cts-nav-links {
      display: flex;
      align-items: center;
      gap: clamp(20px,3vw,48px);
      list-style: none;
      margin: 0;
      padding: 0;
      flex: 1;
      justify-content: center;
    }
    .cts-nav-link {
      font-family: 'Oswald', sans-serif;
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: ${linkColor};
      text-decoration: none;
      position: relative;
      padding: 4px 0;
      white-space: nowrap;
      transition: color 0.2s ease;
    }
    .cts-nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 50%; right: 50%;
      height: 1px;
      background: linear-gradient(to right, ${gradCyan}, ${gradPink});
      transition: left 0.28s cubic-bezier(.22,1,.36,1), right 0.28s cubic-bezier(.22,1,.36,1);
    }
    .cts-nav-link:hover,
    .cts-nav-link.is-active { color: ${linkActive}; }
    .cts-nav-link:hover::after,
    .cts-nav-link.is-active::after { left: 0; right: 0; }
    .cts-nav-link.is-active {
      background: linear-gradient(to right, ${gradCyan}, ${gradPink});
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    .cts-nav-right-desktop {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      margin-left: 14px;
    }
    .cts-theme-btn:hover {
      background: ${accent} !important;
      border-color: ${accent} !important;
      color: #fff !important;
      transform: scale(1.08);
    }
    .cts-nav-toggle {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      width: 40px;
      height: 40px;
      background: none;
      border: 1px solid ${hairline};
      border-radius: 8px;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
      margin-left: 8px;
    }
    .cts-nav-toggle span {
      display: block;
      width: 20px;
      height: 1.5px;
      background: ${hamBg};
      border-radius: 2px;
      transition: transform 0.3s ease, opacity 0.3s ease;
      transform-origin: center;
    }
    .cts-nav-toggle.is-open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    .cts-nav-toggle.is-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .cts-nav-toggle.is-open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

    @media (max-width: 860px) {
      .cts-nav-toggle { display: flex; }
      .cts-nav-links  { display: none; }
      .cts-nav-right-desktop { display: none; }

      .cts-mobile-drawer {
        position: fixed;
        top: 76px; left: 0; right: 0;
        z-index: 999;
        flex-direction: column;
        align-items: stretch;
        background: ${drawerBg};
        backdrop-filter: blur(20px);
        border-bottom: 1px solid ${hairline};
        padding: 20px 24px 28px;
        transform: translateY(-110%);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.38s cubic-bezier(.22,1,.36,1), opacity 0.38s;
        display: flex;
      }
      .cts-mobile-drawer.is-open {
        transform: translateY(0);
        opacity: 1;
        pointer-events: all;
      }
      .cts-mobile-links {
        display: flex;
        flex-direction: column;
        list-style: none;
        margin: 0 0 16px;
        padding: 0 0 16px;
        border-bottom: 1px solid ${hairline};
        gap: 0;
      }
      .cts-mobile-links li a {
        font-family: 'Oswald', sans-serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: ${linkColor};
        text-decoration: none;
        display: block;
        padding: 13px 0;
        border-bottom: 1px solid ${rowSep};
        transition: color 0.2s;
      }
      .cts-mobile-links li a:hover,
      .cts-mobile-links li a.is-active { color: ${linkActive}; }
      .cts-mobile-theme-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 8px;
        font-family: 'Oswald', sans-serif;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: ${linkColor};
      }
    }
    @media (min-width: 861px) {
      .cts-mobile-drawer { display: none !important; }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <nav className={`cts-nav ${scrolled ? "is-scrolled" : "is-top"}`} role="navigation" aria-label="Main navigation">
        <div className="cts-nav-inner">

          {/* Logo */}
          <NavLink to={ROUTES.home} className="cts-nav-logo" onClick={closeMenu} aria-label="CTS Tyres — home">
            <Logo
              size={72}
              textSize={22}
              filter={
                isDark
                  ? undefined
                  : "brightness(0.15) saturate(2) sepia(0.4) hue-rotate(5deg)"
              }
            />
          </NavLink>

          {/* Desktop nav links — centred */}
          <ul className="cts-nav-links">
            {NAV_LINKS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === ROUTES.home}
                  className={({ isActive }) => `cts-nav-link${isActive ? " is-active" : ""}`}
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop — theme toggle only */}
          <div className="cts-nav-right-desktop">
            <button
              type="button"
              className="cts-theme-btn"
              style={toggleStyle}
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            className={`cts-nav-toggle${menuOpen ? " is-open" : ""}`}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer — outside nav so it layers correctly */}
      <div className={`cts-mobile-drawer${menuOpen ? " is-open" : ""}`} role="dialog" aria-modal="false" aria-label="Navigation menu">
        <ul className="cts-mobile-links">
          {NAV_LINKS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === ROUTES.home}
                className={({ isActive }) => isActive ? "is-active" : ""}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="cts-mobile-theme-row">
          <span>{isDark ? "Dark Mode" : "Light Mode"}</span>
          <button
            type="button"
            className="cts-theme-btn"
            style={toggleStyle}
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </>
  );
}
