import { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";

const IconPhone = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#fff" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#fff" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#fff" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#fff" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

interface ContactForm {
  name: string; phone: string; email: string; subject: string; message: string;
}

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

export default function ContactUs() {
  const [form, setForm] = useState<ContactForm>({
    name: "", phone: "", email: "", subject: "General Enquiry", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = (name: string) => ({
    padding: "10px 12px",
    fontSize: "0.86rem",
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif",
    border: `1.5px solid ${focused === name ? "#C03020" : "#e4e4e4"}`,
    borderRadius: 4, background: "#fff", color: "#111",
    outline: "none", width: "100%",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  });

  const iconBox = {
    width: 36, height: 36, borderRadius: 4, background: "#C03020",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 10, flexShrink: 0,
  };

  return (
    <div style={{ fontFamily: "Inter, Helvetica Neue, Arial, sans-serif", background: "#fff", color: "#111", minHeight: "100vh" }}>

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
            Contact Us
          </p>
          <h1 style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#111", marginBottom: 12 }}>
            Get in touch — <span style={{ color: "#C03020" }}>we're here to help.</span>
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.65, maxWidth: 400, margin: "0 auto 18px" }}>
            Have a question about a tyre? Our team is ready to help you find the right fit.
          </p>
          <a href="#contact" style={{ display: "inline-block", background: "#C03020", color: "#fff", padding: "9px 22px", borderRadius: 4, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", letterSpacing: "0.04em" }}>
            Send a Message ↓
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

      {/* CONTACT SECTION */}
      <section id="contact" style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px 72px" }}>

        <div style={{ marginBottom: 32 }}>
          <span style={{ display: "inline-block", background: "#fff0ee", color: "#C03020", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(192,48,32,0.2)", marginBottom: 10 }}>
            Contact
          </span>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>
            Send Us a Message
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24 }}>

          {/* LEFT */}
          <div style={{ background: "#f9f9f9", borderRadius: 12, border: "1px solid #e4e4e4", padding: "32px 28px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111", marginBottom: 6 }}>Contact Information</h3>
            <p style={{ fontSize: "0.82rem", color: "#666", marginBottom: 24, lineHeight: 1.6 }}>
              Reach us directly or visit our store. Available 6 days a week.
            </p>
            <div style={{ width: 28, height: 3, background: "#C03020", marginBottom: 24, borderRadius: 2 }} />

            {[
              { icon: <IconPhone />, label: "Phone",   value: "+91 98765 43210" },
              { icon: <IconMail />,  label: "Email",   value: "info@ctstyres.com" },
              { icon: <IconPin />,   label: "Address", value: "123 Tyre Market Road,\nJammu, J&K, India" },
              { icon: <IconClock />, label: "Hours",   value: "Mon – Sat, 9am – 7pm" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <div style={iconBox}>{item.icon}</div>
                <div>
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: 3 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#111", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            <div style={{ width: 28, height: 3, background: "#C03020", margin: "6px 0 18px", borderRadius: 2 }} />
            <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: 12 }}>
              Follow Us
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "Facebook",  icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg> },
                { label: "Instagram", icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth={1.8}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg> },
                { label: "WhatsApp",  icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.4-.7-2.3-1.2-3.3-2.8-.2-.3.2-.3.5-.9.1-.2 0-.3-.1-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9 1-.9 2.3 0 1.3 1 2.6 1.1 2.8.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z"/></svg> },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} style={{ width: 36, height: 36, borderRadius: 4, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e4e4", padding: "32px 28px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111", marginBottom: 6 }}>Fill out the form</h3>
            <p style={{ fontSize: "0.82rem", color: "#666", marginBottom: 24, lineHeight: 1.6 }}>
              Our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#111", marginBottom: 5 }}>Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Your full name" required
                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                    style={inputStyle("name")} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#111", marginBottom: 5 }}>Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+91 98765 43210" required
                    onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                    style={inputStyle("phone")} />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#111", marginBottom: 5 }}>Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  style={inputStyle("email")} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#111", marginBottom: 5 }}>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange}
                  onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)}
                  style={inputStyle("subject")}>
                  <option>General Enquiry</option>
                  <option>Find a Tyre</option>
                  <option>Order Help</option>
                  <option>Booking a Service</option>
                  <option>Other</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#111", marginBottom: 5 }}>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder="Tell us what you need help with..." required rows={4}
                  onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                  style={{ ...inputStyle("message"), resize: "vertical" }} />
              </div>

              <button type="submit" style={{
                background: "#C03020", color: "#fff", border: "none",
                padding: "11px 28px", borderRadius: 4, fontSize: "0.84rem",
                fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em",
                textTransform: "uppercase", fontFamily: "Inter, sans-serif",
              }}>
                Send Message
              </button>

              {submitted && (
                <p style={{ marginTop: 14, fontSize: "0.84rem", color: "#1a7a3c", fontWeight: 600 }}>
                  Message sent! We'll get back to you shortly.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section style={{ height: 320, borderTop: "1px solid #e4e4e4", borderBottom: "1px solid #e4e4e4" }}>
        <iframe
          title="CTS Store Location"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Jammu,Jammu%20and%20Kashmir,India&output=embed"
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
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
            <Link to="/service" style={{ background: "transparent", color: "#fff", padding: "10px 22px", fontWeight: 700, fontSize: "0.85rem", borderRadius: 4, textDecoration: "none", border: "1px solid #333", letterSpacing: "0.04em" }}>
              Our Services
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}