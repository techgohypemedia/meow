"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function AnimatedProductBag() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollY } = useScroll();

  // Global motion for the container - smoothly animates from hero curve position (bottom-left corner) to true viewport center
  const desktopX = useTransform(scrollY, [0, 500], ["-24vw", "0vw"]);
  const mobileX = useTransform(scrollY, [0, 500], ["-23vw", "0vw"]);
  const desktopY = useTransform(scrollY, [0, 500], ["12vh", "0vh"]);
  const mobileY = useTransform(scrollY, [0, 500], ["18vh", "0vh"]);
  const desktopScale = useTransform(scrollY, [0, 500], [0.92, 1]);
  const mobileScale = useTransform(scrollY, [0, 500], [0.72, 1]);

  // Single continuous bag filter transition
  const bagFilter = useTransform(
    scrollY,
    [0, 500, 1000, 1500, 2000],
    [
      "hue-rotate(0deg)",
      "hue-rotate(0deg)",
      "hue-rotate(90deg)",
      "hue-rotate(180deg)",
      "hue-rotate(270deg)",
    ]
  );

  // Text Opacities - smoothly transitions across the 4 flavors without disappearing
  const text1Opacity = useTransform(scrollY, [0, 350, 450, 600, 700], [0, 0, 1, 1, 0]);
  const text2Opacity = useTransform(scrollY, [700, 800, 950, 1100, 1200], [0, 1, 1, 1, 0]);
  const text3Opacity = useTransform(scrollY, [1200, 1300, 1450, 1600, 1700], [0, 1, 1, 1, 0]);
  const text4Opacity = useTransform(scrollY, [1700, 1800, 2400], [0, 1, 1]);

  const commonClasses =
    "absolute inset-0 w-full h-full origin-center flex items-center justify-center";

  const texts = [
    {
      id: "original",
      opacity: text1Opacity,
      title: "Pure Routine",
      subtitle: "Original Unscented",
      priceNum: 19.99,
      price: "$19.99",
      desc: "The classic, unscented tofu cat litter. 100% natural, incredibly absorbent, and completely flushable for a hassle-free routine.",
      color: "text-brand-blue-dark",
      hueFilter: "hue-rotate(0deg)",
      accentColor: "#8FBEE5",
    },
    {
      id: "berry",
      opacity: text2Opacity,
      title: "Berry Fresh",
      subtitle: "Scented Tofu Litter",
      priceNum: 21.99,
      price: "$21.99",
      desc: "A subtle, sweet berry scent that neutralizes tough odors instantly. Perfect for multi-cat households.",
      color: "text-pink-600",
      hueFilter: "hue-rotate(90deg)",
      accentColor: "#DB2777",
    },
    {
      id: "peach",
      opacity: text3Opacity,
      title: "Peach Paradise",
      subtitle: "Scented Tofu Litter",
      priceNum: 21.99,
      price: "$21.99",
      desc: "Infused with natural peach extracts for a sweet, refreshing scent that keeps your home smelling delightful all day.",
      color: "text-orange-600",
      hueFilter: "hue-rotate(180deg)",
      accentColor: "#EA580C",
    },
    {
      id: "green-tea",
      opacity: text4Opacity,
      title: "Fresh Green Tea",
      subtitle: "Scented Tofu Litter",
      priceNum: 21.99,
      price: "$21.99",
      desc: "Superior odor control powered by natural green tea catechins. Clean, refreshing, and incredibly effective.",
      color: "text-emerald-600",
      hueFilter: "hue-rotate(270deg)",
      accentColor: "#059669",
    },
  ];

  const handleQuickAdd = (flavorItem: typeof texts[0]) => {
    addToCart({
      productId: "clean-bean",
      name: "Clean Bean Tofu Litter",
      flavor: {
        id: flavorItem.id,
        name: flavorItem.subtitle,
        color: flavorItem.accentColor,
        hueFilter: flavorItem.hueFilter,
      },
      size: {
        id: "6l",
        name: "Single Bag (6L)",
        volume: "6 Liters",
      },
      price: flavorItem.priceNum,
      image: "/product-bag.png",
      quantity: 1,
    }, true);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center w-full h-full relative pointer-events-none"
    >
      {/* Master Container - Positioned on bottom-left curve at scroll 0, centered on scroll */}
      <motion.div
        style={{
          x: isMobile ? mobileX : desktopX,
          y: isMobile ? mobileY : desktopY,
          scale: isMobile ? mobileScale : desktopScale,
        }}
        className="relative w-[58vw] sm:w-[64vw] md:w-auto h-[36vh] sm:h-[40vh] md:h-[44vh] max-w-[260px] sm:max-w-[320px] md:max-w-none max-h-[330px] sm:max-h-[360px] md:max-h-[400px] aspect-[926/1004] z-50 origin-center flex items-center justify-center"
      >
        {/* SINGLE Continuous Bag Image (Clickable Link to Product Details Page) */}
        <motion.div
          className="absolute inset-0 w-full h-full origin-center flex items-center justify-center pointer-events-auto z-30"
          style={{ filter: bagFilter }}
        >
          <Link
            href="/product"
            className="animate-float drop-shadow-[0_20px_25px_rgba(0,0,0,0.2)] w-full h-full block cursor-pointer hover:scale-105 transition-transform duration-300 relative"
            title="View Product Details"
          >
            <Image
              src="/product-bag.png"
              alt="Clean Bean Product Bag"
              fill
              sizes="(max-width: 768px) 380px, 440px"
              className="object-contain pointer-events-auto cursor-pointer"
              priority
            />
          </Link>
        </motion.div>

        {/* Mapped Text Elements */}
        {texts.map((t, i) => (
          <motion.div
            key={i}
            style={{ opacity: t.opacity }}
            className={commonClasses + " z-40 pointer-events-none"}
          >
            {/* Title (Top) - positioned with comfortable breathing room above bag handle */}
            <motion.div className="absolute bottom-[102%] left-1/2 -translate-x-1/2 mb-5 sm:mb-6 md:mb-7 lg:mb-8 w-max text-center flex flex-col items-center pointer-events-none z-50">
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-brand-black leading-tight tracking-tight drop-shadow-sm">
                {t.title}
              </h1>
              <p className="hidden md:block text-xs md:text-sm font-heading font-bold uppercase tracking-widest text-brand-black/60 mt-1 sm:mt-1.5">
                {t.subtitle}
              </p>
              {/* Mobile Subtitle & Price Badge */}
              <div className="flex md:hidden items-center gap-1.5 mt-1.5">
                <span className="text-[10px] font-bold text-brand-black/80 bg-brand-white px-2.5 py-0.5 rounded-full border border-brand-black/20 shadow-[1px_1px_0px_#111111]">
                  {t.subtitle}
                </span>
                <span className="text-xs font-heading font-black text-brand-black bg-[#D1F0E4] px-2 py-0.5 rounded-full border border-brand-black/20 shadow-[1px_1px_0px_#111111]">
                  {t.price}
                </span>
              </div>
            </motion.div>

            {/* Description (Left - Desktop) */}
            <motion.div className="hidden md:flex absolute right-[106%] top-1/2 -translate-y-1/2 mr-4 lg:mr-8 w-[230px] lg:w-[280px] xl:w-[320px] text-right flex-col items-end pointer-events-none">
              <p className="text-brand-black/80 text-xs md:text-sm lg:text-base font-bold leading-relaxed">
                {t.desc}
              </p>
            </motion.div>

            {/* Price (Right - Desktop) */}
            <motion.div className="hidden md:flex absolute left-[106%] top-1/2 -translate-y-1/2 ml-4 lg:ml-8 w-max text-left flex-col items-start pointer-events-none">
              <span className="text-xs md:text-sm font-heading font-bold uppercase tracking-widest text-brand-black/60 mb-0.5">
                Price
              </span>
              <p className="font-heading text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight">
                {t.price}
              </p>
            </motion.div>

            {/* Buttons (Bottom) */}
            <motion.div className="absolute top-[103%] left-1/2 -translate-x-1/2 mt-4 sm:mt-5 md:mt-6 flex items-center gap-2.5 sm:gap-4 pointer-events-auto">
              <Link
                href={`/product?flavor=${t.id}`}
                className="bg-brand-black text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-base hover:scale-105 transition-transform shadow-[3px_3px_0px_#A9D3F4] whitespace-nowrap inline-block"
              >
                Buy Now • {t.price}
              </Link>
              <button
                onClick={() => handleQuickAdd(t)}
                className="bg-white text-brand-black border-2 border-brand-black w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-sm md:text-base hover:bg-brand-black/5 shadow-[2px_2px_0px_#111111] transition-colors flex items-center justify-center group shrink-0 cursor-pointer"
                aria-label={`Add ${t.subtitle} to cart`}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
