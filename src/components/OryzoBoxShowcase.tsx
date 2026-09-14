"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export interface OryzoItem {
  id: string;
  title1: string;
  title2: string;
  flavor: string;
  price: string;
  priceNum: number;
  image: string;
  accentColor: string;
  flavorId?: string;
  isComingSoon?: boolean;
  comingSoonDrop?: string;
}

export const ORYZO_ITEMS: OryzoItem[] = [
  {
    id: "clean-bean-original",
    title1: "SO FLUSHABLE,",
    title2: "it's pure routine",
    flavor: "Original Unscented",
    price: "$19.99",
    priceNum: 19.99,
    image: "/showcase/meow/IMG_7598.PNG",
    accentColor: "#A9D3F4",
    flavorId: "original",
  },
  {
    id: "cat-insurance-poster",
    title1: "DO YOU HAVE,",
    title2: "cat insurance?",
    flavor: "Cat Insurance Poster",
    price: "$24.00",
    priceNum: 24.0,
    image: "/showcase/meow/IMG_7614.PNG",
    accentColor: "#EF4444",
  },
  {
    id: "coming-soon-peach",
    title1: "IN THE LAB,",
    title2: "it's peach paradise",
    flavor: "Peach Paradise",
    price: "Coming Soon",
    priceNum: 0,
    image: "/showcase/coming_soon_peach.svg",
    accentColor: "#F59E0B",
    isComingSoon: true,
    comingSoonDrop: "Drop 02",
  },
  {
    id: "coming-soon-matcha",
    title1: "BREWING SOON,",
    title2: "it's matcha zen",
    flavor: "Matcha Zen",
    price: "Coming Soon",
    priceNum: 0,
    image: "/showcase/coming_soon_matcha.svg",
    accentColor: "#10B981",
    isComingSoon: true,
    comingSoonDrop: "Drop 03",
  },
  {
    id: "coming-soon-berry",
    title1: "NEXT DROP,",
    title2: "it's berry fresh",
    flavor: "Berry Fresh",
    price: "Coming Soon",
    priceNum: 0,
    image: "/showcase/coming_soon_berry.svg",
    accentColor: "#EC4899",
    isComingSoon: true,
    comingSoonDrop: "Drop 04",
  },
];

