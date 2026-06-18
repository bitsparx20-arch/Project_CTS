import { useState } from "react";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1, icon: "🔄", title: "Tyre Replacement", tagline: "Right fit. Every time.",
    description: "Full range of passenger, SUV, and commercial tyre replacements. We stock leading brands and help you pick the right compound, load rating, and size for your vehicle.",
    features: ["All vehicle types", "Brand-agnostic advice", "Same-day fitment", "Old tyre disposal"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: 2, icon: "⚖️", title: "Wheel Balancing", tagline: "Smooth out every kilometre.",
    description: "Computer-aided dynamic balancing eliminates vibration at speed, reduces uneven tyre wear, and protects your suspension from unnecessary stress.",
    features: ["Digital balancing machine", "All wheel sizes", "Post-fitment check included", "Highway-speed tested"],
    image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&q=80",
  },
  {
    id: 3, icon: "🎯", title: "Wheel Alignment", tagline: "Straight tracking. Less drag.",
    description: "3D laser alignment corrects camber, caster, and toe angles to manufacturer spec. Misaligned wheels wear tyres unevenly and hurt fuel economy.",
    features: ["3D laser alignment", "4-wheel geometry check", "Steering adjustment", "Print-out report"],
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80",
  },
  {
    id: 4, icon: "🔧", title: "Tyre Rotation", tagline: "Even wear across all four.",
    description: "Regular rotation extends the life of your full tyre set by distributing wear patterns evenly across all four wheels.",
    features: ["Drivetrain-specific patterns", "Torque-verified re-fit", "Inspection included", "Every 8–10k km"],
    image: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=600&q=80",
  },
  {
    id: 5, icon: "🛠️", title: "Puncture Repair", tagline: "Back on the road in minutes.",
    description: "Industry-standard plug-and-patch repairs for repairable punctures. We assess every damage site honestly and show you your options.",
    features: ["Plug & patch method", "Valve stem check", "Pressure reset", "Honest assessment"],
    image: "https://images.unsplash.com/photo-1591293835940-934a7c4f2d9b?w=600&q=80",
  },
  {
    id: 6, icon: "💨", title: "Nitrogen Inflation", tagline: "Stable pressure. Longer life.",
    description: "Nitrogen-filled tyres hold pressure more consistently across temperature changes, improving fuel efficiency and tyre longevity.",
    features: ["Purity-checked fill", "Slower pressure loss", "Better fuel economy", "Ideal for long-haul"],
    image: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&q=80",
  },
  {
    id: 7, icon: "🔍", title: "Tyre Inspection", tagline: "Know before you go.",
    description: "Comprehensive visual and depth inspection of tread wear, sidewall condition, age cracking, and bead seating. We flag issues early.",
    features: ["Tread depth measurement", "Age & crack assessment", "Pressure check", "Written report"],
    image: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=80",
  },
  {
    id: 8, icon: "🏎️", title: "Performance Tyres", tagline: "Spec-grade rubber for serious drivers.",
    description: "Sourcing and fitment of ultra-high-performance, run-flat, and track-day tyres. OEM specs, speed ratings, and load indexes handled correctly.",
    features: ["UHP & run-flat range", "OEM-spec fitment", "TPMS reset", "Track & road options"],
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
  },
  {
    id: 9, icon: "🚛", title: "Commercial & Fleet", tagline: "Keeping fleets moving.",
    description: "Dedicated servicing for trucks, vans, buses, and company fleets. Fleet accounts get priority bays, bulk pricing, and service logs.",
    features: ["Fleet accounts available", "On-site visit options", "Service history logs", "Bulk pricing"],
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
  },
];

