"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Repeat,
  Sparkles,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Heart,
  ShieldCheck,
  Check,
  UserCheck,
} from "lucide-react";
import CatProfileIcon from "@/components/CatProfileIcon";

interface ProfileMenuProps {
  theme?: "frameless" | "brutalist" | "glass-dark" | "glass-light";
  dropdownAlign?: "left" | "right";
  className?: string;
  iconClassName?: string;
}

interface CatProfile {
  id: string;
  name: string;
  breed: string;
  age: string;
  favoriteLitter: string;
  avatarColor: string;
}

const INITIAL_CATS: CatProfile[] = [
  {
    id: "cat-1",
    name: "Luna",
    breed: "Ragdoll",
    age: "2 yrs",
    favoriteLitter: "Original Tofu",
    avatarColor: "#A9D3F4",
  },
  {
    id: "cat-2",
    name: "Milo",
    breed: "Orange Tabby",
    age: "4 yrs",
    favoriteLitter: "Green Tea Fresh",
    avatarColor: "#FCE7C8",
  },
];

export default function ProfileMenu({
  theme = "frameless",
  dropdownAlign = "right",
  className = "",
  iconClassName = "w-7 h-7 md:w-8 md:h-8",
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [cats, setCats] = useState<CatProfile[]>(INITIAL_CATS);
  const [activeCatId, setActiveCatId] = useState<string>("cat-1");
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatBreed, setNewCatBreed] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: CatProfile = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      breed: newCatBreed.trim() || "Domestic Shorthair",
      age: "1 yr",
      favoriteLitter: "Original Tofu",
      avatarColor: "#D1F2D9",
    };

    setCats((prev) => [...prev, newCat]);
    setActiveCatId(newCat.id);
    setNewCatName("");
    setNewCatBreed("");
    setShowAddCatModal(false);
    showToast(`🐾 Added ${newCat.name} to your Fur Family!`);
  };

  const activeCat = cats.find((c) => c.id === activeCatId) || cats[0];

  // Theme-based button styles
  const isFrameless = theme === "frameless";
  const isBrutalist = theme === "brutalist";
  const isGlassDark = theme === "glass-dark";

  const buttonStyle = isFrameless
    ? "p-1.5 hover:scale-115 active:scale-95 transition-transform text-brand-black"
    : isBrutalist
    ? "bg-brand-white text-brand-black rounded-2xl border-[3px] border-brand-black shadow-[3px_3px_0px_#111111] hover:shadow-[1px_1px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px]"
    : isGlassDark
    ? "bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 backdrop-blur-md shadow-md"
    : "bg-white/90 hover:bg-white text-brand-black rounded-full border border-black/15 shadow-[0_4px_16px_rgba(0,0,0,0.14)]";

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* ── Cat Symbol Profile Trigger Button (Frameless / No circle container) ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Profile and Cat Lounge menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`relative transition-all flex items-center justify-center cursor-pointer select-none group ${buttonStyle}`}
      >
        {/* Cat Symbol Icon with wiggle on hover */}
        <motion.div
          whileHover={{ rotate: [-3, 4, -3, 0], scale: 1.08 }}
          transition={{ duration: 0.3 }}
          className="relative flex items-center justify-center"
        >
          <CatProfileIcon
            className={iconClassName}
          />
        </motion.div>
      </button>

      {/* ── Profile Dropdown Popover ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute ${
              dropdownAlign === "left" ? "left-0 sm:left-auto sm:right-auto" : "right-0"
            } top-full mt-3 z-50 w-[335px] xs:w-[365px] sm:w-[390px] max-w-[calc(100vw-1.5rem)] bg-[#FFFDF8] text-brand-black rounded-3xl border-[3.5px] border-brand-black shadow-[6px_6px_0px_#111111] overflow-hidden text-left`}
          >
            {/* ── Card Header (Cat Parent Info) ── */}
            <div className="p-4 sm:p-5 bg-[#A9D3F4] border-b-[3px] border-brand-black relative overflow-hidden">
              {/* Subtle background paw pattern */}
              <div className="absolute right-2 -bottom-2 text-white/30 text-7xl font-black select-none pointer-events-none">
                🐾
              </div>

              {isLoggedIn ? (
                <div className="relative z-10 flex items-start gap-3.5">
                  {/* Cat Avatar with 3D Border */}
                  <div className="relative shrink-0">
                    <div
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border-[2.5px] border-brand-black shadow-[2px_2px_0px_#111111] flex items-center justify-center text-2xl overflow-hidden"
                      style={{ backgroundColor: activeCat?.avatarColor || "#FFFFFF" }}
                    >
                      <CatProfileIcon className="w-10 h-10 text-brand-black" />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-brand-black text-[10px] font-heading font-black px-1 rounded-full border border-brand-black shadow-xs">
                      ★ VIP
                    </span>
                  </div>

                  {/* User & Active Cat Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading font-black text-base sm:text-lg text-brand-black truncate">
                        {activeCat?.name}&apos;s Human
                      </h4>
                      <span className="text-xs">🐱</span>
                    </div>
                    <p className="text-xs font-sans text-brand-black/75 truncate">
                      parent@meowganics.com
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-heading font-bold bg-white px-2 py-0.5 rounded-full border border-brand-black shadow-[1px_1px_0px_#111111]">
                        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                        480 Beans
                      </span>
                      <span className="text-[10px] font-heading font-bold text-brand-black/70">
                        Top Purr-former
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 text-center py-2">
                  <h4 className="font-heading font-black text-lg text-brand-black">
                    Join the Meow Club 🐾
                  </h4>
                  <p className="text-xs text-brand-black/80 mt-1 mb-3">
                    Sign in to track orders & earn free tofu litter bags!
                  </p>
                  <button
                    onClick={() => {
                      setIsLoggedIn(true);
                      showToast("🎉 Welcome back to Meowganics!");
                    }}
                    className="w-full py-2 bg-brand-black text-white rounded-xl font-heading font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer shadow-[2px_2px_0px_#FFFFFF]"
                  >
                    1-Click Demo Login
                  </button>
                </div>
              )}
            </div>

            {/* ── Fur Babies Switcher Tab (If Logged In) ── */}
            {isLoggedIn && (
              <div className="px-4 py-3 bg-[#FEF6E4] border-b-[2.5px] border-brand-black">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-heading font-black tracking-wider uppercase text-brand-black/75 flex items-center gap-1">
                    <span>Fur Family</span>
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  </span>
                  <button
                    onClick={() => setShowAddCatModal(true)}
                    className="text-[11px] font-heading font-bold text-brand-black hover:text-blue-600 flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Kitty
                  </button>
                </div>

                {/* Cat Chips List */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {cats.map((cat) => {
                    const isSelected = cat.id === activeCatId;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCatId(cat.id);
                          showToast(`Switched active profile to ${cat.name} 🐾`);
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "bg-white border-brand-black shadow-[2px_2px_0px_#111111] text-brand-black scale-102"
                            : "bg-white/60 border-brand-black/30 text-brand-black/70 hover:bg-white hover:border-brand-black"
                        }`}
                      >
                        <span className="text-sm">🐱</span>
                        <span>{cat.name}</span>
                        {isSelected && (
                          <Check className="w-3 h-3 text-emerald-600 stroke-3" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Modal for Adding Kitty ── */}
            {showAddCatModal && (
              <div className="p-4 bg-brand-white border-b-[2.5px] border-brand-black">
                <form onSubmit={handleAddCat} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-xs text-brand-black">
                      🐾 Add Your Fur Baby
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddCatModal(false)}
                      className="text-xs text-brand-black/60 hover:text-brand-black font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Cat Name (e.g. Mochi)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border-2 border-brand-black bg-white focus:outline-none focus:ring-2 focus:ring-[#A9D3F4]"
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Breed (e.g. Scottish Fold)"
                    value={newCatBreed}
                    onChange={(e) => setNewCatBreed(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border-2 border-brand-black bg-white focus:outline-none focus:ring-2 focus:ring-[#A9D3F4]"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-[#A9D3F4] text-brand-black rounded-xl font-heading font-black text-xs border-2 border-brand-black shadow-[2px_2px_0px_#111111] hover:scale-101 active:scale-98 cursor-pointer"
                  >
                    Save Kitty Profile
                  </button>
                </form>
              </div>
            )}

            {/* ── Main Profile Nav Links ── */}
            <div className="p-2.5 sm:p-3 space-y-1">
              {/* Order History */}
              <Link
                href="/product#orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F2F7FB] transition-colors group cursor-pointer border border-transparent hover:border-brand-black/15"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#A9D3F4]/50 border-2 border-brand-black flex items-center justify-center text-brand-black group-hover:scale-105 transition-transform">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-heading font-black text-xs sm:text-sm text-brand-black flex items-center gap-1.5">
                      <span>My Orders & Tracking</span>
                      <span className="text-[10px] font-heading font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded-full">
                        In Transit
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-black/60">
                      2x 10lb Tofu Litter • Arriving Oct 26
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-black/40 group-hover:text-brand-black group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Subscriptions */}
              <Link
                href="/product#subscriptions"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F2F7FB] transition-colors group cursor-pointer border border-transparent hover:border-brand-black/15"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 border-2 border-brand-black flex items-center justify-center text-brand-black group-hover:scale-105 transition-transform">
                    <Repeat className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-heading font-black text-xs sm:text-sm text-brand-black flex items-center gap-1.5">
                      <span>Auto-Ship Subscriptions</span>
                      <span className="text-[10px] font-heading font-bold bg-amber-200 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-full">
                        -20% Off
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-black/60">
                      Every 4 weeks • Next refill Nov 12
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-black/40 group-hover:text-brand-black group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Rewards */}
              <button
                onClick={() => {
                  showToast("✨ You have 480 points! 20 more to unlock Free Scoop!");
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F2F7FB] transition-colors group cursor-pointer border border-transparent hover:border-brand-black/15 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 border-2 border-brand-black flex items-center justify-center text-brand-black group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                  </div>
                  <div>
                    <div className="font-heading font-black text-xs sm:text-sm text-brand-black flex items-center gap-1.5">
                      <span>Bean Rewards & Gifts</span>
                    </div>
                    <p className="text-[11px] text-brand-black/60">
                      Redeem points for plush toys & scoops
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-black/40 group-hover:text-brand-black group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Account Settings */}
              <button
                onClick={() => {
                  showToast("⚙️ Account settings & addresses loaded.");
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F2F7FB] transition-colors group cursor-pointer border border-transparent hover:border-brand-black/15 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 border-2 border-brand-black flex items-center justify-center text-brand-black group-hover:scale-105 transition-transform">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-heading font-black text-xs sm:text-sm text-brand-black">
                      Delivery Addresses & Settings
                    </div>
                    <p className="text-[11px] text-brand-black/60">
                      Payment methods, notifications
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-black/40 group-hover:text-brand-black group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* ── Footer / Logout Action ── */}
            <div className="p-3 bg-[#F9F6EE] border-t-[2.5px] border-brand-black flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-heading font-bold text-brand-black/75">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Organic Guarantee</span>
              </div>

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    showToast("👋 Signed out. See you soon!");
                  }}
                  className="flex items-center gap-1 text-xs font-heading font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="flex items-center gap-1 text-xs font-heading font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
              )}
            </div>

            {/* ── Inline Feedback Toast ── */}
            {toastMessage && (
              <div className="bg-brand-black text-white px-3 py-2 text-center text-xs font-heading font-bold border-t border-brand-black flex items-center justify-center gap-1 animate-in fade-in slide-in-from-bottom-2">
                <span>{toastMessage}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
