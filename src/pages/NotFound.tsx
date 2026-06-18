import { Link } from "react-router-dom";
import { ROUTES } from "../config/site";

export default function NotFound() {
  return (
    <section className="notfound">
      <p className="notfound-code">404</p>
      <h1 className="notfound-title">This road leads nowhere.</h1>
      <p className="notfound-text">
        The page you're looking for doesn't exist or may have moved.
        Let's get you back on track.
      </p>
      <div className="notfound-actions">
        <Link to={ROUTES.home} className="btn btn-primary">Back to Home</Link>
        <Link to={ROUTES.tyres} className="btn btn-outline-dark">Browse Tyres</Link>
      </div>
    </section>
  );
}
