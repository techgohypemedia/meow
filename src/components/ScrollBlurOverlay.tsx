"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollBlurOverlay() {
  const { scrollY } = useScroll();
  
  // Fade in blur from 0 to 400px of scroll
  // The opacity of the overlay increases as you scroll down
  const opacity = useTransform(scrollY, [0, 400], [0, 1]);
  
  return (
    <motion.div 
      style={{ opacity }}
      className="absolute inset-0 bg-brand-blue-light/40 backdrop-blur-md pointer-events-none z-40"
    />
  );
}
