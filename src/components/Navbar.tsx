import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { NAV_LINKS, ROUTES } from "../config/site";
import { useTheme } from "../context/ThemeContext";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{
        width: 15,
        height: 15,
        stroke: "currentColor",
        fill: "none",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{
        width: 15,
        height: 15,
        stroke: "currentColor",
        fill: "currentColor",
        strokeWidth: 0,
      }}
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const location                 = useLocation();
  const { theme, toggleTheme }   = useTheme();
  const isDark                   = theme === "dark";

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { closeMenu(); }, [location.pathname]);

  // Only the per-element inline styles that can't live in CSS
  // (border / background / color react to isDark at render time)
  const toggleBtnStyle: React.CSSProperties = {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    width:          36,
    height:         36,
    borderRadius:   "50%",
    border:         `1px solid ${isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.18)"}`,
    background:     isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    color:          isDark ? "#ffffff" : "#1A1A14",
    cursor:         "pointer",
    flexShrink:     0,
    padding:        0,
    transition:     "background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s",
  };

  return (
    <>
      {/* ── Desktop nav ───────────────────────────────────────────── */}
      <nav
        className={`cts-nav ${scrolled ? "is-scrolled" : "is-top"}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="cts-nav-inner">

          {/* Logo */}
          <NavLink
            to={ROUTES.home}
            className="cts-nav-logo"
            onClick={closeMenu}
            aria-label="CTS Tyres — home"
          >
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

          {/* Desktop links — centred */}
          <ul className="cts-nav-links">
            {NAV_LINKS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === ROUTES.home}
                  className={({ isActive }) =>
                    `cts-nav-link${isActive ? " is-active" : ""}`
                  }
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop — theme toggle */}
          <div className="cts-nav-right-desktop">
            <button
              type="button"
              className="cts-theme-btn"
              style={toggleBtnStyle}
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

      {/* ── Mobile drawer ─────────────────────────────────────────── */}
      <div
        className={`cts-mobile-drawer${menuOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-label="Navigation menu"
      >
        <ul className="cts-mobile-links">
          {NAV_LINKS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === ROUTES.home}
                className={({ isActive }) => (isActive ? "is-active" : "")}
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
            style={toggleBtnStyle}
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
