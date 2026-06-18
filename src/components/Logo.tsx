import { Link } from "react-router-dom";
import { ROUTES } from "../config/site";

interface LogoProps {
  size?: number;
  ringColor?: string;
  textSize?: number;
}

export default function Logo({
  size = 36,
  ringColor = "#666",
  textSize = 22,
}: LogoProps) {
  return (
    <Link to={ROUTES.home} className="brand-logo" aria-label="CTS home">
      <svg
        width={size}
        height={size}
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="19" cy="19" r="18" stroke={ringColor} strokeWidth="2.5" fill="none" />
        <circle cx="19" cy="19" r="13" fill="#1a0000" stroke="#C03020" strokeWidth="3.5" />
        <circle cx="19" cy="19" r="7" fill="#C03020" />
        <circle cx="19" cy="19" r="3.5" fill="#E04030" />
        {[0, 90, 180, 270].map((angle) => (
          <line
            key={angle}
            x1="19"
            y1="1"
            x2="19"
            y2="5"
            stroke={ringColor}
            strokeWidth="2"
            transform={`rotate(${angle} 19 19)`}
          />
        ))}
      </svg>
      <span className="brand-logo-text" style={{ fontSize: textSize }}>
        C<span className="brand-logo-accent">T</span>S
      </span>
    </Link>
  );
}
