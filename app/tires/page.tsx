import { useState } from "react";
import { Link } from "react-router-dom";

const TireIcon = ({ color = "#1a1a1a" }: { color?: string }) => (
  <svg viewBox="0 0 100 100" width="80" height="80">
    <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth={9} />
    <circle cx="50" cy="50" r="27" fill="none" stroke={color} strokeWidth={3} />
    <circle cx="50" cy="50" r="8" fill={color} />
    {[...Array(8)].map((_, i) => {
      const angle = (i * Math.PI) / 4;
      const x1 = 50 + 31 * Math.cos(angle);
      const y1 = 50 + 31 * Math.sin(angle);
      const x2 = 50 + 40 * Math.cos(angle);
      const y2 = 50 + 40 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={3} />;
    })}
  </svg>
);

const StarRow = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[...Array(5)].map((_, i) => {
        const fill = i < full || (i === full && half) ? "#C03020" : "#e4e4e4";
        return (
          <svg key={i} viewBox="0 0 24 24" width="12" height="12" fill={fill}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      })}
    </div>
  );
};

interface Tire {
  brand: string; model: string; size: string;
  rating: number; reviews: number; price: string;
  badge: string; badgeColor: string; color: string;
}

const TIRES: Tire[] = [
  { brand: "Michelin",    model: "Pilot Sport 4",       size: "205/55 R16", rating: 4.6, reviews: 38, price: "8,500", badge: "Best Seller", badgeColor: "#C03020", color: "#C03020" },
  { brand: "Bridgestone", model: "Turanza T005",        size: "195/65 R15", rating: 4.4, reviews: 22, price: "6,200", badge: "In Stock",     badgeColor: "#1a7a3c", color: "#1a1a1a" },
  { brand: "Goodyear",    model: "Assurance TripleMax", size: "215/60 R16", rating: 4.2, reviews: 15, price: "7,100", badge: "New Arrival",  badgeColor: "#1a1a1a", color: "#2c5f8a" },
  { brand: "Continental", model: "PremiumContact 6",    size: "225/45 R17", rating: 4.7, reviews: 41, price: "9,800", badge: "Best Seller",  badgeColor: "#C03020", color: "#1a1a1a" },
  { brand: "Pirelli",     model: "Cinturato P7",        size: "205/60 R16", rating: 4.3, reviews: 19, price: "8,900", badge: "In Stock",     badgeColor: "#1a7a3c", color: "#C03020" },
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
          { label: "Tyres", to: "/tires" }, { label: "About Us", to: "/aboutus" },
          { label: "Contact", to: "/contactus" },
        ].map((item) => (
          <li key={item.label}>
            <Link to={item.to} style={{ color: "#ccc", textDecoration: "none", fontSize: 13, letterSpacing: 0.5 }}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <Link to="/services" style={{ background: "#e63c2f", color: "#fff", textDecoration: "none", padding: "9px 20px", borderRadius: 4, fontSize: 13, fontWeight: 700 }}>
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
              { label: "Tyres", to: "/tires" }, { label: "About Us", to: "/aboutus" },
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

export default function TiresPage() {
  const [sort, setSort] = useState("top");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div style={{ fontFamily: "Inter, Helvetica Neue, Arial, sans-serif", background: "#fff", minHeight: "100vh", color: "#111" }}>

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
            Every tyre — <span style={{ color: "#C03020" }}>your car deserves.</span>
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.65, maxWidth: 400, margin: "0 auto 18px" }}>
            Thousands of tyres from the world's leading brands — find the perfect fit for your vehicle, budget, and driving style.
          </p>
          <a href="#tires" style={{ display: "inline-block", background: "#C03020", color: "#fff", padding: "9px 22px", borderRadius: 4, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", letterSpacing: "0.04em" }}>
            Browse Tyres ↓
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

      {/* TYRES SECTION */}
      <section id="tires" style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px 72px" }}>

        <div style={{ marginBottom: 32 }}>
          <span style={{ display: "inline-block", background: "#fff0ee", color: "#C03020", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(192,48,32,0.2)", marginBottom: 10 }}>
            Browse
          </span>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>
            All Tyres
          </h2>
        </div>

        {/* toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28, paddingBottom: 18, borderBottom: "1px solid #e4e4e4" }}>
          <p style={{ fontSize: "0.86rem", color: "#666" }}>
            Showing <strong style={{ color: "#111" }}>5</strong> of 10,000+ tyres
          </p>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            style={{ padding: "8px 12px", fontSize: "0.82rem", fontFamily: "Inter, sans-serif", border: "1.5px solid #e4e4e4", borderRadius: 4, background: "#fff", color: "#111", outline: "none", cursor: "pointer" }}
          >
            <option value="top">Sort by: Top Rated</option>
            <option value="low">Sort by: Price: Low to High</option>
            <option value="high">Sort by: Price: High to Low</option>
            <option value="new">Sort by: Newest</option>
          </select>
        </div>

        {/* tyre grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, border: "1px solid #e4e4e4", borderRadius: 12, overflow: "hidden" }}>
          {TIRES.map((tire, idx) => (
            <div
              key={tire.model}
              onMouseEnter={() => setHoveredCard(tire.model)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                padding: "24px 16px 20px",
                borderRight: idx < TIRES.length - 1 ? "1px solid #e4e4e4" : "none",
                display: "flex", flexDirection: "column", position: "relative",
                background: hoveredCard === tire.model ? "#fafafa" : "#fff",
                transition: "background 0.2s",
              }}
            >
              <span style={{ position: "absolute", top: 12, left: 12, background: tire.badgeColor, color: "#fff", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 3 }}>
                {tire.badge}
              </span>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 100, marginBottom: 14 }}>
                <TireIcon color={tire.color} />
              </div>

              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C03020", marginBottom: 3 }}>
                {tire.brand}
              </p>

              <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111", marginBottom: 3, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {tire.model}
              </h3>

              <p style={{ fontSize: "0.76rem", color: "#888", marginBottom: 10 }}>
                {tire.size}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                <StarRow rating={tire.rating} />
                <span style={{ fontSize: "0.72rem", color: "#888" }}>{tire.rating} ({tire.reviews})</span>
              </div>

              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111", marginBottom: 14 }}>
                ₹{tire.price}
                <span style={{ fontSize: "0.68rem", fontWeight: 400, color: "#888", marginLeft: 3 }}>/ tyre</span>
              </p>

              <a href="#" style={{
                marginTop: "auto", display: "block", textAlign: "center",
                padding: "9px 0", fontSize: "0.72rem", fontWeight: 700,
                letterSpacing: "0.05em", textTransform: "uppercase",
                textDecoration: "none", borderRadius: 4,
                border: `2px solid ${hoveredCard === tire.model ? "#C03020" : "#1a1a1a"}`,
                color: hoveredCard === tire.model ? "#fff" : "#1a1a1a",
                background: hoveredCard === tire.model ? "#C03020" : "transparent",
                transition: "all 0.2s",
              }}>
                View Details
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#111" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "44px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 800, color: "#fff", marginBottom: 4 }}>Not sure which tyre fits your vehicle?</h2>
            <p style={{ color: "#888", fontSize: "0.86rem" }}>Our experts will help you find the perfect match.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/contactus" style={{ background: "#C03020", color: "#fff", padding: "10px 22px", fontWeight: 700, fontSize: "0.85rem", borderRadius: 4, textDecoration: "none", letterSpacing: "0.04em" }}>
              Ask an Expert
            </Link>
            <Link to="/aboutus" style={{ background: "transparent", color: "#fff", padding: "10px 22px", fontWeight: 700, fontSize: "0.85rem", borderRadius: 4, textDecoration: "none", border: "1px solid #333", letterSpacing: "0.04em" }}>
              Learn About Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}