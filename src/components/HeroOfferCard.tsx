"use client";

import React from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface HeroOfferCardProps {
  onSubscribe?: () => void;
}

export default function HeroOfferCard({ onSubscribe }: HeroOfferCardProps) {
  const { addToCart } = useCart();

  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe();
    } else {
      addToCart(
        {
          productId: "clean-bean-annual-sub",
          name: "Clean Bean Tofu Litter - Annual Plan",
          price: 590,
          originalPrice: 860,
          size: { id: "7l", name: "(6+1)L", volume: "7L" },
          image: "/product-bag.png",
          quantity: 1,
          isSubscription: true,
          subscriptionInterval: "1 Pack Every Month (12 Months)",
        },
        true
      );
    }
  };

  return (
    <div className="relative w-full max-w-[380px] sm:max-w-[430px] md:max-w-[460px] mx-auto select-none pointer-events-auto">
      {/* ── Top-Left Doodle Sparkle Strokes ── */}
      <div className="absolute -top-4 sm:-top-5 -left-2 sm:-left-4 pointer-events-none z-10">
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 text-black"
          viewBox="0 0 36 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        >
          <line x1="6" y1="26" x2="16" y2="8" />
          <line x1="18" y1="30" x2="28" y2="12" />
        </svg>
      </div>

      {/* ── Organic Hand-Drawn Styled Card Container ── */}
      <div className="relative bg-white border-[2.2px] sm:border-[2.5px] border-black rounded-[28px] sm:rounded-[36px] px-3.5 sm:px-5 pt-3 sm:pt-4 pb-2.5 sm:pb-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.05)] flex flex-col items-center text-center">
        {/* Sub-Header */}
        <span className="font-heading font-extrabold text-[9px] sm:text-[11px] md:text-xs tracking-[0.2em] text-black uppercase mb-0.5 sm:mb-1">
          SUBSCRIBE FOR A
        </span>

        {/* Chunky Main Headings */}
        <h1 className="font-heading font-black text-[24px] sm:text-[30px] md:text-[34px] text-black tracking-tight leading-none uppercase">
          HEALTHIER
        </h1>

        <div className="flex items-center justify-center gap-1.5 mt-0.5">
          <h2 className="font-heading font-black text-[24px] sm:text-[30px] md:text-[34px] text-[#3FA8EA] tracking-tight leading-none uppercase">
            HAPPIER CAT
          </h2>

          {/* Hand-Drawn Heart with Sparkle Lines */}
          <div className="relative inline-flex items-center justify-center translate-y-[-2px]">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-[#3FA8EA]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19.5 13.5c1.4-1.4 2.5-3 2.5-5 0-2.8-2.2-4.5-4.8-4.5-1.8 0-3.3 1-4.2 2.2-.9-1.2-2.4-2.2-4.2-2.2C6.2 4 4 5.7 4 8.5c0 2 1.1 3.6 2.5 5l6.5 6.5 6.5-6.5Z" />
            </svg>
            {/* 3 Radiating Doodle Lines */}
            <div className="absolute -top-2 -right-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-black"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="2" y1="10" x2="8" y2="4" />
                <line x1="6" y1="14" x2="14" y2="8" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Pricing & Benefit Columns ── */}
        <div className="w-full flex items-center justify-between mt-3 sm:mt-4 px-1 sm:px-2">
          {/* Col 1: Strikethrough MRP */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative inline-block">
              <span className="font-heading font-black text-xl sm:text-2xl md:text-[28px] text-black leading-none">
                ₹860
              </span>
              {/* Bold Red Strikethrough Slash */}
              <div className="absolute inset-x-[-5px] top-1/2 -translate-y-1/2 h-[2.5px] sm:h-[3px] bg-[#E02424] rounded-full rotate-[-4deg]" />
            </div>
            <span className="font-heading font-bold text-[9px] sm:text-[11px] text-black/85 tracking-tight uppercase mt-1">
              MRP per pack
            </span>
          </div>

          {/* Divider Line */}
          <div className="w-[1.5px] h-9 sm:h-11 bg-black/25 mx-1.5 sm:mx-2 shrink-0" />

          {/* Col 2: Pill Badge Subscription Price */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSubscribe}
            className="flex-1 max-w-[130px] sm:max-w-[150px] bg-[#3FA8EA] hover:bg-[#3298D8] text-white rounded-2xl sm:rounded-3xl py-1.5 sm:py-2 px-3 sm:px-4 shadow-sm flex flex-col items-center justify-center cursor-pointer transition-colors"
          >
            <span className="font-heading font-black text-xl sm:text-2xl md:text-[26px] leading-none text-white tracking-tight">
              ₹590
            </span>
            <span className="font-heading font-bold text-[9px] sm:text-[11px] text-white/95 leading-tight mt-0.5">
              per pack
            </span>
          </motion.button>

          {/* Divider Line */}
          <div className="w-[1.5px] h-9 sm:h-11 bg-black/25 mx-1.5 sm:mx-2 shrink-0" />

          {/* Col 3: Insurance Paw Badge */}
          <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2">
            {/* Paw Shield Icon */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center">
              <svg
                className="w-full h-full text-[#3FA8EA]"
                viewBox="0 0 24 24"
                fill="#EBF6FC"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {/* Black Paw Print in Shield Center */}
              <div className="absolute inset-0 flex items-center justify-center pt-0.5">
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-black"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="14" r="2.8" />
                  <circle cx="8.5" cy="9.5" r="1.6" />
                  <circle cx="15.5" cy="9.5" r="1.6" />
                  <circle cx="6" cy="12.5" r="1.3" />
                  <circle cx="18" cy="12.5" r="1.3" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col text-left">
              <span className="font-heading font-bold text-[10px] sm:text-xs text-black leading-tight">
                Your cat
              </span>
              <span className="font-heading font-bold text-[10px] sm:text-xs text-black leading-tight">
                gets insured
              </span>
            </div>
          </div>
        </div>

        {/* ── Horizontal Divider ── */}
        <div className="w-full h-[1.5px] bg-black/20 my-2.5 sm:my-3.5" />

        {/* ── Footer Terms Row ── */}
        <div className="w-full flex items-center justify-between sm:justify-center sm:gap-6 px-1 font-heading font-black text-[8.5px] sm:text-[10.5px] md:text-[11.5px] text-black tracking-wider sm:tracking-widest uppercase">
          <span>12 MONTHS</span>
          <span className="text-black/35 font-normal">|</span>
          <span>1 PACK EVERY MONTH</span>
          <span className="text-black/35 font-normal">|</span>
          <span>HASSLE FREE</span>
        </div>
      </div>
    </div>
  );
}
