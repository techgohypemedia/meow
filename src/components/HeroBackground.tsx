"use client";

import React from "react";
import Image from "next/image";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* ── Base Cream Background ── */}
      <div className="absolute inset-0 bg-[#FEF8EA]" />

      {/* ── Decorative Brick Accents (Color: #F4EBD8) Matching Mockup ── */}
      {/* Top Right Brick Cluster */}
      <div className="absolute top-24 sm:top-28 right-4 sm:right-12 md:right-20 flex flex-col gap-2 opacity-90">
        <div className="flex gap-2">
          <div className="w-12 sm:w-16 h-3 sm:h-4 bg-[#F4EBD8] rounded-[3px]" />
          <div className="w-16 sm:w-20 h-3 sm:h-4 bg-[#F4EBD8] rounded-[3px]" />
        </div>
        <div className="flex gap-2 ml-6 sm:ml-8">
          <div className="w-20 sm:w-24 h-3 sm:h-4 bg-[#F4EBD8] rounded-[3px]" />
          <div className="w-10 sm:w-14 h-3 sm:h-4 bg-[#F4EBD8] rounded-[3px]" />
        </div>
      </div>

      {/* Right Middle Brick Accent */}
      <div className="absolute top-[26%] sm:top-[28%] right-3 sm:right-8 md:right-16 flex flex-col gap-2 opacity-80">
        <div className="w-16 sm:w-20 h-3 sm:h-4 bg-[#F4EBD8] rounded-[3px]" />
        <div className="w-12 sm:w-16 h-3 sm:h-4 bg-[#F4EBD8] rounded-[3px] ml-4" />
      </div>

      {/* Left Middle Brick Cluster (above left litter hill) */}
      <div className="absolute top-[24%] sm:top-[26%] left-3 sm:left-8 md:left-14 flex flex-col gap-2 opacity-80">
        <div className="flex gap-2">
          <div className="w-14 sm:w-18 h-3 sm:h-4 bg-[#F4EBD8] rounded-[3px]" />
          <div className="w-10 sm:w-14 h-3 sm:h-4 bg-[#F4EBD8] rounded-[3px]" />
        </div>
        <div className="w-16 sm:w-22 h-3 sm:h-4 bg-[#F4EBD8] rounded-[3px] ml-5" />
      </div>

      {/* ── Seamless Taller White Floor Base (Generous white stage) ── */}
      <div className="absolute bottom-0 inset-x-0 h-[22vh] sm:h-[24vh] md:h-[26vh] bg-white z-0" />

      {/* ── Complete Bottom Artwork (Cover End-to-End Layout Elevated on Taller White Floor) ── */}
      <div className="absolute bottom-[16vh] sm:bottom-[18vh] md:bottom-[20vh] inset-x-0 w-full flex justify-center items-end pointer-events-none z-10 overflow-hidden">
        <div className="relative w-full aspect-[1672/755] min-h-[240px] max-h-[64vh] sm:max-h-[66vh] md:max-h-[68vh]">
          <Image
            src="/bottom_scene_end_to_end.png"
            alt="Blue Litter Hills & Peeking Cat"
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
