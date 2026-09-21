"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PeekingCat() {
  const [isHappy, setIsHappy] = useState(false);

  const handleClick = () => {
    setIsHappy(true);
    setTimeout(() => setIsHappy(false), 800);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-full flex flex-col items-center justify-end pointer-events-auto cursor-pointer select-none group"
    >
      {/* ── Doodle Whiskers / Tick Marks above the Cat's Head ── */}
      <div className="mb-[-4px] sm:mb-[-8px] pointer-events-none z-20">
        <svg
          className="w-8 h-6 sm:w-10 sm:h-7 text-black transition-transform group-hover:scale-110"
          viewBox="0 0 36 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        >
          <line x1="8" y1="22" x2="14" y2="6" />
          <line x1="18" y1="24" x2="18" y2="4" />
          <line x1="28" y1="22" x2="22" y2="6" />
        </svg>
      </div>

      {/* ── Cat Body & Paws Peeking from Bottom ── */}
      <motion.div
        animate={
          isHappy
            ? { y: [0, -10, 0], rotate: [0, -1.5, 1.5, 0] }
            : { y: [0, -3, 0] }
        }
        transition={
          isHappy
            ? { duration: 0.5, ease: "easeOut" }
            : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative w-full aspect-[4762/2749] max-h-[25vh] sm:max-h-[30vh] md:max-h-[34vh]"
      >
        {/* SVG Eye & Nose Layer behind the transparent cutouts of Asset 4.png */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 4762 2749"
          fill="none"
        >
          {/* Left Eye Iris */}
          <ellipse cx="1778" cy="1314" rx="440" ry="390" fill="#9CD6F6" />
          {/* Left Eye Pupil */}
          <circle cx="1778" cy="1314" r="210" fill="#111111" />

          {/* Right Eye Iris */}
          <ellipse cx="3179" cy="1331" rx="440" ry="390" fill="#9CD6F6" />
          {/* Right Eye Pupil */}
          <circle cx="3179" cy="1331" r="210" fill="#111111" />

          {/* Nose */}
          <ellipse cx="2465" cy="1641" rx="90" ry="45" fill="#9CD6F6" />
        </svg>

        {/* User's Asset 4.png in public folder */}
        <Image
          src="/Asset 4.png"
          alt="Meowganics Cute Black Cat"
          fill
          sizes="(max-width: 640px) 300px, (max-width: 1024px) 420px, 520px"
          className="relative z-10 object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
          priority
        />
      </motion.div>
    </div>
  );
}
