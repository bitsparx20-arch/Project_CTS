import { Link } from "react-router-dom";
import { ROUTES } from "../config/site";

interface LogoProps {
  height?: number;
  size?: number;
  textSize?: number;
  filter?: string;
}

export default function Logo({
  height = 110,
  size,
  filter,
}: LogoProps) {
  const h = size ?? height;
  return (
    <Link
      to={ROUTES.home}
      className="brand-logo"
      aria-label="CTS Home"
    >
      <img
        src="/ctslogo.png"
        alt="CTS Tyres"
        className="brand-logo-image"
        style={{
          height: h,
          filter: filter,
          transition: "filter 0.3s ease",
        }}
      />
    </Link>
  );
}