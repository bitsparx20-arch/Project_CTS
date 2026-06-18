import { Link } from "react-router-dom";

const IconMission = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="#fff" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
  </svg>
);
const IconRange = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="#fff" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconPromise = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="#fff" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const cards = [
  { icon: <IconMission />, title: "Our Mission", body: "To be the most trusted tyre reseller in the country, one vehicle at a time." },
  { icon: <IconRange />,   title: "Our Range",   body: "10,000+ tyres from 8+ global brands, always in stock and ready to ship." },
  { icon: <IconPromise />, title: "Our Promise", body: "No confusing jargon. No unnecessary upsell. Just the right tyre for you." },
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
        <span style={{ color: "#fff", fontSize: 20, fontWeight: 900, letterSpacing: 3 }}>C<span style={{ color: "#e63c2f" }}>T</span>S</span>
      </Link>
      <ul style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0 }}>
        {[
          { label: "Home", to: "/" }, { label: "Services", to: "/service" },
          { label: "Tyres", to: "/tyres" }, { label: "About Us", to: "/aboutus" },
          { label: "Contact", to: "/contactus" },
        ].map((item) => (
          <li key={item.label}>
            <Link to={item.to} style={{ color: "#ccc", textDecoration: "none", fontSize: 13, letterSpacing: 0.5 }}>{item.label}</Link>
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
              { label: "Home", to: "/" }, { label: "Services", to: "/service" },
              { label: "Tyres", to: "/tyres" }, { label: "About Us", to: "/aboutus" },
              { label: "Contact", to: "/contactus" }, { label: "FAQ", to: "#" },
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

export default function AboutUs() {
  return (
    <div style={{ fontFamily: "Inter, Helvetica Neue, Arial, sans-serif", background: "#fff", color: "#111", minHeight: "100vh" }}>

      <Navbar />

      {/* HERO */}
      <header style={{
        height: "45vh", minHeight: 320,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f9f9f9", borderBottom: "1px solid #e4e4e4",
        padding: "0 24px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 560, paddingTop: 24 }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#C03020", marginBottom: 10, fontWeight: 700 }}>
            Our Story
          </p>
          <h1 style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#111", marginBottom: 12 }}>
            About CTS — <span style={{ color: "#C03020" }}>who we are.</span>
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.65, maxWidth: 400, margin: "0 auto 18px" }}>
            The right tyre, at the right price — backed by people who actually know tyres.
          </p>
          <a href="#about" style={{ display: "inline-block", background: "#C03020", color: "#fff", padding: "9px 22px", borderRadius: 4, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", letterSpacing: "0.04em" }}>
            Learn More ↓
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

      {/* ABOUT */}
      <section id="about" style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px 0" }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ display: "inline-block", background: "#fff0ee", color: "#C03020", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(192,48,32,0.2)", marginBottom: 10 }}>
            Who We Are
          </span>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>
            About CTS
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48, border: "1px solid #e4e4e4", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "36px 32px" }}>
            <p style={{ fontSize: "0.92rem", color: "#333", lineHeight: 1.72, marginBottom: 14 }}>
              CTS was founded with one simple goal: <strong>make it easy for every driver to find the right tyre at the right price.</strong>
            </p>
            <p style={{ fontSize: "0.92rem", color: "#333", lineHeight: 1.72, marginBottom: 14 }}>
              We carry thousands of tyres from the world's leading brands — from budget-friendly everyday options to high-performance specialists.
            </p>
            <p style={{ fontSize: "0.92rem", color: "#333", lineHeight: 1.72 }}>
              Our experts don't just sell tyres — they help you choose the right one without the jargon.
            </p>
          </div>
          <div style={{ padding: "36px 32px", background: "#f9f9f9", borderLeft: "1px solid #e4e4e4" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: 14 }}>
              The CTS Promise
            </p>
            <h3 style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 900, lineHeight: 1.2, color: "#111", letterSpacing: "-0.02em" }}>
              Fast delivery.<br />
              <span style={{ color: "#C03020" }}>Honest</span> pricing.<br />
              Expert advice.
            </h3>
            <div style={{ width: 32, height: 3, background: "#C03020", margin: "16px 0", borderRadius: 2 }} />
            <p style={{ fontSize: "0.86rem", color: "#666", lineHeight: 1.65 }}>
              Just the right tyre — chosen for your vehicle, driving style, and budget.
            </p>
          </div>
        </div>
      </section>

      {/* KEY CARDS */}
      <section style={{ borderTop: "1px solid #e4e4e4", borderBottom: "1px solid #e4e4e4" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {cards.map((card, i) => (
            <div key={card.title} style={{ padding: "36px 32px", borderRight: i < cards.length - 1 ? "1px solid #e4e4e4" : "none" }}>
              <div style={{ width: 40, height: 40, borderRadius: 4, background: "#C03020", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111", marginBottom: 8, letterSpacing: "-0.01em" }}>{card.title}</h3>
              <p style={{ fontSize: "0.84rem", color: "#666", lineHeight: 1.6 }}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#1a1a1a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "44px 24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { stat: "10,000+", label: "Tyres in Stock" },
            { stat: "8+",      label: "Global Brands" },
            { stat: "24h",     label: "Fast Delivery" },
          ].map((item, i) => (
            <div key={item.label} style={{ textAlign: "center", padding: "12px", borderRight: i < 2 ? "1px solid #2e2e2e" : "none" }}>
              <div style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", fontWeight: 900, color: "#C03020", marginBottom: 4, letterSpacing: "-0.02em" }}>
                {item.stat}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#888", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#111" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "44px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 800, color: "#fff", marginBottom: 4 }}>Ready to find your perfect tyre?</h2>
            <p style={{ color: "#888", fontSize: "0.86rem" }}>Browse our full range or talk to one of our experts.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/tyres" style={{ background: "#C03020", color: "#fff", padding: "10px 22px", fontWeight: 700, fontSize: "0.85rem", borderRadius: 4, textDecoration: "none", letterSpacing: "0.04em" }}>
              Browse Tyres
            </Link>
            <Link to="/contactus" style={{ background: "transparent", color: "#fff", padding: "10px 22px", fontWeight: 700, fontSize: "0.85rem", borderRadius: 4, textDecoration: "none", border: "1px solid #333", letterSpacing: "0.04em" }}>
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}