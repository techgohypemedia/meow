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
}

export const ORYZO_ITEMS: OryzoItem[] = [
  {
    id: "clean-bean-original",
    title1: "SO FLUSHABLE,",
    title2: "it's pure routine",
    flavor: "Original Unscented",
    price: "$19.99",
    priceNum: 19.99,
    image: "/showcase/meow/card_clean_bean_original.jpg",
    accentColor: "#A9D3F4",
    flavorId: "original",
  },
  {
    id: "clean-bean-berry",
    title1: "SO SWEET,",
    title2: "it's berry fresh",
    flavor: "Berry Fresh",
    price: "$21.99",
    priceNum: 21.99,
    image: "/showcase/meow/card_clean_bean_berry.jpg",
    accentColor: "#F472B6",
    flavorId: "berry",
  },
  {
    id: "clean-bean-peach",
    title1: "SO DELIGHTFUL,",
    title2: "it's peach paradise",
    flavor: "Peach Paradise",
    price: "$21.99",
    priceNum: 21.99,
    image: "/showcase/meow/card_clean_bean_peach.jpg",
    accentColor: "#FBBF24",
    flavorId: "peach",
  },
  {
    id: "clean-bean-greentea",
    title1: "SO NATURAL,",
    title2: "it's fresh green tea",
    flavor: "Fresh Green Tea",
    price: "$21.99",
    priceNum: 21.99,
    image: "/showcase/meow/card_clean_bean_greentea.jpg",
    accentColor: "#34D399",
    flavorId: "green-tea",
  },
  {
    id: "zen-scoop",
    title1: "SO PRECISE,",
    title2: "it's the zen scoop",
    flavor: "The Zen Scoop",
    price: "$18.00",
    priceNum: 18.0,
    image: "/showcase/accessories/acc_zen_scoop.jpg",
    accentColor: "#A9D3F4",
  },
  {
    id: "cloud-mat",
    title1: "SO CLEAN,",
    title2: "it's cloud trap",
    flavor: "Cloud Trap Mat",
    price: "$28.00",
    priceNum: 28.0,
    image: "/showcase/accessories/acc_cloud_mat.jpg",
    accentColor: "#2B7A5D",
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
        name: `Clean Bean - ${item.flavor}`,
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
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right / Center Column: "THIS BOX" with Horizontal Sliding Cards */}
        <div className="w-full lg:w-[62%] relative flex items-center justify-center h-[48vh] sm:h-[54vh] md:h-[60vh] lg:h-[64vh] max-h-[600px]">
          
          {/* "THIS BOX" - Clean dashed container exactly like Oryzo.ai */}
          <div className="absolute z-10 w-[240px] sm:w-[290px] md:w-[350px] lg:w-[390px] h-[320px] sm:h-[390px] md:h-[470px] lg:h-[520px] rounded-2xl md:rounded-3xl border-2 border-dashed border-white/40 pointer-events-none" />

          {/* Horizontal Filmstrip of Pure Product Cards */}
          <div className="relative w-full h-full flex items-center justify-center overflow-visible z-20">
            <div className="relative flex items-center justify-center w-full">
              {ORYZO_ITEMS.map((prod, index) => {
                const offset = index - activeIndex;
                const isCenter = offset === 0;

                return (
                  <motion.div
                    key={prod.id}
                    onClick={() => setActiveIndex(index)}
                    animate={{
                      x: `calc(${offset * 105}% + ${offset * 20}px)`,
                      scale: isCenter ? 1 : 0.88,
                      opacity: isCenter ? 1 : Math.abs(offset) === 1 ? 0.35 : 0.08,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 28,
                    }}
                    className={`absolute w-[240px] sm:w-[290px] md:w-[350px] lg:w-[390px] h-[320px] sm:h-[390px] md:h-[470px] lg:h-[520px] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer select-none transition-shadow duration-300 ${
                      isCenter
                        ? "shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-30"
                        : "z-10 hover:opacity-60"
                    }`}
                  >
                    <Image
                      src={prod.image}
                      alt={prod.flavor}
                      fill
                      sizes="(max-width: 768px) 300px, 420px"
                      className="object-cover object-center"
                      priority={index === 0}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Minimal Floating Navigation Arrows */}
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
