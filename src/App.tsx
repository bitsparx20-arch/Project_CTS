import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Tyres from "./pages/Tyres";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import { ROUTES } from "./config/site";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.services} element={<Services />} />
        <Route path={ROUTES.tyres} element={<Tyres />} />
        <Route path={ROUTES.about} element={<AboutUs />} />
        <Route path={ROUTES.contact} element={<ContactUs />} />

        <Route path="/service" element={<Navigate to={ROUTES.services} replace />} />
        <Route path="/services/*" element={<Navigate to={ROUTES.services} replace />} />
        <Route path="/tires" element={<Navigate to={ROUTES.tyres} replace />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
