"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { PRODUCTS, getProductById, ProductFlavor, ProductSize } from "@/data/products";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

function ProductContent() {
  const searchParams = useSearchParams();
  const requestedFlavorId = searchParams.get("flavor");

  const product = getProductById("clean-bean");
  const { addToCart } = useCart();

  // Selected State
  const initialFlavor =
    product.flavors?.find((f) => f.id === requestedFlavorId) ||
    product.flavors?.[0] ||
    null;

  const [selectedFlavor, setSelectedFlavor] = useState<ProductFlavor | null>(
    initialFlavor
  );
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes.find((s) => s.popular) || product.sizes[0]
  );
  const [isSubscription, setIsSubscription] = useState(false);
  const [subFrequency, setSubFrequency] = useState("Every 4 Weeks");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients" | "usage" | "faq">("benefits");

  // Calculator State
  const [catCount, setCatCount] = useState(1);

  // Added notification feedback
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Price calculations
  const rawPrice = selectedSize.price;
  const unitPrice = isSubscription ? rawPrice * 0.85 : rawPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = (openDrawer: boolean = true) => {
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 800);

    addToCart(
      {
        productId: product.id,
        name: product.name,
        flavor: selectedFlavor
          ? {
              id: selectedFlavor.id,
              name: selectedFlavor.name,
              color: selectedFlavor.color,
              hueFilter: selectedFlavor.hueFilter,
            }
          : undefined,
        size: {
          id: selectedSize.id,
          name: selectedSize.name,
          volume: selectedSize.volume,
        },
        price: unitPrice,
        originalPrice: isSubscription ? rawPrice : selectedSize.originalPrice,
        image: product.image,
        quantity: quantity,
        isSubscription: isSubscription,
        subscriptionInterval: isSubscription ? subFrequency : undefined,
      },
      openDrawer
    );
  };

  const handleBuyNow = () => {
    handleAddToCart(true);
  };

  return (
    <div className="min-h-screen bg-brand-blue text-brand-black selection:bg-brand-black selection:text-brand-white font-sans overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-[#49675B] text-brand-white py-2 px-3 sm:px-4 text-center text-[11px] sm:text-xs md:text-sm font-heading font-bold tracking-wider uppercase border-b-2 border-brand-black">
        🎉 Free Express Shipping on orders over $45 • 30-Day Cat Happiness Guarantee 🐾
      </div>

      {/* Global Shared Navbar */}
      <Navbar theme="blue" />

      {/* Breadcrumbs */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-4 md:pt-6 pb-2 text-xs sm:text-sm font-bold text-brand-black/70 flex items-center gap-2 flex-wrap"
      >
        <Link href="/" className="hover:text-brand-black transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/product" className="hover:text-brand-black transition-colors">
          Cat Litter
        </Link>
        <span>/</span>
        <span className="text-brand-black font-black">{product.name}</span>
      </motion.div>

      {/* Main Product Showcase Section */}
      <main className="w-full overflow-x-hidden">
        <section className="w-full bg-brand-blue pb-12 sm:pb-16 pt-4 sm:pt-6 md:pt-8 px-4 sm:px-6 md:px-12 border-b-[3px] border-brand-black relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14">
            
            {/* Left Column: Product Visuals (col-span-6) */}
            <motion.div 
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-6 flex flex-col items-center lg:items-start w-full"
            >
              {/* Main Image Card with Dynamic Hue Filter */}
              <div className="w-full bg-brand-white rounded-3xl sm:rounded-[2.5rem] border-[3px] border-brand-black p-4 sm:p-6 md:p-8 pt-14 sm:pt-16 pb-12 sm:pb-14 shadow-[6px_6px_0px_#111111] md:shadow-[8px_8px_0px_#111111] hover:shadow-[12px_12px_0px_#111111] transition-all duration-300 aspect-[4/3] sm:aspect-square lg:aspect-[4/5] flex items-center justify-center relative overflow-hidden group">
                
                {/* Background Aura matching flavor color */}
                <div
                  className="absolute inset-0 opacity-25 transition-all duration-500 rounded-3xl sm:rounded-[2.5rem]"
                  style={{
                    backgroundColor: selectedFlavor?.color || "#A9D3F4",
                    filter: "blur(50px)",
                  }}
                />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-[#FFEDEA] text-brand-black font-heading font-bold text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-[2.5px] sm:border-[3px] border-brand-black transform -rotate-6 shadow-[2px_2px_0px_#111111] sm:shadow-[3px_3px_0px_#111111] z-20 flex items-center gap-1">
                  <span>🔥</span> {product.badge}
                </div>

                {selectedFlavor && (
                  <div
                    className="absolute top-3 right-3 sm:top-5 sm:right-5 font-heading font-bold text-[11px] sm:text-xs md:text-sm px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border-2 sm:border-[2.5px] border-brand-black shadow-[2px_2px_0px_#111111] z-20 text-brand-black"
                    style={{ backgroundColor: selectedFlavor.accentBg }}
                  >
                    ✨ {selectedFlavor.name}
                  </div>
                )}

                {/* Main Product Bag with Reactive Hue */}
                <motion.div
                  key={selectedFlavor?.id || "default"}
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ filter: selectedFlavor?.hueFilter || "none" }}
                  className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[500px] xl:max-w-[540px] h-full flex items-center justify-center relative z-10 py-2"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={900}
                    className="w-full h-full max-h-[320px] sm:max-h-[440px] lg:max-h-[500px] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.22)] group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </motion.div>

                {/* Micro Guarantee footer on image */}
                <div className="absolute bottom-2.5 sm:bottom-3 inset-x-3 sm:inset-x-6 text-center text-[10px] sm:text-xs font-heading font-bold text-brand-black/80 bg-brand-white/95 backdrop-blur-sm py-1.5 px-2 rounded-xl border border-brand-black/20 shadow-sm z-20">
                  🌱 100% Food-Grade Soybean Fiber • Zero Harmful Silica
                </div>
              </div>

              {/* Scent Selector Thumbnails Row */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3.5 mt-4 sm:mt-6 w-full">
                {product.flavors?.map((flv) => (
                  <button
                    key={flv.id}
                    onClick={() => setSelectedFlavor(flv)}
                    className={`rounded-2xl border-[2.5px] sm:border-[3px] p-2 transition-all relative overflow-hidden flex flex-col items-center justify-center cursor-pointer ${
                      selectedFlavor?.id === flv.id
                        ? "border-brand-black bg-brand-white shadow-[3px_3px_0px_#111111] sm:shadow-[4px_4px_0px_#111111] scale-105"
                        : "border-brand-black/30 bg-brand-white/60 hover:border-brand-black opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div
                      className="w-7 h-7 sm:w-10 sm:h-10 relative flex items-center justify-center"
                      style={{ filter: flv.hueFilter }}
                    >
                      <Image
                        src="/product-bag.png"
                        alt={flv.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-heading font-bold text-center leading-tight truncate w-full mt-1">
                      {flv.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Trust Badges Ribbon */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-6 sm:mt-8">
                <div className="bg-brand-white border-2 border-brand-black rounded-2xl p-2.5 sm:p-3 text-center shadow-[2px_2px_0px_#111111]">
                  <span className="text-lg sm:text-xl block mb-0.5">🚚</span>
                  <span className="font-heading text-[11px] sm:text-xs font-bold block">Fast 2-Day</span>
                  <span className="text-[9px] sm:text-[10px] text-brand-black/60 font-bold">Dispatch</span>
                </div>
                <div className="bg-brand-white border-2 border-brand-black rounded-2xl p-2.5 sm:p-3 text-center shadow-[2px_2px_0px_#111111]">
                  <span className="text-lg sm:text-xl block mb-0.5">🐾</span>
                  <span className="font-heading text-[11px] sm:text-xs font-bold block">30-Day Trial</span>
                  <span className="text-[9px] sm:text-[10px] text-brand-black/60 font-bold">100% Risk Free</span>
                </div>
                <div className="bg-brand-white border-2 border-brand-black rounded-2xl p-2.5 sm:p-3 text-center shadow-[2px_2px_0px_#111111]">
                  <span className="text-lg sm:text-xl block mb-0.5">🚽</span>
                  <span className="font-heading text-[11px] sm:text-xs font-bold block">Flush Safe</span>
                  <span className="text-[9px] sm:text-[10px] text-brand-black/60 font-bold">Septic Approved</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Customizer & Actions (col-span-6) */}
            <motion.div 
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="lg:col-span-6 flex flex-col justify-start"
            >
              
              {/* Reviews Summary */}
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="font-heading font-bold text-xs sm:text-sm text-brand-black">
                  4.9 / 5.0
                </span>
                <span className="text-brand-black/60 font-bold text-xs sm:text-sm">
                  ({product.reviewCount} Reviews)
                </span>
              </div>

              {/* Title & Tagline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] xl:text-5xl font-heading font-black text-brand-black mb-2 leading-tight tracking-tight whitespace-normal sm:whitespace-nowrap">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-bold text-brand-black/75 mb-5 leading-snug">
                {product.tagline}
              </p>

              {/* Dynamic Price Display */}
              <div className="flex items-baseline gap-2.5 sm:gap-3 mb-6 bg-brand-white border-[2.5px] border-brand-black p-3.5 sm:p-4 rounded-2xl w-fit shadow-[3px_3px_0px_#111111]">
                <span className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#2B7A5D]">
                  ${unitPrice.toFixed(2)}
                </span>
                {selectedSize.originalPrice && !isSubscription && (
                  <span className="text-sm sm:text-base line-through text-brand-black/40 font-bold">
                    ${selectedSize.originalPrice.toFixed(2)}
                  </span>
                )}
                {isSubscription && (
                  <span className="text-sm sm:text-base line-through text-brand-black/40 font-bold">
                    ${rawPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs sm:text-sm font-bold text-brand-black/70 font-sans">
                  / {selectedSize.name}
                </span>

                {isSubscription && (
                  <span className="bg-[#D1F0E4] text-[#059669] text-[10px] sm:text-xs font-heading font-black px-2 py-0.5 rounded-full border border-[#059669]">
                    15% OFF
                  </span>
                )}
              </div>

              {/* 1. SELECT FLAVOR / SCENT */}
              {product.flavors && (
                <div className="mb-5 sm:mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-heading font-bold text-sm sm:text-base text-brand-black">
                      1. Formula:{" "}
                      <span className="text-brand-black/80 font-sans text-xs sm:text-sm font-black ml-1">
                        {selectedFlavor?.name}
                      </span>
                    </label>
                    <span className="text-[11px] sm:text-xs font-bold text-brand-black/60">
                      {selectedFlavor?.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {product.flavors.map((flv) => {
                      const isSelected = selectedFlavor?.id === flv.id;
                      return (
                        <button
                          key={flv.id}
                          onClick={() => setSelectedFlavor(flv)}
                          className={`p-2.5 sm:p-3 rounded-2xl border-[2.5px] text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? "border-brand-black bg-brand-white shadow-[3px_3px_0px_#111111] -translate-y-0.5"
                              : "border-brand-black/30 bg-brand-white/70 hover:border-brand-black hover:bg-brand-white"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-brand-black shrink-0"
                              style={{ backgroundColor: flv.color }}
                            />
                            <span className="font-heading font-bold text-xs truncate">
                              {flv.name.split(" ")[0]}
                            </span>
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-brand-black/60 font-bold block truncate">
                            {flv.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedFlavor && (
                    <p className="text-[11px] sm:text-xs font-bold text-brand-black/75 mt-2 bg-brand-white/80 px-3 py-1.5 rounded-xl border border-brand-black/20">
                      💡 <strong>Note:</strong> {selectedFlavor.description}
                    </p>
                  )}
                </div>
              )}

              {/* 2. SELECT BUNDLE / SIZE */}
              <div className="mb-5 sm:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-heading font-bold text-sm sm:text-base text-brand-black">
                    2. Size & Pack
                  </label>
                  <span className="text-[11px] sm:text-xs font-bold text-[#059669]">
                    💡 2-Bag Duo covers 2 months!
                  </span>
                </div>

                <div className="space-y-2">
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize.id === sz.id;
                    return (
                      <button
                        key={sz.id}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-full p-3 sm:p-3.5 rounded-2xl border-[2.5px] sm:border-[3px] flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "border-brand-black bg-brand-white shadow-[3px_3px_0px_#111111] -translate-y-0.5"
                            : "border-brand-black/30 bg-brand-white/70 hover:border-brand-black hover:bg-brand-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div
                            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-brand-black flex items-center justify-center ${
                              isSelected ? "bg-brand-black" : "bg-brand-white"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-white" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <span className="font-heading font-bold text-sm sm:text-base text-brand-black">
                                {sz.name}
                              </span>
                              {sz.savingsBadge && (
                                <span className="bg-[#D1F0E4] text-[#059669] text-[9px] sm:text-[10px] font-heading font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-brand-black">
                                  {sz.savingsBadge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] sm:text-xs font-bold text-brand-black/60">
                              {sz.volume}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-heading font-bold text-base sm:text-lg text-brand-black">
                            ${sz.price.toFixed(2)}
                          </span>
                          {sz.originalPrice && (
                            <span className="text-[10px] sm:text-xs line-through text-brand-black/40 font-bold block">
                              ${sz.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. PURCHASE OPTIONS (One-time vs Subscription) */}
              <div className="mb-5 sm:mb-6 bg-brand-white rounded-2xl border-[2.5px] sm:border-[3px] border-brand-black p-3 sm:p-4 shadow-[3px_3px_0px_#111111] space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsSubscription(false)}
                    className={`py-2 px-2.5 sm:px-3 rounded-xl border-2 font-heading font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      !isSubscription
                        ? "bg-brand-black text-brand-white border-brand-black shadow-[2px_2px_0px_#A9D3F4]"
                        : "bg-[#F8F9FA] text-brand-black border-brand-black/30 hover:border-brand-black"
                    }`}
                  >
                    One-Time Purchase
                  </button>
                  <button
                    onClick={() => setIsSubscription(true)}
                    className={`py-2 px-2.5 sm:px-3 rounded-xl border-2 font-heading font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isSubscription
                        ? "bg-[#2B7A5D] text-brand-white border-brand-black shadow-[2px_2px_0px_#111111]"
                        : "bg-[#D1F0E4] text-[#2B7A5D] border-brand-black/30 hover:border-brand-black"
                    }`}
                  >
                    <span>🔄 Subscribe (-15%)</span>
                  </button>
                </div>

                {isSubscription && (
                  <div className="pt-2 border-t border-brand-black/10 flex items-center justify-between text-xs font-bold">
                    <span className="text-brand-black/70">Frequency:</span>
                    <select
                      value={subFrequency}
                      onChange={(e) => setSubFrequency(e.target.value)}
                      className="bg-[#F8F9FA] border-2 border-brand-black rounded-xl px-2.5 py-1 font-heading font-bold text-xs outline-none cursor-pointer"
                    >
                      <option value="Every 3 Weeks">Every 3 Weeks</option>
                      <option value="Every 4 Weeks">Every 4 Weeks (Best)</option>
                      <option value="Every 6 Weeks">Every 6 Weeks</option>
                      <option value="Every 8 Weeks">Every 8 Weeks</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 4. QUANTITY & ADD TO CART ACTIONS (Side-by-Side Row) */}
              <div className="flex flex-row items-center gap-2.5 sm:gap-3.5 p-2.5 sm:p-3.5 bg-brand-white rounded-2xl border-[2.5px] sm:border-[3px] border-brand-black shadow-[4px_4px_0px_#111111] mb-4">
                {/* Quantity Counter */}
                <div className="flex items-center bg-[#F8F9FA] border-2 sm:border-[3px] border-brand-black rounded-full h-12 sm:h-14 w-28 sm:w-36 shrink-0 shadow-[2px_2px_0px_#111111] justify-between">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 sm:w-11 h-full flex items-center justify-center hover:bg-black/10 rounded-l-full transition-colors font-bold text-lg sm:text-2xl cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center font-heading font-bold text-base sm:text-xl text-brand-black">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 sm:w-11 h-full flex items-center justify-center hover:bg-black/10 rounded-r-full transition-colors font-bold text-lg sm:text-2xl cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add To Cart Primary Button */}
                <button
                  onClick={() => handleAddToCart(true)}
                  className={`flex-1 min-w-0 bg-brand-black text-brand-white h-12 sm:h-14 rounded-full font-heading text-xs sm:text-base md:text-lg px-2 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 border-2 sm:border-[3px] border-brand-black shadow-[3px_3px_0px_#A9D3F4] hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:shadow-[5px_5px_0px_#A9D3F4] active:translate-y-0 transition-all cursor-pointer whitespace-nowrap ${
                    addedAnimation ? "bg-[#2B7A5D]" : ""
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
                  <span className="truncate">
                    {addedAnimation ? "Added! 🐱" : `Add to Cart • $${totalPrice.toFixed(2)}`}
                  </span>
                </button>
              </div>

              {/* Fast Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="w-full h-12 sm:h-13 bg-[#FFB5A7] hover:bg-[#ffa291] text-brand-black font-heading text-sm sm:text-base rounded-2xl sm:rounded-full border-[2.5px] sm:border-[3px] border-brand-black shadow-[3px_3px_0px_#111111] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111111] active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer font-bold mb-3"
              >
                <span>⚡ Buy Now with 1-Click</span>
              </button>

              {/* Guarantee notice */}
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-brand-black/70 justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>In Stock • 30-Day Money-Back Guarantee</span>
              </div>

            </motion.div>
          </div>
        </section>

        {/* INTERACTIVE LITTER CALCULATOR SECTION */}
        <section className="w-full py-12 sm:py-16 px-4 sm:px-6 md:px-12 bg-[#D1F0E4] border-b-[3px] border-brand-black relative">
          <motion.div 
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-5xl mx-auto bg-brand-white border-[2.5px] sm:border-[3px] border-brand-black rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-[6px_6px_0px_#111111]"
          >
            <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
              <span className="bg-[#FFEDEA] text-brand-black font-heading font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full border-2 border-brand-black uppercase tracking-wider mb-2 inline-block">
                Interactive Tool
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-brand-black tracking-tight">
                How Much Clean Bean Do You Need?
              </h2>
              <p className="text-brand-black/70 font-bold text-xs sm:text-sm md:text-base mt-1.5">
                Select your cat family size to calculate your ideal monthly subscription.
              </p>
            </div>

            {/* Cat Selector Tabs */}
            <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
              {[
                { count: 1, label: "1 Cat", icon: "🐱" },
                { count: 2, label: "2 Cats", icon: "🐱🐱" },
                { count: 3, label: "3+ Cats", icon: "🐾🐾" },
              ].map((item) => (
                <button
                  key={item.count}
                  onClick={() => setCatCount(item.count)}
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border-2 sm:border-[3px] font-heading font-bold text-xs sm:text-base transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                    catCount === item.count
                      ? "bg-brand-black text-brand-white border-brand-black shadow-[3px_3px_0px_#A9D3F4] -translate-y-0.5"
                      : "bg-[#F8F9FA] text-brand-black border-brand-black/30 hover:border-brand-black"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Calculation Results Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 bg-[#EBF4FC] border-2 sm:border-[3px] border-brand-black rounded-2xl p-4 sm:p-6 text-center shadow-[3px_3px_0px_#111111]">
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-xs font-bold text-brand-black/60 uppercase tracking-wider mb-1">
                  Recommended Quantity
                </span>
                <span className="font-heading text-2xl sm:text-3xl font-black text-brand-black">
                  {catCount === 1 ? "1 × 6L Bag" : catCount === 2 ? "2 × 6L Bags" : "3 × 6L Bags"}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-brand-black/70 mt-1">
                  lasts 4 full weeks
                </span>
              </div>

              <div className="flex flex-col items-center border-y-2 sm:border-y-0 sm:border-x-2 border-brand-black/20 py-3 sm:py-0">
                <span className="text-[10px] sm:text-xs font-bold text-brand-black/60 uppercase tracking-wider mb-1">
                  Estimated Monthly Cost
                </span>
                <span className="font-heading text-2xl sm:text-3xl font-black text-[#2B7A5D]">
                  ${(catCount === 1 ? 16.99 : catCount === 2 ? 30.59 : 42.49).toFixed(2)}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#059669] mt-1">
                  with Subscribe & Save 15%
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-xs font-bold text-brand-black/60 uppercase tracking-wider mb-1">
                  Clay Dust Avoided
                </span>
                <span className="font-heading text-2xl sm:text-3xl font-black text-brand-black">
                  {catCount * 14} lbs / yr
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-brand-black/70 mt-1">
                  clean lungs for your pet
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* THE NITTY GRITTY (Tabs & Detailed Breakdown) */}
        <section id="details" className="w-full py-12 sm:py-20 px-4 sm:px-6 md:px-12 bg-[#F8F9FA] border-b-[3px] border-brand-black relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center max-w-2xl mx-auto mb-8 sm:mb-12"
            >
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-brand-black tracking-tight mb-2 sm:mb-4">
                The Nitty Gritty
              </h2>
              <p className="text-sm sm:text-base md:text-lg font-bold text-brand-black/70">
                Everything you need to know about why Clean Bean is superior to clay and silica litters.
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-10"
            >
              {[
                { id: "benefits", label: "Key Benefits", icon: "✨" },
                { id: "ingredients", label: "Ingredients", icon: "🌱" },
                { id: "usage", label: "How to Use & Flush", icon: "🚽" },
                { id: "faq", label: "FAQ", icon: "❓" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 sm:border-[3px] font-heading font-bold text-xs sm:text-sm md:text-base transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-brand-black text-brand-white border-brand-black shadow-[3px_3px_0px_#A9D3F4] -translate-y-0.5"
                      : "bg-brand-white text-brand-black border-brand-black hover:bg-[#EBF4FC]"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </motion.div>

            {/* Tab Content Panels */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-brand-white border-[2.5px] sm:border-[3px] border-brand-black rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-[6px_6px_0px_#111111]"
            >
              <AnimatePresence mode="wait">
                {/* 1. Benefits */}
                {activeTab === "benefits" && (
                  <motion.div 
                    key="benefits"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8"
                  >
                    {product.benefits.map((b, idx) => (
                      <div
                        key={idx}
                        className="bg-[#EBF4FC] border-2 border-brand-black rounded-2xl p-4 sm:p-6 shadow-[2px_2px_0px_#111111] sm:shadow-[3px_3px_0px_#111111] flex gap-3 sm:gap-4"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-white border-2 border-brand-black flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-[2px_2px_0px_#111111]">
                          {b.icon}
                        </div>
                        <div>
                          <h4 className="font-heading text-lg sm:text-xl font-bold text-brand-black mb-1">
                            {b.title}
                          </h4>
                          <p className="text-xs sm:text-sm font-bold text-brand-black/75 leading-relaxed">
                            {b.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* 2. Ingredients */}
                {activeTab === "ingredients" && (
                  <motion.div
                    key="ingredients"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-xs sm:text-sm md:text-base font-bold text-brand-black/80 mb-4 sm:mb-6 max-w-2xl">
                      We believe in radical transparency. Every single component of Clean Bean is organic, edible-grade, and free from artificial dyes or silica dust.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[340px]">
                        <thead>
                          <tr className="border-b-2 border-brand-black text-[10px] sm:text-xs font-heading font-bold uppercase tracking-wider text-brand-black/60">
                            <th className="py-2.5 px-3 sm:px-4">Ingredient</th>
                            <th className="py-2.5 px-3 sm:px-4">Share</th>
                            <th className="py-2.5 px-3 sm:px-4">Function</th>
                          </tr>
                        </thead>
                        <tbody className="font-bold text-xs sm:text-sm divide-y divide-brand-black/10">
                          {product.ingredients.map((ing, i) => (
                            <tr key={i} className="hover:bg-[#F8F9FA]">
                              <td className="py-3 px-3 sm:px-4 font-heading text-sm sm:text-base text-brand-black">
                                {ing.name}
                              </td>
                              <td className="py-3 px-3 sm:px-4 text-[#2B7A5D]">
                                {ing.percentage}
                              </td>
                              <td className="py-3 px-3 sm:px-4 text-brand-black/70 text-xs sm:text-sm">
                                {ing.purpose}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* 3. Usage & Flushing */}
                {activeTab === "usage" && (
                  <motion.div 
                    key="usage"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                  >
                    {product.usageSteps.map((step) => (
                      <div
                        key={step.step}
                        className="bg-[#FFEDEA] border-2 border-brand-black rounded-2xl p-4 sm:p-6 shadow-[2px_2px_0px_#111111] flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-black text-brand-white font-heading font-black text-sm sm:text-lg flex items-center justify-center mb-3 sm:mb-4 shadow-[2px_2px_0px_#A9D3F4]">
                            {step.step}
                          </div>
                          <h4 className="font-heading text-lg sm:text-xl font-bold text-brand-black mb-1.5 sm:mb-2">
                            {step.title}
                          </h4>
                          <p className="text-xs font-bold text-brand-black/75 leading-relaxed">
                            {step.instruction}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* 4. FAQ */}
                {activeTab === "faq" && (
                  <motion.div 
                    key="faq"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3 sm:space-y-4"
                  >
                    {product.faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="bg-[#F8F9FA] border-2 border-brand-black rounded-2xl p-4 sm:p-6 shadow-[2px_2px_0px_#111111]"
                      >
                        <h4 className="font-heading text-base sm:text-lg font-bold text-brand-black mb-1.5 flex items-center gap-2">
                          <span className="text-[#059669]">Q:</span> {faq.question}
                        </h4>
                        <p className="text-xs sm:text-sm font-bold text-brand-black/75 leading-relaxed pl-5 sm:pl-6">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ACCESSORIES CROSS-SELL SECTION */}
        <section id="accessories" className="w-full py-12 sm:py-20 px-4 sm:px-6 md:px-12 bg-brand-blue border-b-[3px] border-brand-black overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 sm:mb-12 gap-2 sm:gap-4"
            >
              <div>
                <span className="bg-[#FFEDEA] text-brand-black font-heading font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full border-2 border-brand-black uppercase tracking-wider mb-2 inline-block">
                  Complete Routine
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-brand-black tracking-tight">
                  Pairs Purr-fectly With
                </h2>
                <p className="text-sm sm:text-base md:text-lg font-bold text-brand-black/70 mt-1">
                  Engineered accessories designed specifically for Clean Bean pellets.
                </p>
              </div>
            </motion.div>

            <div 
              className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none -mx-4 px-4 sm:mx-0 sm:px-0 pt-2 pb-5 sm:pb-0 no-scrollbar touch-pan-x"
            >
              {PRODUCTS.filter((p) => p.id !== "clean-bean").map((acc, idx) => (
                <motion.div
                  key={acc.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: idx * 0.1, ease: "easeOut" }}
                  className="w-[82vw] max-w-[320px] sm:w-auto shrink-0 snap-center bg-brand-white border-[2.5px] sm:border-[3px] border-brand-black rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-6 shadow-[5px_5px_0px_#111111] sm:shadow-[8px_8px_0px_#111111] hover:shadow-[12px_12px_0px_#111111] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Card */}
                    <div className="bg-[#D1F0E4] rounded-2xl sm:rounded-3xl aspect-[4/3] mb-4 sm:mb-6 border-2 sm:border-[3px] border-brand-black flex items-center justify-center relative overflow-hidden p-4 sm:p-6 group">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand-white border-2 border-brand-black flex items-center justify-center text-4xl sm:text-5xl shadow-[3px_3px_0px_#111111] group-hover:scale-110 transition-transform">
                        {acc.id === "zen-scoop"
                          ? "🥄"
                          : acc.id === "cloud-mat"
                          ? "☁️"
                          : "🌿"}
                      </div>
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-brand-white text-brand-black text-[10px] sm:text-xs font-heading font-bold px-2.5 sm:px-3 py-1 rounded-full border-2 border-brand-black shadow-[2px_2px_0px_#111111]">
                        {acc.badge}
                      </div>
                    </div>

                    <h3 className="font-heading text-xl sm:text-2xl text-brand-black mb-1">
                      {acc.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-brand-black/75 mb-4 leading-relaxed">
                      {acc.description}
                    </p>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t-2 border-brand-black/10 flex items-center justify-between">
                    <span className="font-heading text-xl sm:text-2xl font-black text-brand-black">
                      ${acc.basePrice.toFixed(2)}
                    </span>
                    <button
                      onClick={() =>
                        addToCart({
                          productId: acc.id,
                          name: acc.name,
                          size: acc.sizes[0],
                          price: acc.basePrice,
                          image: acc.image,
                          quantity: 1,
                        }, true)
                      }
                      className="bg-brand-black text-brand-white font-heading text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border-2 border-brand-black shadow-[2px_2px_0px_#A9D3F4] sm:shadow-[3px_3px_0px_#A9D3F4] hover:-translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>+ Add to Cart</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Swipe Hint */}
            <div className="flex sm:hidden items-center justify-center gap-2 mt-2">
              <span className="text-[11px] font-heading font-bold text-brand-black/70 flex items-center gap-1.5 bg-brand-white/80 px-3.5 py-1.5 rounded-full border-2 border-brand-black/15 shadow-[2px_2px_0px_rgba(0,0,0,0.06)]">
                <span>👈 Swipe to explore accessories 👉</span>
              </span>
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS SECTION WITH STAGGER TESTIMONIALS */}
        <section id="reviews" className="w-full py-12 sm:py-20 px-4 sm:px-6 md:px-12 bg-[#F8F9FA] border-b-[3px] border-brand-black">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center max-w-2xl mx-auto mb-8 sm:mb-12"
            >
              <span className="bg-[#D1F0E4] text-brand-black font-heading font-bold text-[10px] sm:text-xs px-3.5 py-1.5 rounded-full border-2 border-brand-black uppercase tracking-wider mb-3 inline-block shadow-[2px_2px_0px_#111111]">
                🐾 Real Verified Cat Parents
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-brand-black tracking-tight mb-2 sm:mb-3">
                Loved by 1,200+ Cats & Parents
              </h2>
              <p className="text-sm sm:text-base md:text-lg font-bold text-brand-black/70">
                Tap or swipe the cards to explore why thousands of cat parents made the switch.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
              className="max-w-5xl mx-auto"
            >
              <StaggerTestimonials />
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-brand-black text-brand-white py-12 sm:py-16 px-4 sm:px-6 md:px-12 border-t-8 border-brand-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl sm:text-4xl font-heading mb-3 sm:mb-4 tracking-tight">
              Meow<span className="text-brand-blue">Ganics</span>
            </h2>
            <p className="text-sm sm:text-base font-bold opacity-80 mb-6 sm:mb-8 max-w-md">
              Making cats happy and the planet healthier, one flushable bowl of Clean Bean at a time.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-white text-brand-black rounded-full border-2 border-brand-white flex items-center justify-center hover:bg-brand-blue hover:scale-110 transition-all cursor-pointer shadow-[2px_2px_0px_#A9D3F4]">
                In
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-white text-brand-black rounded-full border-2 border-brand-white flex items-center justify-center hover:bg-brand-blue hover:scale-110 transition-all cursor-pointer shadow-[2px_2px_0px_#A9D3F4]">
                Fb
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-white text-brand-black rounded-full border-2 border-brand-white flex items-center justify-center hover:bg-brand-blue hover:scale-110 transition-all cursor-pointer shadow-[2px_2px_0px_#A9D3F4]">
                Tw
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-heading mb-3 sm:mb-4 text-brand-blue">Products</h3>
            <ul className="space-y-2.5 sm:space-y-3 font-bold opacity-80 text-xs sm:text-sm">
              <li>
                <Link href="/product" className="hover:text-brand-blue transition-colors">
                  Clean Bean Litter
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
                <Link href="/product#accessories" className="hover:text-brand-blue transition-colors">
                  Catnip Mist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-heading mb-3 sm:mb-4 text-brand-blue">Stay in the Loop</h3>
            <p className="font-bold opacity-80 mb-3 sm:mb-4 text-xs sm:text-sm">Get 10% off your first order!</p>
            <div className="flex border-2 border-brand-white rounded-2xl overflow-hidden focus-within:border-brand-blue transition-colors">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-brand-black text-brand-white px-3 py-2 sm:py-2.5 outline-none font-bold text-xs sm:text-sm placeholder:text-brand-white/50"
              />
              <button className="bg-brand-white text-brand-black px-3.5 sm:px-4 py-2 sm:py-2.5 font-bold hover:bg-brand-blue transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 sm:mt-12 pt-6 border-t border-brand-white/20 text-center font-bold opacity-60 text-[10px] sm:text-xs">
          <p>© {new Date().getFullYear()} MeowGanics Inc. Purely feline, planet approved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-blue flex items-center justify-center font-heading text-2xl">Loading MeowGanics...</div>}>
      <ProductContent />
    </Suspense>
  );
}
