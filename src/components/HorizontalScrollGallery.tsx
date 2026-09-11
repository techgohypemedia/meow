"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ScrollReelTestimonials,
  ScrollReelTestimonial,
} from "@/components/ui/scroll-reel-testimonials";

interface AccessoryItem {
  id: string;
  productId: string;
  tag: string;
  tagBg: string;
  badge: string;
  eyebrow: string;
  headline: string;
  title: string;
  desc: string;
  price: string;
  priceNum: number;
  image: string;
  features: string[];
}

const ACCESSORIES: AccessoryItem[] = [
  {
    id: "zen-scoop",
    productId: "zen-scoop",
    tag: "ESSENTIAL TOOL",
    tagBg: "bg-brand-blue",
    badge: "FSC Beechwood Grip",
    eyebrow: "PRECISION SIFTER,",
    headline: "saves 30% clean litter",
    title: "The Zen Sifter Scoop",
    desc: "Engineered specifically for cylindrical tofu pellets. Precision 5.5mm slots let clean pellets glide effortlessly back into the box while catching clumps cleanly.",
    price: "$18.00",
    priceNum: 18.0,
    image: "/showcase/accessories/acc_zen_scoop.jpg",
    features: ["5.5mm Precision Slots", "FSC Beechwood Grip", "Non-Stick Aluminum"],
  },
  {
    id: "cloud-mat",
    productId: "cloud-mat",
    tag: "FLOOR DEFENSE",
    tagBg: "bg-[#D1F0E4]",
    badge: "Dual Honeycomb",
    eyebrow: "ZERO TRACKING,",
    headline: "stops litter scatter dead",
    title: "Cloud Trap Litter Mat",
    desc: "Deep double-layer honeycomb pockets capture 99% of stray pellets as your cat steps out. Easy-pour envelope design lets you recycle clean pellets back into the box in 5 seconds.",
    price: "$28.00",
    priceNum: 28.0,
    image: "/showcase/accessories/acc_cloud_mat.jpg",
    features: ["Honeycomb Pellet Trap", "100% Waterproof Base", "Easy-Pour Recycle"],
  },
  {
    id: "catnip-mist",
    productId: "catnip-mist",
    tag: "PURE BOTANICAL",
    tagBg: "bg-pink-300",
    badge: "Organic Canadian",
    eyebrow: "MESS-FREE FUN,",
    headline: "steam-distilled euphoria",
    title: "Organic Catnip Mist",
    desc: "100% pure certified organic Canadian catnip hydrosol spray. All the joyful zoomies and playful excitement without annoying flaky mess stuck in rugs.",
    price: "$14.00",
    priceNum: 14.0,
    image: "/showcase/accessories/acc_catnip_mist.jpg",
    features: ["Steam-Distilled Hydrosol", "Zero Flake Mess", "Fabric Safe"],
  },
  {
    id: "charcoal-pods",
    productId: "charcoal-pods",
    tag: "AIR PURIFIER",
    tagBg: "bg-amber-300",
    badge: "Active Carbon",
    eyebrow: "ODOR DEFENSE,",
    headline: "natural 24/7 air absorption",
    title: "Odor-Lock Charcoal Pods",
    desc: "High-density coconut shell activated charcoal pods that mount beside any litter box to capture airborne ammonia molecules continuously.",
    price: "$12.00",
    priceNum: 12.0,
    image: "/showcase/accessories/acc_charcoal_pods.jpg",
    features: ["Coconut Shell Carbon", "Peel & Stick Dock", "30-Day Fresh Air"],
  },
];

const TESTIMONIALS: ScrollReelTestimonial[] = [
  {
    quote:
      "Total game changer for my apartment! Two British Shorthairs, zero dust clouds, and being able to flush it is life-changing.",
    author: "Sarah M. — Verified Cat Mom (2 British Shorthairs)",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    alt: "Portrait of Sarah M.",
  },
  {
    quote:
      "My cat's asthma is completely relieved. Zero silica dust means we both breathe easy. The clumps are rock solid and never crumble.",
    author: "Marcus T. — Multi-Cat Parent (3 Rescue Cats)",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    alt: "Portrait of Marcus T.",
  },
  {
    quote:
      "The Green Tea formula is pure magic. It neutralizes ammonia odors in seconds without artificial synthetic perfumes.",
    author: "Elena R. — Ragdoll Owner & Breeder",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    alt: "Portrait of Elena R.",
  },
  {
    quote:
      "Paired with their Zen Scoop, daily bathroom cleanup takes less than 30 seconds now. Truly the best litter we have ever used.",
    author: "Chloe P. — Eco Living Advocate & Cat Lover",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
    alt: "Portrait of Chloe P.",
  },
];

