"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string; // unique item hash e.g. "clean-bean-berry-12l-sub"
  productId: string;
  name: string;
  flavor?: {
    id: string;
    name: string;
    color: string;
    hueFilter: string;
  };
  size: {
    id: string;
    name: string;
    volume: string;
  };
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  isSubscription?: boolean;
  subscriptionInterval?: string; // e.g. "Every 4 Weeks"
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  discount: number;
  discountCode: string | null;
  shipping: number;
  finalTotal: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: Omit<CartItem, "id"> & { id?: string }, openDrawer?: boolean) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  setQuantity: (id: string, qty: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 45.0;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize cart from localStorage once mounted
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("meowganics_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("meowganics_cart", JSON.stringify(cart));
      } catch (e) {
        console.warn("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, isLoaded]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (
    itemData: Omit<CartItem, "id"> & { id?: string },
    openDrawer: boolean = true
  ) => {
    const itemKey = `${itemData.productId}-${itemData.flavor?.id || "default"}-${itemData.size.id}-${itemData.isSubscription ? "sub" : "onetime"}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === itemKey);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (itemData.quantity || 1),
        };
        return updated;
      } else {
        const newItem: CartItem = {
          ...itemData,
          id: itemKey,
          quantity: itemData.quantity || 1,
        };
        return [...prevCart, newItem];
      }
    });

    if (openDrawer) {
      setIsOpen(true);
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const setQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "MEOW10" || cleanCode === "CLEANBEAN10") {
      setDiscountCode(cleanCode);
      setDiscountPercent(10);
      return { success: true, message: "10% off coupon applied! 🐱" };
    } else if (cleanCode === "PURRFECT15" || cleanCode === "CAT15") {
      setDiscountCode(cleanCode);
      setDiscountPercent(15);
      return { success: true, message: "15% off coupon applied! 🎉" };
    } else {
      return { success: false, message: "Invalid promo code. Try 'MEOW10'!" };
    }
  };

  const removeCoupon = () => {
    setDiscountCode(null);
    setDiscountPercent(0);
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discount;
  const shipping = taxableAmount >= FREE_SHIPPING_THRESHOLD || totalItems === 0 ? 0 : 5.99;
  const finalTotal = Math.max(0, taxableAmount + shipping);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - taxableAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        totalItems,
        subtotal,
        discount,
        discountCode,
        shipping,
        finalTotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        setQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
