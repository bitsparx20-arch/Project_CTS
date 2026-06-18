import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { NAV_LINKS, ROUTES } from "../config/site";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="main-nav">
      <div className="main-nav-inner">
        <div onClick={closeMenu}>
          <Logo size={36} textSize={22} />
        </div>

        <div className={`main-nav-menu ${menuOpen ? "is-open" : ""}`}>
          <ul className="main-nav-links">
            {NAV_LINKS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === ROUTES.home}
                  className={({ isActive }) =>
                    `main-nav-link ${isActive ? "is-active" : ""}`
                  }
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <NavLink to={ROUTES.tyres} className="main-nav-cta" onClick={closeMenu}>
            Find My Tyre
          </NavLink>
        </div>

        <button
          type="button"
          className={`main-nav-toggle ${menuOpen ? "is-open" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
