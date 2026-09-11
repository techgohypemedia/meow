"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-brand-black text-brand-white pt-16 sm:pt-20 pb-8 px-4 sm:px-8 md:px-12 border-t-[3px] border-brand-black relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] left-1/4 w-[40vw] h-[30vh] rounded-full bg-brand-blue/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-1/4 w-[35vw] h-[25vh] rounded-full bg-[#2B7A5D]/10 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 sm:pb-16 border-b border-white/10">
          
          {/* Brand Column (Col 1-5) */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-8">
            <Link href="/" className="inline-block group mb-4">
              <Image 
                src="/meowganics_logo_footer.png" 
                alt="MeowGanics Logo" 
                width={1776}
                height={725}
                className="h-11 sm:h-13 md:h-14 w-auto object-contain object-left group-hover:scale-105 transition-transform duration-300 origin-left drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                priority
              />
            </Link>

            <div className="inline-flex items-center gap-2 bg-white/10 text-[#D1F0E4] px-3 py-1 rounded-full border border-white/15 text-[11px] font-heading font-black tracking-wider uppercase mb-4">
              <span>🐾</span>
              <span>100% Organic & Flushable Tofu Cat Litter</span>
            </div>

            <p className="text-sm sm:text-base font-medium text-white/75 leading-relaxed max-w-sm mb-6">
              Making cats happy and the planet healthier, one flushable bowl of Clean Bean at a time. Pure plant-powered odor control.
            </p>

            {/* Social Links with SVG icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-blue hover:text-brand-black text-white border border-white/15 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-[2px_2px_0px_#111111]"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-blue hover:text-brand-black text-white border border-white/15 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-[2px_2px_0px_#111111]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-blue hover:text-brand-black text-white border border-white/15 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-[2px_2px_0px_#111111]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.28 6.28 0 0 0 1.95-4.52V8.06a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.95.51z"/>
                </svg>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-blue hover:text-brand-black text-white border border-white/15 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-[2px_2px_0px_#111111]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.822 0-2.55.279-2.55 2.502v1.478h4.484l-.587 3.667h-3.897v7.98H9.101z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links (Col 6-7) */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-heading font-black uppercase tracking-wider mb-4 text-brand-blue">
              Shop Clean
            </h3>
            <ul className="space-y-2.5 font-bold text-sm text-white/75">
              <li>
                <Link href="/product" className="hover:text-brand-blue transition-colors flex items-center gap-1.5">
                  Clean Bean Litter
                </Link>
              </li>
              <li>
                <Link href="/product?flavor=peach" className="hover:text-brand-blue transition-colors">
                  Peach Paradise
                </Link>
              </li>
              <li>
                <Link href="/product?flavor=green-tea" className="hover:text-brand-blue transition-colors">
                  Fresh Green Tea
                </Link>
              </li>
              <li>
                <Link href="/product#accessories" className="hover:text-brand-blue transition-colors">
                  The Zen Scoop
                </Link>
              </li>
              <li>
                <Link href="/product#accessories" className="hover:text-brand-blue transition-colors">
                  Cloud Trap Mat
                </Link>
              </li>
              <li>
                <Link href="/product#accessories" className="hover:text-brand-blue transition-colors text-brand-blue">
                  Subscribe & Save 15%
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn & Care (Col 8-9) */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-heading font-black uppercase tracking-wider mb-4 text-brand-blue">
              Care & Help
            </h3>
            <ul className="space-y-2.5 font-bold text-sm text-white/75">
              <li>
                <Link href="/product#details" className="hover:text-brand-blue transition-colors">
                  Why Tofu Litter?
                </Link>
              </li>
              <li>
                <Link href="/product#details" className="hover:text-brand-blue transition-colors">
                  How to Flush Safely
                </Link>
              </li>
              <li>
                <Link href="/product#details" className="hover:text-brand-blue transition-colors">
                  Transition Guide
                </Link>
              </li>
              <li>
                <Link href="/product#reviews" className="hover:text-brand-blue transition-colors">
                  Reviews (4.9★)
                </Link>
              </li>
              <li>
                <Link href="/product#details" className="hover:text-brand-blue transition-colors">
                  Vet FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column (Col 10-12) */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-heading font-black uppercase tracking-wider mb-2 text-brand-blue">
              Join the Meow Club
            </h3>
            <p className="text-xs sm:text-sm font-medium text-white/75 mb-4 leading-relaxed">
              Get <span className="text-brand-blue font-bold">10% off</span> your first order plus secret litter drops and cat wellness tips.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex bg-white/10 rounded-2xl border-2 border-white/20 p-1 focus-within:border-brand-blue transition-all">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-transparent text-white px-3.5 py-2 text-xs sm:text-sm font-bold outline-none placeholder:text-white/40"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-blue text-brand-black font-heading font-black text-xs rounded-xl hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer shadow-[2px_2px_0px_#111111]"
                >
                  Join →
                </button>
              </div>
              {subscribed && (
                <p className="text-xs font-heading font-bold text-[#D1F0E4] animate-in fade-in">
                  🎉 Welcome to the pack! Check your inbox for 10% off.
                </p>
              )}
              <p className="text-[10px] text-white/50 font-medium">
                Zero spam. Only fresh litter updates and cute cat tips.
              </p>
            </form>
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div className="py-6 border-b border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-white/70">
            <span className="text-base">🚽</span>
            <span>100% Flush & Septic Safe</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-white/70">
            <span className="text-base">✨</span>
            <span>99.9% Dust-Free Formula</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-white/70">
            <span className="text-base">🌿</span>
            <span>Food-Grade Soybean Fiber</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-white/70">
            <span className="text-base">🔒</span>
            <span>30-Day Odor-Lock Guarantee</span>
          </div>
        </div>
      </div>

      {/* Massive Faded Logo Text Title Watermark Behind Bottom Footer */}
      <div className="w-full overflow-hidden flex items-center justify-center pointer-events-none select-none relative -mb-3 sm:-mb-6 md:-mb-8 mt-6 sm:mt-10">
        <span className="font-heading font-black text-[14vw] sm:text-[15vw] md:text-[16vw] tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-transparent whitespace-nowrap">
          MEOWGANICS
        </span>
      </div>

      {/* Copyright & Legal Sub-Footer Bar */}
      <div className="relative z-10 max-w-7xl mx-auto pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-white/50 text-center sm:text-left">
        <p>© {new Date().getFullYear()} MeowGanics Inc. All rights reserved.</p>
        <div className="flex items-center gap-6 text-[11px] sm:text-xs">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link>
        </div>
      </div>
    </footer>
  );
}
