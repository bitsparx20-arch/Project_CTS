import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ServicePage from "../app/service/page.tsx";
import AboutUsPage from "../app/aboutus/page.tsx";
import ContactUsPage from "../app/contactus/page.tsx";
import TiresPage from "../app/tires/page.tsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<App />} />
  <Route path="/service" element={<ServicePage />} />
  <Route path="/aboutus" element={<AboutUsPage />} />
  <Route path="/contactus" element={<ContactUsPage />} />
  <Route path="/tyres" element={<TiresPage />} />
</Routes>
    </BrowserRouter>
     {/* added a router  */}
  </StrictMode>
// 