export default function HorizontalScrollGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"accessories" | "reviews">("accessories");
  const [activeAccIndex, setActiveAccIndex] = useState(0);
  const [activeRevIndex, setActiveRevIndex] = useState(0);
  const { addToCart } = useCart();

  const totalAcc = ACCESSORIES.length;
  const totalRev = TESTIMONIALS.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 0.00 - 0.48: Accessories Phase
    // 0.48 - 0.52: Crossfade Transition
    // 0.52 - 1.00: Reviews Phase
    if (latest < 0.49) {
      if (phase !== "accessories") setPhase("accessories");
      const normProgress = Math.min(1, latest / 0.46);
      const accIdx = Math.min(totalAcc - 1, Math.max(0, Math.floor(normProgress * totalAcc)));
      if (accIdx !== activeAccIndex) {
        setActiveAccIndex(accIdx);
      }
    } else {
      if (phase !== "reviews") setPhase("reviews");
      const revProgress = Math.min(1, Math.max(0, (latest - 0.51) / 0.47));
      const revIdx = Math.min(totalRev - 1, Math.max(0, Math.floor(revProgress * totalRev)));
      if (revIdx !== activeRevIndex) {
        setActiveRevIndex(revIdx);
      }
    }
  });

  const activeItem = ACCESSORIES[activeAccIndex] || ACCESSORIES[0];

  const scrollToAccStep = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const scrollHeight = rect.height - window.innerHeight;
    const targetScroll = scrollTop + (index / (totalAcc - 1)) * (scrollHeight * 0.46) + 10;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const scrollToRevStep = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const scrollHeight = rect.height - window.innerHeight;
    const targetScroll =
      scrollTop + (scrollHeight * 0.51) + (index / (totalRev - 1)) * (scrollHeight * 0.47) + 10;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const scrollToPhase = (targetPhase: "accessories" | "reviews") => {
    if (targetPhase === "accessories") {
      scrollToAccStep(0);
    } else {
      scrollToRevStep(0);
    }
  };

  const handleScrollToNext = () => {
    if (!containerRef.current) return;
    if (phase === "accessories") {
      if (activeAccIndex < totalAcc - 1) {
        scrollToAccStep(activeAccIndex + 1);
      } else {
        scrollToRevStep(0);
      }
    } else {
      if (activeRevIndex < totalRev - 1) {
        scrollToRevStep(activeRevIndex + 1);
      } else {
        const rect = containerRef.current.getBoundingClientRect();
        window.scrollTo({
          top: window.scrollY + rect.bottom - 40,
          behavior: "smooth",
        });
      }
    }
  };

  const handleQuickAdd = (item: AccessoryItem) => {
    addToCart(
      {
        productId: item.productId,
        name: item.title,
        size: {
          id: "standard",
          name: item.badge,
          volume: "1 Unit",
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
      ref={containerRef}
      id="meow-master-showcase"
      className="relative w-full h-[560vh] bg-[#0E1822] text-brand-white select-none z-30"
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 h-screen max-h-screen w-full overflow-hidden flex flex-col justify-between pt-3.5 sm:pt-6 md:pt-8 pb-2 sm:pb-3 md:pb-4 px-3.5 sm:px-8 md:px-12">
        {/* Ambient Brand Lighting */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-[10%] top-[20%] w-[50vw] h-[55vh] rounded-full bg-[#A9D3F4]/15 blur-[140px]" />
          <div className="absolute -right-[10%] bottom-[15%] w-[45vw] h-[50vh] rounded-full bg-[#8FBEE5]/12 blur-[130px]" />
          <div className="absolute left-[55%] top-[48%] -translate-x-1/2 -translate-y-1/2 w-[380px] h-[480px] rounded-full bg-[#A9D3F4]/10 blur-[90px]" />
        </div>

        {/* Top Header Controls: Phase Switcher Tabs */}
        <div className="w-full flex items-center justify-between z-30 shrink-0 pb-1 sm:pb-1.5">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/15">
            <button
              onClick={() => scrollToPhase("accessories")}
              className={`px-2.5 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-heading font-black transition-all cursor-pointer ${
                phase === "accessories"
                  ? "bg-brand-blue text-brand-black shadow-[0_0_12px_rgba(169,211,244,0.6)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              ✨ ECO ACCESSORIES (04)
            </button>
            <button
              onClick={() => scrollToPhase("reviews")}
              className={`px-2.5 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-heading font-black transition-all cursor-pointer ${
                phase === "reviews"
                  ? "bg-brand-blue text-brand-black shadow-[0_0_12px_rgba(169,211,244,0.6)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              ⭐ CAT PARENT REVIEWS (12K+)
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-heading font-bold text-white/60">
            {phase === "accessories" ? "Essential Litter Tools" : "Verified Customer Love • 4.9★"}
          </div>
        </div>

        {/* Center Content Arena: Seamless Crossfade between Accessories & Reviews */}
        <div className="relative flex-1 w-full flex items-center justify-center z-20 min-h-0 py-0.5 sm:py-1">
          {/* Phase 1: Accessories Showcase View */}
          <AnimatePresence mode="wait">
            {phase === "accessories" ? (
              <motion.div
                key="phase-accessories"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-5 sm:gap-6 md:gap-10 my-auto"
              >
                {/* Left Column: Headline & Description */}
                <div className="w-full md:w-1/2 lg:w-[46%] flex flex-col items-center md:items-start justify-center pr-0 md:pr-4 z-30 pointer-events-auto text-center md:text-left">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeItem.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex flex-col items-center md:items-start w-full"
                    >
                      {/* Eyebrow Pill */}
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5 sm:mb-2 w-full">
                        <span
                          className={`text-[10px] md:text-xs font-heading font-black px-2 sm:px-2.5 py-0.5 rounded-full border border-brand-black/30 shadow-[1px_1px_0px_#111111] ${activeItem.tagBg} text-brand-black uppercase tracking-wider`}
                        >
                          {activeItem.tag}
                        </span>
                        <span className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-widest text-brand-blue">
                          {activeItem.eyebrow}
                        </span>
                      </div>

                      {/* Main Headline */}
                      <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black text-brand-white leading-[1.15] tracking-tight text-center md:text-left">
                        {activeItem.headline}
                      </h2>

                      {/* Description */}
                      <p className="text-brand-white/80 font-sans text-xs sm:text-sm md:text-base font-bold leading-snug sm:leading-relaxed max-w-lg mt-1.5 sm:mt-3 line-clamp-2 sm:line-clamp-none text-center md:text-left mx-auto md:mx-0">
                        {activeItem.desc}
                      </p>

                      {/* Key Features Chips */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-2 mt-2 sm:mt-4 w-full">
                        {activeItem.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] sm:text-xs font-heading font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-white/10 text-white/90 border border-white/15"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>

                      {/* Price & Action Row */}
                      <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 mt-3 sm:mt-6 w-full">
                        <span className="text-lg sm:text-2xl md:text-3xl font-heading font-black text-brand-blue tracking-tight">
                          {activeItem.price}
                        </span>
                        <button
                          onClick={() => handleQuickAdd(activeItem)}
                          className="px-4 sm:px-6 py-1.5 sm:py-2.5 bg-brand-blue text-brand-black font-heading font-black text-xs sm:text-sm rounded-full border-2 border-brand-black shadow-[2px_2px_0px_#111111] sm:shadow-[3px_3px_0px_#111111] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          Add to Bag +
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right Column: Hero Showcase Card */}
                <div className="w-full md:w-1/2 lg:w-[54%] h-[30vh] sm:h-[36vh] md:h-[54vh] lg:h-[60vh] xl:h-[64vh] max-h-[310px] sm:max-h-[360px] md:max-h-[520px] lg:max-h-[580px] xl:max-h-[640px] flex items-center justify-center relative shrink-0">
                  <div className="relative h-full aspect-[4/5] w-auto max-w-[320px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[480px] xl:max-w-[530px] rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-[3px] border-brand-black shadow-[4px_4px_0px_#111111] md:shadow-[8px_8px_0px_#111111] bg-[#1a2c3d] group transition-all duration-300">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeItem.id}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={activeItem.image}
                          alt={activeItem.title}
                          fill
                          sizes="(max-width: 768px) 340px, (max-width: 1200px) 480px, 600px"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          priority
                        />

                        {/* Top Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
                          <span
                            className={`text-[10px] font-heading font-black px-2 py-0.5 rounded-full border border-brand-black/30 shadow-[1px_1px_0px_#111111] ${activeItem.tagBg} text-brand-black`}
                          >
                            {activeItem.badge}
                          </span>
                        </div>

                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Upcoming Next Accessory Teaser */}
                  {activeAccIndex < totalAcc - 1 && (
                    <div
                      onClick={() => scrollToAccStep(activeAccIndex + 1)}
                      className="hidden 2xl:block absolute left-[102%] top-1/2 -translate-y-1/2 h-[34vh] max-h-[300px] aspect-[3/4] rounded-2xl overflow-hidden opacity-30 blur-[0.5px] hover:opacity-80 hover:scale-105 transition-all cursor-pointer border-2 border-dashed border-white/30"
                    >
                      <Image
                        src={ACCESSORIES[activeAccIndex + 1].image}
                        alt="Next Accessory"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-brand-black/40" />
                      <div className="absolute bottom-2 left-2 text-[10px] font-heading font-black text-white bg-black/70 px-2 py-0.5 rounded border border-white/20">
                        Next →
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Phase 2: Merged Customer Reviews Reel View */
              <motion.div
                key="phase-reviews"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full flex flex-col items-center justify-center my-auto max-h-full"
              >
                {/* Header inside the stage */}
                <div className="text-center max-w-xl mx-auto shrink-0 mb-2 md:mb-3">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-black text-white tracking-tight leading-tight">
                    Loved by 12,000+ Happy Cats
                  </h2>
                  <p className="text-white/60 font-bold text-[11px] sm:text-xs mt-0.5">
                    Real Cat Parents • 100% Verified Clean Bean Reviews
                  </p>
                </div>

                {/* The Fullpage Dark Reel Component */}
                <div className="w-full max-w-5xl mx-auto flex items-center justify-center">
                  <ScrollReelTestimonials
                    testimonials={TESTIMONIALS}
                    variant="fullpage"
                    theme="dark"
                    showControls={false}
                    activeIndex={activeRevIndex}
                    onNavigate={scrollToRevStep}
                    className="w-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Bar: Stepper Navigation & Dynamic Scroll Indicator */}
        <div className="w-full flex items-center justify-between z-30 pt-2 pb-1 border-t border-white/10 shrink-0 h-12">
          {/* Stepper Dots */}
          <div className="flex items-center gap-2">
            {phase === "accessories"
              ? ACCESSORIES.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToAccStep(idx)}
                    aria-label={`Jump to ${item.title}`}
                    className={`transition-all rounded-full cursor-pointer flex items-center gap-1.5 ${
                      idx === activeAccIndex
                        ? "w-8 sm:w-12 h-2.5 bg-brand-blue shadow-[0_0_12px_rgba(169,211,244,0.8)]"
                        : "w-2.5 h-2.5 bg-white/25 hover:bg-white/60"
                    }`}
                  />
                ))
              : TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToRevStep(idx)}
                    aria-label={`Jump to review 0${idx + 1}`}
                    className={`transition-all rounded-full cursor-pointer flex items-center gap-1.5 ${
                      idx === activeRevIndex
                        ? "w-8 sm:w-12 h-2.5 bg-brand-blue shadow-[0_0_12px_rgba(169,211,244,0.8)]"
                        : "w-2.5 h-2.5 bg-white/25 hover:bg-white/60"
                    }`}
                  />
                ))}
          </div>

          {/* Center Scroll Action Button */}
          <button
            onClick={handleScrollToNext}
            className="group flex items-center gap-2 text-[10px] md:text-xs tracking-[0.25em] font-heading font-black text-brand-blue hover:text-white transition-all uppercase cursor-pointer"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-brand-blue/50 flex items-center justify-center group-hover:border-brand-blue group-hover:scale-110 transition-all bg-brand-black/40">
              <svg
                className="w-3.5 h-3.5 text-brand-blue group-hover:text-white transition-colors animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <span>
              {phase === "accessories"
                ? activeAccIndex === totalAcc - 1
                  ? "CONTINUE TO REVIEWS →"
                  : "SCROLL TO CONTINUE"
                : "SCROLL TO ADVANCE"}
            </span>
          </button>

          {/* Active Badge / Counter & Navigation Controls */}
          <div className="flex items-center gap-3">
            {phase === "reviews" && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollToRevStep(Math.max(0, activeRevIndex - 1))}
                  disabled={activeRevIndex === 0}
                  aria-label="Previous Review"
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-brand-blue hover:text-brand-black border border-white/20 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer text-white"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToRevStep(Math.min(totalRev - 1, activeRevIndex + 1))}
                  disabled={activeRevIndex === totalRev - 1}
                  aria-label="Next Review"
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-brand-blue hover:text-brand-black border border-white/20 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer text-white"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
            <div className="hidden sm:flex items-center text-xs font-heading font-bold text-brand-white/60">
              {phase === "accessories" ? (
                <span>
                  Accessory 0{activeAccIndex + 1} / 0{totalAcc}
                </span>
              ) : (
                <span>
                  Review 0{activeRevIndex + 1} / 0{totalRev}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
