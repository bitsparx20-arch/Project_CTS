import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BRANDS, ROUTES } from "../config/site";

const carBrands = [
  "Toyota", "Honda", "Ford", "Maruti Suzuki", "Hyundai", "Tata",
  "Mahindra", "BMW", "Mercedes", "Audi", "Kia", "Volkswagen",
];
const carModels = [
  "Innova", "Fortuner", "City", "Swift", "Creta",
  "Nexon", "Scorpio", "Baleno", "i20", "Seltos",
];
const carYears = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];
const tireSizes = [
  "155/65 R13", "175/65 R14", "185/65 R15", "195/65 R15",
  "205/55 R16", "215/60 R17", "235/65 R17", "265/70 R16",
];

interface Category {
  image: string;
  title: string;
  desc: string;
}

const categories: Category[] = [
  { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", title: "Passenger Tyres", desc: "Smooth, fuel-efficient tires for everyday cars and city driving comfort." },
  { image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80", title: "SUV & 4x4 Tyres", desc: "Built for bigger vehicles and tougher terrain — on-road and off." },
  { image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80", title: "Truck & Van Tyres", desc: "Heavy-duty performance for commercial vehicles and long hauls." },
  { image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80", title: "Performance Tyres", desc: "High-speed tires engineered for sports and performance cars." },
  { image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80", title: "All-Season Tyres", desc: "One tire for rain, sun, and light snow — year-round reliability." },
  { image: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=80", title: "Run-Flat Tyres", desc: "Keep going even after a puncture — safety without compromise." },
];

const whyPoints = [
  { stat: "10,000+", title: "Tires in Stock", desc: "We carry a huge range so you always find exactly what you need." },
  { stat: "★★★★★", title: "Expert Advice", desc: "Our team helps you choose the right tire for your vehicle and budget." },
  { stat: "24h", title: "Fast Delivery", desc: "Order today and get your tires delivered quickly right to your door." },
];

const reviews = [
  { text: "Great selection and super fast delivery. Found the exact tires I needed in minutes.", author: "Rahul M., Mumbai" },
  { text: "Helpful team, fair prices. My go-to place for all tire needs. Highly recommended!", author: "Priya S., Pune" },
  { text: "Easy to use website and the tires arrived the next day. Very happy with the service!", author: "Amir K., Delhi" },
  { text: "Best tyre shop in the city. Staff is knowledgeable and prices are unbeatable.", author: "Sneha R., Bangalore" },
  { text: "Quick installation, great quality tyres. Will definitely come back again!", author: "Vikram T., Chennai" },
];

function Hero() {
  return (
    <section className="home-hero">
      <div className="home-hero-overlay" />
      <div className="home-hero-content">
        <h1>
          Every Road.<br />
          Every Vehicle.<br />
          <span className="accent">Every Tyre.</span>
        </h1>
        <p>
          Thousands of tyres in stock. Expert advice. Fast delivery.<br />
          Find the right tyre for your car today.
        </p>
        <div className="home-hero-actions">
          <Link to={ROUTES.tyres} className="btn btn-primary">
            Shop Tyres
          </Link>
          <Link to={ROUTES.contact} className="btn btn-outline">
            Get Expert Advice
          </Link>
        </div>
      </div>
    </section>
  );
}

function TireFinder() {
  return (
    <section className="finder-section">
      <p className="section-label">Tire Finder</p>
      <h2 className="section-heading">Find the Right Tyre for Your Car</h2>
      <div className="finder-grid">
        <select defaultValue="">
          <option value="">Select Car Brand</option>
          {carBrands.map((b) => <option key={b}>{b}</option>)}
        </select>
        <select defaultValue="">
          <option value="">Select Model</option>
          {carModels.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select defaultValue="">
          <option value="">Select Year</option>
          {carYears.map((y) => <option key={y}>{y}</option>)}
        </select>
        <select defaultValue="">
          <option value="">Tyre Size (Optional)</option>
          {tireSizes.map((s) => <option key={s}>{s}</option>)}
        </select>
        <Link to={ROUTES.tyres} className="finder-search-btn">
          Search Tyres →
        </Link>
      </div>
    </section>
  );
}

function Brands() {
  return (
    <section className="brands-section">
      <h2 className="section-heading">Brands We Carry</h2>
      <div className="accent-line" />
      <div className="brand-strip">
        {BRANDS.map((brand) => (
          <div key={brand} className="brand-chip">{brand}</div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="categories-section">
      <p className="section-label">Our Range</p>
      <h2 className="section-heading">Shop by Category</h2>
      <p className="section-subtext">
        Whether you need everyday comfort or off-road strength, we have the right tyre for the job.
      </p>
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
                onError={(e) => { e.currentTarget.style.display = "none"; }}
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
  );
}

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
  );
}

function Reviews() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % reviews.length),
      3500,
    );
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goTo = (index: number) => {
    setCurrent((index + reviews.length) % reviews.length);
    startTimer();
  };

  return (
    <section className="reviews-section">
      <p className="section-label">Testimonials</p>
      <h2 className="section-heading">What Our Customers Say</h2>
      <div className="accent-line" />

      <div className="slider-wrapper">
        <button
          type="button"
          className="slider-arrow left"
          aria-label="Previous review"
          onClick={() => goTo(current - 1)}
        >
          &#8592;
        </button>
        <div className="slider-track">
          {reviews.map((r, i) => (
            <div key={r.author} className={`review-card ${i === current ? "active" : ""}`}>
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">— {r.author}</div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="slider-arrow right"
          aria-label="Next review"
          onClick={() => goTo(current + 1)}
        >
          &#8594;
        </button>
      </div>

      <div className="slider-dots">
        {reviews.map((r, i) => (
          <button
            key={r.author}
            type="button"
            aria-label={`Go to review ${i + 1}`}
            className={`dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <TireFinder />
      <Brands />
      <Categories />
      <WhyCTS />
      <Reviews />
    </>
  );
}
