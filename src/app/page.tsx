import Image from "next/image";
import InteractiveCat from "../components/InteractiveCat";
import AnimatedProductBag from "../components/AnimatedProductBag";
import ScrollBlurOverlay from "../components/ScrollBlurOverlay";
import HeroScrollOverlay from "../components/HeroScrollOverlay";

export default function Home() {
  return (
    <div className="bg-brand-blue text-brand-black selection:bg-brand-black selection:text-brand-white font-sans">
      
      {/* Hero Wrapper - 3000px for scrolljacking multiple bags */}
      <div className="h-[3000px] relative w-full">
        <div className="sticky top-0 h-screen flex flex-col overflow-hidden w-full">
          <HeroScrollOverlay />

        
        {/* Navigation */}
      <nav className="w-full z-50 px-6 py-2 md:px-12 md:py-4 flex items-center justify-between h-20 md:h-24">
        <div className="flex items-center gap-3 cursor-pointer group -my-12 md:-my-16">
          <div className="relative w-40 h-40 md:w-56 md:h-56 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2">
            <Image 
              src="/meowganics_logo_transparent.png" 
              alt="Meow Ganics Logo" 
              fill 
              className="object-contain object-left" 
              priority
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Shopping Bag Icon */}
          <button className="p-2 md:p-4 hover:scale-110 transition-transform">
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </button>
          
          {/* Hamburger Menu */}
          <button className="flex flex-col gap-2 p-3 hover:bg-brand-black/5 rounded-lg transition-colors">
            <span className="w-8 h-[4px] bg-brand-black rounded-full"></span>
            <span className="w-8 h-[4px] bg-brand-black rounded-full"></span>
            <span className="w-6 h-[4px] bg-brand-black rounded-full self-end"></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row relative max-w-7xl mx-auto w-full px-6 items-center md:items-stretch z-50 pointer-events-none">
        
        {/* Left Side: Product - ON TOP of table (z-30) */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center z-30 pt-4 md:pt-0 pb-4 md:pb-12 pointer-events-none">
          
          <AnimatedProductBag />
          
        </div>
        
        {/* Right Side: Empty spacing */}
        <div className="w-full md:w-1/2 relative h-[400px] md:h-auto mt-4 md:mt-0 flex flex-col items-center md:items-end justify-start md:pr-10 pt-8 z-30 pointer-events-none">
          
        </div>
      </main>

      {/* Full-width Litter Pile Background (behind product bag) */}
      <div className="absolute bottom-[-110px] md:bottom-[-150px] left-0 w-full h-[350px] md:h-[520px] z-10 pointer-events-none">
        <div className="absolute inset-0 w-full h-full scale-105 origin-bottom">
          <Image 
            src="/merged_litter_pile.png" 
            alt="Litter Pile" 
            fill 
            className="object-cover md:object-fill object-top drop-shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
          />
        </div>
      </div>

      {/* Peaking Cat (in front of product bag initially, but under blur) */}
      <div className="absolute bottom-[-110px] md:bottom-[-150px] left-0 w-full h-[300px] md:h-[450px] z-10 pointer-events-none">
        <div className="absolute top-[-50px] md:top-[-90px] right-[5%] md:right-[15%] w-[350px] h-[350px] md:w-[520px] md:h-[520px] pointer-events-auto">
          <InteractiveCat />
        </div>
      </div>


        </div>
      </div>

      {/* Marquee Section */}
      <div className="w-full bg-[#49675B] border-y-[3px] border-brand-black shadow-[0_6px_0px_#111111] py-3 md:py-4 overflow-hidden flex relative z-30 transform -translate-y-1">
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
      </div>
      {/* Static Sections Removed */}

      {/* Footer */}
      <footer className="w-full bg-brand-black text-brand-white py-16 px-6 md:px-12 border-t-8 border-brand-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-4xl font-heading mb-6 tracking-tight">Meow<span className="text-brand-blue">Ganics</span></h2>
            <p className="text-lg font-bold opacity-80 mb-8 max-w-md">
              Making cats happy and the planet healthier, one bowl of Clean Bean at a time.
            </p>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-brand-white text-brand-black rounded-full border-2 border-brand-white flex items-center justify-center hover:bg-brand-blue hover:scale-110 transition-all cursor-pointer shadow-[2px_2px_0px_#A9D3F4]">
                In
              </div>
              <div className="w-12 h-12 bg-brand-white text-brand-black rounded-full border-2 border-brand-white flex items-center justify-center hover:bg-brand-blue hover:scale-110 transition-all cursor-pointer shadow-[2px_2px_0px_#A9D3F4]">
                Fb
              </div>
              <div className="w-12 h-12 bg-brand-white text-brand-black rounded-full border-2 border-brand-white flex items-center justify-center hover:bg-brand-blue hover:scale-110 transition-all cursor-pointer shadow-[2px_2px_0px_#A9D3F4]">
                Tw
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-heading mb-6 text-brand-blue">Shop</h3>
            <ul className="space-y-4 font-bold opacity-80">
              <li className="hover:text-brand-blue cursor-pointer transition-colors">All Products</li>
              <li className="hover:text-brand-blue cursor-pointer transition-colors">Clean Bean</li>
              <li className="hover:text-brand-blue cursor-pointer transition-colors">Subscriptions</li>
              <li className="hover:text-brand-blue cursor-pointer transition-colors">Gift Cards</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-heading mb-6 text-brand-blue">Stay in the Loop</h3>
            <p className="font-bold opacity-80 mb-4">Get 10% off your first order!</p>
            <div className="flex border-4 border-brand-white rounded-2xl overflow-hidden focus-within:border-brand-blue transition-colors">
              <input type="email" placeholder="Enter your email" className="w-full bg-brand-black text-brand-white px-4 py-3 outline-none font-bold placeholder:text-brand-white/50" />
              <button className="bg-brand-white text-brand-black px-4 py-3 font-bold hover:bg-brand-blue transition-colors">→</button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t-2 border-brand-white/20 text-center font-bold opacity-60">
          <p>© {new Date().getFullYear()} Meow Ganics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
