"use client";

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import InteractiveCat from "./InteractiveCat";
import { useCart } from "@/context/CartContext";
import gsap from "gsap";

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

// -- Film Strip Carousel: ALL cards in one continuous strip, GSAP slides the whole band --
function FilmStripCarousel({
  items,
  activeIndex,
  isMobile,
  onSelect,
}: {
  items: typeof ORYZO_ITEMS;
  activeIndex: number;
  isMobile: boolean;
  onSelect: (i: number) => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(activeIndex);

  const centerW = isMobile ? 210 : 310;
  const centerH = isMobile ? 300 : 430;
  const sideW = isMobile ? 110 : 155;
  const gap = isMobile ? 14 : 20;
  const slotW = centerW + gap * 2;

  useLayoutEffect(() => {
    if (!stripRef.current || !wrapperRef.current) return;
    const isFirst = prevIndexRef.current === activeIndex;
    prevIndexRef.current = activeIndex;

    const wrapperCenterX = wrapperRef.current.offsetWidth / 2;
    const activeCenterInStrip = activeIndex * slotW + slotW / 2;
    const translateX = wrapperCenterX - activeCenterInStrip;

    gsap.to(stripRef.current, {
      x: translateX,
      duration: isFirst ? 0 : 0.75,
      ease: "power3.inOut",
    });
  }, [activeIndex, slotW]);

  useEffect(() => {
    const snap = () => {
      if (!stripRef.current || !wrapperRef.current) return;
      const wrapperCenterX = wrapperRef.current.offsetWidth / 2;
      const activeCenterInStrip = prevIndexRef.current * slotW + slotW / 2;
      gsap.set(stripRef.current, { x: wrapperCenterX - activeCenterInStrip });
    };
    window.addEventListener("resize", snap);
    return () => window.removeEventListener("resize", snap);
  }, [slotW]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full flex items-center justify-center overflow-visible"
      style={{ height: centerH }}
    >
      <div
        ref={stripRef}
        className="absolute top-0 flex items-center will-change-transform"
        style={{ gap, left: 0 }}
      >
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const isCenter = offset === 0;
          const abs = Math.abs(offset);

          const opacity = isCenter ? 1 : abs === 1 ? 0.8 : abs === 2 ? 0.55 : 0.3;

          return (
            <div
              key={item.id}
              onClick={() => onSelect(index)}
              style={{
                width: slotW,
                height: centerH,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isCenter ? "default" : "pointer",
              }}
            >
              <div
                style={{
                  width: isCenter ? centerW : sideW,
                  height: isCenter ? centerH : Math.round(centerH * (sideW / centerW)),
                  borderRadius: 18,
                  overflow: "hidden",
                  opacity,
                  transition:
                    "opacity 0.5s ease, width 0.75s cubic-bezier(0.22,1,0.36,1), height 0.75s cubic-bezier(0.22,1,0.36,1)",
                  position: "relative",
                  boxShadow: isCenter
                    ? "0 25px 60px rgba(0,0,0,0.85)"
                    : "0 8px 24px rgba(0,0,0,0.45)",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={item.image}
                  alt={item.flavor}
                  fill
                  sizes="(max-width: 640px) 210px, 360px"
                  className="object-cover object-center"
                  priority={index === 0}
                />
                {item.isComingSoon && (
                  <div className="absolute top-2 right-2 z-10 pointer-events-none">
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider backdrop-blur-md border border-white/25 text-white shadow-xl flex items-center gap-1"
                      style={{ backgroundColor: `${item.accentColor}33` }}
                    >
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: item.accentColor }}
                      />
                      Soon
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashed box overlay sits exactly over center slot */}
      <div
        className="absolute pointer-events-none z-20 rounded-2xl md:rounded-3xl border border-dashed border-white/50 shadow-2xl"
        style={{ width: centerW, height: centerH }}
      />
    </div>
  );
}
// --------------------------------------------------------------------------------

export default function HeroScrollExperience() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(0); // -1 = prev, 0 = idle, 1 = next
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchCooldownRef = useRef(false);
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
    setSlideDir(1);
    setActiveIndex((prev) => (prev < ORYZO_ITEMS.length - 1 ? prev + 1 : 0));
  }, []);

  const handlePrev = useCallback(() => {
    setSlideDir(-1);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : ORYZO_ITEMS.length - 1));
  }, []);

  const handleSelectIndex = useCallback((newIndex: number) => {
    setActiveIndex((prev) => {
      if (newIndex === prev) return prev;
      setSlideDir(newIndex > prev ? 1 : -1);
      return newIndex;
    });
  }, []);

  // Reset tilt back to upright AFTER slide completes (550ms) to eliminate mid-slide jitter
  useEffect(() => {
    if (slideDir !== 0) {
      const t = setTimeout(() => setSlideDir(0), 550);
      return () => clearTimeout(t);
    }
  }, [slideDir, activeIndex]);

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

  // Touch Swipe handlers with ref-based tracking & cooldown to ensure exactly 1 item slides per swipe
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || touchCooldownRef.current) {
      touchStartRef.current = null;
      return;
    }

    const touchEnd = e.changedTouches?.[0];
    if (!touchEnd) {
      touchStartRef.current = null;
      return;
    }

    const diffX = touchStartRef.current.x - touchEnd.clientX;
    const diffY = touchStartRef.current.y - touchEnd.clientY;
    touchStartRef.current = null; // Instantly consume the touch start

    const minSwipeDist = 30;

    // Check if primarily horizontal or vertical swipe
    if (Math.abs(diffX) >= Math.abs(diffY)) {
      // Horizontal swipe
      if (Math.abs(diffX) > minSwipeDist) {
        touchCooldownRef.current = true;
        setTimeout(() => {
          touchCooldownRef.current = false;
        }, 450);

        if (!isDocked) {
          setIsDocked(true);
        } else if (diffX > 0) {
          // Swiped Left -> Next image (consistent with right arrow)
          handleNext();
        } else {
          // Swiped Right -> Prev image (consistent with left arrow)
          handlePrev();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > minSwipeDist) {
        touchCooldownRef.current = true;
        setTimeout(() => {
          touchCooldownRef.current = false;
        }, 450);

        if (diffY > 0) {
          // Swiped UP -> Move into box / next product
          if (!isDocked) {
            setIsDocked(true);
          } else {
            handleNext();
          }
        } else {
          // Swiped DOWN -> Previous product / back to hill
          if (isDocked) {
            if (activeIndex > 0) {
              handlePrev();
            } else {
              setIsDocked(false);
            }
          }
        }
      }
    }
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

      {/* Layer 4: Global Header / Navbar (Always crisp, locked at top, Oryzo.ai inspired) */}
      <nav className="relative z-50 px-4 sm:px-8 md:px-12 flex items-center justify-between h-16 md:h-20 pointer-events-auto shrink-0">
        <Link href="/" className="flex items-center cursor-pointer group h-full py-1 shrink-0">
          <Image 
            src="/meowganics_logo_transparent.png" 
            alt="Meow Ganics Logo" 
            width={1776}
            height={725}
            className="h-full w-auto max-h-[58px] sm:max-h-[66px] md:max-h-[74px] object-contain object-left transition-transform duration-300 group-hover:scale-105 origin-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" 
            priority
          />
        </Link>
        
        <div className="flex items-center gap-3 md:gap-4">
          {/* Shopping Bag Icon */}
          <button
            onClick={openCart}
            className="relative p-2.5 md:p-3 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 shadow-md backdrop-blur-md"
            aria-label="Open Cart"
          >
            <svg className="w-5 h-5 md:w-5.5 md:h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-white text-brand-black text-[10px] md:text-xs font-heading font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-md">
              {totalItems}
            </span>
          </button>
          
          {/* Shop Litter Button */}
          <Link
            href="/product"
            className="hidden sm:flex items-center gap-2 bg-white text-brand-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-heading font-bold text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <span>Shop Litter</span>
            <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
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
      <motion.div 
        animate={{
          opacity: isDocked ? 1 : 0,
          pointerEvents: isDocked ? "auto" : "none",
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          opacity: isDocked ? 1 : 0,
          visibility: isDocked ? "visible" : "hidden",
        }}
        className={`relative z-30 w-full flex-1 flex flex-col justify-center items-center px-4 overflow-visible ${
          !isDocked ? "opacity-0 pointer-events-none invisible" : ""
        }`}
      >
        
        {/* Center Arena: center box + flanking side thumbnails (Oryzo.ai gallery strip) */}
        <div className="relative w-full flex items-center justify-center h-[310px] sm:h-[370px] md:h-[440px] lg:h-[480px] xl:h-[510px] overflow-visible">

          {/* Desktop Product Details: Positioned on top of the left corner preview image with spacing */}
          <div
            className="hidden md:block absolute z-40 pointer-events-auto shrink-0 max-w-[360px]"
            style={{
              left: "max(1.5rem, calc(50% - 510px))",
              bottom: "calc(50% + 128px)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex flex-col items-start text-left w-full"
              >
                <h1 className="flex flex-col items-start text-left">
                  <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-white/50 mb-0.5 sm:mb-1">
                    {currentItem.title1}
                  </span>
                  <span className="text-xl sm:text-2xl md:text-3xl font-heading font-black tracking-tight leading-tight text-white drop-shadow-md">
                    {currentItem.title2}
                  </span>
                </h1>

                <div className="flex items-center gap-2.5 sm:gap-3 mt-2 sm:mt-2.5">
                  {currentItem.isComingSoon ? (
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3.5 sm:px-4 py-1.5 rounded-full font-heading font-black text-xs text-brand-black shadow-lg flex items-center gap-1.5 select-none"
                        style={{ backgroundColor: currentItem.accentColor }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-black animate-ping" />
                        <span>{currentItem.comingSoonDrop || "Coming Soon"}</span>
                      </span>
                      <span className="text-white/70 text-[11px] font-mono font-medium px-2.5 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
                        Stay Tuned
                      </span>
                    </div>
                  ) : (
                    <>
                      <Link
                        href={`/product${currentItem.flavorId ? `?flavor=${currentItem.flavorId}` : ""}`}
                        className="px-4 sm:px-5 py-1.5 sm:py-2 bg-white text-brand-black rounded-full font-heading font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_4px_18px_rgba(255,255,255,0.18)]"
                      >
                        Buy Now • {currentItem.price}
                      </Link>

                      <button
                        onClick={() => handleQuickAdd(currentItem)}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/25 hover:border-white text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-md"
                        aria-label={`Quick add ${currentItem.flavor}`}
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Side Thumbnail Previews (outside the box: continuous horizontal filmstrip) ── */}
          {ORYZO_ITEMS.map((prod, index) => {
            const offset = index - activeIndex;
            const abs = Math.abs(offset);
            const sign = Math.sign(offset);

            // Responsive positioning distances
            const baseDist = isMobile ? 145 : 275;
            const stepDist = isMobile ? 90 : 175;

            let xPos = 0;
            const thumbScale = isMobile ? 0.38 : 0.44;
            let thumbOpacity = 0;

            if (abs === 0) {
              // Center card: tucked smoothly behind the center box at x=0
              xPos = 0;
              thumbOpacity = 0;
            } else if (abs === 1) {
              xPos = sign * baseDist;
              thumbOpacity = !isDocked ? 0 : 0.60;
            } else if (abs === 2) {
              xPos = sign * (baseDist + stepDist);
              thumbOpacity = !isDocked ? 0 : 0.28;
            } else {
              // Further out: smoothly glides off into distance while faded
              xPos = sign * (baseDist + stepDist * (abs - 1));
              thumbOpacity = 0;
            }

            const isInteractive = isDocked && (abs === 1 || abs === 2);

            return (
              <motion.div
                key={prod.id}
                onClick={() => {
                  if (isInteractive) handleSelectIndex(index);
                }}
                style={{ top: "50%" }}
                animate={{
                  x: xPos,
                  y: "-50%",
                  scale: thumbScale,
                  opacity: thumbOpacity,
                }}
                whileHover={isInteractive ? { scale: thumbScale * 1.05, opacity: 0.95 } : undefined}
                transition={{
                  duration: 0.55,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className={`absolute w-[220px] sm:w-[260px] md:w-[320px] lg:w-[360px] xl:w-[380px] h-[310px] sm:h-[370px] md:h-[440px] lg:h-[480px] xl:h-[510px] rounded-none overflow-hidden z-10 select-none shadow-xl border border-white/10 ${
                  isInteractive ? "cursor-pointer pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <Image
                  src={prod.image}
                  alt={prod.flavor}
                  fill
                  sizes="(max-width: 640px) 140px, 180px"
                  className="object-cover object-center"
                  draggable={false}
                />

                {/* Hardware-accelerated dimming overlay (no laggy CSS filter) */}
                <div
                  className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-300 ${
                    abs === 1 ? "opacity-30" : "opacity-65"
                  }`}
                />

                {prod.isComingSoon && (
                  <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
                    <span
                      className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-black uppercase tracking-wider backdrop-blur-md border border-white/25 text-white flex items-center gap-1 shadow-md"
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

          {/* THE BOX: static border — does NOT move or rotate */}
          <motion.div
            animate={{
              opacity: isDocked ? 1 : 0,
              scale: isDocked ? 1 : 0.9,
            }}
            transition={{
              opacity: { duration: 0.9, delay: isDocked ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 0.9, delay: isDocked ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] },
            }}
            style={{ visibility: isDocked ? "visible" : "hidden" }}
            className={`relative z-20 w-[220px] sm:w-[260px] md:w-[320px] lg:w-[360px] xl:w-[380px] h-[310px] sm:h-[370px] md:h-[440px] lg:h-[480px] xl:h-[510px] rounded-none border-[1.5px] border-dashed border-white/40 overflow-hidden shadow-2xl ${!isDocked ? "opacity-0 invisible" : ""}`}
          >
            {/* Tilt wrapper: absolute inset-0 = same size as box, so rotate pivots around box center */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: slideDir * 3 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
            >
              {/* Filmstrip: only x translation — lives inside the tilt wrapper */}
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
                      sizes="(max-width: 640px) 220px, 380px"
                      className="object-cover object-center"
                      priority={index === 0}
                      draggable={false}
                    />
                    {prod.isComingSoon && (
                      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 pointer-events-none">
                        <span
                          className="px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-mono font-black uppercase tracking-wider backdrop-blur-md border border-white/25 text-white shadow-xl flex items-center gap-1"
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
            </motion.div>
          </motion.div>

          {/* Navigation arrows flanking the box: centered vertically in the middle of the box */}
          <motion.div
            animate={{
              opacity: isDocked ? 1 : 0,
              pointerEvents: isDocked ? "auto" : "none",
            }}
            transition={{ duration: 0.5, delay: isDocked ? 0.2 : 0 }}
            style={{
              visibility: isDocked ? "visible" : "hidden",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            className={`absolute z-40 w-[220px] sm:w-[260px] md:w-[320px] lg:w-[360px] xl:w-[380px] flex items-center justify-between pointer-events-none ${!isDocked ? "opacity-0 invisible pointer-events-none" : ""}`}
          >
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              aria-label="Previous product"
              className="-translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-black/80 hover:bg-white hover:text-brand-black text-white backdrop-blur-md border border-white/25 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-[0_8px_25px_rgba(0,0,0,0.6)] pointer-events-auto"
            >
              <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              aria-label="Next product"
              className="translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-black/80 hover:bg-white hover:text-brand-black text-white backdrop-blur-md border border-white/25 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-[0_8px_25px_rgba(0,0,0,0.6)] pointer-events-auto"
            >
              <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>

        </div>

        {/* Mobile Product Details: Placed in bottom of box in middle with spacing */}
        <div className="md:hidden z-40 pointer-events-auto shrink-0 w-full max-w-[320px] mt-4 sm:mt-5 flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col items-center text-center w-full"
            >
              <h1 className="flex flex-col items-center text-center">
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-white/50 mb-0.5 sm:mb-1">
                  {currentItem.title1}
                </span>
                <span className="text-xl sm:text-2xl font-heading font-black tracking-tight leading-tight text-white drop-shadow-md">
                  {currentItem.title2}
                </span>
              </h1>

              <div className="flex items-center justify-center gap-2.5 mt-2">
                {currentItem.isComingSoon ? (
                  <div className="flex items-center gap-2">
                    <span
                      className="px-3.5 py-1.5 rounded-full font-heading font-black text-xs text-brand-black shadow-lg flex items-center gap-1.5 select-none"
                      style={{ backgroundColor: currentItem.accentColor }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-black animate-ping" />
                      <span>{currentItem.comingSoonDrop || "Coming Soon"}</span>
                    </span>
                    <span className="text-white/70 text-[11px] font-mono font-medium px-2.5 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
                      Stay Tuned
                    </span>
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/product${currentItem.flavorId ? `?flavor=${currentItem.flavorId}` : ""}`}
                      className="px-4 py-1.5 bg-white text-brand-black rounded-full font-heading font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_4px_18px_rgba(255,255,255,0.18)]"
                    >
                      Buy Now • {currentItem.price}
                    </Link>

                    <button
                      onClick={() => handleQuickAdd(currentItem)}
                      className="w-8 h-8 rounded-full border border-white/25 hover:border-white text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-md"
                      aria-label={`Quick add ${currentItem.flavor}`}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Layer 7: Bottom Navigation & Swap Indicators (Locked cleanly at the bottom) */}
      <div className="relative z-30 max-w-7xl mx-auto w-full pb-3 sm:pb-4 px-4 sm:px-8 md:px-12 flex items-center justify-between text-xs text-white/50 pointer-events-auto shrink-0">
        {/* Scroll hint on Hero / Swap hint in Box */}
        <div className="flex items-center">
          {!isDocked ? (
            <button
              onClick={() => setIsDocked(true)}
              className="flex items-center gap-2 text-brand-black font-heading font-bold cursor-pointer hover:opacity-90 transition-all bg-brand-white/80 backdrop-blur-sm px-3.5 sm:px-4 py-1.5 rounded-full border border-brand-black/20 shadow-sm text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-brand-black animate-pulse" />
              <span className="hidden sm:inline">Scroll down to see product in box</span>
              <span className="sm:hidden">Explore Box</span>
              <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-white/60 font-heading text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9D3F4] animate-pulse" />
              <span>Scroll or use arrows to swap</span>
            </div>
          )}
        </div>

        {/* Oryzo-style Scroll Cue & Indicator Dots */}
        <motion.div 
          animate={{
            opacity: isDocked ? 1 : 0,
            pointerEvents: isDocked ? "auto" : "none",
          }}
          transition={{ duration: 0.5 }}
          style={{
            opacity: isDocked ? 1 : 0,
            visibility: isDocked ? "visible" : "hidden",
          }}
          className={`flex items-center gap-2.5 sm:gap-4 ${
            !isDocked ? "opacity-0 pointer-events-none invisible" : ""
          }`}
        >
          {/* Circular Down Chevron Pill matching Oryzo */}
          <div className="hidden md:flex items-center gap-2 text-white/50 text-[10px] font-mono tracking-widest uppercase select-none">
            <span className="w-4.5 h-4.5 rounded-full border border-white/20 flex items-center justify-center text-white/70">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
            <span>Scroll to continue</span>
          </div>

          <div className="flex items-center gap-1.5 md:pl-3 md:border-l md:border-white/15">
            {ORYZO_ITEMS.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelectIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex ? "w-5 sm:w-6 bg-white" : "w-1.5 bg-white/25 hover:bg-white/50"
                }`}
                aria-label={`Go to product ${i + 1}`}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] sm:text-[11px] text-white/40">
            {activeIndex + 1} / {ORYZO_ITEMS.length}
          </span>
        </motion.div>

        {/* Back to top hill button */}
        <motion.button
          animate={{
            opacity: isDocked ? 1 : 0,
            pointerEvents: isDocked ? "auto" : "none",
          }}
          transition={{ duration: 0.5 }}
          style={{
            opacity: isDocked ? 1 : 0,
            visibility: isDocked ? "visible" : "hidden",
          }}
          onClick={() => {
            setActiveIndex(0);
            setIsDocked(false);
          }}
          className={`hover:text-white text-white/60 transition-colors cursor-pointer text-[10px] sm:text-[11px] flex items-center gap-1 font-heading font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-white/10 ${
            !isDocked ? "opacity-0 pointer-events-none invisible" : ""
          }`}
        >
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className="hidden sm:inline">Back to Hill</span>
          <span className="sm:hidden">Top</span>
        </motion.button>
      </div>

    </div>
  );
}

