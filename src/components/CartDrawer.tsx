"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    totalItems,
    subtotal,
    shipping,
    finalTotal,
    freeShippingThreshold,
    freeShippingRemaining,
    updateQuantity,
    removeFromCart,
    addToCart,
  } = useCart();

  const progressPercent = Math.min(
    100,
    ((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100
  );

  // Quick add upsell suggestions (accessories not currently in cart)
  const upsellItems = PRODUCTS.filter(
    (p) => p.category === "accessory" || p.category === "care"
  ).slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-out Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
            <motion.div
              data-lenis-prevent
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-md md:max-w-lg bg-[#F8F9FA] text-brand-black border-l-[4px] border-brand-black shadow-2xl flex flex-col pointer-events-auto relative h-full max-h-screen"
            >
              {/* Header */}
              <div className="px-6 py-4 md:py-5 bg-[#EBF4FC] border-b-[3px] border-brand-black flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-white border-[3px] border-brand-black flex items-center justify-center shadow-[2px_2px_0px_#111111]">
                    <span className="text-xl">🐱</span>
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-bold tracking-tight text-brand-black">
                      Your Cart
                    </h2>
                    <span className="text-xs font-bold text-brand-black/60 uppercase tracking-wider">
                      {totalItems} {totalItems === 1 ? "item" : "items"} selected
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="w-10 h-10 rounded-full bg-brand-white border-[3px] border-brand-black flex items-center justify-center hover:bg-brand-black hover:text-brand-white transition-all shadow-[2px_2px_0px_#111111] hover:rotate-90 cursor-pointer"
                  aria-label="Close cart"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="bg-[#D1F0E4] border-b-[3px] border-brand-black px-6 py-3 shrink-0">
                <div className="flex items-center justify-between text-xs font-bold font-heading mb-1 text-brand-black">
                  {freeShippingRemaining > 0 ? (
                    <span>
                      Add <span className="text-[#059669] font-black">${freeShippingRemaining.toFixed(2)}</span> more for <strong className="uppercase">Free Shipping</strong>!
                    </span>
                  ) : (
                    <span className="text-[#059669] font-black flex items-center gap-1">
                      🎉 You unlocked FREE standard shipping!
                    </span>
                  )}
                  <span>{progressPercent.toFixed(0)}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-brand-white h-3 rounded-full border-2 border-brand-black overflow-hidden p-[1px] shadow-[1px_1px_0px_#111111]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-[#2B7A5D] rounded-full"
                  />
                </div>
              </div>

              {/* Cart Content (Scrollable Container with data-lenis-prevent) */}
              <div
                data-lenis-prevent
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain touch-pan-y"
              >
                {cart.length === 0 ? (
                  /* Empty State */
                  <div className="py-16 text-center flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#FFEDEA] border-[3px] border-brand-black flex items-center justify-center shadow-[6px_6px_0px_#111111] mb-5 animate-bounce">
                      <span className="text-4xl">🥣</span>
                    </div>
                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-brand-black mb-2">
                      Your bowl is empty!
                    </h3>
                    <p className="text-brand-black/70 font-bold max-w-xs mb-6 text-sm leading-relaxed">
                      Treat your feline bestie to 99% dust-free, flushable organic tofu bliss.
                    </p>
                    <button
                      onClick={closeCart}
                      className="bg-brand-black text-brand-white font-heading text-base px-6 py-3 rounded-full border-[3px] border-brand-black shadow-[4px_4px_0px_#A9D3F4] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#A9D3F4] transition-all cursor-pointer"
                    >
                      <Link href="/product">Explore Products →</Link>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Item list */}
                    <div className="space-y-3.5">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="bg-brand-white border-[3px] border-brand-black rounded-2xl p-3.5 sm:p-4 shadow-[4px_4px_0px_#111111] flex gap-3 sm:gap-4 items-center relative group"
                        >
                          {/* Image preview with filter */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#EBF4FC] rounded-xl border-2 border-brand-black p-1 flex items-center justify-center relative overflow-hidden shrink-0">
                            <div
                              className="w-full h-full relative flex items-center justify-center"
                              style={{ filter: item.flavor?.hueFilter || "none" }}
                            >
                              <Image
                                src={item.image || "/product-bag.png"}
                                alt={item.name}
                                fill
                                className="object-contain p-0.5"
                              />
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1.5">
                              <h4 className="font-heading font-bold text-sm sm:text-base text-brand-black leading-snug truncate">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-brand-black/40 hover:text-red-600 transition-colors p-1 cursor-pointer"
                                title="Remove item"
                                aria-label="Remove item"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>

                            {/* Tags & Variants */}
                            <div className="flex flex-wrap gap-1 my-1">
                              {item.flavor && (
                                <span
                                  className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border border-brand-black"
                                  style={{ backgroundColor: item.flavor.color + "33" }}
                                >
                                  {item.flavor.name}
                                </span>
                              )}
                              <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F8F9FA] border border-brand-black/40 text-brand-black/80">
                                {item.size.name}
                              </span>
                              {item.isSubscription && (
                                <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#D1F0E4] border border-[#2B7A5D] text-[#2B7A5D]">
                                  🔄 {item.subscriptionInterval || "Subscription"} (-15%)
                                </span>
                              )}
                            </div>

                            {/* Price & Quantity Controls */}
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-brand-black/10">
                              <span className="font-heading font-bold text-base sm:text-lg text-brand-black">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>

                              <div className="flex items-center bg-[#F8F9FA] border-2 border-brand-black rounded-full h-7 sm:h-8 shadow-[2px_2px_0px_#111111]">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="w-6 sm:w-7 h-full flex items-center justify-center hover:bg-black/10 rounded-l-full font-bold text-sm sm:text-base transition-colors cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="w-6 sm:w-7 text-center font-heading font-bold text-xs text-brand-black">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="w-6 sm:w-7 h-full flex items-center justify-center hover:bg-black/10 rounded-r-full font-bold text-sm sm:text-base transition-colors cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Upsell Add-ons */}
                    <div className="pt-2">
                      <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-black/60 mb-2">
                        Purr-fect Add-ons
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {upsellItems.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-[#FFEDEA] border-2 border-brand-black rounded-xl p-2.5 shadow-[2px_2px_0px_#111111] flex flex-col justify-between"
                          >
                            <div>
                              <span className="font-heading text-xs font-bold block truncate">
                                {prod.name}
                              </span>
                              <span className="text-xs font-bold text-[#2B7A5D]">
                                ${prod.basePrice.toFixed(2)}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                addToCart(
                                  {
                                    productId: prod.id,
                                    name: prod.name,
                                    size: prod.sizes[0],
                                    price: prod.basePrice,
                                    image: prod.image,
                                    quantity: 1,
                                  },
                                  false
                                )
                              }
                              className="mt-2 w-full bg-brand-white hover:bg-brand-black hover:text-brand-white border border-brand-black text-[11px] font-heading font-bold py-1 rounded-lg transition-colors shadow-[1px_1px_0px_#111111] cursor-pointer"
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer / Checkout Area (Compact without promo code) */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-6 bg-brand-white border-t-[3px] border-brand-black space-y-3 shrink-0">
                  {/* Calculations breakdown */}
                  <div className="space-y-1 text-sm font-bold text-brand-black/80">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-heading text-brand-black">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-[#059669] uppercase font-black">
                            FREE
                          </span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    <div className="border-t-2 border-brand-black pt-1.5 flex justify-between items-baseline">
                      <span className="font-heading text-lg sm:text-xl text-brand-black">
                        Estimated Total
                      </span>
                      <span className="font-heading text-xl sm:text-2xl font-black text-[#2B7A5D]">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      alert(
                        `🐱 Thank you for testing MeowGanics! Your order total is $${finalTotal.toFixed(
                          2
                        )}. Checkout flow simulated.`
                      );
                    }}
                    className="w-full bg-brand-black text-brand-white font-heading text-lg sm:text-xl py-3.5 sm:py-4 rounded-2xl border-[3px] border-brand-black shadow-[4px_4px_0px_#A9D3F4] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#A9D3F4] active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <span>•</span>
                    <span>${finalTotal.toFixed(2)}</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[10px] sm:text-[11px] font-bold text-brand-black/60 pt-0.5">
                    <span>🔒 256-Bit SSL Encrypted</span>
                    <span>•</span>
                    <span>🌿 30-Day Guarantee</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
