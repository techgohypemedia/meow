"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroScrollOverlay() {
  const { scrollY } = useScroll();
  
  // Fade in a solid background to hide the litter pile and peaking cat
  const bgOpacity = useTransform(scrollY, [0, 300], [0, 1]);

  // Fade the neon glow in at start, but fade it OUT at the end of the scroll section 
  // (around 2000px-2300px) so it doesn't overlap the Marquee when the sticky container scrolls up
  const glowOpacity = useTransform(scrollY, [0, 300, 2000, 2300], [0, 1, 1, 0]);

  // Match the product bag's hue rotation perfectly
  const borderFilter = useTransform(
    scrollY,
    [0, 500, 1000, 1500, 2000],
    ["hue-rotate(0deg)", "hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(180deg)", "hue-rotate(270deg)"]
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Solid background to hide original background */}
      <motion.div 
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-brand-blue pointer-events-none"
      />

      {/* Neon Edge Glow (Matches Reference Image) - Guaranteed Rendering */}
      <motion.div 
        style={{ opacity: glowOpacity, filter: borderFilter }}
        className="absolute inset-0 pointer-events-none z-50 overflow-hidden"
      >
        {/* Top Edge */}
        <div className="absolute top-0 left-0 w-full h-[30px] bg-gradient-to-r from-[#1d4ed8] via-[#38bdf8] to-[#38bdf8] blur-[50px] opacity-90" />
        {/* Right Edge */}
        <div className="absolute top-0 right-0 w-[30px] h-full bg-gradient-to-b from-[#38bdf8] via-[#0ea5e9] to-[#0ea5e9] blur-[50px] opacity-90" />
        {/* Bottom Edge */}
        <div className="absolute bottom-0 left-0 w-full h-[30px] bg-gradient-to-r from-[#1e40af] via-[#0ea5e9] to-[#0ea5e9] blur-[50px] opacity-90" />
        {/* Left Edge */}
        <div className="absolute top-0 left-0 w-[30px] h-full bg-gradient-to-b from-[#1d4ed8] via-[#1e40af] to-[#1e40af] blur-[50px] opacity-90" />
      </motion.div>
    </div>
  );
}
