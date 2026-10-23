"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import CartIcon from "@/components/CartIcon";
import ProfileMenu from "@/components/ProfileMenu";

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
      className="w-full z-50 px-4 sm:px-6 py-2.5 sm:py-3 md:px-12 flex items-center justify-between min-h-[96px] sm:min-h-[96px] md:min-h-[96px] bg-brand-blue"
    >
      {/* Brand Logo */}
      <Link href="/" className="flex items-center cursor-pointer group h-full py-1 sm:py-1.5 shrink-0">
        <Image
          src="/meowganics_logo_transparent.png"
          alt="Meow Ganics Logo"
          width={1776}
          height={725}
          className="w-[72vw] xs:w-[74vw] max-w-[315px] sm:max-w-none sm:w-auto h-auto max-h-[114px] xs:max-h-[126px] sm:max-h-[82px] md:max-h-[90px] object-contain object-left transition-transform duration-300 group-hover:scale-105 origin-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
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
      <div className="fixed top-6 right-3 z-50 flex items-center gap-0 rounded-full bg-brand-blue/90 backdrop-blur-sm px-1.5 py-0.5 md:static md:gap-5 md:bg-transparent md:backdrop-blur-none md:p-0 md:rounded-none">
        {/* Cat Symbol Profile Menu (Frameless) */}
        <ProfileMenu theme="frameless" />

        {/* Shopping Cart Button with Dynamic Item Count (Frameless) */}
        <button
          onClick={openCart}
          className="relative p-0 md:p-1 -ml-2.5 md:ml-0 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer text-brand-black"
          aria-label={`Open Cart with ${totalItems} items`}
        >
          {/* Doodle Style Cart Icon */}
          <CartIcon className="w-7 h-7 md:w-8 md:h-8 text-brand-black" />

          {/* Badge Counter */}
          <span className="absolute -top-1.5 -right-2 bg-brand-black text-brand-white text-[10px] md:text-xs font-heading font-black min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in">
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
          <div className="pt-3 border-t-2 border-brand-black/10 flex items-center justify-between">
            <span className="font-heading text-sm font-bold text-brand-black/80 flex items-center gap-1.5">
              <span>🐱</span>
              <span>VIP Cat Club: 480 🐾</span>
            </span>
            <span className="text-[11px] font-heading font-black bg-[#A9D3F4] px-2 py-0.5 rounded-full border border-brand-black">
              Active Member
            </span>
          </div>
        </div>
      )}
    </motion.header>
  );
}