export default function OryzoBoxShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const isScrollingRef = useRef(false);
  const { addToCart } = useCart();

  const currentItem = ORYZO_ITEMS[activeIndex];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < ORYZO_ITEMS.length - 1 ? prev + 1 : 0));
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : ORYZO_ITEMS.length - 1));
  }, []);

  // Wheel / Trackpad listener with smooth debounce
  const handleWheel = (e: React.WheelEvent) => {
    // If scrolling up at index 0, let the user scroll up naturally to the Hero section
    if (e.deltaY < -20 && activeIndex === 0) {
      return;
    }
    // If scrolling down at the last item, let the user scroll down naturally to next sections
    if (e.deltaY > 20 && activeIndex === ORYZO_ITEMS.length - 1) {
      return;
    }

    if (isScrollingRef.current) return;
    if (Math.abs(e.deltaY) > 25 || Math.abs(e.deltaX) > 25) {
      isScrollingRef.current = true;
      if (e.deltaY > 25 || e.deltaX > 25) {
        if (activeIndex < ORYZO_ITEMS.length - 1) {
          handleNext();
        }
      } else {
        if (activeIndex > 0) {
          handlePrev();
        }
      }
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 400);
    }
  };

  // Touch Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStart(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleQuickAdd = (item: OryzoItem) => {
    addToCart(
      {
        productId: item.id,
        name: item.flavorId ? `Clean Bean - ${item.flavor}` : item.flavor,
        flavor: item.flavorId
          ? {
              id: item.flavorId,
              name: item.flavor,
              color: item.accentColor,
              hueFilter: "hue-rotate(0deg)",
            }
          : undefined,
        size: {
          id: "standard",
          name: "Standard Pack",
          volume: "Single",
        },
        price: item.priceNum,
        image: item.image,
        quantity: 1,
      },
      true
    );
  };

  return (
    <section
      onWheel={handleWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative w-full h-screen bg-[#111317] text-white flex flex-col justify-between overflow-hidden select-none px-6 sm:px-10 md:px-16"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full blur-[160px] opacity-20 transition-all duration-700"
          style={{ backgroundColor: currentItem.accentColor }}
        />
      </div>

      {/* Top spacing below header */}
      <div className="h-20 md:h-24 shrink-0" />

      {/* Main Arena: Left Typographic Headline + Center Box & Strip */}
      <div className="relative z-20 max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 my-auto">
        
        {/* Left Column: Clean, Bold Typography (matching Oryzo.ai) */}
        <div className="w-full lg:w-[38%] flex flex-col items-center lg:items-start text-center lg:text-left z-30 shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center lg:items-start w-full"
            >
              {/* Minimal 2-line headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-heading font-black tracking-tight leading-[1.05] text-white uppercase">
                <span>{currentItem.title1}</span>
                <br />
                <span className="text-white/60 font-bold lowercase tracking-normal">
                  {currentItem.title2}
                </span>
              </h1>

              {/* Minimal Call to Action */}
              <div className="flex items-center gap-4 mt-6 sm:mt-8">
                {currentItem.isComingSoon ? (
                  <div className="flex items-center gap-3">
                    <span
                      className="px-6 py-2.5 sm:py-3 rounded-full font-heading font-black text-xs sm:text-sm text-brand-black shadow-lg flex items-center gap-2 select-none"
                      style={{ backgroundColor: currentItem.accentColor }}
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-black animate-ping" />
                      <span>{currentItem.comingSoonDrop || "Coming Soon"}</span>
                    </span>
                    <span className="text-white/70 text-xs font-mono font-medium px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
                      Stay Tuned
                    </span>
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/product${
                        currentItem.flavorId ? `?flavor=${currentItem.flavorId}` : ""
                      }`}
                      className="px-6 py-2.5 sm:py-3 bg-white text-brand-black rounded-full font-heading font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0px_#A9D3F4]"
                    >
                      Buy Now • {currentItem.price}
                    </Link>

                    <button
                      onClick={() => handleQuickAdd(currentItem)}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/25 hover:border-white text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      aria-label={`Quick add ${currentItem.flavor}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right / Center Column: The BOX is the clip container — images slide inside it */}
        <div className="w-full lg:w-[62%] relative flex items-center justify-center h-[48vh] sm:h-[54vh] md:h-[60vh] lg:h-[64vh] max-h-[600px]">

          {/* THE BOX — fixed dashed border, clips images inside, images slide through it */}
          <div
            className="relative z-20 w-[240px] sm:w-[290px] md:w-[350px] lg:w-[390px] h-[320px] sm:h-[390px] md:h-[470px] lg:h-[520px] rounded-2xl md:rounded-3xl border-2 border-dashed border-white/40 overflow-hidden"
          >
            {/* Filmstrip: all images stacked side-by-side, shifted so active is visible */}
            <motion.div
              className="absolute inset-0 flex flex-row"
              animate={{ x: `calc(${-activeIndex * (100 / ORYZO_ITEMS.length)}%)` }}
              transition={{ type: "tween", ease: [0.76, 0, 0.24, 1], duration: 0.55 }}
              style={{ width: `${ORYZO_ITEMS.length * 100}%` }}
            >
              {ORYZO_ITEMS.map((prod, index) => (
                <div
                  key={prod.id}
                  className="relative flex-shrink-0 h-full"
                  style={{ width: `${100 / ORYZO_ITEMS.length}%` }}
                >
                  <Image
                    src={prod.image}
                    alt={prod.flavor}
                    fill
                    sizes="(max-width: 768px) 290px, 390px"
                    className="object-cover object-center"
                    priority={index === 0}
                  />
                  {prod.isComingSoon && (
                    <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider backdrop-blur-md border border-white/25 text-white shadow-xl flex items-center gap-1.5"
                        style={{ backgroundColor: `${prod.accentColor}33` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: prod.accentColor }} />
                        Soon
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Minimal Floating Navigation Arrows — outside the box, over the section */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-40 px-2 sm:px-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous product"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-white hover:text-brand-black text-white/80 backdrop-blur-md border border-white/15 flex items-center justify-center pointer-events-auto cursor-pointer transition-all hover:scale-110 active:scale-95"
            >
              <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next product"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-white hover:text-brand-black text-white/80 backdrop-blur-md border border-white/15 flex items-center justify-center pointer-events-auto cursor-pointer transition-all hover:scale-110 active:scale-95"
            >
              <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Minimal Indicator (exact Oryzo style: "SCROLL TO CONTINUE") */}
      <div className="relative z-20 max-w-7xl mx-auto w-full flex items-center justify-center pb-5 sm:pb-7">
        <div
          onClick={handleNext}
          className="inline-flex items-center gap-2.5 text-[11px] font-heading font-bold uppercase tracking-widest text-white/40 hover:text-white/80 transition-all cursor-pointer group"
        >
          <span className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white transition-colors">
            <svg className="w-2 h-2 fill-current animate-bounce" viewBox="0 0 24 24">
              <path d="M12 16l-6-6h12z" />
            </svg>
          </span>
          <span>Scroll To Continue</span>
        </div>
      </div>
    </section>
  );
}
