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
    id: "peach-paradise",
    title1: "IN THE LAB,",
    title2: "it's peach paradise",
    flavor: "Peach Paradise",
    price: "$19.99",
    priceNum: 19.99,
    image: "/showcase/meow/IMG_7598.PNG",
    accentColor: "#F59E0B",
    flavorId: "peach",
  },
  {
    id: "matcha-zen",
    title1: "BREWING FRESH,",
    title2: "it's matcha zen",
    flavor: "Matcha Zen",
    price: "$19.99",
    priceNum: 19.99,
    image: "/showcase/meow/IMG_7614.PNG",
    accentColor: "#10B981",
    flavorId: "matcha",
  },
  {
    id: "berry-fresh",
    title1: "SWEET EXTRACT,",
    title2: "it's berry fresh",
    flavor: "Berry Fresh",
    price: "$19.99",
    priceNum: 19.99,
    image: "/showcase/meow/IMG_7614.PNG",
    accentColor: "#EC4899",
    flavorId: "berry",
  },
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
];

export type ShowcaseStage = "carousel" | "focus" | "details";

export default function HeroScrollExperience() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [stage, setStage] = useState<ShowcaseStage>("carousel");
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(0); // -1 = prev, 0 = idle, 1 = next
  const [addedAnimation, setAddedAnimation] = useState(false);

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

  // Lock body scroll to power the smooth choreographed steps
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const currentItem = ORYZO_ITEMS[activeIndex] || ORYZO_ITEMS[0];
  // Total steps: Carousel slides (5) + Focus step (1) + Product details (1)
  const TOTAL_SLIDES = ORYZO_ITEMS.length;

  const handleNext = useCallback(() => {
    if (!isDocked) {
      setIsDocked(true);
      setStage("carousel");
      return;
    }

    if (stage === "carousel") {
      if (activeIndex < ORYZO_ITEMS.length - 1) {
        setSlideDir(1);
        setActiveIndex((prev) => prev + 1);
      } else {
        // Step 2: Transition from Carousel Dashed Frame to Center Focus (Image 2)
        setStage("focus");
      }
    } else if (stage === "focus") {
      // Step 3: Transition from Center Focus to Full Screen Details (Image 3)
      setStage("details");
    }
  }, [isDocked, stage, activeIndex]);

  const handlePrev = useCallback(() => {
    if (stage === "details") {
      // Step 3 -> Step 2: Return to Center Focus (Image 2)
      setStage("focus");
      return;
    }

    if (stage === "focus") {
      // Step 2 -> Step 1: Return to Carousel last slide (Image 1)
      setStage("carousel");
      setActiveIndex(ORYZO_ITEMS.length - 1);
      setSlideDir(-1);
      return;
    }

    if (isDocked && stage === "carousel") {
      if (activeIndex > 0) {
        setSlideDir(-1);
        setActiveIndex((prev) => prev - 1);
      } else {
        // Step 1 -> Hill
        setIsDocked(false);
      }
    }
  }, [stage, isDocked, activeIndex]);

  const handleSelectIndex = useCallback((newIndex: number) => {
    setIsDocked(true);
    setStage("carousel");
    setActiveIndex((prev) => {
      if (newIndex === prev) return prev;
      setSlideDir(newIndex > prev ? 1 : -1);
      return newIndex;
    });
  }, []);

  useEffect(() => {
    if (slideDir !== 0) {
      const t = setTimeout(() => setSlideDir(0), 550);
      return () => clearTimeout(t);
    }
  }, [slideDir, activeIndex]);

  // Locked Wheel listener with calibrated scroll pacing
  const handleWheel = (e: React.WheelEvent) => {
    if (isWheelDebounced.current) return;

    if (Math.abs(e.deltaY) > 18) {
      isWheelDebounced.current = true;

      if (e.deltaY > 18) {
        handleNext();
      } else {
        handlePrev();
      }

      const cooldown = !isDocked ? 950 : stage !== "carousel" ? 850 : 580;
      setTimeout(() => {
        isWheelDebounced.current = false;
      }, cooldown);
    }
  };

  // Touch handlers with matching pacing
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
    touchStartRef.current = null;

    const minSwipeDist = 28;
    const touchCooldownTime = stage !== "carousel" ? 750 : 450;

    if (Math.abs(diffX) >= Math.abs(diffY)) {
      if (Math.abs(diffX) > minSwipeDist) {
        touchCooldownRef.current = true;
        setTimeout(() => {
          touchCooldownRef.current = false;
        }, touchCooldownTime);

        if (diffX > 0) handleNext();
        else handlePrev();
      }
    } else {
      if (Math.abs(diffY) > minSwipeDist) {
        touchCooldownRef.current = true;
        setTimeout(() => {
          touchCooldownRef.current = false;
        }, touchCooldownTime);

        if (diffY > 0) handleNext();
        else handlePrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Quick add to cart
  const handleQuickAdd = (item: OryzoItem) => {
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 900);

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
          volume: "6L / Single",
        },
        price: item.priceNum || 19.99,
        image: item.image,
        quantity: 1,
      },
      true
    );
  };

  const handleProductDetailsAddToCart = () => {
    const cleanBeanItem =
      ORYZO_ITEMS.find((item) => item.id === "clean-bean-original") ||
      ORYZO_ITEMS[ORYZO_ITEMS.length - 1];
    handleQuickAdd(cleanBeanItem);
  };

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#111317] select-none flex flex-col justify-between"
    >
      {/* Layer 0: Sky Blue Hero Background (Crossfades away on scroll) */}
      <motion.div
        animate={{ opacity: isDocked ? 0 : 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-brand-blue pointer-events-none z-0"
      />

      {/* Layer 0.5: Rich Oryzo-Style Warm Dark Background Gradient */}
      <motion.div
        animate={{
          opacity: isDocked ? (stage !== "carousel" ? 1 : 0.85) : 0,
        }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-gradient-to-r from-[#241711] via-[#161311] to-[#0c0d0f] pointer-events-none z-0"
      />

      {/* Layer 1: Ambient Background Color Glow (Left Warm Espresso Bloom) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            backgroundColor: stage !== "carousel" ? "#4a2a19" : currentItem.accentColor,
            opacity: isDocked ? (stage === "details" ? 0.35 : stage === "focus" ? 0.45 : 0.3) : 0.05,
            x: stage !== "carousel" ? "-20vw" : "0vw",
            scale: stage === "details" ? 1.4 : stage === "focus" ? 1.25 : 1.0,
          }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[80vh] rounded-full blur-[180px]"
        />
      </div>

      {/* Layer 2: White Wave Curve Hill */}
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

      {/* Layer 3: Interactive Cat on Right Hill */}
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

      {/* Layer 4: Global Header / Navbar */}
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
            <svg
              className="w-5 h-5 md:w-5.5 md:h-5.5"
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
            <span className="absolute -top-1 -right-1 bg-white text-brand-black text-[10px] md:text-xs font-heading font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-md">
              {totalItems}
            </span>
          </button>

          {/* Shop Litter Button (Directly triggers Full Screen Product Stage) */}
          <button
            onClick={() => {
              setIsDocked(true);
              setStage("details");
            }}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-heading font-bold text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer ${
              stage === "details"
                ? "bg-[#A9D3F4] text-brand-black ring-2 ring-white/50"
                : "bg-white text-brand-black"
            }`}
          >
            <span>Shop Litter</span>
            <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Layer 5: Initial Product Bag on Hill */}
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

      {/* ══════════════════════════════════════════════════════════════════════════════════════
          LAYER 6: SEQUENTIAL 3-STEP SHOWCASE ARENA (Oryzo.ai Sequence)
          Step 1 (stage === 'carousel'): Dashed Box with Side Cards & Headline (Image 1)
          Step 2 (stage === 'focus'): Dashed border contracts, clean vertical focus slice (Image 2)
          Step 3 (stage === 'details'): Opens full screen, product moves right, left glass reveals (Image 3)
          ══════════════════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        animate={{
          opacity: isDocked ? 1 : 0,
          pointerEvents: isDocked ? "auto" : "none",
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          visibility: isDocked ? "visible" : "hidden",
        }}
        className={`relative z-30 w-full flex-1 flex flex-col justify-center items-center overflow-visible ${
          !isDocked ? "opacity-0 pointer-events-none invisible" : ""
        }`}
      >
        <div className="relative w-full h-full flex items-center justify-center overflow-visible">

          {/* ── Side Thumbnail Previews (Visible ONLY in Stage 1: Carousel) ── */}
          {ORYZO_ITEMS.map((prod, index) => {
            const offset = index - activeIndex;
            const abs = Math.abs(offset);
            const sign = Math.sign(offset);

            const baseDist = isMobile ? 145 : 275;
            const stepDist = isMobile ? 90 : 175;

            let xPos = 0;
            const thumbScale = isMobile ? 0.38 : 0.44;
            let thumbOpacity = 0;

            if (abs === 0) {
              xPos = 0;
              thumbOpacity = 0;
            } else if (abs === 1) {
              xPos = sign * baseDist;
              thumbOpacity = isDocked && stage === "carousel" ? 0.6 : 0;
            } else if (abs === 2) {
              xPos = sign * (baseDist + stepDist);
              thumbOpacity = isDocked && stage === "carousel" ? 0.28 : 0;
            } else {
              xPos = sign * (baseDist + stepDist * (abs - 1));
              thumbOpacity = 0;
            }

            const isInteractive = isDocked && stage === "carousel" && (abs === 1 || abs === 2);

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
                <div
                  className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-300 ${
                    abs === 1 ? "opacity-30" : "opacity-65"
                  }`}
                />
              </motion.div>
            );
          })}

          {/* ── THE MORPHING BOX CONTAINER (Sequence: Step 1 -> Step 2 -> Step 3) ──
              Step 1: 380px dashed box (Carousel)
              Step 2: Box EXPANDS OUTWARDS to Full Screen (100vw × 100vh) with Centered Image (Focus)
              Step 3: Product image glides from center to the right & left glass card reveals (Details) ── */}
          <motion.div
            animate={{
              width: stage !== "carousel" ? "100vw" : isMobile ? 220 : 380,
              height: stage !== "carousel" ? "100vh" : isMobile ? 310 : 510,
              borderRadius: 0,
            }}
            transition={{
              duration: 1.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              overflow: stage === "carousel" ? "hidden" : "visible",
            }}
            className="relative z-20 flex items-center justify-center pointer-events-auto"
          >
            {/* Dashed Border Layer: Shrinks/reduces inwards in a minus sequence when entering focus mode */}
            <motion.div
              animate={{
                opacity: stage === "carousel" ? 1 : 0,
                scale: stage === "carousel" ? 1 : 0.88,
              }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-0 border-[1.5px] border-dashed border-white/40 pointer-events-none z-30"
            />

            {/* Step 1: Carousel Filmstrip with Original 3D Spring Tilt */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ rotate: stage === "carousel" ? slideDir * 3 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 flex flex-row pointer-events-auto"
                animate={{
                  x: `calc(${-activeIndex * (100 / ORYZO_ITEMS.length)}%)`,
                  opacity: stage === "carousel" ? 1 : 0,
                }}
                transition={{ type: "tween", ease: [0.76, 0, 0.24, 1], duration: 0.55 }}
                style={{
                  width: `${ORYZO_ITEMS.length * 100}%`,
                  pointerEvents: stage === "carousel" ? "auto" : "none",
                }}
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
                      priority={index === 0 || index === ORYZO_ITEMS.length - 1}
                      draggable={false}
                    />
                    </div>
                  ))}
              </motion.div>
            </motion.div>

            {/* Step 2 & Step 3: Clean Product Centerpiece Visual
                - Step 2 (focus): Centered upright in the exact middle
                - Step 3 (details): On desktop glides to RIGHT (x: 18vw), on mobile shifts UP (y: -18vh, scale: 0.65)
                Both forward and backward transitions are perfectly symmetric & responsive */}
            <motion.div
              animate={{
                opacity: stage !== "carousel" ? 1 : 0,
                x: stage === "details" ? (isMobile ? "0vw" : "18vw") : "0vw",
                y: stage === "details" ? (isMobile ? "-18vh" : "0vh") : "0vh",
                scale: stage === "details" ? (isMobile ? 0.65 : 1.0) : 1.0,
              }}
              transition={{
                duration: 1.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <div className="relative h-[48vh] sm:h-[58vh] md:h-[72vh] max-h-[500px] aspect-[974/1536] drop-shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex items-center justify-center">
                <div className="w-full h-full relative flex items-center justify-center">
                  <Image
                    src="/showcase/meow/IMG_7598.PNG"
                    alt="Clean Bean Original Tofu Cat Litter"
                    fill
                    sizes="(max-width: 768px) 240px, 520px"
                    className="object-contain object-center"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Step 3: Left Side (Desktop) / Bottom Sheet (Mobile) Product Panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: stage === "details" ? 1 : 0,
                x: isMobile ? "-50%" : stage === "details" ? 0 : -50,
                y: isMobile ? (stage === "details" ? 0 : 25) : 0,
                pointerEvents: stage === "details" ? "auto" : "none",
              }}
              transition={{
                duration: stage === "details" ? 0.85 : 0.45,
                delay: stage === "details" ? 0.15 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                left: isMobile ? "50%" : "max(2.5rem, calc(50% - 580px))",
                bottom: isMobile ? "max(4.8rem, 9.5vh)" : "auto",
                top: isMobile ? "auto" : "auto",
                position: "absolute",
                zIndex: 45,
              }}
              className={`w-[calc(100vw-1.5rem)] max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] xl:max-w-[480px] p-3.5 sm:p-6 md:p-8 shrink-0 flex flex-col justify-between ${
                stage !== "details" ? "pointer-events-none" : ""
              }`}
            >
              {/* Frosted Glass Background Layer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{
                  opacity: stage === "details" ? 1 : 0,
                  scale: stage === "details" ? 1 : 0.96,
                }}
                transition={{
                  duration: stage === "details" ? 0.85 : 0.4,
                  delay: stage === "details" ? 0.32 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-white/10 hover:bg-white/[0.13] backdrop-blur-2xl border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.7)] pointer-events-none transition-colors duration-300"
              />

              {/* Content Layer */}
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: stage === "details" ? 1 : 0,
                    y: stage === "details" ? 0 : 10,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: stage === "details" ? 0.15 : 0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mb-0.5"
                >
                  <span className="text-[9px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#A9D3F4]">
                    Elevate Your Routine
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: stage === "details" ? 1 : 0,
                    y: stage === "details" ? 0 : 10,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: stage === "details" ? 0.22 : 0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-xl sm:text-3xl md:text-[42px] font-heading font-black tracking-tight text-white mb-1 sm:mb-3 leading-tight drop-shadow-md"
                >
                  CLEAN BEAN
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: stage === "details" ? 1 : 0,
                    y: stage === "details" ? 0 : 10,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: stage === "details" ? 0.28 : 0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-[10.5px] sm:text-xs md:text-base text-white/80 font-sans font-normal leading-snug mb-1.5 sm:mb-5 line-clamp-2 sm:line-clamp-none"
                >
                  100% natural tofu cat litter made from food-grade soybean fiber. Fast clumping, 99.9% dust-free, and flushable.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: stage === "details" ? 1 : 0 }}
                transition={{ duration: 0.5, delay: stage === "details" ? 0.35 : 0 }}
                className="relative z-10 border-t border-dashed border-white/20 w-full my-1 sm:my-3"
              />

              {/* Price & Add to Cart */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: stage === "details" ? 1 : 0,
                  y: stage === "details" ? 0 : 10,
                }}
                transition={{
                  duration: 0.7,
                  delay: stage === "details" ? 0.38 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative z-10 flex items-center justify-between gap-3 sm:gap-4 pt-0.5"
              >
                <div className="flex flex-col shrink-0">
                  <span className="text-[8.5px] sm:text-[10px] font-mono uppercase tracking-widest text-white/50">
                    Price
                  </span>
                  <span className="text-lg sm:text-3xl md:text-4xl font-heading font-black text-white tracking-tight">
                    $19.99
                  </span>
                </div>

                <button
                  onClick={handleProductDetailsAddToCart}
                  className={`flex-1 py-2 sm:py-3.5 px-3.5 sm:px-6 rounded-full font-heading font-black text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_8px_25px_rgba(255,255,255,0.22)] cursor-pointer ${
                    addedAnimation
                      ? "bg-[#2B7A5D] text-white"
                      : "bg-white text-brand-black hover:bg-white/95"
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <span className="truncate">
                    {addedAnimation ? "Added! 🐾" : "Add to Cart"}
                  </span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── Carousel Mini-Headline on Top Left (Visible only in stage === 'carousel') ── */}
          <div
            className={`hidden md:block absolute z-40 pointer-events-auto shrink-0 max-w-[360px] transition-opacity duration-500 ${
              stage !== "carousel" ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            style={{
              left: "max(1.5rem, calc(50% - 510px))",
              bottom: "calc(50% + 128px)",
            }}
          >
            <AnimatePresence mode="wait">
              {stage === "carousel" && (
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
                    <button
                      onClick={() => {
                        setStage("details");
                      }}
                      className="px-4 sm:px-5 py-1.5 sm:py-2 bg-white text-brand-black rounded-full font-heading font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_4px_18px_rgba(255,255,255,0.18)] cursor-pointer"
                    >
                      Buy Now • {currentItem.price}
                    </button>

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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Navigation arrows flanking the box in Carousel mode ── */}
          <motion.div
            animate={{
              opacity: isDocked && stage === "carousel" ? 1 : 0,
              pointerEvents: isDocked && stage === "carousel" ? "auto" : "none",
            }}
            transition={{ duration: 0.4, delay: isDocked ? 0.2 : 0 }}
            style={{
              visibility: isDocked && stage === "carousel" ? "visible" : "hidden",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            className={`absolute z-40 w-[220px] sm:w-[260px] md:w-[320px] lg:w-[360px] xl:w-[380px] flex items-center justify-between pointer-events-none ${
              !isDocked || stage !== "carousel" ? "opacity-0 invisible pointer-events-none" : ""
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous product"
              className="-translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-black/80 hover:bg-white hover:text-brand-black text-white backdrop-blur-md border border-white/25 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-[0_8px_25px_rgba(0,0,0,0.6)] pointer-events-auto"
            >
              <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next product"
              className="translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-black/80 hover:bg-white hover:text-brand-black text-white backdrop-blur-md border border-white/25 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-[0_8px_25px_rgba(0,0,0,0.6)] pointer-events-auto"
            >
              <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>

        </div>

        {/* Mobile Carousel Details: Bottom */}
        {stage === "carousel" && (
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
                  <button
                    onClick={() => {
                      setStage("details");
                    }}
                    className="px-4 py-1.5 bg-white text-brand-black rounded-full font-heading font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_4px_18px_rgba(255,255,255,0.18)] cursor-pointer"
                  >
                    Buy Now • {currentItem.price}
                  </button>

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
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════════════════════
          LAYER 7: BOTTOM CONTROLS & CONTINUOUS SCROLL STATUS BAR
          ══════════════════════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-40 max-w-7xl mx-auto w-full pb-3 sm:pb-4 px-4 sm:px-8 md:px-12 flex items-center justify-between text-xs text-white/50 pointer-events-auto shrink-0">
        {/* Left Action / Stage indicator */}
        <div className="flex items-center">
          {!isDocked ? (
            <button
              onClick={() => setIsDocked(true)}
              className="flex items-center gap-2 text-brand-black font-heading font-bold cursor-pointer hover:opacity-90 transition-all bg-brand-white/80 backdrop-blur-sm px-3.5 sm:px-4 py-1.5 rounded-full border border-brand-black/20 shadow-sm text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-brand-black animate-pulse" />
              <span className="hidden sm:inline">Scroll down to explore collection</span>
              <span className="sm:hidden">Explore Box</span>
              <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          ) : stage === "details" ? (
            <div className="flex items-center gap-2 text-white/80 font-heading text-xs">
              <span className="w-2 h-2 rounded-full bg-[#A9D3F4] animate-pulse" />
              <span>Product Details • Clean Bean Original</span>
            </div>
          ) : stage === "focus" ? (
            <div className="flex items-center gap-2 text-white/80 font-heading text-xs">
              <span className="w-2 h-2 rounded-full bg-[#A9D3F4] animate-pulse" />
              <span>Focus • Scroll again for Details</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-white/60 font-heading text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9D3F4] animate-pulse" />
              <span>Scroll or swipe to continue</span>
            </div>
          )}
        </div>

        {/* Center/Right Navigation Dots & Step Counter (7 Steps Total) */}
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
          {/* Scroll cue matching Oryzo */}
          <div
            onClick={handleNext}
            className="hidden md:flex items-center gap-2 text-white/50 text-[10px] font-mono tracking-widest uppercase select-none cursor-pointer hover:text-white transition-colors"
          >
            <span className="w-4.5 h-4.5 rounded-full border border-white/20 flex items-center justify-center text-white/70">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
            <span>{stage === "details" ? "Product Ready" : "Scroll to continue"}</span>
          </div>

          {/* Dots for the 5 carousel slides */}
          <div className="flex items-center gap-1.5 md:pl-3 md:border-l md:border-white/15">
            {ORYZO_ITEMS.map((_, i) => {
              const isSelected = stage === "carousel" ? activeIndex === i : i === ORYZO_ITEMS.length - 1;

              return (
                <button
                  key={i}
                  onClick={() => handleSelectIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "w-5 sm:w-6 bg-white"
                      : "w-1.5 bg-white/25 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              );
            })}
          </div>

          <span className="font-mono text-[10px] sm:text-[11px] text-white/40">
            {stage === "details"
              ? "Product Details"
              : stage === "focus"
              ? "Focus"
              : `${activeIndex + 1} / ${TOTAL_SLIDES}`}
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
            setStage("carousel");
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
