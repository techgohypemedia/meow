"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import InteractiveCat from "./InteractiveCat";
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

export default function HeroScrollExperience() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const isWheelDebounced = useRef(false);
  const { totalItems, openCart, addToCart } = useCart();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent any native page scrolling to lock the hero permanently
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const currentItem = ORYZO_ITEMS[activeIndex];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < ORYZO_ITEMS.length - 1 ? prev + 1 : 0));
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : ORYZO_ITEMS.length - 1));
  }, []);

  // Locked Wheel listener: scroll down triggers transition into box, then swaps products!
  const handleWheel = (e: React.WheelEvent) => {
    if (isWheelDebounced.current) return;

    if (Math.abs(e.deltaY) > 20) {
      isWheelDebounced.current = true;

      if (e.deltaY > 20) {
        // Scroll DOWN
        if (!isDocked) {
          setIsDocked(true);
        } else {
          handleNext();
        }
      } else {
        // Scroll UP
        if (isDocked) {
          if (activeIndex > 0) {
            handlePrev();
          } else {
            // If at first product and scrolling up -> return to Hill!
            setIsDocked(false);
          }
        }
      }

      setTimeout(() => {
        isWheelDebounced.current = false;
      }, isDocked ? 500 : 1000);
    }
  };

  // Touch Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
    const diffX = touchStart.x - touchEnd.x;
    const diffY = touchStart.y - touchEnd.y;

    if (Math.abs(diffY) > 40 && Math.abs(diffY) > Math.abs(diffX)) {
      // Vertical swipe
      if (diffY > 40) {
        // Swiped UP -> Move into box / next product
        if (!isDocked) {
          setIsDocked(true);
        } else {
          handleNext();
        }
      } else if (diffY < -40) {
        // Swiped DOWN -> Previous product / back to hill
        if (isDocked) {
          if (activeIndex > 0) {
            handlePrev();
          } else {
            setIsDocked(false);
          }
        }
      }
    } else if (Math.abs(diffX) > 40) {
      // Horizontal swipe
      if (isDocked) {
        if (diffX > 40) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    setTouchStart(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        if (!isDocked) setIsDocked(true);
        else handleNext();
      } else if (e.key === "ArrowUp") {
        if (isDocked) {
          if (activeIndex > 0) handlePrev();
          else setIsDocked(false);
        }
      } else if (e.key === "ArrowRight") {
        if (!isDocked) setIsDocked(true);
        else handleNext();
      } else if (e.key === "ArrowLeft") {
        if (isDocked) handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDocked, activeIndex, handleNext, handlePrev]);

  // Quick add to cart
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
    <div
      onWheel={handleWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#111317] select-none flex flex-col justify-between"
    >
      {/* Layer 0: Sky Blue Hero Background (Smooth luxury crossfade) */}
      <motion.div 
        animate={{ opacity: isDocked ? 0 : 1 }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-brand-blue pointer-events-none z-0"
      />

      {/* Layer 1: Ambient Background Color Glow (Pulses based on active product) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            backgroundColor: currentItem.accentColor,
            opacity: isDocked ? 0.32 : 0.05,
          }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] rounded-full blur-[180px]"
        />
      </div>

      {/* Layer 2: White Wave Curve Hill (Smoothly sinks down and fades) */}
      <motion.div 
        animate={{
          opacity: isDocked ? 0 : 1,
          y: isDocked ? 60 : 0,
        }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 w-full h-[36vh] z-10 pointer-events-none overflow-hidden"
      >
        <div className="relative w-full h-full">
          <Image 
            src="/white_curve_transparent.svg" 
            alt="Wave Curve Mask" 
            fill 
            className="object-fill object-bottom" 
            priority
          />
        </div>
      </motion.div>

      {/* Layer 3: Interactive Cat on Right Hill (Smoothly sinks down and fades) */}
      <div className="absolute inset-0 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 z-30 pointer-events-none overflow-visible flex items-end justify-end">
        <motion.div 
          animate={{
            opacity: isDocked ? 0 : 1,
            y: isDocked ? 50 : 0,
          }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-1/2 flex justify-end items-end pb-[calc(24vh-6px)] sm:pb-[calc(25vh-6px)] md:pb-[calc(26vh-6px)] lg:pb-[calc(26.5vh-6px)] pointer-events-none pr-1 sm:pr-4 md:pr-10 lg:pr-16 xl:pr-20"
        >
          <div className="w-[260px] sm:w-[340px] md:w-[420px] lg:w-[520px] xl:w-[640px] 2xl:w-[740px] aspect-[16/9] relative pointer-events-auto hover:scale-105 transition-transform duration-300">
            <InteractiveCat />
          </div>
        </motion.div>
      </div>

      {/* Layer 4: Global Header / Navbar (Always crisp, locked at top) */}
      <nav className="relative z-50 px-4 sm:px-8 md:px-12 flex items-center justify-between h-20 md:h-24 pointer-events-auto shrink-0">
        <Link href="/" className="flex items-center cursor-pointer group h-full py-1 sm:py-1.5 shrink-0">
          <Image 
            src="/meowganics_logo_transparent.png" 
            alt="Meow Ganics Logo" 
            width={1776}
            height={725}
            className="h-full w-auto max-h-[74px] sm:max-h-[82px] md:max-h-[90px] object-contain object-left transition-transform duration-300 group-hover:scale-105 origin-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" 
            priority
          />
        </Link>
        
        <div className="flex items-center gap-3 md:gap-5">
          {/* Shopping Bag Icon */}
          <button
            onClick={openCart}
            className="relative p-2 md:p-3 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer bg-brand-white text-brand-black rounded-full border-2 border-brand-black shadow-[2px_2px_0px_#111111]"
            aria-label="Open Cart"
          >
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-brand-black text-brand-white text-[10px] md:text-xs font-heading font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-white">
              {totalItems}
            </span>
          </button>
          
          {/* Shop Litter Button */}
          <Link
            href="/product"
            className="hidden sm:flex items-center gap-2 bg-brand-white text-brand-black px-4 py-2 rounded-full font-heading font-bold text-xs md:text-sm border-2 border-brand-black shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#111111] transition-all"
          >
            Shop Litter →
          </Link>
        </div>
      </nav>

      {/* Layer 5: Product Bag on Hill (Glides gracefully into the centered dashed box) */}
      <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center pt-4 sm:pt-6">
        <motion.div
          animate={{
            x: isDocked ? "0vw" : (isMobile ? "-23vw" : "-24vw"),
            y: isDocked ? "0vh" : (isMobile ? "18vh" : "12vh"),
            scale: isDocked ? (isMobile ? 0.78 : 0.92) : (isMobile ? 0.72 : 0.92),
            opacity: isDocked ? 0 : 1,
            pointerEvents: isDocked ? "none" : "auto",
          }}
          transition={{
            x: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.45, delay: isDocked ? 0.75 : 0, ease: "easeOut" },
          }}
          className="relative w-[58vw] sm:w-[64vw] md:w-auto h-[36vh] sm:h-[40vh] md:h-[44vh] max-w-[260px] sm:max-w-[320px] md:max-w-none max-h-[330px] sm:max-h-[360px] md:max-h-[400px] aspect-[926/1004] origin-center flex items-center justify-center pointer-events-auto"
        >
          <div 
            onClick={() => {
              if (!isDocked) setIsDocked(true);
            }}
            className="animate-float drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] w-full h-full block relative cursor-pointer hover:scale-105 transition-transform"
          >
            <Image
              src="/product-bag.png"
              alt="Clean Bean Product Bag"
              fill
              sizes="(max-width: 768px) 380px, 440px"
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Layer 6: Main Showcase Arena matching Oryzo.ai layout */}
      <div 
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative z-30 w-full flex-1 flex flex-col items-center justify-center my-auto px-4 overflow-visible"
      >
        
        {/* Left Headline: Compact, elegant Oryzo Typography placed in Upper-Left corner above side cards (matching Image 2) */}
        <motion.div 
          animate={{
            opacity: isDocked ? 1 : 0,
            y: isDocked ? 0 : -20,
            pointerEvents: isDocked ? "auto" : "none",
          }}
          transition={{ duration: 0.8, delay: isDocked ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-6 sm:left-10 md:left-14 lg:left-16 xl:left-20 top-16 sm:top-18 md:top-20 lg:top-22 z-40 max-w-[220px] sm:max-w-[280px] md:max-w-[340px] flex flex-col items-start text-left pointer-events-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-start w-full"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-heading font-black tracking-wide leading-tight text-white uppercase drop-shadow-md">
                <span>{currentItem.title1}</span>
                <br />
                <span className="text-white/60 font-bold lowercase tracking-normal">
                  {currentItem.title2}
                </span>
              </h1>

              <div className="flex items-center gap-3 mt-3.5 sm:mt-4">
                {currentItem.isComingSoon ? (
                  <div className="flex items-center gap-2">
                    <span
                      className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-heading font-black text-xs sm:text-sm text-brand-black shadow-lg flex items-center gap-2 select-none"
                      style={{ backgroundColor: currentItem.accentColor }}
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-black animate-ping" />
                      <span>{currentItem.comingSoonDrop || "Coming Soon"}</span>
                    </span>
                    <span className="text-white/70 text-xs font-mono font-medium px-2.5 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
                      Stay Tuned
                    </span>
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/product${currentItem.flavorId ? `?flavor=${currentItem.flavorId}` : ""}`}
                      className="px-4 sm:px-5 py-1.5 sm:py-2 bg-white text-brand-black rounded-full font-heading font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0px_#A9D3F4]"
                    >
                      Buy Now • {currentItem.price}
                    </Link>

                    <button
                      onClick={() => handleQuickAdd(currentItem)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/25 hover:border-white text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer bg-black/30 backdrop-blur-sm"
                      aria-label={`Quick add ${currentItem.flavor}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Center Arena: "THIS BOX" in DEAD CENTER with small side thumbnails (matching Image 2) */}
        <div className="relative w-full flex items-center justify-center h-[50vh] sm:h-[54vh] md:h-[60vh] max-h-[540px]">
          
          {/* "THIS BOX" - Centered Dashed Frame Container */}
          <motion.div 
            animate={{
              opacity: isDocked ? 1 : 0,
              scale: isDocked ? 1 : 0.9,
            }}
            transition={{ duration: 0.9, delay: isDocked ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-10 w-[230px] sm:w-[270px] md:w-[310px] lg:w-[340px] h-[310px] sm:h-[370px] md:h-[430px] lg:h-[470px] rounded-2xl md:rounded-3xl border border-dashed border-white/50 pointer-events-none shadow-2xl" 
          />

          {/* Horizontal Filmstrip: Center Card is Large, Side Cards are Reduced Thumbnails (matching Image 2) */}
          <motion.div 
            animate={{
              opacity: isDocked ? 1 : 0,
              pointerEvents: isDocked ? "auto" : "none",
            }}
            transition={{ duration: 0.9, delay: isDocked ? 0.4 : 0, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full flex items-center justify-center overflow-visible z-20"
          >
            <div className="relative flex items-center justify-center w-full">
              {ORYZO_ITEMS.map((prod, index) => {
                const offset = index - activeIndex;
                const isCenter = offset === 0;
                const abs = Math.abs(offset);
                const sign = Math.sign(offset);

                // Side thumbnails: scaled down to ~45% and spaced out horizontally
                const baseDist = isMobile ? 180 : 260;
                const stepDist = isMobile ? 115 : 160;
                const targetX = isCenter ? 0 : sign * (baseDist + (abs - 1) * stepDist);
                const targetScale = isCenter ? 1 : (isMobile ? 0.45 : 0.48);
                const targetOpacity = isCenter ? 1 : (abs === 1 ? 0.85 : abs === 2 ? 0.6 : 0.35);

                return (
                  <motion.div
                    key={prod.id}
                    onClick={() => setActiveIndex(index)}
                    animate={{
                      x: targetX,
                      scale: targetScale,
                      opacity: targetOpacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 160,
                      damping: 24,
                      mass: 0.8,
                    }}
                    className={`absolute w-[230px] sm:w-[270px] md:w-[310px] lg:w-[340px] h-[310px] sm:h-[370px] md:h-[430px] lg:h-[470px] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer select-none transition-shadow duration-300 origin-center ${
                      isCenter
                        ? "shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-30"
                        : "z-10 hover:opacity-95"
                    }`}
                  >
                    <Image
                      src={prod.image}
                      alt={prod.flavor}
                      fill
                      sizes="(max-width: 640px) 210px, (max-width: 768px) 280px, 360px"
                      className="object-cover object-center"
                      priority={index === 0}
                    />
                    {prod.isComingSoon && (
                      <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 pointer-events-none">
                        <span
                          className="px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider backdrop-blur-md border border-white/25 text-white shadow-xl flex items-center gap-1.5"
                          style={{ backgroundColor: `${prod.accentColor}33` }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: prod.accentColor }} />
                          Soon
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Floating Navigation Arrows flanking the center preview box */}
          <motion.div 
            animate={{
              opacity: isDocked ? 1 : 0,
              pointerEvents: isDocked ? "auto" : "none",
            }}
            transition={{ duration: 0.5, delay: isDocked ? 0.2 : 0 }}
            className="absolute z-40 w-[230px] sm:w-[270px] md:w-[310px] lg:w-[340px] flex items-center justify-between pointer-events-none"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous product"
              className="-translate-x-4 sm:-translate-x-6 md:-translate-x-8 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-white hover:text-brand-black text-white backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-[0_8px_25px_rgba(0,0,0,0.6)] pointer-events-auto"
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
              className="translate-x-4 sm:translate-x-6 md:translate-x-8 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-white hover:text-brand-black text-white backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-[0_8px_25px_rgba(0,0,0,0.6)] pointer-events-auto"
            >
              <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>

        </div>
      </div>

      {/* Layer 7: Bottom Navigation & Swap Indicators (Locked cleanly at the bottom) */}
      <div className="relative z-30 max-w-7xl mx-auto w-full pb-4 sm:pb-6 px-6 sm:px-10 flex items-center justify-between text-xs text-white/50 pointer-events-auto">
        {/* Scroll hint on Hero / Swap hint in Box */}
        <div className="flex items-center">
          {!isDocked ? (
            <button
              onClick={() => setIsDocked(true)}
              className="flex items-center gap-2 text-brand-black font-heading font-bold cursor-pointer hover:opacity-80 transition-opacity bg-brand-white/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-brand-black/20 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-brand-black animate-pulse" />
              <span>Scroll down to see product in box ↓</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-white/60 font-heading">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9D3F4] animate-pulse" />
              <span>Scroll or use arrows to swap</span>
            </div>
          )}
        </div>

        {/* Swap Indicator Dots & Product Counter when docked */}
        <motion.div 
          animate={{
            opacity: isDocked ? 1 : 0,
            pointerEvents: isDocked ? "auto" : "none",
          }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-1.5">
            {ORYZO_ITEMS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/20 hover:bg-white/50"
                }`}
                aria-label={`Go to product ${i + 1}`}
              />
            ))}
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] text-white/40">
            {activeIndex + 1} / {ORYZO_ITEMS.length}
          </span>
        </motion.div>

        {/* Back to top hill button */}
        <motion.button
          animate={{
            opacity: isDocked ? 1 : 0,
            pointerEvents: isDocked ? "auto" : "none",
          }}
          onClick={() => {
            setActiveIndex(0);
            setIsDocked(false);
          }}
          className="hover:text-white text-white/60 transition-colors cursor-pointer text-[11px] flex items-center gap-1 font-heading font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
        >
          <span>↑ Back to Hill</span>
        </motion.button>
      </div>

    </div>
  );
}
