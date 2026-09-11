"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  theme?: "blue" | "light";
}

export default function Navbar({ theme = "blue" }: NavbarProps) {
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLight = theme === "light";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full z-50 px-6 py-3 md:px-12 flex items-center justify-between h-20 md:h-24 bg-brand-blue"
    >
      {/* Brand Logo */}
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

      {/* Center Nav Links (Desktop) */}
      <nav className="hidden md:flex items-center gap-8 bg-brand-white/80 backdrop-blur-md px-8 py-2.5 rounded-full border-[3px] border-brand-black shadow-[4px_4px_0px_#111111]">
        <Link
          href="/"
          className="font-heading font-bold text-base hover:text-brand-blue-dark transition-colors text-brand-black"
        >
          Home
        </Link>
        <Link
          href="/product"
          className="font-heading font-bold text-base hover:text-brand-blue-dark transition-colors text-brand-black"
        >
          Clean Bean Litter
        </Link>
        <Link
          href="/product#accessories"
          className="font-heading font-bold text-base hover:text-brand-blue-dark transition-colors text-brand-black/70 hover:text-brand-black"
        >
          Accessories
        </Link>
        <Link
          href="/product#reviews"
          className="font-heading font-bold text-base hover:text-brand-blue-dark transition-colors text-brand-black/70 hover:text-brand-black"
        >
          Reviews
        </Link>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Shopping Cart Button with Dynamic Item Count */}
        <button
          onClick={openCart}
          className="relative p-2 md:p-3 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer bg-brand-white rounded-2xl border-[3px] border-brand-black shadow-[3px_3px_0px_#111111]"
          aria-label={`Open Cart with ${totalItems} items`}
        >
          <svg
            className="w-7 h-7 md:w-8 md:h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>

          {/* Badge Counter */}
          <span className="absolute -top-2 -right-2 bg-brand-black text-brand-white text-[11px] md:text-xs font-heading font-black min-w-[22px] h-[22px] px-1 rounded-full flex items-center justify-center border-2 border-brand-white shadow-[1px_1px_0px_#111111] animate-in zoom-in">
            {totalItems}
          </span>
        </button>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col justify-center gap-1.5 p-2.5 bg-brand-white rounded-xl border-[3px] border-brand-black shadow-[2px_2px_0px_#111111] cursor-pointer"
          aria-label="Toggle menu"
        >
          <span className="w-6 h-[3px] bg-brand-black rounded-full"></span>
          <span className="w-6 h-[3px] bg-brand-black rounded-full"></span>
          <span className="w-4 h-[3px] bg-brand-black rounded-full self-end"></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-brand-white border-[3px] border-brand-black rounded-2xl p-6 shadow-[8px_8px_0px_#111111] flex flex-col gap-4 z-50 md:hidden animate-in fade-in slide-in-from-top-4">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="font-heading text-xl font-bold hover:text-brand-blue-dark py-1"
          >
            Home
          </Link>
          <Link
            href="/product"
            onClick={() => setMobileMenuOpen(false)}
            className="font-heading text-xl font-bold hover:text-brand-blue-dark py-1"
          >
            Clean Bean Tofu Litter
          </Link>
          <Link
            href="/product#accessories"
            onClick={() => setMobileMenuOpen(false)}
            className="font-heading text-xl font-bold hover:text-brand-blue-dark py-1"
          >
            Accessories
          </Link>
          <Link
            href="/product#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="font-heading text-xl font-bold hover:text-brand-blue-dark py-1"
          >
            Reviews & Guarantee
          </Link>
        </div>
      )}
    </motion.header>
  );
}
