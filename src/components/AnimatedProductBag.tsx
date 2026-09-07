"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function AnimatedProductBag() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollY } = useScroll();
  
  // Global motion for the container
  const desktopX = useTransform(scrollY, [0, 500], ["0vw", "25vw"]);
  const mobileX = useTransform(scrollY, [0, 500], ["0vw", "0vw"]);
  const desktopY = useTransform(scrollY, [0, 500], ["0vh", "-18vh"]);
  const mobileY = useTransform(scrollY, [0, 500], ["0vh", "-12vh"]);
  const containerScale = useTransform(scrollY, [0, 500], [1, 0.95]);
  
  // Single continuous bag filter transition
  const bagFilter = useTransform(
    scrollY,
    [0, 500, 1000, 1500, 2000],
    ["hue-rotate(0deg)", "hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(180deg)", "hue-rotate(270deg)"]
  );

  // Text Opacities (Quick fade out/in to prevent overlapping text)
  const text1Opacity = useTransform(scrollY, [0, 400, 500, 650, 750], [0, 0, 1, 1, 0]);
  const text2Opacity = useTransform(scrollY, [750, 850, 1000, 1150, 1250], [0, 1, 1, 1, 0]);
  const text3Opacity = useTransform(scrollY, [1250, 1350, 1500, 1650, 1750], [0, 1, 1, 1, 0]);
  const text4Opacity = useTransform(scrollY, [1750, 1850, 2000], [0, 1, 1]);

  const commonClasses = "absolute inset-0 w-full h-full origin-center flex items-center justify-center";

  const texts = [
    {
      opacity: text1Opacity,
      title: "Pure Routine",
      subtitle: "Original Unscented",
      price: "$19.99",
      desc: "The classic, unscented tofu cat litter. 100% natural, incredibly absorbent, and completely flushable for a hassle-free routine.",
      color: "text-brand-blue-dark"
    },
    {
      opacity: text2Opacity,
      title: "Berry Fresh",
      subtitle: "Scented Tofu Litter",
      price: "$21.99",
      desc: "A subtle, sweet berry scent that neutralizes tough odors instantly. Perfect for multi-cat households.",
      color: "text-pink-600"
    },
    {
      opacity: text3Opacity,
      title: "Peach Paradise",
      subtitle: "Scented Tofu Litter",
      price: "$21.99",
      desc: "Infused with natural peach extracts for a sweet, refreshing scent that keeps your home smelling delightful all day.",
      color: "text-orange-600"
    },
    {
      opacity: text4Opacity,
      title: "Fresh Green Tea",
      subtitle: "Scented Tofu Litter",
      price: "$21.99",
      desc: "Superior odor control powered by natural green tea catechins. Clean, refreshing, and incredibly effective.",
      color: "text-emerald-600"
    }
  ];

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full h-full relative pointer-events-none">
      
      {/* Master Container */}
      <motion.div 
        style={{ 
          x: isMobile ? mobileX : desktopX, 
          y: isMobile ? mobileY : desktopY,
          scale: containerScale 
        }}
        className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[480px] xl:max-w-[540px] 2xl:max-w-[600px] aspect-[4/5] z-50 origin-center"
      >
        
        {/* SINGLE Continuous Bag Image */}
        <motion.div className="absolute inset-0 w-full h-full origin-center flex items-center justify-center pointer-events-none z-10" style={{ filter: bagFilter }}>
          <div className="animate-float drop-shadow-[0_20px_25px_rgba(0,0,0,0.2)] w-full">
            <Image src="/product-bag.png" alt="Product Bag" width={800} height={800} className="w-full h-auto object-contain" priority />
          </div>
        </motion.div>

        {/* Mapped Text Elements */}
        {texts.map((t, i) => (
          <motion.div key={i} style={{ opacity: t.opacity }} className={commonClasses + " z-20 pointer-events-auto"}>
            
            {/* Title (Top) */}
            <motion.div className="absolute bottom-[84%] left-1/2 -translate-x-1/2 mb-2 w-max text-center flex flex-col items-center pointer-events-none">
              <h1 className="font-outfit text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-brand-black leading-none tracking-tight">{t.title}</h1>
            </motion.div>

            {/* Description (Left) - Hidden on mobile, shown on desktop */}
            <motion.div className="hidden md:flex absolute right-[95%] top-1/2 -translate-y-1/2 mr-8 w-[260px] lg:w-[320px] xl:w-[360px] text-right flex-col items-end pointer-events-none">
              <p className="text-brand-black/75 text-sm md:text-base lg:text-lg xl:text-xl font-medium leading-relaxed">{t.desc}</p>
            </motion.div>

            {/* Price (Right) - Hidden on mobile, shown on desktop */}
            <motion.div className="hidden md:flex absolute left-[95%] top-1/2 -translate-y-1/2 ml-8 w-max text-left flex-col items-start pointer-events-none">
              <span className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-widest text-brand-black/50 mb-1">Price</span>
              <p className="font-outfit text-3xl md:text-4xl lg:text-5xl font-black text-brand-black tracking-tight">{t.price}</p>
            </motion.div>

            {/* Buttons (Bottom) */}
            <motion.div className="absolute top-[88%] left-1/2 -translate-x-1/2 mt-2 flex items-center gap-3 md:gap-4 pointer-events-auto">
              <button className="bg-brand-black text-white px-6 md:px-8 py-2.5 md:py-3.5 rounded-full font-bold text-sm md:text-base hover:scale-105 transition-transform shadow-xl whitespace-nowrap">
                Buy Now
              </button>
              <button className="bg-white text-brand-black border-2 border-brand-black w-12 h-12 md:w-14 md:h-14 rounded-full font-bold text-base md:text-lg hover:bg-brand-black/5 transition-colors flex items-center justify-center group shrink-0">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
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
