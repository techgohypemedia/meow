"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import InteractiveCat from "./InteractiveCat";
import HeroBackground from "./HeroBackground";
import { useCart } from "@/context/CartContext";
import CartIcon from "@/components/CartIcon";
import ProfileMenu from "@/components/ProfileMenu";

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
];

export type ShowcaseStage = "carousel" | "focus" | "details";
export type IntroPhase = "hero" | "spotlight" | "stabilizing" | "docked";

export default function HeroScrollExperience() {
  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [introPhase, setIntroPhase] = useState<IntroPhase>("hero");
  const [isDocked, setIsDocked] = useState(false);
  const [stage, setStage] = useState<ShowcaseStage>("carousel");
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(0); // -1 = prev, 0 = idle, 1 = next
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [pullProgress, setPullProgress] = useState(0); // 0 to 90px pull down distance
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dragOffset, setDragOffset] = useState(0); // horizontal drag in carousel mode

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchCooldownRef = useRef(false);
  const isWheelDebounced = useRef(false);
  const introTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const introSubTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { totalItems, openCart, addToCart } = useCart();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Precise mobile hero position matching the portrait artwork (Image 1 & Image 2)
  // Artwork is 941w x 1672h, pinned to bottom-0
  const isMobileView = viewport.width ? viewport.width < 768 : isMobile;
  // Mobile hero position, measured from the mockup at full phone width (HeroBackground puts the
  // cat's paws at ~44.8vw-89vw and its ear tips 0.532vw above the viewport bottom):
  //   bag ~43vw wide, centred at 26vw so it spans ~4.5vw-47.5vw and just meets the cat's left
  //   paw; bag top 0.66vw above the bottom so the bag grows evenly up and down.
  const mobileBagBaseWidth = viewport.width >= 640
    ? Math.min(viewport.width * 0.30, 220)
    : Math.min(viewport.width * 0.42, 205);
  const mobileBagWidth = viewport.width * 0.43;
  const mobileBagHeight = mobileBagWidth * (1448 / 1086);
  const mobileHeroScale = mobileBagBaseWidth ? mobileBagWidth / mobileBagBaseWidth : 1.0;
  const mobileHeroX = viewport.width ? viewport.width * (0.26 - 0.5) : "-24vw";
  const mobileHeroY = viewport.height
    ? viewport.height / 2 - (viewport.width * 0.66 - mobileBagHeight / 2)
    : "26.5vh";

  // Laptop hero position (>= 1024px): bag locked bottom-left on the floor, sized off viewport
  // width like the background artwork so bag and cat keep the same layout on every laptop.
  // Bag is 22vw wide, centred at 28vw, bottom edge 3vh above the viewport bottom.
  const isLaptopView = viewport.width >= 1024;
  const laptopBagBaseWidth = Math.min(viewport.width * 0.19, 280);
  const laptopBagHeight = viewport.width * 0.22 * (1448 / 1086);
  const laptopHeroX = viewport.width * (0.28 - 0.5);
  const laptopHeroY = viewport.height * 0.47 - laptopBagHeight / 2;
  const laptopHeroScale = laptopBagBaseWidth ? (viewport.width * 0.22) / laptopBagBaseWidth : 0.92;

  // Responsive Carousel Card Dimensions (Enlarged banner for mobile view, tuned for mobile viewport height)
  const isTablet = viewport.width ? viewport.width >= 640 && viewport.width < 1024 : false;
  const rawCardWidth = !isMobile ? 380 : isTablet ? 340 : (viewport.width ? Math.min(Math.round(viewport.width * 0.74), 280) : 270);
  const maxMobileCardHeight = viewport.height ? Math.round(viewport.height * 0.42) : 330;
  const cardWidth = !isMobile ? 380 : isTablet ? 340 : rawCardWidth;
  const cardHeight = !isMobile ? 510 : isTablet ? 455 : Math.min(Math.round(cardWidth * (510 / 380)), maxMobileCardHeight);

  // Scaled to fit cleanly INSIDE the dashed box (no enlarging or overflowing outside the card)
  const inBoxBagScale = isMobileView ? 0.78 : 0.88;

  // Lock body scroll to power the smooth choreographed steps
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Dedicated reliable state-machine for intro progression
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (introPhase === "stabilizing") {
      timer = setTimeout(() => {
        setIntroPhase("docked");
        setIsDocked(true);
        setStage("carousel");
      }, 350);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [introPhase]);

  const currentItem = ORYZO_ITEMS[activeIndex] || ORYZO_ITEMS[0];
  // Total steps: Carousel slides (5) + Focus step (1) + Product details (1)
  const TOTAL_SLIDES = ORYZO_ITEMS.length;

  const handleSlideNext = useCallback(() => {
    if (introPhase !== "docked") return;
    setSlideDir(1);
    setActiveIndex((prev) => (prev < ORYZO_ITEMS.length - 1 ? prev + 1 : 0));
  }, [introPhase]);

  const handleSlidePrev = useCallback(() => {
    if (introPhase !== "docked") return;
    setSlideDir(-1);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : ORYZO_ITEMS.length - 1));
  }, [introPhase]);

  const handleNext = useCallback(() => {
    if (introPhase === "stabilizing") return;

    // Step 0 -> Step 1: Hero to Center Spotlight
    if (introPhase === "hero") {
      setIntroPhase("spotlight");
      isWheelDebounced.current = true;
      setTimeout(() => {
        isWheelDebounced.current = false;
      }, 550);
      return;
    }

    // Step 1 -> Step 2: Smoothly enter carousel banner (syncs bag and banner simultaneously)
    if (introPhase === "spotlight" || (!isDocked && introPhase !== "docked")) {
      setIntroPhase("docked");
      setIsDocked(true);
      setStage("carousel");
      isWheelDebounced.current = true;
      setTimeout(() => {
        isWheelDebounced.current = false;
      }, 550);
      return;
    }

    if (stage === "carousel") {
      // ON SCROLL DOWN: The current active slide box expands to become its full-screen product details!
      setStage("details");
    }
  }, [introPhase, isDocked, stage]);

  const handlePrev = useCallback(() => {
    if (introPhase === "stabilizing") return;

    if (stage === "details" || stage === "focus") {
      // Return from Full Screen Details back to Carousel at CURRENT active slide
      setStage("carousel");
      return;
    }

    if (isDocked && stage === "carousel") {
      if (activeIndex > 0) {
        handleSlidePrev();
        return;
      }
      // Return from Carousel to Center Spotlight
      setIsDocked(false);
      setIntroPhase("spotlight");
      isWheelDebounced.current = true;
      setTimeout(() => {
        isWheelDebounced.current = false;
      }, 550);
    } else if (introPhase === "spotlight") {
      // Return from Center Spotlight to Hero Hill
      setIntroPhase("hero");
      isWheelDebounced.current = true;
      setTimeout(() => {
        isWheelDebounced.current = false;
      }, 550);
    }
  }, [introPhase, stage, isDocked, activeIndex, handleSlidePrev]);

  const handleSelectIndex = useCallback((newIndex: number) => {
    if (introPhase !== "docked") return;
    setStage("carousel");
    setActiveIndex((prev) => {
      if (newIndex === prev) return prev;
      setSlideDir(newIndex > prev ? 1 : -1);
      return newIndex;
    });
  }, [introPhase]);

  useEffect(() => {
    if (slideDir !== 0) {
      const t = setTimeout(() => setSlideDir(0), 550);
      return () => clearTimeout(t);
    }
  }, [slideDir, activeIndex]);

  // Continuous Wheel listener
  const handleWheel = (e: React.WheelEvent) => {
    if (isWheelDebounced.current) return;
    if (introPhase === "stabilizing") return;

    // In spotlight, smoothly enter carousel frame on scroll down, or return to hero on scroll up
    if (introPhase === "spotlight") {
      if (e.deltaY > 8) {
        setIntroPhase("docked");
        setIsDocked(true);
        setStage("carousel");
        isWheelDebounced.current = true;
        setTimeout(() => {
          isWheelDebounced.current = false;
        }, 550);
      } else if (e.deltaY < -8) {
        setIntroPhase("hero");
        isWheelDebounced.current = true;
        setTimeout(() => {
          isWheelDebounced.current = false;
        }, 550);
      }
      return;
    }

    // Trackpad Horizontal Swipe (e.g. 2-finger swipe left/right on laptop trackpad) - only in docked carousel
    if (introPhase === "docked" && stage === "carousel" && Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 16) {
      isWheelDebounced.current = true;

      if (e.deltaX > 0) {
        handleSlideNext();
      } else {
        handleSlidePrev();
      }

      setTimeout(() => {
        isWheelDebounced.current = false;
      }, 350);
      return;
    }

    if (Math.abs(e.deltaY) > 18) {
      isWheelDebounced.current = true;

      if (e.deltaY > 18) {
        handleNext();
      } else {
        handlePrev();
      }

      const cooldown =
        introPhase !== "docked"
          ? 650
          : stage !== "carousel"
          ? 450
          : 380;
      setTimeout(() => {
        isWheelDebounced.current = false;
      }, cooldown);
    }
  };

  // Touch handlers with real-time drag tracking & pull-to-refresh
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
      setDragOffset(0);
      if (!isRefreshing) setPullProgress(0);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isRefreshing || touchCooldownRef.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartRef.current.x;
    const diffY = currentY - touchStartRef.current.y;

    // 1. Pull down to refresh gesture in Hero phase (drag down from top)
    if (introPhase === "hero" && diffY > 0 && Math.abs(diffY) > Math.abs(diffX)) {
      const pull = Math.min(Math.pow(diffY, 0.82) * 1.4, 90);
      setPullProgress(pull);
      return;
    }

    // 2. Interactive horizontal drag in Carousel phase
    if (introPhase === "docked" && stage === "carousel" && Math.abs(diffX) > Math.abs(diffY)) {
      setDragOffset(diffX * 0.75);
      return;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    // 1. Handle Pull-To-Refresh completion in Hero phase
    if (introPhase === "hero" && pullProgress > 0) {
      if (pullProgress >= 50) {
        setIsRefreshing(true);
        setPullProgress(65);
        touchStartRef.current = null;
        setTimeout(() => {
          window.location.reload();
        }, 500);
        return;
      } else {
        setPullProgress(0);
      }
    }

    // 2. Handle interactive horizontal drag in Carousel phase
    if (introPhase === "docked" && stage === "carousel" && dragOffset !== 0) {
      const currentDrag = dragOffset;
      setDragOffset(0);
      if (Math.abs(currentDrag) > 30) {
        touchCooldownRef.current = true;
        setTimeout(() => {
          touchCooldownRef.current = false;
        }, 360);

        if (currentDrag < 0) {
          handleSlideNext();
        } else {
          handleSlidePrev();
        }
        touchStartRef.current = null;
        return;
      }
    }

    if (!touchStartRef.current || touchCooldownRef.current || isWheelDebounced.current) {
      touchStartRef.current = null;
      setDragOffset(0);
      return;
    }
    if (introPhase === "stabilizing") {
      touchStartRef.current = null;
      setDragOffset(0);
      return;
    }

    const touchEnd = e.changedTouches?.[0];
    if (!touchEnd) {
      touchStartRef.current = null;
      setDragOffset(0);
      return;
    }

    const diffX = touchStartRef.current.x - touchEnd.clientX;
    const diffY = touchStartRef.current.y - touchEnd.clientY;
    touchStartRef.current = null;
    setDragOffset(0);

    // Fast-swipe handling with responsive thresholds
    const minSwipeDist = 24;

    if (introPhase === "spotlight") {
      if (diffY > 10) {
        setIntroPhase("docked");
        setIsDocked(true);
        setStage("carousel");
        touchCooldownRef.current = true;
        setTimeout(() => {
          touchCooldownRef.current = false;
        }, 600);
      } else if (diffY < -10) {
        setIntroPhase("hero");
        touchCooldownRef.current = true;
        setTimeout(() => {
          touchCooldownRef.current = false;
        }, 600);
      }
      return;
    }

    if (Math.abs(diffX) >= Math.abs(diffY)) {
      // Horizontal swipe fallback
      if (introPhase === "docked" && stage === "carousel" && Math.abs(diffX) > minSwipeDist) {
        touchCooldownRef.current = true;
        setTimeout(() => {
          touchCooldownRef.current = false;
        }, 360);

        if (diffX > 0) handleSlideNext();
        else handleSlidePrev();
      }
    } else {
      // Vertical swipe: stage transitions
      if (Math.abs(diffY) > minSwipeDist) {
        const cooldownTime = introPhase !== "docked" ? 600 : stage !== "carousel" ? 380 : 420;
        touchCooldownRef.current = true;
        setTimeout(() => {
          touchCooldownRef.current = false;
        }, cooldownTime);

        if (diffY > 0) handleNext();
        else handlePrev();
      }
    }
  };

  // Keep latest action handlers in ref for keyboard navigation
  const actionsRef = useRef({ handleNext, handlePrev, handleSlideNext, handleSlidePrev });
  actionsRef.current = { handleNext, handlePrev, handleSlideNext, handleSlidePrev };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        if (introPhase === "docked") actionsRef.current.handleSlideNext();
      } else if (e.key === "ArrowLeft") {
        if (introPhase === "docked") actionsRef.current.handleSlidePrev();
      } else if (e.key === "ArrowDown") {
        actionsRef.current.handleNext();
      } else if (e.key === "ArrowUp") {
        actionsRef.current.handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [introPhase]);

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

  // Mouse / Pointer drag support for laptop/desktop
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return; // Touch events handle mobile
    if (e.button !== 0) return;
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (!touchStartRef.current || touchCooldownRef.current || isWheelDebounced.current) {
      touchStartRef.current = null;
      return;
    }
    if (introPhase === "stabilizing") {
      touchStartRef.current = null;
      return;
    }

    const diffX = touchStartRef.current.x - e.clientX;
    const diffY = touchStartRef.current.y - e.clientY;
    touchStartRef.current = null;

    const minSwipeDist = 28;
    const touchCooldownTime =
      introPhase !== "docked" ? 650 : stage !== "carousel" ? 400 : 360;

    if (Math.abs(diffX) >= Math.abs(diffY)) {
      if (introPhase === "docked" && Math.abs(diffX) > minSwipeDist) {
        touchCooldownRef.current = true;
        setTimeout(() => {
          touchCooldownRef.current = false;
        }, touchCooldownTime);

        if (diffX > 0) actionsRef.current.handleSlideNext();
        else actionsRef.current.handleSlidePrev();
      }
    } else {
      if (Math.abs(diffY) > minSwipeDist) {
        touchCooldownRef.current = true;
        setTimeout(() => {
          touchCooldownRef.current = false;
        }, touchCooldownTime);

        if (diffY > 0) actionsRef.current.handleNext();
        else actionsRef.current.handlePrev();
      }
    }
  };

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className={`fixed inset-0 w-full h-[100dvh] max-h-[100dvh] overflow-hidden select-none flex flex-col justify-between transition-colors duration-700 ${
        introPhase === "hero" ? "bg-[#FEF8EA]" : "bg-[#111317]"
      }`}
    >
      {/* ── Native-Feel Pull-To-Refresh Indicator (Mobile Hero Mode) ── */}
      {(pullProgress > 0 || isRefreshing) && introPhase === "hero" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: pullProgress,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed top-2 inset-x-0 mx-auto w-fit z-[100] pointer-events-none flex items-center justify-center"
        >
          <div className="flex items-center gap-2.5 bg-white/95 text-brand-black backdrop-blur-xl px-4 py-2 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.18)] border border-brand-black/15 text-xs font-heading font-bold">
            <div
              className={`w-4 h-4 flex items-center justify-center transition-transform duration-150 ${
                isRefreshing ? "animate-spin" : ""
              }`}
              style={{
                transform: !isRefreshing ? `rotate(${Math.min(pullProgress * 3.5, 180)}deg)` : undefined,
              }}
            >
              {isRefreshing ? (
                <svg className="w-3.5 h-3.5 text-brand-black" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
            </div>
            <span>
              {isRefreshing
                ? "Refreshing..."
                : pullProgress >= 50
                ? "Release to refresh"
                : "Pull down to refresh"}
            </span>
          </div>
        </motion.div>
      )}
      {/* Layer 0: Cream Hero Background with Brick Accents & Litter Pile */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: introPhase === "hero" ? 1 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute inset-0 overflow-hidden z-0 ${
          introPhase === "hero" ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0 invisible"
        }`}
      >
        <HeroBackground />
      </motion.div>

      {/* Layer 0.5: Clean Studio Solid Dark Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: introPhase === "hero" ? 0 : 1,
        }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute inset-0 bg-[#111317] pointer-events-none z-0 ${
          introPhase === "hero" ? "opacity-0 invisible pointer-events-none" : ""
        }`}
      />



      {/* Layer 1: Ambient Background Color Glow (Left Warm Espresso Bloom, disabled in spotlight to preserve dark studio) */}
      <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${introPhase === "hero" ? "hidden" : ""}`}>
        <motion.div
          animate={{
            backgroundColor: stage !== "carousel" ? "#4a2a19" : currentItem.accentColor,
            opacity:
              introPhase === "hero"
                ? 0.05
                : introPhase === "spotlight" || introPhase === "stabilizing"
                ? 0.12
                : stage === "details"
                ? 0.35
                : 0.25,
            x: stage !== "carousel" ? "-20vw" : "0vw",
            scale: stage === "details" ? 1.4 : 1.0,
          }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[80vh] rounded-full blur-[180px]"
        />
      </div>



      {/* Layer 4: Global Header / Navbar */}
      <nav className="relative z-50 px-4 sm:px-8 md:px-12 flex items-center justify-between min-h-[108px] xs:min-h-[118px] sm:min-h-[88px] md:min-h-[96px] pointer-events-auto shrink-0 pt-2.5 sm:pt-3">
        {/* Left Aligned Clean Logo */}
        <Link href="/" className="flex items-center cursor-pointer group shrink-0">
          <Image
            src="/meowganics_logo_transparent.png"
            alt="Meow Ganics Logo"
            width={1776}
            height={725}
            className="w-[72vw] xs:w-[74vw] max-w-[315px] sm:max-w-none sm:w-[260px] md:w-[285px] lg:w-[340px] h-auto max-h-[114px] xs:max-h-[126px] sm:max-h-[84px] md:max-h-[92px] lg:max-h-[139px] object-contain object-left transition-transform duration-300 group-hover:scale-105 origin-left drop-shadow-[0_2px_6px_rgba(0,0,0,0.10)]"
            priority
          />
        </Link>

        {/* Right Actions: Laptop Header (Desktop/Tablet) or Scrolled Mobile Header */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Profile Menu with Cat Symbol (Hidden on mobile during hero phase, visible on laptop or when scrolled) */}
          <div className="hidden md:flex">
            <ProfileMenu
              theme="frameless"
              dropdownAlign="right"
              iconClassName={`w-6.5 h-6.5 sm:w-7 sm:h-7 ${
                introPhase === "hero" ? "text-brand-black" : "text-white"
              }`}
            />
          </div>

          {/* Shopping Cart Button (Hidden on mobile during hero phase, visible on laptop or when scrolled) */}
          <div className="hidden md:flex">
            <button
              onClick={openCart}
              className={`relative p-1 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer ${
                introPhase === "hero" ? "text-brand-black" : "text-white"
              }`}
              aria-label="Open Cart"
            >
              <CartIcon className="w-6.5 h-6.5 sm:w-7 sm:h-7" />
              <span
                className={`absolute -top-1.5 -right-2 text-[10px] font-heading font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-xs ${
                  introPhase === "hero"
                    ? "bg-brand-black text-brand-white"
                    : "bg-brand-white text-brand-black"
                }`}
              >
                {totalItems}
              </span>
            </button>
          </div>

          {/* Shop Litter Button */}
          <button
            onClick={() => {
              setIntroPhase("docked");
              setIsDocked(true);
              setStage("details");
            }}
            className={`hidden xs:flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full font-heading font-bold text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer ${
              introPhase === "hero"
                ? "bg-black text-white hover:bg-black/85"
                : stage === "details" && isDocked
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

      {/* ── Mobile Action Icons in Right Corner (Hero View: md:hidden) ── */}
      {true && (
        <div className="md:hidden fixed top-[130px] xs:top-[136px] sm:top-[144px] right-4 xs:right-6 z-40 flex items-center gap-0 pointer-events-auto">
          {/* Left Red Circle: Cat Symbol Profile Menu (Frameless, No Circle Container) */}
          <ProfileMenu
            theme="frameless"
            dropdownAlign="right"
            iconClassName={`w-8 h-8 xs:w-8.5 xs:h-8.5 ${
              introPhase === "hero" ? "text-brand-black" : "text-white"
            }`}
          />

          {/* Right Red Circle: Cart Icon with Badge (Frameless, No Circle Container) */}
          <button
            onClick={openCart}
            className={`relative p-0 ml-1 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer ${
              introPhase === "hero" ? "text-brand-black" : "text-white"
            }`}
            aria-label="Open Cart"
          >
            <CartIcon className="w-8 h-8 xs:w-8.5 xs:h-8.5" />
            <span
              className={`absolute -top-1.5 -right-2 text-[10px] font-heading font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-xs ${
                introPhase === "hero"
                  ? "bg-brand-black text-brand-white"
                  : "bg-brand-white text-brand-black"
              }`}
            >
              {totalItems}
            </span>
          </button>
        </div>
      )}

      {/* Layer 5: Hero Product Bag Synchronized into Banner Card (Oryzo.ai Reference Flow) */}
      <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{
            x:
              introPhase === "hero"
                ? isMobileView
                  ? mobileHeroX
                  : isLaptopView
                  ? laptopHeroX
                  : "-26vw"
                : "0vw",
            y:
              introPhase === "hero"
                ? isMobileView
                  ? mobileHeroY
                  : isLaptopView
                  ? laptopHeroY
                  : "16vh"
                : isMobile
                ? "-20px"
                : "0px",
            rotate:
              introPhase === "hero"
                ? 0
                : introPhase === "spotlight" || introPhase === "stabilizing"
                ? 0
                : 8.0,
            rotateX: 0,
            rotateY: 0,
            scale:
              introPhase === "hero"
                ? isMobileView
                  ? mobileHeroScale
                  : isLaptopView
                  ? laptopHeroScale
                  : 0.92
                : introPhase === "spotlight" || introPhase === "stabilizing"
                ? isMobileView
                  ? 1.05
                  : 1.18
                : inBoxBagScale,
            opacity:
              introPhase === "hero" || introPhase === "spotlight" || introPhase === "stabilizing"
                ? 1
                : 0,
            pointerEvents: introPhase === "hero" || introPhase === "spotlight" ? "auto" : "none",
          }}
          transition={{
            x: {
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            },
            y: {
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            },
            rotate: {
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            },
            scale: {
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            },
            opacity: {
              duration: introPhase === "docked" ? 0.35 : 0.65,
              delay: introPhase === "docked" ? 0.40 : 0,
              ease: "easeInOut",
            },
          }}
          className="relative w-[42vw] xs:w-[43vw] sm:w-[30vw] md:w-[22vw] lg:w-[19vw] max-w-[205px] sm:max-w-[220px] md:max-w-[250px] lg:max-w-[280px] aspect-[1086/1448] origin-center flex items-center justify-center pointer-events-auto"
        >
          <motion.div
            onClick={() => {
              if (introPhase === "hero" || introPhase === "spotlight") handleNext();
            }}
            animate={
              introPhase === "spotlight"
                ? {
                    y: [-4, 4, -4],
                    rotate: [-0.4, 0.4, -0.4],
                  }
                : {}
            }
            transition={
              introPhase === "spotlight"
                ? {
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }
                : undefined
            }
            className={`${
              introPhase === "hero"
                ? "md:animate-float cursor-pointer hover:scale-105"
                : introPhase === "spotlight"
                ? "cursor-pointer hover:scale-105 transition-transform"
                : ""
            } drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] w-full h-full block relative z-10 transition-transform`}
          >
            <Image
              src="/product-bag.png"
              alt="Clean Bean Product Bag"
              fill
              sizes="(max-width: 768px) 380px, 440px"
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Floor contact shadow for bag in hero mode */}
          {introPhase === "hero" && (
            <div className="absolute -bottom-2.5 inset-x-3 h-3.5 bg-black/35 blur-sm rounded-full pointer-events-none z-0" />
          )}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════════════════
          LAYER 6: SEQUENTIAL 3-STEP SHOWCASE ARENA (Oryzo.ai Sequence)
          Step 1 (stage === 'carousel'): Dashed Box with Side Cards & Headline (Image 1)
          Step 2 (stage === 'focus'): Dashed border contracts, clean vertical focus slice (Image 2)
          Step 3 (stage === 'details'): Opens full screen, product moves right, left glass reveals (Image 3)
          ══════════════════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: introPhase === "hero" ? 0 : 1,
          scale: introPhase === "hero" ? 0.94 : 1,
          pointerEvents: introPhase === "hero" ? "none" : "auto",
        }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute inset-0 z-30 w-full h-full flex flex-col justify-center items-center overflow-visible ${
          introPhase === "hero" ? "opacity-0 pointer-events-none invisible" : ""
        }`}
      >
        <div className="relative w-full h-full flex items-center justify-center overflow-visible">

          {/* ── Side Thumbnail Previews (Visible in Stage 1: Carousel when slide is active) ── */}
          {ORYZO_ITEMS.map((prod, index) => {
            const offset = index - activeIndex;
            const abs = Math.abs(offset);
            const sign = Math.sign(offset);

            const baseDist = isMobile ? Math.round(cardWidth * 0.64) : 275;
            const stepDist = isMobile ? Math.round(cardWidth * 0.40) : 175;

            let xPos = 0;
            const thumbScale = isMobile ? 0.40 : 0.44;
            let thumbOpacity = 0;
            const isSlideVisible = introPhase === "docked";

            if (abs === 0) {
              xPos = 0;
              thumbOpacity = 0;
            } else if (abs === 1) {
              xPos = sign * baseDist;
              thumbOpacity = isSlideVisible && stage === "carousel" ? 0.6 : 0;
            } else if (abs === 2) {
              xPos = sign * (baseDist + stepDist);
              thumbOpacity = isSlideVisible && stage === "carousel" ? 0.28 : 0;
            } else {
              xPos = sign * (baseDist + stepDist * (abs - 1));
              thumbOpacity = 0;
            }

            const isInteractive = introPhase === "docked" && stage === "carousel" && (abs === 1 || abs === 2);

            return (
              <motion.div
                key={prod.id}
                onClick={() => {
                  if (isInteractive) handleSelectIndex(index);
                }}
                style={{
                  top: "50%",
                  width: cardWidth,
                  height: cardHeight,
                }}
                initial={{
                  x: sign * (baseDist + cardWidth),
                  y: isMobile ? "calc(-50% - 20px)" : "-50%",
                  scale: 0.25,
                  opacity: 0,
                }}
                animate={{
                  x: isSlideVisible ? xPos : sign * (baseDist + cardWidth + 120),
                  y: isMobile ? "calc(-50% - 20px)" : "-50%",
                  scale: isSlideVisible ? thumbScale : 0.25,
                  opacity: thumbOpacity,
                }}
                whileHover={isInteractive ? { scale: thumbScale * 1.05, opacity: 0.95 } : undefined}
                transition={{
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                  delay: isSlideVisible ? 0.42 : 0,
                }}
                className={`absolute rounded-none overflow-hidden z-10 select-none shadow-xl border border-white/10 ${
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

          {/* ── THE MORPHING BOX CONTAINER (Sequence: Carousel Box -> Full Screen Expansion -> Details) ──
              Step 1: 380px dashed box (Carousel)
              Step 2: Box EXPANDS OUTWARDS to Full Screen (100vw × 100vh) slowly and smoothly on scroll
              Step 3: Full background image captures the screen, transparent glass reveals on left, details stagger in ── */}
          <motion.div
            animate={{
              width: stage !== "carousel" ? "100vw" : cardWidth,
              height: stage !== "carousel" ? "100dvh" : cardHeight,
              y: stage !== "carousel" ? 0 : isMobile ? -20 : 0,
              borderRadius: 0,
            }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              overflow: "hidden",
            }}
            className="relative z-20 flex items-center justify-center origin-center shrink-0 pointer-events-auto"
          >
            {/* Dashed Border Box: Active on the Banner in Carousel mode, hidden during Spotlight */}
            <motion.div
              animate={{
                opacity:
                  introPhase === "docked" && stage === "carousel"
                    ? 1
                    : 0,
                scale: stage === "carousel" ? 1 : 0.92,
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0 border-[1.5px] border-dashed border-white/50 pointer-events-none z-30 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_25px_rgba(169,211,244,0.12)]"
            >
              {/* Corner Viewfinder L-Brackets (Oryzo aesthetic) */}
              <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-white/90" />
              <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-white/90" />
              <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-white/90" />
              <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-white/90" />
            </motion.div>

            {/* Step 1: Carousel Filmstrip (When in Carousel stage, crossfades smoothly from spotlight) */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                rotate: stage === "carousel" ? slideDir * 3 : 0,
                opacity: stage === "carousel" && introPhase === "docked" ? 1 : 0,
                scale: stage === "carousel" && introPhase === "docked" ? 1 : 1.04,
              }}
              transition={{
                opacity: {
                  duration: 0.6,
                  delay: introPhase === "docked" ? 0.32 : 0,
                  ease: [0.16, 1, 0.3, 1],
                },
                scale: {
                  duration: 0.75,
                  delay: introPhase === "docked" ? 0.32 : 0,
                  ease: [0.16, 1, 0.3, 1],
                },
                rotate: { type: "spring", stiffness: 200, damping: 20, mass: 0.5 },
              }}
            >
              <motion.div
                className="absolute inset-0 flex flex-row pointer-events-auto"
                animate={{
                  x: `calc(${-activeIndex * (100 / ORYZO_ITEMS.length)}% + ${dragOffset}px)`,
                }}
                transition={
                  dragOffset !== 0
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 260, damping: 28 }
                }
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
                      sizes="(max-width: 640px) 300px, 380px"
                      className="object-cover object-center"
                      priority={index === 0 || index === ORYZO_ITEMS.length - 1}
                      draggable={false}
                    />
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Step 2 & Step 3: THE IMAGE EXPANDS SLOWLY & SMOOTHLY TO CAPTURE THE FULL SCREEN */}
            <motion.div
              animate={{
                opacity: stage !== "carousel" ? 1 : 0,
              }}
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
            >
              <Image
                src={currentItem.image}
                alt={currentItem.flavor}
                fill
                sizes="100vw"
                className="object-cover object-center w-full h-full"
                priority
              />
              {/* Subtle cinematic left vignette for the glass card */}
              <motion.div
                animate={{ opacity: stage === "details" ? 1 : 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/10 pointer-events-none"
              />
            </motion.div>

            {/* Step 3: Left Side (Desktop) / Lower-Center (Mobile) Product Panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: stage === "details" ? 1 : 0,
                x: isMobile ? "-50%" : stage === "details" ? 0 : -40,
                y: isMobile ? (stage === "details" ? 0 : 20) : "-50%",
                pointerEvents: stage === "details" ? "auto" : "none",
              }}
              transition={{
                duration: stage === "details" ? 0.85 : 0.45,
                delay: stage === "details" ? 0.35 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                left: isMobile ? "50%" : "max(2.5rem, calc(50% - 580px))",
                bottom: isMobile ? "calc(4.5rem + env(safe-area-inset-bottom, 0px))" : "auto",
                top: isMobile ? "auto" : "calc(50% + 52px)",
                position: "absolute",
                zIndex: 45,
              }}
              className={`w-[calc(100vw-2.5rem)] max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] xl:max-w-[480px] p-4.5 sm:p-7 md:p-8 shrink-0 flex flex-col justify-between ${
                stage !== "details" ? "pointer-events-none" : ""
              }`}
            >
              {/* 1. Transparent Frosted Glass Background Layer (Appears First) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: stage === "details" ? 1 : 0,
                  scale: stage === "details" ? 1 : 0.95,
                }}
                transition={{
                  duration: stage === "details" ? 0.75 : 0.35,
                  delay: stage === "details" ? 0.35 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-white/10 hover:bg-white/[0.13] backdrop-blur-2xl border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.7)] pointer-events-none transition-colors duration-300"
              />

              {/* 2. Content Layer (Staggered Entry after the transparent glass appears) */}
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{
                    opacity: stage === "details" ? 1 : 0,
                    y: stage === "details" ? 0 : 12,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: stage === "details" ? 0.55 : 0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mb-0.5"
                >
                  <span className="text-[9px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#A9D3F4]">
                    {currentItem.title1}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{
                    opacity: stage === "details" ? 1 : 0,
                    y: stage === "details" ? 0 : 12,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: stage === "details" ? 0.68 : 0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-xl sm:text-3xl md:text-[42px] font-heading font-black tracking-tight text-white mb-1 sm:mb-3 leading-tight drop-shadow-md"
                >
                  {currentItem.id === "clean-bean-original" ? "CLEAN BEAN" : currentItem.flavor.toUpperCase()}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{
                    opacity: stage === "details" ? 1 : 0,
                    y: stage === "details" ? 0 : 12,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: stage === "details" ? 0.78 : 0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-[10.5px] sm:text-xs md:text-base text-white/80 font-sans font-normal leading-snug mb-1.5 sm:mb-5 line-clamp-2 sm:line-clamp-none"
                >
                  {currentItem.id === "clean-bean-original"
                    ? "100% natural tofu cat litter made from food-grade soybean fiber. Fast clumping, 99.9% dust-free, and flushable."
                    : "Official Meow Ganics vintage art poster. High quality archival print on heavy matte paper."}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: stage === "details" ? 1 : 0 }}
                transition={{ duration: 0.5, delay: stage === "details" ? 0.88 : 0 }}
                className="relative z-10 border-t border-dashed border-white/20 w-full my-1 sm:my-3"
              />

              {/* Price & Add to Cart (Staggers in at the end) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: stage === "details" ? 1 : 0,
                  y: stage === "details" ? 0 : 12,
                }}
                transition={{
                  duration: 0.65,
                  delay: stage === "details" ? 0.95 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative z-10 flex items-center justify-between gap-3 sm:gap-4 pt-0.5"
              >
                <div className="flex flex-col shrink-0">
                  <span className="text-[8.5px] sm:text-[10px] font-mono uppercase tracking-widest text-white/50">
                    Price
                  </span>
                  <span className="text-lg sm:text-3xl md:text-4xl font-heading font-black text-white tracking-tight">
                    {currentItem.price}
                  </span>
                </div>

                <button
                  onClick={() => handleQuickAdd(currentItem)}
                  className={`flex-1 py-2 sm:py-3.5 px-3.5 sm:px-6 rounded-full font-heading font-black text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_8px_25px_rgba(255,255,255,0.22)] cursor-pointer ${
                    addedAnimation
                      ? "bg-[#2B7A5D] text-white"
                      : "bg-white text-brand-black hover:bg-white/95"
                  }`}
                >
                  <CartIcon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 shrink-0" />
                  <span className="truncate">
                    {addedAnimation ? "Added! 🐾" : "Add to Cart"}
                  </span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── Carousel Mini-Headline on Left Center (Visible only in stage === 'carousel') ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{
              opacity: introPhase === "docked" && stage === "carousel" ? 1 : 0,
              x: introPhase === "docked" && stage === "carousel" ? 0 : -30,
              pointerEvents: introPhase === "docked" && stage === "carousel" ? "auto" : "none",
            }}
            transition={{
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
              delay: introPhase === "docked" && stage === "carousel" ? 0.45 : 0,
            }}
            className="hidden md:block absolute z-40 shrink-0 max-w-[360px] -translate-y-1/2"
            style={{
              left: "max(2.5rem, calc(50% - 540px))",
              top: "50%",
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
                        if (!currentItem.isComingSoon) {
                          setStage("details");
                        }
                      }}
                      className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-heading font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_4px_18px_rgba(255,255,255,0.18)] cursor-pointer ${
                        currentItem.isComingSoon
                          ? "bg-white/20 text-white border border-white/30 cursor-default"
                          : "bg-white text-brand-black"
                      }`}
                    >
                      {currentItem.isComingSoon
                        ? `${currentItem.comingSoonDrop || "Next Drop"} • Coming Soon`
                        : `Buy Now • ${currentItem.price}`}
                    </button>

                    {!currentItem.isComingSoon && (
                      <button
                        onClick={() => handleQuickAdd(currentItem)}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/25 hover:border-white text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-md"
                        aria-label={`Quick add ${currentItem.flavor}`}
                      >
                        <CartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>

                  {/* Subtle Swipe & Scroll Gesture Hint */}
                  <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/10 text-white/60 text-[11px] font-mono select-none">
                    <span className="flex items-center gap-1 text-white/80 font-semibold">
                      <svg className="w-3.5 h-3.5 text-[#A9D3F4]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Swipe ⇄
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="flex items-center gap-1 text-white/80 font-semibold">
                      <svg className="w-3.5 h-3.5 text-[#A9D3F4]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      Scroll ↕
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Navigation arrows flanking the box in Carousel mode ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: introPhase === "docked" && stage === "carousel" ? 1 : 0,
              pointerEvents: isDocked && stage === "carousel" ? "auto" : "none",
            }}
            transition={{ duration: 0.5, delay: introPhase === "docked" && stage === "carousel" ? 0.50 : 0 }}
            style={{
              top: isMobile ? "calc(50% - 20px)" : "50%",
              transform: "translateY(-50%)",
              width: cardWidth,
            }}
            className={`absolute z-40 flex items-center justify-between pointer-events-none ${
              introPhase !== "docked" ? "opacity-0 invisible pointer-events-none" : ""
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSlidePrev();
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
                handleSlideNext();
              }}
              aria-label="Next product"
              className="translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-black/80 hover:bg-white hover:text-brand-black text-white backdrop-blur-md border border-white/25 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-[0_8px_25px_rgba(0,0,0,0.6)] pointer-events-auto"
            >
              <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>

          {/* ── Mobile Carousel Headline & CTA: Positioned cleanly below the centered card ── */}
          {stage === "carousel" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: introPhase === "docked" ? 1 : 0,
                y: introPhase === "docked" ? 0 : 20,
                pointerEvents: introPhase === "docked" ? "auto" : "none",
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
                delay: introPhase === "docked" ? 0.45 : 0,
              }}
              style={{
                top: `calc(50% - 20px + ${Math.round(cardHeight / 2 + 14)}px)`,
              }}
              className="md:hidden absolute z-40 w-full max-w-[340px] px-4 flex flex-col items-center text-center"
            >
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
                    <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-white/60 mb-0.5 sm:mb-1">
                      {currentItem.title1}
                    </span>
                    <span className="text-2xl sm:text-3xl font-heading font-black tracking-tight leading-tight text-white drop-shadow-md">
                      {currentItem.title2}
                    </span>
                  </h1>

                  <div className="flex items-center justify-center gap-3 mt-2.5 sm:mt-3">
                    <button
                      onClick={() => {
                        if (!currentItem.isComingSoon) {
                          setStage("details");
                        }
                      }}
                      className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-full font-heading font-black text-sm sm:text-base hover:scale-105 active:scale-95 transition-all shadow-[0_4px_18px_rgba(255,255,255,0.18)] cursor-pointer ${
                        currentItem.isComingSoon
                          ? "bg-white/20 text-white border border-white/30 cursor-default"
                          : "bg-white text-brand-black"
                      }`}
                    >
                      {currentItem.isComingSoon
                        ? `${currentItem.comingSoonDrop || "Next Drop"} • Coming Soon`
                        : `Buy Now • ${currentItem.price}`}
                    </button>

                    {!currentItem.isComingSoon && (
                      <button
                        onClick={() => handleQuickAdd(currentItem)}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/25 hover:border-white text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-md"
                        aria-label={`Quick add ${currentItem.flavor}`}
                      >
                        <CartIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════════════════════
          LAYER 7: BOTTOM CONTROLS & CONTINUOUS SCROLL STATUS BAR
          ══════════════════════════════════════════════════════════════════════════════════════ */}
      {/* ── Fixed Center-Bottom Explore Button (Hero Mode) ── */}
      {introPhase === "hero" && (
        <div className="absolute bottom-[max(0.4rem,env(safe-area-inset-bottom,0px))] sm:bottom-6 md:bottom-8 lg:bottom-3 inset-x-0 mx-auto w-fit z-50 flex items-center justify-center pointer-events-auto">
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 sm:gap-2 text-brand-black font-heading font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all bg-brand-white/90 hover:bg-brand-white backdrop-blur-md px-3 sm:px-5 lg:px-3.5 py-1 sm:py-2 lg:py-1 rounded-full border border-brand-black/20 shadow-md text-[10.5px] sm:text-sm lg:text-xs"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-black animate-pulse" />
            <span className="sm:hidden">Scroll to explore</span>
            <span className="hidden sm:inline">Scroll down to explore collection</span>
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════════════════
          LAYER 7: BOTTOM CONTROLS & CONTINUOUS SCROLL STATUS BAR (Spotlight / Carousel Modes)
          ══════════════════════════════════════════════════════════════════════════════════════ */}
      <div className={`relative z-40 max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 flex items-center justify-between text-xs text-white/50 pointer-events-auto shrink-0 pb-[max(0.75rem,calc(env(safe-area-inset-bottom,0px)+0.25rem))] sm:pb-4 transition-all duration-300 ${
        introPhase === "hero" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}>
        {/* Left Action / Stage indicator */}
        <div className="flex items-center">
          {introPhase === "spotlight" ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 text-white font-heading font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all bg-white/15 hover:bg-white/20 backdrop-blur-md px-4 sm:px-5 py-2 rounded-full border border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.4)] text-xs group"
            >
              <span className="w-2 h-2 rounded-full bg-[#A9D3F4] animate-ping" />
              <span className="tracking-wide">Scroll down to continue</span>
              <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none group-hover:translate-y-0.5 transition-transform" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          ) : stage === "details" ? (
            <div className="flex items-center gap-2 text-white/80 font-heading text-xs truncate max-w-[180px] sm:max-w-none">
              <span className="w-2 h-2 rounded-full bg-[#A9D3F4] animate-pulse shrink-0" />
              <span className="truncate">{currentItem.flavor}</span>
            </div>
          ) : stage === "focus" ? (
            <div className="flex items-center gap-2 text-white/80 font-heading text-xs">
              <span className="w-2 h-2 rounded-full bg-[#A9D3F4] animate-pulse" />
              <span>Focus • Scroll for Details</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md text-white/90 text-[11px] sm:text-xs font-heading font-medium tracking-wide shadow-sm transition-all select-none">
              <span className="w-2 h-2 rounded-full bg-[#A9D3F4] animate-pulse shrink-0 shadow-[0_0_8px_#A9D3F4]" />
              <span className="flex items-center gap-1.5">
                <span>Swipe</span>
                <span className="text-white/60 font-mono text-[10px]">⇄</span>
                <span className="text-white/40">•</span>
                <span>Scroll</span>
                <span className="text-white/60 font-mono text-[10px]">↕</span>
              </span>
            </div>
          )}
        </div>

        {/* Center/Right Navigation Dots & Step Counter */}
        <motion.div
          animate={{
            opacity: introPhase === "docked" || isDocked ? 1 : 0,
            pointerEvents: introPhase === "docked" || isDocked ? "auto" : "none",
          }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 sm:gap-4"
        >
          {/* Scroll & Swipe cue matching Oryzo - shown only when not in final details mode */}
          {stage !== "details" && (
            <div
              onClick={handleNext}
              className="hidden md:flex items-center gap-2 text-white/75 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase select-none cursor-pointer hover:text-white transition-colors bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm"
            >
              <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-white/80">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <span>Scroll ↕ or Swipe ⇄</span>
            </div>
          )}

          {/* Dots for the carousel slides */}
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
            opacity: introPhase === "docked" ? 1 : 0,
            pointerEvents: introPhase === "docked" ? "auto" : "none",
          }}
          transition={{ duration: 0.5 }}
          style={{
            visibility: introPhase === "docked" ? "visible" : "hidden",
          }}
          onClick={() => {
            setStage("carousel");
            setActiveIndex(0);
            setIsDocked(false);
            setIntroPhase("spotlight");
            if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
            introTimeoutRef.current = setTimeout(() => {
              setIntroPhase("hero");
            }, 500);
          }}
          className={`hover:text-white text-white/60 transition-colors cursor-pointer text-[10px] sm:text-[11px] flex items-center gap-1 font-heading font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-white/10 ${
            introPhase !== "docked" ? "opacity-0 pointer-events-none invisible" : ""
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
