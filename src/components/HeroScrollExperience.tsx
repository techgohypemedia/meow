"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
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
export type IntroPhase = "hero" | "spotlight" | "box" | "blur" | "docked";

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
  const transitionTimers = useRef<NodeJS.Timeout[]>([]);
  const clearTransitionTimers = useCallback(() => {
    transitionTimers.current.forEach((t) => clearTimeout(t));
    transitionTimers.current = [];
  }, []);

  useEffect(() => {
    return () => {
      transitionTimers.current.forEach((t) => clearTimeout(t));
    };
  }, []);
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

  // Responsive Carousel Card Dimensions (Taller mobile card height matching exact 974 x 1536 aspect ratio)
  const isTablet = viewport.width ? viewport.width >= 640 && viewport.width < 1024 : false;
  const rawCardWidth = !isMobile ? 335 : isTablet ? 305 : (viewport.width ? Math.min(Math.round(viewport.width * 0.68), 260) : 255);
  const cardWidth = !isMobile ? 335 : isTablet ? 305 : rawCardWidth;
  // Exact aspect ratio of IMG_7598.PNG is 1536 / 974 (~1.577). 
  // We match this exact ratio so the full length of the behind product image is shown from top handle to bottom rim.
  const mobileTargetHeight = Math.round(cardWidth * (1536 / 974));
  const maxMobileCardHeight = viewport.height ? Math.max(Math.round(viewport.height - 265), 380) : 410;
  const cardHeight = !isMobile ? 445 : isTablet ? 405 : Math.min(mobileTargetHeight, maxMobileCardHeight);
  // Banner top spacing offset on mobile so it starts cleanly below the fixed icons (~168px)
  const mobileBannerYOffset = isMobile ? (viewport.height ? Math.max(Math.round(175 + cardHeight / 2 - viewport.height / 2), 24) : 48) : 0;

  // Scaled to fit cleanly INSIDE the dashed box with breathing room on top and bottom
  const inBoxBagScale = isMobileView ? 0.78 : 0.80;

  // ── Continuous 160vh Virtual Scroll Engine (No body scroll, zero blank space) ──
  const scrollProgress = useMotionValue(0);
  const virtualScroll = useRef(0);
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 190,
    damping: 26,
    restDelta: 0.0005,
  });

  // Permanently lock physical body scroll so the browser page NEVER scrolls down
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keep introPhase and isDocked aligned with continuous virtual scroll position
  useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      if (latest < 0.30) {
        setIntroPhase("hero");
        setIsDocked(false);
      } else if (latest < 0.62) {
        setIntroPhase("box");
        setIsDocked(false);
      } else if (latest < 0.94) {
        setIntroPhase("blur");
        setIsDocked(false);
      } else {
        setIntroPhase("docked");
        setIsDocked(true);
      }
    });
  }, [smoothProgress]);

  // Positions and dimensions
  const heroStartX = isMobileView
    ? typeof mobileHeroX === "number"
      ? mobileHeroX
      : -100
    : typeof laptopHeroX === "number"
    ? laptopHeroX
    : -180;
  const heroStartY = isMobileView
    ? typeof mobileHeroY === "number"
      ? mobileHeroY
      : 120
    : typeof laptopHeroY === "number"
    ? laptopHeroY
    : 100;
  const heroStartScale = isMobileView ? mobileHeroScale : laptopHeroScale;
  const boxCenterY = isMobile ? mobileBannerYOffset : 0;
  const dockedTargetX = isMobileView ? Math.round(8 * (cardWidth / 335)) : 8;
  const dockedTargetY = isMobile ? mobileBannerYOffset + Math.round(-26 * (cardHeight / 445)) : -26;
  const dockedTargetScale = isMobileView ? 1.95 * (cardWidth / 260) : 1.48;

  // Background Opacity Transforms
  const creamBgOpacity = useTransform(smoothProgress, [0, 0.32], [1, 0]);
  const darkBgOpacity = useTransform(smoothProgress, [0, 0.32], [0, 1]);
  const ambientOpacity = useTransform(smoothProgress, [0, 0.32, 0.65, 1], [0.05, 0, 0.12, 0.25]);

  // Continuous Bag Position, Scale, Rotate, Opacity Transforms
  const bagX = useTransform(smoothProgress, (p) => {
    if (p <= 0.40) {
      const ease = 0.5 - 0.5 * Math.cos((p / 0.40) * Math.PI);
      return heroStartX * (1 - ease);
    }
    if (p <= 0.70) return 0;
    const ease = 0.5 - 0.5 * Math.cos(((p - 0.70) / 0.30) * Math.PI);
    return dockedTargetX * ease;
  });

  const bagY = useTransform(smoothProgress, (p) => {
    if (p <= 0.40) {
      const ease = 0.5 - 0.5 * Math.cos((p / 0.40) * Math.PI);
      return heroStartY * (1 - ease) + boxCenterY * ease;
    }
    if (p <= 0.70) return boxCenterY;
    const ease = 0.5 - 0.5 * Math.cos(((p - 0.70) / 0.30) * Math.PI);
    return boxCenterY * (1 - ease) + dockedTargetY * ease;
  });

  const bagScale = useTransform(smoothProgress, (p) => {
    const spotlightScale = isMobileView ? 1.05 : 1.15;
    if (p <= 0.40) {
      const ease = 0.5 - 0.5 * Math.cos((p / 0.40) * Math.PI);
      return heroStartScale * (1 - ease) + spotlightScale * ease;
    }
    if (p <= 0.70) {
      const ease = 0.5 - 0.5 * Math.cos(((p - 0.40) / 0.30) * Math.PI);
      return spotlightScale * (1 - ease) + inBoxBagScale * ease;
    }
    const ease = 0.5 - 0.5 * Math.cos(((p - 0.70) / 0.30) * Math.PI);
    return inBoxBagScale * (1 - ease) + dockedTargetScale * ease;
  });

  const bagRotate = useTransform(smoothProgress, (p) => {
    if (p <= 0.70) return 0;
    const ease = 0.5 - 0.5 * Math.cos(((p - 0.70) / 0.30) * Math.PI);
    return 12.0 * ease;
  });

  const floatingBagOpacity = useTransform(smoothProgress, (p) => {
    if (p <= 0.88) return 1;
    return Math.max(0, 1 - (p - 0.88) / 0.12);
  });

  // Dashed Box Opacity
  const dashedBoxOpacity = useTransform(smoothProgress, (p) => {
    if (stage !== "carousel") return 0;
    if (p <= 0.38) return 0;
    if (p <= 0.52) return (p - 0.38) / 0.14;
    return 1;
  });

  // Filmstrip Banner behind bag
  const bannerFilmstripOpacity = useTransform(smoothProgress, (p) => {
    if (stage !== "carousel") return 0;
    if (p <= 0.68) return 0;
    if (p <= 0.86) return (p - 0.68) / 0.18;
    return 1;
  });

  const bannerFilmstripFilter = useTransform(smoothProgress, (p) => {
    if (p <= 0.82) return "blur(7px) brightness(0.95)";
    if (p >= 0.98) return "blur(0px) brightness(1)";
    const blurAmount = Math.max(0, 7 * (1 - (p - 0.82) / 0.16));
    return `blur(${blurAmount.toFixed(1)}px) brightness(1)`;
  });

  // Dynamic Clip Path for the bag as it enters the card boundary
  const bagClipPath = useTransform(smoothProgress, (p) => {
    if (p <= 0.70) return "none";
    return `inset(calc(50% - ${cardHeight / 2}px + ${mobileBannerYOffset}px) calc(50% - ${cardWidth / 2}px) calc(50% - ${cardHeight / 2}px - ${mobileBannerYOffset}px) calc(50% - ${cardWidth / 2}px))`;
  });

  // Side Thumbnail Previews Opacity
  const sideCardsOpacity = useTransform(smoothProgress, (p) => {
    if (p <= 0.85) return 0;
    return Math.min(1, (p - 0.85) / 0.15);
  });

  // Bottom Controls Opacity
  const bottomControlsOpacity = useTransform(smoothProgress, (p) => {
    if (p <= 0.88) return 0;
    return Math.min(1, (p - 0.88) / 0.12);
  });

  const currentItem = ORYZO_ITEMS[activeIndex] || ORYZO_ITEMS[0];
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
    if (isDocked && stage === "carousel") {
      setStage("details");
    } else {
      const totalDist = Math.max((viewport.height || 850) * 1.60, 1150);
      virtualScroll.current = totalDist;
      animate(scrollProgress, 1, { duration: 0.95, ease: [0.22, 1, 0.36, 1] });
    }
  }, [isDocked, stage, viewport.height, scrollProgress]);

  const handlePrev = useCallback(() => {
    if (stage === "details" || stage === "focus") {
      setStage("carousel");
      return;
    }
    if (isDocked && stage === "carousel") {
      if (activeIndex > 0) {
        handleSlidePrev();
        return;
      }
      virtualScroll.current = 0;
      animate(scrollProgress, 0, { duration: 0.95, ease: [0.22, 1, 0.36, 1] });
    }
  }, [stage, isDocked, activeIndex, handleSlidePrev, scrollProgress]);

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

  // Continuous 160vh Wheel listener
  const handleWheel = (e: React.WheelEvent) => {
    // 1. Trackpad Horizontal Swipe (only in docked carousel)
    if (isDocked && stage === "carousel" && Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 16) {
      if (isWheelDebounced.current) return;
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

    // 2. In full-screen details view, scrolling up returns to carousel
    if (stage === "details") {
      if (e.deltaY < -28) {
        if (isWheelDebounced.current) return;
        isWheelDebounced.current = true;
        setStage("carousel");
        setTimeout(() => {
          isWheelDebounced.current = false;
        }, 400);
      }
      return;
    }

    // 3. When docked in carousel, scrolling down further opens details
    if (isDocked && stage === "carousel" && e.deltaY > 38) {
      if (isWheelDebounced.current) return;
      isWheelDebounced.current = true;
      setStage("details");
      setTimeout(() => {
        isWheelDebounced.current = false;
      }, 450);
      return;
    }

    // 4. Continuous 160vh Virtual Scroll Accumulator
    const totalDistance = Math.max((viewport.height || 850) * 1.60, 1150);
    virtualScroll.current = Math.min(Math.max(virtualScroll.current + e.deltaY * 1.15, 0), totalDistance);
    scrollProgress.set(virtualScroll.current / totalDistance);
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
    if (virtualScroll.current <= 0 && diffY > 0 && Math.abs(diffY) > Math.abs(diffX)) {
      const pull = Math.min(Math.pow(diffY, 0.82) * 1.4, 90);
      setPullProgress(pull);
      return;
    }

    // 2. Interactive horizontal drag in Carousel phase
    if (introPhase === "docked" && stage === "carousel" && Math.abs(diffX) > Math.abs(diffY)) {
      setDragOffset(diffX * 0.75);
      return;
    }

    // 3. Continuous 160vh touch scroll
    if (stage !== "details") {
      const totalDistance = Math.max((viewport.height || 850) * 1.60, 1150);
      const delta = (touchStartRef.current.y - currentY) * 1.6;
      touchStartRef.current.y = currentY;
      virtualScroll.current = Math.min(Math.max(virtualScroll.current + delta, 0), totalDistance);
      scrollProgress.set(virtualScroll.current / totalDistance);
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

    if (!touchStartRef.current || touchCooldownRef.current) {
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
    const minSwipeDist = 20;

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
        const cooldownTime = introPhase === "hero" ? 1200 : stage !== "carousel" ? 380 : 420;
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
    if (!touchStartRef.current || touchCooldownRef.current) {
      touchStartRef.current = null;
      return;
    }

    const diffX = touchStartRef.current.x - e.clientX;
    const diffY = touchStartRef.current.y - e.clientY;
    touchStartRef.current = null;

    const minSwipeDist = 20;
    const touchCooldownTime =
      introPhase !== "docked" ? 380 : stage !== "carousel" ? 360 : 320;

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
      onTouchCancel={() => {
        touchStartRef.current = null;
        setDragOffset(0);
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className={`fixed inset-0 w-full h-[100dvh] max-h-[100dvh] overflow-hidden select-none flex flex-col justify-between transition-colors duration-700 ${
        introPhase === "hero" ? "bg-[#FEF8EA]" : "bg-[#07080A]"
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
          style={{ opacity: creamBgOpacity }}
          className="absolute inset-0 overflow-hidden z-0 pointer-events-auto"
        >
          <HeroBackground />
        </motion.div>

        {/* Layer 0.5: Clean Studio Solid Pure Black Background */}
        <motion.div
          style={{ opacity: darkBgOpacity }}
          className="absolute inset-0 bg-[#07080A] pointer-events-none z-0"
        />

        {/* Layer 1: Ambient Background Color Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            style={{ opacity: ambientOpacity }}
            animate={{
              backgroundColor: stage !== "carousel" ? "#4a2a19" : currentItem.accentColor,
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
      <motion.div
        style={{
          clipPath: bagClipPath,
        }}
        className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-visible"
      >
        <motion.div
          style={{
            x: bagX,
            y: bagY,
            rotate: bagRotate,
            scale: bagScale,
            opacity: floatingBagOpacity,
            pointerEvents: introPhase === "hero" ? "auto" : "none",
          }}
          className="relative w-[42vw] xs:w-[43vw] sm:w-[30vw] md:w-[22vw] lg:w-[19vw] max-w-[205px] sm:max-w-[220px] md:max-w-[250px] lg:max-w-[280px] aspect-[1086/1448] origin-center flex items-center justify-center pointer-events-none"
        >
          <motion.div
            onClick={() => {
              if (introPhase === "hero") handleNext();
            }}
            animate={
              introPhase === "spotlight" || introPhase === "box" || introPhase === "blur"
                ? {
                    y: [-4, 4, -4],
                    rotate: [-0.4, 0.4, -0.4],
                  }
                : {}
            }
            transition={
              introPhase === "spotlight" || introPhase === "box" || introPhase === "blur"
                ? {
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }
                : undefined
            }
            className={`${
              introPhase === "hero"
                ? "md:animate-float cursor-pointer hover:scale-105 pointer-events-auto"
                : ""
            } drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] w-full h-full block relative z-10 transition-transform`}
          >
            <Image
              src="/product-bag.png"
              alt="Clean Bean Product Bag"
              fill
              sizes="(max-width: 768px) 380px, 440px"
              className="object-contain"
              draggable={false}
              priority
            />
          </motion.div>

          {/* Floor contact shadow for bag in hero mode */}
          {introPhase === "hero" && (
            <div className="absolute -bottom-2.5 inset-x-3 h-3.5 bg-black/35 blur-sm rounded-full pointer-events-none z-0" />
          )}
        </motion.div>
      </motion.div>

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
        className="absolute inset-0 z-30 w-full h-full flex flex-col justify-center items-center overflow-visible"
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
                  y: isMobile ? `calc(-50% + ${mobileBannerYOffset}px)` : "-50%",
                  scale: 0.25,
                  opacity: 0,
                }}
                animate={{
                  x: isSlideVisible ? xPos : sign * (baseDist + cardWidth + 120),
                  y: isMobile ? `calc(-50% + ${mobileBannerYOffset}px)` : "-50%",
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
              y: stage !== "carousel" ? 0 : mobileBannerYOffset,
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
            {/* Dashed Border Box: Appears in Box stage, stays through Blur and Docked Carousel */}
            <motion.div
              style={{
                opacity: dashedBoxOpacity,
              }}
              animate={{
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
              {/* Top Right Accent Dot from user reference images */}
              <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            </motion.div>

            {/* Step 1: Carousel Filmstrip (Hidden in Spotlight & Box -> More Visible Banner in Blur -> Sharp in Docked) */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: bannerFilmstripOpacity,
                filter: bannerFilmstripFilter,
              }}
              animate={{
                rotate: stage === "carousel" ? slideDir * 3 : 0,
                scale: 1,
              }}
              transition={{
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
              top: isMobile ? `calc(50% + ${mobileBannerYOffset}px)` : "50%",
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
          LAYER 7: BOTTOM CONTROLS & CONTINUOUS SCROLL STATUS BAR (Only shown when Docked Carousel)
          ══════════════════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        style={{
          opacity: bottomControlsOpacity,
        }}
        className="relative z-40 max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 flex items-center justify-between text-xs text-white/50 pointer-events-auto shrink-0 pb-[max(0.75rem,calc(env(safe-area-inset-bottom,0px)+0.25rem))] sm:pb-4 transition-all duration-300"
      >
        {/* Left Action / Stage indicator */}
        <div className="flex items-center">
          {stage === "details" ? (
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
            opacity: isDocked ? 1 : 0,
            pointerEvents: isDocked ? "auto" : "none",
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
        <button
          onClick={() => {
            setStage("carousel");
            setActiveIndex(0);
            virtualScroll.current = 0;
            animate(scrollProgress, 0, { duration: 1.0, ease: [0.22, 1, 0.36, 1] });
          }}
          className="hover:text-white text-white/60 transition-colors cursor-pointer text-[10px] sm:text-[11px] flex items-center gap-1 font-heading font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-auto"
        >
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className="hidden sm:inline">Back to Hill</span>
          <span className="sm:hidden">Top</span>
        </button>
      </motion.div>

    </div>
  );
}
