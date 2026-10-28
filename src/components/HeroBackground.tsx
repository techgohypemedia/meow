"use client";

import React from "react";
import Image from "next/image";
import CatWave from "./CatWave";

// Where the animated cat sits inside each artwork container, as % of the artwork box. Measured
// from the eyes/nose of the cat painted into hero-cat-hills*.png. The *-nocat.png variants are the
// same artwork with only the slivers of the painted cat that the frames ever leave exposed removed.
const CAT_RECT_DESKTOP = { left: 52.521, top: 56.468, width: 28.435, height: 33.683 };
const CAT_RECT_MOBILE = { left: 46.106, top: 67.993, width: 50.436, height: 18.923 };

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* ── Base Peach Background ── */}
      <div className="absolute inset-0 bg-[#FEF8EA]" />

      {/* ── Decorative Brick Accents (Color: #EDDEC5) Matching Mockup ── */}
      {/* Top Right Brick Cluster */}
      <div className="absolute top-24 sm:top-28 right-4 sm:right-12 md:right-20 flex flex-col gap-2 opacity-90">
        <div className="flex gap-2">
          <div className="w-12 sm:w-16 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
          <div className="w-16 sm:w-20 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
        </div>
        <div className="flex gap-2 ml-6 sm:ml-8">
          <div className="w-20 sm:w-24 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
          <div className="w-10 sm:w-14 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
        </div>
      </div>

      {/* Right Middle Brick Accent */}
      <div className="absolute top-[26%] sm:top-[28%] right-3 sm:right-8 md:right-16 flex flex-col gap-2 opacity-80">
        <div className="w-16 sm:w-20 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
        <div className="w-12 sm:w-16 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px] ml-4" />
      </div>

      {/* Left Middle Brick Cluster (above left litter hill) */}
      <div className="absolute top-[24%] sm:top-[26%] left-3 sm:left-8 md:left-14 flex flex-col gap-2 opacity-80">
        <div className="flex gap-2">
          <div className="w-14 sm:w-18 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
          <div className="w-10 sm:w-14 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
        </div>
        <div className="w-16 sm:w-22 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px] ml-5" />
      </div>

      {/* ── Seamless White Floor Base (Fills any bottom space) ── */}
      <div className="absolute bottom-0 inset-x-0 h-[4vh] sm:h-[6vh] md:h-[8vh] bg-white z-0" />

      {/* ── Hero Artwork (Blue Litter Hills & White Floor) + animated Peeking Cat overlay ── */}
      {/* Mobile view (< md: 768px): Uses the vertical portrait artwork scaled so the cat is prominent and cute */}
      <div className="md:hidden absolute bottom-0 inset-x-0 h-[78vw] pointer-events-none z-10 overflow-hidden">
        <div
          className="absolute"
          style={{ width: "119vw", aspectRatio: "941 / 1672", left: "-14vw", bottom: "-4vw" }}
        >
          <Image
            src="/hero-cat-hills-mobile-nocat-v3.png"
            alt="Meow Ganics Litter Hills Mobile"
            fill
            sizes="119vw"
            className="object-contain"
            priority
          />
          <CatWave frameSet="sm" rect={CAT_RECT_MOBILE} />
        </div>
      </div>

      {/* Laptop view (>= lg: 1024px): artwork scaled off viewport width so the cat stays locked
          right of centre (~72vw) with its paws ~12vh above the bottom edge on every laptop.
          Artwork is 1672x941 and the cat's paws sit at y=800 (141px above the image bottom). */}
      <div
        className="hidden lg:block absolute pointer-events-none z-10"
        style={{
          width: "160vw",
          aspectRatio: "1672 / 941",
          left: "-34vw",
          bottom: "calc(12vh - 160vw * 141 / 1672)",
        }}
      >
        <Image
          src="/hero-cat-hills-nocat-v3.png"
          alt="Meow Ganics Litter Hills"
          fill
          sizes="160vw"
          className="object-contain"
          priority
        />
        <CatWave frameSet="lg" rect={CAT_RECT_DESKTOP} />
      </div>

      {/* Tablet view (md to lg): Uses the landscape artwork */}
      <div className="hidden md:flex lg:hidden absolute bottom-0 inset-x-0 w-full justify-center items-end pointer-events-none z-10 overflow-hidden">
        <div className="relative w-full aspect-[1672/941] min-h-[300px] md:min-h-[340px] max-h-[66vh] md:max-h-[74vh]">
          <Image
            src="/hero-cat-hills.png"
            alt="Meow Ganics Litter Hills & Peeking Cat"
            fill
            sizes="100vw"
            className="object-cover object-bottom w-full h-full"
            priority
          />
        </div>
      </div>
    </div>
  );
}
