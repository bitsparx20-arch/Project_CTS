import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import './App.css';

// ─── DATA ───────────────────────────────────────────────
const carBrands = ['Toyota', 'Honda', 'Ford', 'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'BMW', 'Mercedes', 'Audi', 'Kia', 'Volkswagen']
const carModels = ['Innova', 'Fortuner', 'City', 'Swift', 'Creta', 'Nexon', 'Scorpio', 'Baleno', 'i20', 'Seltos']
const carYears = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016']
const tireSizes = ['155/65 R13', '175/65 R14', '185/65 R15', '195/65 R15', '205/55 R16', '215/60 R17', '235/65 R17', '265/70 R16']
const brandNames = ['MICHELIN', 'BRIDGESTONE', 'GOODYEAR', 'CONTINENTAL', 'PIRELLI', 'YOKOHAMA', 'HANKOOK', 'MAXXIS']

const categories = [
  { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", title: 'Passenger Tyres', desc: 'Smooth, fuel-efficient tires for everyday cars and city driving comfort.' },
  { image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80", title: 'SUV & 4x4 Tyres', desc: 'Built for bigger vehicles and tougher terrain — on-road and off.' },
  { image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80", title: 'Truck & Van Tyres', desc: 'Heavy-duty performance for commercial vehicles and long hauls.' },
  { image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80", title: 'Performance Tyres', desc: 'High-speed tires engineered for sports and performance cars.' },
  { image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80", title: 'All-Season Tyres', desc: 'One tire for rain, sun, and light snow — year-round reliability.' },
  { image: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=80", title: 'Run-Flat Tyres', desc: 'Keep going even after a puncture — safety without compromise.' },
]

const whyPoints = [
  { stat: '10,000+', title: 'Tires in Stock', desc: 'We carry a huge range so you always find exactly what you need.' },
  { stat: '★★★★★', title: 'Expert Advice', desc: 'Our team helps you choose the right tire for your vehicle and budget.' },
  { stat: '24h', title: 'Fast Delivery', desc: 'Order today and get your tires delivered quickly right to your door.' },
]

const reviews = [
  { text: 'Great selection and super fast delivery. Found the exact tires I needed in minutes.', author: 'Rahul M., Mumbai' },
  { text: 'Helpful team, fair prices. My go-to place for all tire needs. Highly recommended!', author: 'Priya S., Pune' },
  { text: 'Easy to use website and the tires arrived the next day. Very happy with the service!', author: 'Amir K., Delhi' },
  { text: 'Best tyre shop in the city. Staff is knowledgeable and prices are unbeatable.', author: 'Sneha R., Bangalore' },
  { text: 'Quick installation, great quality tyres. Will definitely come back again!', author: 'Vikram T., Chennai' },
]

const quickLinks = ['Home', 'Tyres', 'Brands', 'About Us', 'Contact', 'FAQ']

// ─── NAVBAR ──────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home",     to: "/" },
    { label: "Services", to: "/service" },
    { label: "Tyres",    to: "/tyres" },
    { label: "About Us", to: "/aboutus" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="main-nav">
      <div className="main-nav-inner">

        {/* LOGO */}
        <Link to="/" className="main-nav-logo" onClick={closeMenu}>
          <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19" cy="19" r="18" stroke="#666" strokeWidth="2.5" fill="none" />
            <circle cx="19" cy="19" r="13" fill="#1a0000" stroke="#C03020" strokeWidth="3.5" />
            <circle cx="19" cy="19" r="7" fill="#C03020" />
            <circle cx="19" cy="19" r="3.5" fill="#E04030" />
            {[0, 90, 180, 270].map((angle) => (
              <line key={angle} x1="19" y1="1" x2="19" y2="5"
                stroke="#666" strokeWidth="2"
                transform={`rotate(${angle} 19 19)`} />
            ))}
          </svg>
          <span className="main-nav-logo-text">
            C<span className="main-nav-logo-accent">T</span>S
          </span>
        </Link>

        {/* NAV LINKS + CTA (collapses into dropdown on mobile) */}
        <div className={`main-nav-menu ${menuOpen ? "is-open" : ""}`}>
          <ul className="main-nav-links">
            {navLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="main-nav-link" onClick={closeMenu}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link to="/contactus" className="main-nav-cta" onClick={closeMenu}>
            Contact
          </Link>
        </div>

        {/* HAMBURGER TOGGLE (mobile only) */}
        <button
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

// ─── HERO — exactly full screen ──────────────────────────
function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8%',
        background: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400') center/cover no-repeat",
        boxSizing: 'border-box',
      }}
    >
      {/* dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)' }} />

      {/* content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 52px)',
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1.13,
          marginBottom: '20px',
        }}>
          Every Road.<br />
          Every Vehicle.<br />
          <span style={{ color: '#e63c2f' }}>Every Tyre.</span>
        </h1>
        <p style={{
          color: '#ddd',
          fontSize: 'clamp(15px, 2vw, 17px)',
          lineHeight: 1.7,
          marginBottom: '34px',
        }}>
          Thousands of tyres in stock. Expert advice. Fast delivery.<br />
          Find the right tyre for your car today.
        </p>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>

  <Link to="/tyres"
    style={{
      background: '#e63c2f',
      color: '#fff',
      textDecoration: 'none',
      padding: '14px 34px',
      borderRadius: '4px',
      fontSize: '15px',
      fontWeight: 700,
      display: 'inline-block',
    }}
  >
    Shop Tyres
  </Link>

  <Link
    to="/contactus"
    style={{
      background: 'transparent',
      color: '#fff',
      textDecoration: 'none',
      border: '2px solid #fff',
      padding: '14px 34px',
      borderRadius: '4px',
      fontSize: '15px',
      fontWeight: 600,
      display: 'inline-block',
    }}
  >
    Get Expert Advice
  </Link>

</div>
      </div>
    </section>
  )
}

// ─── TIRE FINDER ─────────────────────────────────────────
function TireFinder() {
  return (
    <section className="finder-section">
      <p className="section-label">Tire Finder</p>
      <h2 className="section-heading">Find the Right Tyre for Your Car</h2>
      <div className="finder-grid">
        <select>
          <option value="">Select Car Brand</option>
          {carBrands.map(b => <option key={b}>{b}</option>)}
        </select>
        <select>
          <option value="">Select Model</option>
          {carModels.map(m => <option key={m}>{m}</option>)}
        </select>
        <select>
          <option value="">Select Year</option>
          {carYears.map(y => <option key={y}>{y}</option>)}
        </select>
        <select>
          <option value="">Tyre Size (Optional)</option>
          {tireSizes.map(s => <option key={s}>{s}</option>)}
        </select>
       <Link to="/tyres" className="finder-search-btn">
  Search Tyres →
</Link>
      </div>
    </section>
  )
}

// ─── BRANDS ──────────────────────────────────────────────
function Brands() {
  return (
    <section className="brands-section">
      <h2 className="section-heading">Brands We Carry</h2>
      <div className="accent-line" />
      <div className="brand-strip">
        {brandNames.map(brand => (
          <div key={brand} className="brand-chip">{brand}</div>
        ))}
      </div>
    </section>
  )
}

// ─── CATEGORIES with images ──────────────────────────────
function Categories() {
  return (
    <section className="categories-section">
      <p className="section-label">Our Range</p>
      <h2 className="section-heading">Shop by Category</h2>
      <p className="section-subtext">Whether you need everyday comfort or off-road strength, we have the right tyre for the job.</p>
      <div className="accent-line" />
      <div className="cat-grid">
        {categories.map((cat) => (
          <div key={cat.title} className="cat-card">
            <div className="cat-img-wrap">
              <img
                src={cat.image}
                alt={cat.title}
                className="cat-img"
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="cat-img-overlay" />
              <div className="cat-img-label">{cat.title}</div>
            </div>
            <div className="cat-body">
              <p>{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── WHY CTS ─────────────────────────────────────────────
function WhyCTS() {
  return (
    <section className="why-section">
      <h2>Why Customers Choose Us</h2>
      <div className="why-grid">
        {whyPoints.map((p) => (
          <div key={p.title} className="why-card">
            <div className="why-stat">{p.stat}</div>
            <div className="why-title">{p.title}</div>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── REVIEWS SLIDER ──────────────────────────────────────
function Reviews() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  const next = () => setCurrent(c => (c + 1) % reviews.length)
  const prev = () => setCurrent(c => (c - 1 + reviews.length) % reviews.length)

  const resetTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 3500)
  }

  useEffect(() => {
    timerRef.current = setInterval(next, 3500)
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <section className="reviews-section">
      <p className="section-label">Testimonials</p>
      <h2 className="section-heading">What Our Customers Say</h2>
      <div className="accent-line" />

      <div className="slider-wrapper">
        <button className="slider-arrow left" onClick={() => { prev(); resetTimer() }}>&#8592;</button>
        <div className="slider-track">
          {reviews.map((r, i) => (
            <div
              key={i}
              className={`review-card ${
                i === current ? 'active' :
                i === (current - 1 + reviews.length) % reviews.length ? 'prev' :
                'hidden'
              }`}
            >
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">— {r.author}</div>
            </div>
          ))}
        </div>
        <button className="slider-arrow right" onClick={() => { next(); resetTimer() }}>&#8594;</button>
      </div>

      <div className="slider-dots">
        {reviews.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => { setCurrent(i); resetTimer() }}
          />
        ))}
      </div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────────────────
function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="footer-logo">C<span>T</span>S</div>
          <p className="footer-brand-p">
            Your trusted partner for tyres across India. Quality brands, expert advice, and fast delivery.
          </p>
          <div className="socials">
            {['f', 'in', 'W'].map(icon => (
              <a key={icon} href="#" className="social-icon">{icon}</a>
            ))}
          </div>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map(link => (
              <li key={link}><a href="#">{link}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact Us</h4>
          <div className="contact-item">📞 +91 98765 43210</div>
          <div className="contact-item">✉ info@ctstyres.com</div>
          <div className="contact-item">📍 Mumbai, Maharashtra</div>
        </div>
      </div>
      <div className="footer-bottom">© 2025 CTS. All rights reserved.</div>
    </footer>
  )
}

// ─── MAIN APP ────────────────────────────────────────────
export default function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <TireFinder />
      <Brands />
      <Categories />
      <WhyCTS />
      <Reviews />
      <Footer />
    </div>
  )
}