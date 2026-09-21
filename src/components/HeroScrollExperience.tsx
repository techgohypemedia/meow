"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import InteractiveCat from "./InteractiveCat";
import HeroBackground from "./HeroBackground";
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
];

export type ShowcaseStage = "carousel" | "focus" | "details";
export type IntroPhase = "hero" | "spotlight" | "stabilizing" | "minimizing" | "docked";

export default function HeroScrollExperience() {
  const [isMobile, setIsMobile] = useState(false);
  const [introPhase, setIntroPhase] = useState<IntroPhase>("hero");
  const [rotationDeg, setRotationDeg] = useState(0);
  const [isDocked, setIsDocked] = useState(false);
  const [stage, setStage] = useState<ShowcaseStage>("carousel");
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(0); // -1 = prev, 0 = idle, 1 = next
  const [addedAnimation, setAddedAnimation] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchCooldownRef = useRef(false);
  const isWheelDebounced = useRef(false);
  const introTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const introSubTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Dedicated reliable state-machine for intro progression
  // stabilizing (500ms upright rest) -> minimizing (1350ms smooth shrink) -> docked (slide arrives)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (introPhase === "stabilizing") {
      timer = setTimeout(() => {
        setIntroPhase("minimizing");
      }, 500);
    } else if (introPhase === "minimizing") {
      timer = setTimeout(() => {
        setIntroPhase("docked");
        setIsDocked(true);
        setStage("carousel");
      }, 1350);
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
    if (introPhase === "stabilizing" || introPhase === "minimizing") return;

    // Step 0 -> Step 1: Hero to Center Spotlight
    if (introPhase === "hero") {
      setIntroPhase("spotlight");
      setRotationDeg(0);
      isWheelDebounced.current = true;
      setTimeout(() => {
        isWheelDebounced.current = false;
      }, 1050);
      return;
    }

    // Direct trigger: Complete rotation, trigger stabilizing -> minimizing -> docked
    if (introPhase === "spotlight" || (!isDocked && introPhase !== "docked")) {
      setRotationDeg(360);
      setIntroPhase("stabilizing");
      isWheelDebounced.current = true;
      setTimeout(() => {
        isWheelDebounced.current = false;
      }, 2200);
      return;
    }

    if (stage === "carousel") {
      // ON SCROLL DOWN: The current active slide box expands to become its full-screen product details!
      setStage("details");
    }
  }, [introPhase, isDocked, stage]);

  const handlePrev = useCallback(() => {
    if (introPhase === "stabilizing" || introPhase === "minimizing") return;

    if (stage === "details" || stage === "focus") {
      // Return from Full Screen Details back to Carousel at CURRENT active slide
      setStage("carousel");
      return;
    }

    if (isDocked && stage === "carousel") {
      // Return from Carousel to Center Spotlight
      setIsDocked(false);
      setIntroPhase("spotlight");
      setRotationDeg(360);
      isWheelDebounced.current = true;
      setTimeout(() => {
        isWheelDebounced.current = false;
      }, 1050);
    } else if (introPhase === "spotlight") {
      // Return from Center Spotlight to Hero Hill
      setRotationDeg(0);
      setIntroPhase("hero");
      isWheelDebounced.current = true;
      setTimeout(() => {
        isWheelDebounced.current = false;
      }, 1050);
    }
  }, [introPhase, stage, isDocked]);

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

  // Continuous Wheel listener: rot scroll -> stable pause -> smooth slow minimization -> slide arrives
  const handleWheel = (e: React.WheelEvent) => {
    if (isWheelDebounced.current) return;
    if (introPhase === "stabilizing" || introPhase === "minimizing") return;

    // In spotlight, smoothly complete 360 rotation on scroll down without getting stuck
    if (introPhase === "spotlight") {
      if (e.deltaY > 8) {
        setRotationDeg(360);
        setIntroPhase("stabilizing");
        isWheelDebounced.current = true;
        setTimeout(() => {
          isWheelDebounced.current = false;
        }, 2200);
      } else if (e.deltaY < -8) {
        setRotationDeg(0);
        setIntroPhase("hero");
        isWheelDebounced.current = true;
        setTimeout(() => {
          isWheelDebounced.current = false;
        }, 1050);
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
      }, 450);
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
          ? 1800
          : stage !== "carousel"
          ? 900
          : 600;
      setTimeout(() => {
        isWheelDebounced.current = false;
      }, cooldown);
    }
  };

  // Touch handlers with matching scroll rotation scrubbing
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || touchCooldownRef.current || isWheelDebounced.current) {
      touchStartRef.current = null;
      return;
    }
    if (introPhase === "stabilizing" || introPhase === "minimizing") {
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

    if (introPhase === "spotlight") {
      if (diffY > 10) {
        setRotationDeg((prev) => {
          const next = Math.min(360, prev + diffY * 0.9);
          if (next >= 360) {
            setIntroPhase("stabilizing");
            isWheelDebounced.current = true;
            setTimeout(() => {
              isWheelDebounced.current = false;
            }, 2200);
            return 360;
          }
          return next;
        });
      } else if (diffY < -10) {
        setRotationDeg((prev) => {
          if (prev > 20) return Math.max(0, prev + diffY * 0.9);
          setIntroPhase("hero");
          isWheelDebounced.current = true;
          setTimeout(() => {
            isWheelDebounced.current = false;
          }, 1050);
          return 0;
        });
      }
      return;
    }

    const minSwipeDist = 28;
    const touchCooldownTime =
      introPhase !== "docked" ? 1800 : stage !== "carousel" ? 800 : 480;

    if (Math.abs(diffX) >= Math.abs(diffY)) {
      // Horizontal swipe: change slides in carousel (only when docked)
      if (introPhase === "docked" && Math.abs(diffX) > minSwipeDist) {
        touchCooldownRef.current = true;
        setTimeout(() => {
          touchCooldownRef.current = false;
        }, touchCooldownTime);

        if (diffX > 0) handleSlideNext();
        else handleSlidePrev();
      }
    } else {
      // Vertical swipe: open/close full-screen product details
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
    if (e.button !== 0) return;
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!touchStartRef.current || touchCooldownRef.current || isWheelDebounced.current) {
      touchStartRef.current = null;
      return;
    }
    if (introPhase === "stabilizing" || introPhase === "minimizing") {
      touchStartRef.current = null;
      return;
    }

    const diffX = touchStartRef.current.x - e.clientX;
    const diffY = touchStartRef.current.y - e.clientY;
    touchStartRef.current = null;

    const minSwipeDist = 32;
    const touchCooldownTime =
      introPhase !== "docked" ? 1800 : stage !== "carousel" ? 800 : 480;

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
      onTouchEnd={onTouchEnd}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className={`fixed inset-0 w-screen h-screen overflow-hidden select-none flex flex-col justify-between transition-colors duration-700 ${
        introPhase === "hero" ? "bg-[#FEF8EA]" : "bg-[#111317]"
      }`}
    >
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

      {/* Layer 0.5: Rich Oryzo-Style Warm Dark Background Gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: introPhase === "hero" ? 0 : stage !== "carousel" ? 1 : 0.88,
        }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute inset-0 bg-gradient-to-r from-[#241711] via-[#161311] to-[#0c0d0f] pointer-events-none z-0 ${
          introPhase === "hero" ? "opacity-0 invisible pointer-events-none" : ""
        }`}
      />

      {/* ── Dynamic End-to-End Aurora Edge & Corner Aura (No border lines, full screen bleed) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: introPhase === "spotlight" || introPhase === "stabilizing" ? 1 : 0,
        }}
        transition={{ duration: 0.85, ease: "easeInOut" }}
        className={`fixed inset-0 pointer-events-none z-35 overflow-hidden ${
          introPhase === "hero" ? "opacity-0 invisible pointer-events-none" : ""
        }`}
      >
        <motion.div
          animate={{
            filter: [
              "hue-rotate(0deg) brightness(1.05)",
              "hue-rotate(180deg) brightness(1.25)",
              "hue-rotate(360deg) brightness(1.05)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative w-full h-full"
        >
          {/* Top-Left Ambient Aurora Corner */}
          <div className="absolute -top-24 -left-24 w-80 sm:w-96 md:w-[32rem] h-80 sm:h-96 md:h-[32rem] rounded-full bg-gradient-to-br from-[#f59e0b] via-[#ff5500] to-transparent blur-[70px] sm:blur-[95px] opacity-45" />

          {/* Top-Right Ambient Aurora Corner */}
          <div className="absolute -top-24 -right-24 w-80 sm:w-96 md:w-[32rem] h-80 sm:h-96 md:h-[32rem] rounded-full bg-gradient-to-bl from-[#00f2fe] via-[#4facfe] to-transparent blur-[70px] sm:blur-[95px] opacity-40" />

          {/* Bottom-Right Ambient Aurora Corner */}
          <div className="absolute -bottom-24 -right-24 w-80 sm:w-96 md:w-[32rem] h-80 sm:h-96 md:h-[32rem] rounded-full bg-gradient-to-tl from-[#a855f7] via-[#ec4899] to-transparent blur-[70px] sm:blur-[95px] opacity-45" />

          {/* Bottom-Left Ambient Aurora Corner */}
          <div className="absolute -bottom-24 -left-24 w-80 sm:w-96 md:w-[32rem] h-80 sm:h-96 md:h-[32rem] rounded-full bg-gradient-to-tr from-[#f43f5e] via-[#fb923c] to-transparent blur-[70px] sm:blur-[95px] opacity-45" />

          {/* End-to-End Top Edge Aurora Halo */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#f59e0b]/20 via-[#00f2fe]/15 to-transparent blur-xl opacity-60" />

          {/* End-to-End Bottom Edge Aurora Halo */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#f43f5e]/25 via-[#a855f7]/20 to-transparent blur-xl opacity-65" />

          {/* End-to-End Left Edge Aurora Halo */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#ff5500]/20 to-transparent blur-xl opacity-50" />

          {/* End-to-End Right Edge Aurora Halo */}
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#a855f7]/20 to-transparent blur-xl opacity-50" />
        </motion.div>
      </motion.div>

      {/* Layer 1: Ambient Background Color Glow (Left Warm Espresso Bloom, disabled in spotlight to preserve dark studio) */}
      <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${introPhase === "hero" ? "hidden" : ""}`}>
        <motion.div
          animate={{
            backgroundColor: stage !== "carousel" ? "#4a2a19" : currentItem.accentColor,
            opacity:
              introPhase === "hero"
                ? 0.05
                : introPhase === "spotlight" || introPhase === "stabilizing"
                ? 0
                : stage === "details"
                ? 0.35
                : 0.25,
            x: stage !== "carousel" ? "-20vw" : "0vw",
            scale: stage === "details" ? 1.4 : 1.0,
          }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[80vh] rounded-full blur-[180px]"
        />
      </div>

      {/* Layer 4: Global Header / Navbar */}
      <nav className="relative z-50 px-4 sm:px-8 md:px-12 flex items-center justify-between min-h-[86px] sm:min-h-[100px] md:min-h-[118px] pointer-events-auto shrink-0 pt-2 sm:pt-3">
        {/* Left Aligned Big Logo */}
        <Link href="/" className="flex items-center cursor-pointer group shrink-0">
          <Image
            src="/meowganics_logo_transparent.png"
            alt="Meow Ganics Logo"
            width={1776}
            height={725}
            className="w-[200px] xs:w-[215px] sm:w-[240px] md:w-[300px] lg:w-[340px] xl:w-[370px] h-auto max-h-[86px] sm:max-h-[96px] md:max-h-[120px] lg:max-h-[136px] xl:max-h-[148px] object-contain object-left transition-transform duration-300 group-hover:scale-105 origin-left drop-shadow-[0_3px_8px_rgba(0,0,0,0.1)]"
            priority
          />
        </Link>

        {/* Right Actions: Cart & Shop Litter */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Shopping Bag Icon */}
          <button
            onClick={openCart}
            className={`relative p-2.5 sm:p-3 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer rounded-full border shadow-lg ${
              introPhase === "hero"
                ? "bg-white hover:bg-white/90 text-brand-black border-black/15 shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
                : "bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
            }`}
            aria-label="Open Cart"
          >
            <svg
              className="w-5 h-5"
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
            <span
              className={`absolute -top-1 -right-1 text-[10px] font-heading font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-md ${
                introPhase === "hero"
                  ? "bg-black text-white"
                  : "bg-white text-brand-black"
              }`}
            >
              {totalItems}
            </span>
          </button>

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

      {/* Layer 5: Hero Product Bag with 3-Step Choreography: Hill -> Center Spotlight -> Minimizes into Slide Frame */}
      <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center pt-4 sm:pt-6">
        <motion.div
          animate={{
            x:
              introPhase === "hero"
                ? isMobile
                  ? "-24vw"
                  : "-34vw"
                : "0vw",
            y:
              introPhase === "hero"
                ? isMobile
                  ? "30vh"
                  : "22vh"
                : "0vh",
            rotate:
              introPhase === "hero"
                ? 0
                : introPhase === "spotlight"
                ? rotationDeg
                : 360,
            scale:
              introPhase === "hero"
                ? isMobile
                  ? 0.70
                  : 0.90
                : introPhase === "spotlight" || introPhase === "stabilizing"
                ? isMobile
                  ? 1.10
                  : 1.30
                : 0,
            opacity:
              introPhase === "hero" || introPhase === "spotlight" || introPhase === "stabilizing"
                ? 1
                : 0,
            pointerEvents: introPhase === "hero" ? "auto" : "none",
          }}
          transition={{
            x: {
              duration: introPhase === "spotlight" ? 0.95 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            },
            y: {
              duration: introPhase === "spotlight" ? 0.95 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            },
            rotate: {
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            },
            scale: {
              duration: introPhase === "minimizing" ? 1.4 : 0.95,
              ease: [0.22, 1, 0.36, 1],
            },
            opacity: {
              duration: introPhase === "minimizing" ? 1.3 : 0.45,
              ease: "easeOut",
            },
          }}
          className="relative w-[44vw] sm:w-[36vw] md:w-[26vw] lg:w-[22vw] max-w-[190px] sm:max-w-[270px] md:max-w-[300px] lg:max-w-[330px] aspect-[926/1004] origin-center flex items-center justify-center pointer-events-auto"
        >
          {/* ── Studio Ambient Spotlight Bloom behind the Product Bag ── */}
          <motion.div
            animate={{
              opacity: introPhase === "spotlight" || introPhase === "stabilizing" ? 1 : 0,
              scale: introPhase === "spotlight" || introPhase === "stabilizing" ? 1 : 0.7,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute -inset-16 sm:-inset-24 md:-inset-32 rounded-full pointer-events-none z-0 flex items-center justify-center"
          >
            {/* Warm Studio Spotlight Glow with Organic Falloff */}
            <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(255,90,30,0.3)_0%,rgba(60,25,12,0.15)_45%,transparent_70%)] blur-3xl" />
          </motion.div>

          <div
            onClick={() => {
              if (introPhase === "hero") handleNext();
            }}
            className={`${
              introPhase === "hero" ? "animate-float cursor-pointer hover:scale-105" : ""
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
          </div>

          {/* Floor contact shadow for bag in hero mode */}
          {introPhase === "hero" && (
            <div className="absolute -bottom-2 inset-x-4 h-3.5 bg-black/35 blur-sm rounded-full pointer-events-none z-0" />
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
          opacity: introPhase === "docked" || introPhase === "minimizing" ? 1 : 0,
          scale: introPhase === "docked" || introPhase === "minimizing" ? 1 : 0.94,
          pointerEvents: introPhase === "docked" ? "auto" : "none",
        }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute inset-0 z-30 w-full h-full flex flex-col justify-center items-center overflow-visible ${
          introPhase !== "docked" && introPhase !== "minimizing" ? "opacity-0 pointer-events-none invisible" : ""
        }`}
      >
        <div className="relative w-full h-full flex items-center justify-center overflow-visible">

          {/* ── Side Thumbnail Previews (Visible in Stage 1: Carousel when slide is active) ── */}
          {ORYZO_ITEMS.map((prod, index) => {
            const offset = index - activeIndex;
            const abs = Math.abs(offset);
            const sign = Math.sign(offset);

            const baseDist = isMobile ? 145 : 275;
            const stepDist = isMobile ? 90 : 175;

            let xPos = 0;
            const thumbScale = isMobile ? 0.38 : 0.44;
            let thumbOpacity = 0;
            const isSlideVisible = introPhase === "docked" || introPhase === "minimizing";

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
                style={{ top: "50%" }}
                initial={{
                  x: sign * (baseDist + 220),
                  y: "-50%",
                  scale: 0.25,
                  opacity: 0,
                }}
                animate={{
                  x: isSlideVisible ? xPos : sign * (baseDist + 220),
                  y: "-50%",
                  scale: isSlideVisible ? thumbScale : 0.25,
                  opacity: thumbOpacity,
                }}
                whileHover={isInteractive ? { scale: thumbScale * 1.05, opacity: 0.95 } : undefined}
                transition={{
                  duration: 0.95,
                  ease: [0.16, 1, 0.3, 1],
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

          {/* ── THE MORPHING BOX CONTAINER (Sequence: Carousel Box -> Full Screen Expansion -> Details) ──
              Step 1: 380px dashed box (Carousel)
              Step 2: Box EXPANDS OUTWARDS to Full Screen (100vw × 100vh) slowly and smoothly on scroll
              Step 3: Full background image captures the screen, transparent glass reveals on left, details stagger in ── */}
          <motion.div
            animate={{
              width: stage !== "carousel" ? "100vw" : isMobile ? 220 : 380,
              height: stage !== "carousel" ? "100vh" : isMobile ? 310 : 510,
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
            {/* Dashed Border Layer: Smoothly reduces size and fades away when entering focus/details mode */}
            <motion.div
              animate={{
                opacity: stage === "carousel" ? 1 : 0,
                scale: stage === "carousel" ? 1 : 0.88,
              }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0 border-[1.5px] border-dashed border-white/40 pointer-events-none z-30"
            />

            {/* Step 1: Carousel Filmstrip (When in Carousel stage) */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                rotate: stage === "carousel" ? slideDir * 3 : 0,
                opacity: stage === "carousel" ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 flex flex-row pointer-events-auto"
                animate={{
                  x: `calc(${-activeIndex * (100 / ORYZO_ITEMS.length)}%)`,
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
                bottom: isMobile ? "calc(6.5rem + env(safe-area-inset-bottom, 0px))" : "auto",
                top: isMobile ? "auto" : "50%",
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

          {/* ── Carousel Mini-Headline on Left Center (Visible only in stage === 'carousel') ── */}
          <div
            className={`hidden md:block absolute z-40 pointer-events-auto shrink-0 max-w-[360px] -translate-y-1/2 transition-opacity duration-500 ${
              stage !== "carousel" ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
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
          </div>

          {/* ── Navigation arrows flanking the box in Carousel mode ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: (introPhase === "docked" || introPhase === "minimizing" || isDocked) && stage === "carousel" ? 1 : 0,
              pointerEvents: isDocked && stage === "carousel" ? "auto" : "none",
            }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              top: "50%",
              transform: "translateY(-50%)",
            }}
            className={`absolute z-40 w-[220px] sm:w-[260px] md:w-[320px] lg:w-[360px] xl:w-[380px] flex items-center justify-between pointer-events-none ${
              introPhase !== "docked" && introPhase !== "minimizing" ? "opacity-0 invisible pointer-events-none" : ""
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
            <div
              style={{
                top: "calc(50% + 168px)",
              }}
              className="md:hidden absolute z-40 pointer-events-auto w-full max-w-[340px] px-4 flex flex-col items-center text-center"
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
                        <svg
                          className="w-4 h-4 sm:w-4.5 sm:h-4.5"
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
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════════════════════
          LAYER 7: BOTTOM CONTROLS & CONTINUOUS SCROLL STATUS BAR
          ══════════════════════════════════════════════════════════════════════════════════════ */}
      {/* ── Fixed Center-Bottom Explore Button (Hero Mode) ── */}
      {introPhase === "hero" && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 inset-x-0 mx-auto w-fit z-50 flex items-center justify-center pointer-events-auto">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 text-brand-black font-heading font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all bg-brand-white/90 hover:bg-brand-white backdrop-blur-md px-4 sm:px-5 py-2 rounded-full border border-brand-black/20 shadow-md text-xs sm:text-sm"
          >
            <span className="w-2 h-2 rounded-full bg-brand-black animate-pulse" />
            <span>Scroll down to explore collection</span>
            <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════════════════
          LAYER 7: BOTTOM CONTROLS & CONTINUOUS SCROLL STATUS BAR (Spotlight / Carousel Modes)
          ══════════════════════════════════════════════════════════════════════════════════════ */}
      <div className={`relative z-40 max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 flex items-center justify-between text-xs text-white/50 pointer-events-auto shrink-0 pb-3 sm:pb-4 transition-all duration-300 ${
        introPhase === "hero" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}>
        {/* Left Action / Stage indicator */}
        <div className="flex items-center">
          {introPhase === "spotlight" ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 text-white font-heading font-bold cursor-pointer hover:opacity-90 transition-all bg-white/15 backdrop-blur-sm px-3.5 sm:px-4 py-1.5 rounded-full border border-white/20 shadow-sm text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#A9D3F4] animate-pulse" />
              <span>Scroll down to continue</span>
              <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
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
            opacity: introPhase === "docked" || introPhase === "minimizing" || isDocked ? 1 : 0,
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