function Navbar() {
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5%" }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <svg width="34" height="34" viewBox="0 0 38 38" fill="none">
          <circle cx="19" cy="19" r="18" stroke="#666" strokeWidth="2.5" fill="none" />
          <circle cx="19" cy="19" r="13" fill="#1a0000" stroke="#C03020" strokeWidth="3.5" />
          <circle cx="19" cy="19" r="7" fill="#C03020" />
          <circle cx="19" cy="19" r="3.5" fill="#E04030" />
          {[0, 90, 180, 270].map((angle) => (
            <line key={angle} x1="19" y1="1" x2="19" y2="5" stroke="#666" strokeWidth="2" transform={`rotate(${angle} 19 19)`} />
          ))}
        </svg>
        <span style={{ color: "#fff", fontSize: 20, fontWeight: 900, letterSpacing: 3 }}>
          C<span style={{ color: "#e63c2f" }}>T</span>S
        </span>
      </Link>
      <ul style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0 }}>
        {[
          { label: "Home", to: "/" },
          { label: "Services", to: "/service" },
          { label: "Tyres", to: "/tyres" },
          { label: "About Us", to: "/aboutus" },
          { label: "Contact", to: "/contactus" },
        ].map((item) => (
          <li key={item.label}>
            <Link
              to={item.to}
              style={{ color: "#ccc", textDecoration: "none", fontSize: 14, fontWeight: 500, letterSpacing: "0.02em" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e63c2f")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/tyres" style={{ background: "#e63c2f", color: "#fff", textDecoration: "none", padding: "9px 20px", borderRadius: 4, fontSize: 13, fontWeight: 700 }}>
        Find My Tyre
      </Link>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#111", paddingTop: 40 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 32px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, borderBottom: "1px solid #2a2a2a" }}>
        <div>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 12 }}>
            <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
              <circle cx="19" cy="19" r="18" stroke="#555" strokeWidth="2.5" fill="none" />
              <circle cx="19" cy="19" r="13" fill="#1a0000" stroke="#C03020" strokeWidth="3.5" />
              <circle cx="19" cy="19" r="7" fill="#C03020" />
              <circle cx="19" cy="19" r="3.5" fill="#E04030" />
              {[0, 90, 180, 270].map((angle) => (
                <line key={angle} x1="19" y1="1" x2="19" y2="5" stroke="#555" strokeWidth="2" transform={`rotate(${angle} 19 19)`} />
              ))}
            </svg>
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 900, letterSpacing: 3 }}>C<span style={{ color: "#e63c2f" }}>T</span>S</span>
          </Link>
          <p style={{ color: "#888", fontSize: 12, lineHeight: 1.7, maxWidth: 260, margin: "0 0 16px" }}>
            Your trusted partner for tyres across India. Quality brands, expert advice, and fast delivery.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "f",  icon: <svg viewBox="0 0 24 24" width="15" height="15" fill="#888"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg> },
              { label: "in", icon: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#888" strokeWidth={1.8}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg> },
              { label: "W",  icon: <svg viewBox="0 0 24 24" width="15" height="15" fill="#888"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.4-.7-2.3-1.2-3.3-2.8-.2-.3.2-.3.5-.9.1-.2 0-.3-.1-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9 1-.9 2.3 0 1.3 1 2.6 1.1 2.8.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z"/></svg> },
            ].map((s) => (
              <a key={s.label} href="#" style={{ width: 32, height: 32, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#e63c2f")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#222")}
              >{s.icon}</a>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ color: "#fff", fontSize: 12, fontWeight: 700, marginBottom: 12, letterSpacing: "0.5px" }}>Quick Links</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { label: "Home", to: "/" },
              { label: "Services", to: "/service" }, // ✅ Fixed: added missing comma
              { label: "Tyres", to: "/tyres" },       // ✅ Fixed: "/Tyres" → "/tyres"
              { label: "About Us", to: "/aboutus" },
              { label: "Contact", to: "/contactus" },
              { label: "FAQ", to: "#" },
            ].map((link) => (
              <li key={link.label} style={{ marginBottom: 8 }}>
                <Link to={link.to} style={{ color: "#888", textDecoration: "none", fontSize: 12 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#e63c2f")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                >{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ color: "#fff", fontSize: 12, fontWeight: 700, marginBottom: 12, letterSpacing: "0.5px" }}>Contact Us</h4>
          {[
            { icon: "📞", text: "+91 98765 43210" },
            { icon: "✉",  text: "info@ctstyres.com" },
            { icon: "📍", text: "Mumbai, Maharashtra" },
            { icon: "🕐", text: "Mon – Sat, 9am – 7pm" },
          ].map((item) => (
            <div key={item.text} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 12, marginTop: 1 }}>{item.icon}</span>
              <span style={{ color: "#888", fontSize: 12, lineHeight: 1.6 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <p style={{ color: "#555", fontSize: 11, margin: 0 }}>© {new Date().getFullYear()} CTS — Complete Tyre Solutions. All rights reserved.</p>
        <div style={{ display: "flex", gap: 16 }}>
          {["Privacy Policy", "Terms of Service"].map((item) => (
            <a key={item} href="#" style={{ color: "#555", fontSize: 11, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e63c2f")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
            >{item}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function ServicePage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "Inter, Helvetica Neue, Arial, sans-serif", background: "#fff", minHeight: "100vh" }}>

      <Navbar />

      {/* HERO — compact */}
      <header style={{
        height: "45vh", minHeight: 320,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f9f9f9", borderBottom: "1px solid #e4e4e4",
        padding: "0 24px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 560, paddingTop: 24 }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#C03020", marginBottom: 10, fontWeight: 700 }}>
            Complete Tyre Solutions
          </p>
          <h1 style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#111", marginBottom: 12 }}>
            Every service — <span style={{ color: "#C03020" }}>your tyres need.</span>
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.65, maxWidth: 400, margin: "0 auto 18px" }}>
            From a simple puncture repair to full fleet management — CTS has the expertise and parts to keep you moving safely.
          </p>
          <a href="#services" style={{ display: "inline-block", background: "#C03020", color: "#fff", padding: "9px 22px", borderRadius: 4, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", letterSpacing: "0.04em" }}>
            Explore Services ↓
          </a>
        </div>

        <div style={{ position: "absolute", right: -60, top: "50%", transform: "translateY(-50%)", width: 260, height: 260, opacity: 0.06, pointerEvents: "none" }}>
          <svg viewBox="0 0 300 300" fill="none" style={{ width: "100%", height: "100%" }}>
            <circle cx="150" cy="150" r="140" stroke="#C03020" strokeWidth="3" />
            <circle cx="150" cy="150" r="100" stroke="#C03020" strokeWidth="2" />
            <circle cx="150" cy="150" r="60"  stroke="#C03020" strokeWidth="2" />
            <circle cx="150" cy="150" r="20"  fill="#C03020" />
            <line x1="150" y1="0"   x2="150" y2="300" stroke="#C03020" strokeWidth="1.5" />
            <line x1="0"   y1="150" x2="300" y2="150" stroke="#C03020" strokeWidth="1.5" />
          </svg>
        </div>
      </header>

      {/* SERVICES SECTION */}
      <section id="services" style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px 72px" }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ display: "inline-block", background: "#fff0ee", color: "#C03020", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(192,48,32,0.2)", marginBottom: 10 }}>
            What We Do
          </span>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>
            Our Services
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {services.map((s) => (
            <div
              key={s.id}
              onClick={() => setActive(active === s.id ? null : s.id)}
              style={{
                background: "#fff",
                border: active === s.id ? "1.5px solid #C03020" : "1.5px solid #e4e4e4",
                borderRadius: 10, overflow: "hidden", cursor: "pointer",
                transition: "all 0.25s",
                boxShadow: active === s.id ? "0 8px 28px rgba(192,48,32,0.13)" : "0 2px 6px rgba(0,0,0,0.04)",
                transform: active === s.id ? "translateY(-2px)" : "none",
              }}
            >
              <div style={{ position: "relative", width: "100%", height: 160, overflow: "hidden", background: "#f0f0f0" }}>
                <img src={s.image} alt={s.title} loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent 55%)" }} />
                <span style={{ position: "absolute", top: 10, right: 10, background: "#C03020", color: "#fff", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", padding: "3px 8px", borderRadius: 20 }}>
                  {String(s.id).padStart(2, "0")}
                </span>
              </div>

              <div style={{ padding: "16px 18px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: "1rem" }}>{s.icon}</span>
                  <span style={{ fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#C03020" }}>
                    {s.tagline}
                  </span>
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111", marginBottom: 6, letterSpacing: "-0.01em" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "0.8rem", color: "#666", lineHeight: 1.6, marginBottom: 10 }}>
                  {s.description}
                </p>

                {active === s.id && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 10px", borderTop: "1px solid #f0f0f0", paddingTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
                    {s.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.78rem", color: "#333" }}>
                        <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "#C03020", flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <button style={{ background: "none", border: "none", color: "#C03020", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer", padding: 0, letterSpacing: "0.04em" }}>
                  {active === s.id ? "Show less ↑" : "Learn more ↓"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#111" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "44px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 800, color: "#fff", marginBottom: 4 }}>Need a tyre check today?</h2>
            <p style={{ color: "#888", fontSize: "0.86rem" }}>Walk in or book a bay — we'll sort you out.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="tel:+911234567890" style={{ background: "#C03020", color: "#fff", padding: "10px 22px", fontWeight: 700, fontSize: "0.85rem", borderRadius: 4, textDecoration: "none", letterSpacing: "0.04em" }}>
              Call Us
            </a>
            <a href="#" style={{ background: "transparent", color: "#fff", padding: "10px 22px", fontWeight: 700, fontSize: "0.85rem", borderRadius: 4, textDecoration: "none", border: "1px solid #333", letterSpacing: "0.04em" }}>
              Book Online
            </a>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
