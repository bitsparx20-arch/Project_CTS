import { Link } from "react-router-dom";
import Logo from "./Logo";
import SocialIcons from "./SocialIcons";
import { COMPANY, CONTACT_ITEMS, FOOTER_LINKS } from "../config/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">
            <Logo size={28} ringColor="#555" textSize={20} />
          </div>
          <p className="footer-brand-p">{COMPANY.tagline}</p>
          <SocialIcons />
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          {CONTACT_ITEMS.map((item) => (
            <div key={item.label} className="contact-item">
              {item.icon} {item.value}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {COMPANY.fullName}. All rights reserved.
        </p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
