import { useScroll, useTransform, motion } from "framer-motion";

export function ParallaxLayer({ children, speed = 0.5 }: { children: React.ReactNode; speed?: number }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 1000 * speed]);
  return <motion.div style={{ y }}>{children}</motion.div>;
}