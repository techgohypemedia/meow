"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const { totalItems, openCart, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const price = 19.99;
  const totalPrice = price * quantity;

  const handleAddToCart = () => {
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 900);

    addToCart(
      {
        productId: "clean-bean-original",
        name: "Clean Bean Tofu Cat Litter - Original",
        flavor: {
          id: "original",
          name: "Original Unscented",
          color: "#A9D3F4",
          hueFilter: "hue-rotate(0deg)",
        },
        size: {
          id: "standard",
          name: "Standard Pack",
          volume: "6L / Single",
        },
        price: price,
        image: "/showcase/meow/IMG_7598.PNG",
        quantity: quantity,
      },
      true
    );
  };

  return (
    <div className="min-h-screen w-screen bg-[#111317] text-white flex flex-col justify-between overflow-x-hidden select-none relative">
      {/* Layer 1: Ambient Background Color Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] rounded-full blur-[180px] bg-[#A9D3F4]/25" />
      </div>

      {/* Layer 2: Global Header / Navbar */}
      <nav className="relative z-50 px-4 sm:px-8 md:px-12 flex items-center justify-between h-16 md:h-20 shrink-0">
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
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full font-heading font-bold text-xs md:text-sm bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15"
          >
            <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Experience</span>
          </Link>

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
        </div>
      </nav>

      {/* Layer 3: Main Product Showcase */}
      <main className="relative z-30 max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 px-4 sm:px-8 md:px-12 py-6 md:py-10 my-auto">
        
        {/* Left: Minimal Frosted Glass Product Details Card */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="w-full lg:w-[460px] xl:w-[500px] bg-white/10 hover:bg-white/[0.13] backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 md:p-9 shadow-[0_30px_70px_rgba(0,0,0,0.65)] flex flex-col justify-between shrink-0 relative overflow-hidden transition-all duration-300"
        >
          <div>
            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-heading font-black tracking-tight text-white mb-3 sm:mb-4 leading-tight drop-shadow-md">
              CLEAN BEAN
            </h1>

            {/* Product Description */}
            <p className="text-sm sm:text-base text-white/80 font-sans font-normal leading-relaxed mb-6">
              100% natural tofu cat litter made from food-grade soybean fiber. Fast clumping, 99.9% dust-free, and flushable.
            </p>
          </div>

          {/* Dashed line divider */}
          <div className="border-t border-dashed border-white/20 w-full my-3 sm:my-4" />

          {/* Quantity & Add to Cart Section */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col shrink-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                  Price
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-white tracking-tight">
                  ${price.toFixed(2)}
                </span>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center bg-white/10 border border-white/20 rounded-full h-11 sm:h-12 w-28 sm:w-32 justify-between px-1 backdrop-blur-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-full flex items-center justify-center hover:bg-white/15 rounded-full transition-colors font-bold text-lg text-white cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <div className="flex-1 text-center font-mono font-bold text-sm sm:text-base text-white">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-full flex items-center justify-center hover:bg-white/15 rounded-full transition-colors font-bold text-lg text-white cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add To Cart Primary Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 sm:py-4 px-6 rounded-full font-heading font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(255,255,255,0.22)] cursor-pointer ${
                addedAnimation
                  ? "bg-[#2B7A5D] text-white"
                  : "bg-white text-brand-black hover:bg-white/95"
              }`}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>
                {addedAnimation
                  ? "Added to Cart! 🐾"
                  : `Add to Cart • $${totalPrice.toFixed(2)}`}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Right: Centerpiece First Slide Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 35 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
          className="relative flex-1 flex items-center justify-center max-w-[340px] sm:max-w-[460px] lg:max-w-[560px] xl:max-w-[620px] aspect-[4/5] max-h-[62vh]"
        >
          {/* Ambient Image Backdrop glow */}
          <div className="absolute inset-0 bg-[#A9D3F4]/15 rounded-full blur-3xl scale-90 pointer-events-none" />

          <div className="relative w-full h-full animate-float drop-shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
            <Image
              src="/showcase/meow/IMG_7598.PNG"
              alt="Clean Bean Original Tofu Cat Litter"
              fill
              sizes="(max-width: 1024px) 380px, 620px"
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
      </main>

      {/* Layer 4: Footer Return Link */}
      <footer className="relative z-40 max-w-7xl mx-auto w-full pb-4 sm:pb-6 px-4 sm:px-8 md:px-12 flex items-center justify-start text-xs text-white/50">
        <Link
          href="/"
          className="hover:text-white transition-colors flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider"
        >
          <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Return Home</span>
        </Link>
      </footer>
    </div>
  );
}
