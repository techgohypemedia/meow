"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import InteractiveCat from "../components/InteractiveCat";
import AnimatedProductBag from "../components/AnimatedProductBag";
import HeroScrollOverlay from "../components/HeroScrollOverlay";
import HorizontalScrollGallery from "../components/HorizontalScrollGallery";
import FAQs from "@/components/ui/text-reveal-faqs";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { scrollY } = useScroll();
  const { totalItems, openCart } = useCart();

  // Smoothly and swiftly fade out the cat, dust free badge, and white curve when scrolling starts
  const heroExitOpacity = useTransform(scrollY, [0, 150], [1, 0]);
  const heroExitY = useTransform(scrollY, [0, 150], [0, 40]);


  return (
    <div className="bg-brand-blue text-brand-black selection:bg-brand-black selection:text-brand-white font-sans">
      
      {/* Header - Non-sticky, scrolls away with the hero */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ opacity: heroExitOpacity }}
        className="absolute top-0 left-0 w-full z-50 px-4 sm:px-8 md:px-12 flex items-center justify-between h-20 md:h-24 pointer-events-auto bg-transparent"
      >
        <Link href="/" className="flex items-center cursor-pointer group h-full py-1 sm:py-1.5 shrink-0">
          <Image 
            src="/meowganics_logo_transparent.png" 
            alt="Meow Ganics Logo" 
            width={1776}
            height={725}
            className="h-full w-auto max-h-[74px] sm:max-h-[82px] md:max-h-[90px] object-contain object-left transition-transform duration-300 group-hover:scale-105 origin-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)]" 
            priority
          />
        </Link>
        
        <div className="flex items-center gap-3 md:gap-5">
          {/* Shopping Bag Icon with dynamic badge that opens side cart */}
          <button
            onClick={openCart}
            className="relative p-2 md:p-3 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer bg-brand-white text-brand-black rounded-full border-2 border-brand-black shadow-[2px_2px_0px_#111111]"
            aria-label="Open Cart"
          >
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
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
      </motion.nav>

      {/* Hero Wrapper - Tightened to 2650px to eliminate dead scroll space */}
      <div className="h-[2650px] relative w-full">
        <div className="sticky top-0 h-screen flex flex-col overflow-hidden w-full">
          <HeroScrollOverlay />

        {/* White Wave Curve Mask SVG (Background Hill at z-10) */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
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

        {/* Hero Interactive Cat (Sitting directly on top ridge of SVG curve at z-30) */}
        <div className="absolute inset-0 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 z-30 pointer-events-none overflow-visible flex items-end justify-end">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            style={{ opacity: heroExitOpacity, y: heroExitY }}
            className="w-1/2 flex justify-end items-end pb-[calc(24vh-6px)] sm:pb-[calc(25vh-6px)] md:pb-[calc(26vh-6px)] lg:pb-[calc(26.5vh-6px)] pointer-events-none pr-1 sm:pr-4 md:pr-10 lg:pr-16 xl:pr-20"
          >
            <div className="w-[260px] sm:w-[340px] md:w-[420px] lg:w-[520px] xl:w-[640px] 2xl:w-[740px] aspect-[16/9] relative pointer-events-auto hover:scale-105 transition-transform duration-300">
              <InteractiveCat />
            </div>
          </motion.div>
        </div>

        {/* Hero Product Bag Stage (Layered in front at z-40, centered in viewport) */}
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center pt-4 sm:pt-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="relative flex items-center justify-center pointer-events-auto"
          >
            <AnimatedProductBag />
          </motion.div>
        </div>

        </div>
      </div>

      {/* Horizontal Scroll Showcase Gallery (Oryzo Style) */}
      <HorizontalScrollGallery />

      {/* Marquee Section */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full bg-[#49675B] border-y-[3px] border-brand-black shadow-[0_6px_0px_#111111] py-3 md:py-4 overflow-hidden flex relative z-30 transform -translate-y-1"
      >
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
      </motion.div>

      {/* FAQs Section */}
      <section className="w-full bg-[#FAFDFE] border-y-[3px] border-brand-black relative z-30">
        <FAQs
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about Clean Bean 100% Organic Tofu Cat Litter."
          supportText="Have a question about your cat's setup or subscription?"
          supportLinkText="Chat with our feline care team"
          supportLinkHref="/product"
          items={[
            {
              id: "faq-1",
              question: "Is Clean Bean truly safe to flush down the toilet?",
              answer: "Yes! Clean Bean is made of 100% natural, water-soluble soybean fibers that dissolve within seconds when submerged in water. We recommend flushing 1-2 clumps at a time.",
            },
            {
              id: "faq-2",
              question: "How long does one 6L bag last for one cat?",
              answer: "One 6L bag typically lasts 3 to 4 weeks for a single average-sized adult cat when scooped daily and maintained at the recommended 2-3 inch depth.",
            },
            {
              id: "faq-3",
              question: "What if my cat accidentally tries to nibble on it?",
              answer: "Clean Bean is made exclusively from 100% food-grade soybean fiber, corn starch, and natural guar gum. If an inquisitive kitten swallows a pellet, it will digest safely without causing any gastrointestinal blockage.",
            },
            {
              id: "faq-4",
              question: "How does the 2-second rapid clumping work?",
              answer: "Our natural starch-lock matrix absorbs liquids immediately upon contact, forming solid, scoopable discs in under two seconds that won't crumble or stick to the litter tray.",
            },
            {
              id: "faq-5",
              question: "How do I transition my cat from clay or silica litter?",
              answer: "Mix 1/3 Clean Bean with 2/3 of your previous litter during Week 1. Move to a 50/50 mix in Week 2, and 100% Clean Bean by Week 3. Most cats adapt immediately thanks to the soft, gentle paw feel.",
            },
          ]}
        />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
