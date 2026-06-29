import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Tyres from "./pages/Tyres";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import { ROUTES } from "./config/site";
import IntroScreen from "./components/IntroScreen";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <IntroScreen key="intro" onEnter={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Homepage fades in after intro */}
      <AnimatePresence>
        {!showIntro && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
