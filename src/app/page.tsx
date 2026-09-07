"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import InteractiveCat from "../components/InteractiveCat";
import AnimatedProductBag from "../components/AnimatedProductBag";
import ScrollBlurOverlay from "../components/ScrollBlurOverlay";
import HeroScrollOverlay from "../components/HeroScrollOverlay";

export default function Home() {
  const { scrollY } = useScroll();

  // Smoothly and swiftly fade out the cat, dust free badge, and white curve when scrolling starts
  const heroExitOpacity = useTransform(scrollY, [0, 150], [1, 0]);
  const heroExitY = useTransform(scrollY, [0, 150], [0, 40]);

  return (
    <div className="bg-brand-blue text-brand-black selection:bg-brand-black selection:text-brand-white font-sans">
      
      {/* Hero Wrapper - 3000px for scrolljacking multiple bags */}
      <div className="h-[3000px] relative w-full">
        <div className="sticky top-0 h-screen flex flex-col overflow-hidden w-full">
          <HeroScrollOverlay />

        
        {/* Navigation */}
        <nav className="w-full z-50 px-6 py-2 md:px-12 md:py-4 flex items-center justify-between h-20 md:h-24">
          <div className="flex items-center gap-3 cursor-pointer group -my-12 md:-my-16">
            <div className="relative w-40 h-40 md:w-56 md:h-56 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2">
              <Image 
                src="/meowganics_logo_transparent.png" 
                alt="Meow Ganics Logo" 
                fill 
                className="object-contain object-left" 
                priority
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5">
            {/* Shopping Bag Icon with '0' badge */}
            <button className="relative p-2 md:p-3 hover:scale-110 transition-transform flex items-center justify-center cursor-pointer">
              <svg className="w-8 h-8 md:w-9 md:h-9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="absolute top-1 right-0 md:top-1.5 md:right-0.5 bg-brand-black text-brand-white text-[10px] md:text-xs font-heading font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-blue">
                0
              </span>
            </button>
            
            {/* Hamburger Menu */}
            <button className="flex flex-col justify-center gap-1.5 p-2.5 md:p-3 hover:bg-brand-black/10 rounded-xl transition-colors cursor-pointer">
              <span className="w-7 md:w-8 h-[3.5px] bg-brand-black rounded-full"></span>
              <span className="w-7 md:w-8 h-[3.5px] bg-brand-black rounded-full"></span>
              <span className="w-5 md:w-6 h-[3.5px] bg-brand-black rounded-full self-end"></span>
            </button>
          </div>
        </nav>

        {/* Hero Stage (End-to-end responsive layout anchored to curve features) */}
        <main className="flex-1 relative w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 z-40 pointer-events-none overflow-visible flex items-end justify-between">
          
          {/* Left Side: Product Bag Placement (Sitting on left curve) */}
          <div className="w-1/2 flex justify-start sm:justify-center items-end pb-[6vh] sm:pb-[7vh] md:pb-[8vh] pointer-events-none overflow-visible pl-2 sm:pl-6 md:pl-10">
            <div className="w-full max-w-[240px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[420px] xl:max-w-[500px] 2xl:max-w-[580px] overflow-visible">
              <AnimatedProductBag />
            </div>
          </div>
          
          {/* Right Side: Interactive Cat (Seated right on top of the curve crest) */}
          <motion.div 
            style={{ opacity: heroExitOpacity, y: heroExitY }}
            className="w-1/2 flex justify-end items-end pb-[23vh] sm:pb-[24vh] md:pb-[25vh] lg:pb-[25.5vh] pointer-events-none z-30 pr-2 sm:pr-6 md:pr-12 lg:pr-16 xl:pr-24"
          >
            <div className="w-[280px] sm:w-[360px] md:w-[440px] lg:w-[540px] xl:w-[660px] 2xl:w-[760px] aspect-[16/9] relative pointer-events-auto hover:scale-105 transition-transform duration-300">
              <InteractiveCat />
            </div>
          </motion.div>
        </main>

        {/* White Wave Curve Mask SVG (Scales synchronously with vh across all screens) */}
        <motion.div 
          style={{ opacity: heroExitOpacity }}
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

        </div>
      </div>

      {/* Marquee Section */}
      <div className="w-full bg-[#49675B] border-y-[3px] border-brand-black shadow-[0_6px_0px_#111111] py-3 md:py-4 overflow-hidden flex relative z-30 transform -translate-y-1">
        <div className="flex whitespace-nowrap animate-marquee w-fit">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center shrink-0 gap-6 md:gap-10 px-3 md:px-5 text-brand-white font-heading text-lg md:text-xl tracking-widest uppercase font-bold">
              <span>100% Biodegradable</span>
              <span>•</span>
              <span>Dust-Free Formula</span>
              <span>•</span>
              <span>Odor-Blocking Tech</span>
              <span>•</span>
              <span>Vet Approved</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </div>
      {/* Static Sections Removed */}

      {/* Footer */}
      <footer className="w-full bg-brand-black text-brand-white py-16 px-6 md:px-12 border-t-8 border-brand-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-4xl font-heading mb-6 tracking-tight">Meow<span className="text-brand-blue">Ganics</span></h2>
            <p className="text-lg font-bold opacity-80 mb-8 max-w-md">
              Making cats happy and the planet healthier, one bowl of Clean Bean at a time.
            </p>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-brand-white text-brand-black rounded-full border-2 border-brand-white flex items-center justify-center hover:bg-brand-blue hover:scale-110 transition-all cursor-pointer shadow-[2px_2px_0px_#A9D3F4]">
                In
              </div>
              <div className="w-12 h-12 bg-brand-white text-brand-black rounded-full border-2 border-brand-white flex items-center justify-center hover:bg-brand-blue hover:scale-110 transition-all cursor-pointer shadow-[2px_2px_0px_#A9D3F4]">
                Fb
              </div>
              <div className="w-12 h-12 bg-brand-white text-brand-black rounded-full border-2 border-brand-white flex items-center justify-center hover:bg-brand-blue hover:scale-110 transition-all cursor-pointer shadow-[2px_2px_0px_#A9D3F4]">
                Tw
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-heading mb-6 text-brand-blue">Shop</h3>
            <ul className="space-y-4 font-bold opacity-80">
              <li className="hover:text-brand-blue cursor-pointer transition-colors">All Products</li>
              <li className="hover:text-brand-blue cursor-pointer transition-colors">Clean Bean</li>
              <li className="hover:text-brand-blue cursor-pointer transition-colors">Subscriptions</li>
              <li className="hover:text-brand-blue cursor-pointer transition-colors">Gift Cards</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-heading mb-6 text-brand-blue">Stay in the Loop</h3>
            <p className="font-bold opacity-80 mb-4">Get 10% off your first order!</p>
            <div className="flex border-4 border-brand-white rounded-2xl overflow-hidden focus-within:border-brand-blue transition-colors">
              <input type="email" placeholder="Enter your email" className="w-full bg-brand-black text-brand-white px-4 py-3 outline-none font-bold placeholder:text-brand-white/50" />
              <button className="bg-brand-white text-brand-black px-4 py-3 font-bold hover:bg-brand-blue transition-colors">→</button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t-2 border-brand-white/20 text-center font-bold opacity-60">
          <p>© {new Date().getFullYear()} Meow Ganics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
