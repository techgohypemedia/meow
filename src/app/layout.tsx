import type { Metadata } from "next";
import { Fredoka, Nunito_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meow Ganics | 100% Organic Flushable Tofu Cat Litter",
  description: "Pure nature for your feline friend. 99% dust-free, instant clumping, flushable organic tofu cat litter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fredoka.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-brand-blue text-brand-black">
        <CartProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
