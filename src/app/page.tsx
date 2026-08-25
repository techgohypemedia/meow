import Image from "next/image";
import InteractiveCat from "../components/InteractiveCat";

export default function Home() {
  return (
    <div className="bg-brand-blue text-brand-black selection:bg-brand-black selection:text-brand-white overflow-x-hidden font-sans">
      
      {/* Hero Wrapper - 100vh */}
      <div className="h-screen flex flex-col relative overflow-hidden">
        
        {/* Background Wavy curve from sketch */}
        <div className="absolute top-[40%] w-full h-[60%] bg-brand-blue-light/50 -z-10" style={{ clipPath: "polygon(0 20%, 100% 0, 100% 100%, 0% 100%)" }}></div>
        <svg className="absolute top-[35%] w-full text-brand-blue-light/50 -z-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,170.7C960,160,1056,192,1152,213.3C1248,235,1344,245,1392,250.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>

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
      <main className="flex-1 flex flex-col md:flex-row relative max-w-7xl mx-auto w-full px-6 overflow-hidden items-center md:items-stretch">
        
        {/* Left Side: Product - ON TOP of table (z-30) */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center z-30 pt-4 md:pt-0 pb-4 md:pb-8">
          
          <div className="flex flex-col items-center">
            {/* Product Packaging Image */}
            <div className="relative w-full max-w-[400px] md:max-w-[550px] animate-float drop-shadow-[0_20px_25px_rgba(0,0,0,0.2)] z-40">
              <Image 
                src="/product-bag.png" 
                alt="Clean Bean Product Bag" 
                width={800} 
                height={800} 
                className="w-full h-auto object-contain"
                priority
              />
            </div>
            


          </div>
          
        </div>
        
        {/* Right Side: Text (Top) & Peaking Cat (Bottom) */}
        <div className="w-full md:w-1/2 relative h-[600px] md:h-auto mt-4 md:mt-0 flex flex-col items-center md:items-end justify-between md:pr-10 pt-8">
          
          {/* Text Details (z-30) */}
          <div className="w-full flex flex-col items-center md:items-end text-center md:text-right z-30 px-4">

          </div>
          

          
          {/* Peaking Cat - ON TOP of the table (z-30) */}
          <div className="absolute right-0 md:right-10 -bottom-8 md:-bottom-12 w-[350px] h-[350px] md:w-[520px] md:h-[520px] z-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            <InteractiveCat />
          </div>
          
        </div>
      </main>

      {/* Curved SVG Mask (replaces the table) */}
      <div className="absolute -bottom-1 w-full z-20 pointer-events-none">
        <img 
          src="/tofu-mask.svg"
          alt="Curved separator"
          className="w-full h-[50px] md:h-[100px] xl:h-[120px] object-fill"
        />
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

      {/* Features Section */}
      <section className="w-full bg-brand-white py-24 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-heading text-center mb-16 text-brand-black">Why Cats <span className="text-brand-blue-dark">Love</span> Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* Feature 1 */}
            <div className="bg-[#FFEDEA] p-8 md:p-10 rounded-[2rem] border-[3px] border-brand-black shadow-[6px_6px_0px_#111111] hover:-translate-y-2 hover:shadow-[10px_10px_0px_#111111] transition-all duration-300 flex flex-col items-center text-center group cursor-default">
              <div className="w-20 h-20 bg-brand-white rounded-full border-[3px] border-brand-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_#111111] group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-[#FFB5A7]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <h3 className="text-2xl font-heading mb-4 text-brand-black">100% Organic</h3>
              <p className="text-base md:text-lg font-bold opacity-75 text-brand-black leading-relaxed">Only the finest natural ingredients. No weird chemicals or unpronounceable fillers.</p>
            </div>
            
            {/* Feature 2 (Staggered) */}
            <div className="bg-[#EBF4FC] p-8 md:p-10 rounded-[2rem] border-[3px] border-brand-black shadow-[6px_6px_0px_#111111] hover:-translate-y-2 hover:shadow-[10px_10px_0px_#111111] transition-all duration-300 flex flex-col items-center text-center mt-0 md:mt-12 group cursor-default">
              <div className="w-20 h-20 bg-brand-white rounded-full border-[3px] border-brand-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_#111111] group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-brand-blue-dark" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                  <path d="M9 12h6"/>
                  <path d="M12 9v6"/>
                </svg>
              </div>
              <h3 className="text-2xl font-heading mb-4 text-brand-black">Vet Approved</h3>
              <p className="text-base md:text-lg font-bold opacity-75 text-brand-black leading-relaxed">Formulated with feline nutritionists to keep your kitty purring and healthy.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-[#F8F9FA] p-8 md:p-10 rounded-[2rem] border-[3px] border-brand-black shadow-[6px_6px_0px_#111111] hover:-translate-y-2 hover:shadow-[10px_10px_0px_#111111] transition-all duration-300 flex flex-col items-center text-center group cursor-default">
              <div className="w-20 h-20 bg-brand-white rounded-full border-[3px] border-brand-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_#111111] group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-[#4CAF50]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                  <path d="M2 12h20"/>
                </svg>
              </div>
              <h3 className="text-2xl font-heading mb-4 text-brand-black">Eco-Friendly</h3>
              <p className="text-base md:text-lg font-bold opacity-75 text-brand-black leading-relaxed">Sustainably sourced ingredients and fully recyclable packaging.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Shop Section */}
      <section className="w-full bg-brand-blue-light py-24 px-6 md:px-12 border-t-[3px] border-brand-black relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16 bg-brand-white p-8 md:p-14 rounded-[3rem] border-[3px] border-brand-black shadow-[12px_12px_0px_#111111] hover:shadow-[16px_16px_0px_#111111] transition-shadow duration-300">
          
          {/* Product Image Replica */}
          <div className="w-full md:w-5/12 flex justify-center perspective-1000">
            <div className="relative w-full max-w-[280px] aspect-[3/4] bg-brand-white rounded-[2rem] border-[3px] border-brand-black shadow-[6px_6px_0px_#111111] flex flex-col items-center justify-start p-8 transform transition-transform duration-500 hover:rotate-2 hover:scale-105">
              <h2 className="font-heading text-4xl mb-6 text-center leading-tight tracking-tight">Clean<br/>Bean</h2>
              <div className="w-32 h-32 border-[3px] border-brand-black rounded-full overflow-hidden relative bg-brand-blue-light mt-auto mb-8 shadow-inner">
                  <svg viewBox="0 0 100 100" className="w-full h-full p-4">
                    {/* Left Ear */}
                    <path d="M35 45 L38 25 L50 38" fill="none" stroke="#111111" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    {/* Right Ear */}
                    <path d="M65 45 L62 25 L50 38" fill="none" stroke="#111111" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    {/* Head Arc */}
                    <path d="M25 75 C25 35, 75 35, 75 75" fill="none" stroke="#111111" strokeWidth="6" strokeLinecap="round"/>
                    {/* Eyes */}
                    <circle cx="38" cy="58" r="4" fill="#111111"/>
                    <circle cx="62" cy="58" r="4" fill="#111111"/>
                    {/* Smile */}
                    <path d="M47 68 Q50 72 53 68" fill="none" stroke="#111111" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
              </div>
              <div className="w-full h-10 bg-brand-blue-dark/10 rounded-xl mt-auto border-2 border-brand-black border-dashed flex items-center justify-center">
                <span className="text-xs font-bold opacity-50 uppercase tracking-widest">Tofu Litter</span>
              </div>
            </div>
          </div>
          
          {/* Product Details */}
          <div className="w-full md:w-7/12 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFB5A7] border-[2px] border-brand-black rounded-full text-sm font-bold mb-4 shadow-[2px_2px_0px_#111111]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Best Seller
            </div>
            <h2 className="text-4xl md:text-5xl font-heading mb-3 text-brand-black tracking-tight">Original Clean Bean</h2>
            <div className="text-3xl md:text-4xl font-heading text-brand-blue-dark mb-6 drop-shadow-sm">$24.99</div>
            <p className="text-lg md:text-xl font-bold opacity-75 text-brand-black mb-10 leading-relaxed">
              The revolutionary organic cat litter that started it all. Say goodbye to dust clouds and heavy clay, and hello to effortless, flushable scooping.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* Quantity Selector */}
              <div className="flex items-center border-[3px] border-brand-black rounded-2xl bg-brand-white shadow-[4px_4px_0px_#111111] overflow-hidden w-full sm:w-auto h-14">
                <button className="flex-1 sm:px-6 h-full hover:bg-brand-black/5 font-bold text-2xl transition-colors">-</button>
                <div className="px-6 h-full flex items-center justify-center font-bold text-xl border-x-[3px] border-brand-black bg-gray-50">1</div>
                <button className="flex-1 sm:px-6 h-full hover:bg-brand-black/5 font-bold text-2xl transition-colors">+</button>
              </div>
              
              {/* Add to Cart Button */}
              <button className="flex-1 h-14 rounded-2xl bg-brand-black text-brand-white font-bold text-xl border-[3px] border-brand-black shadow-[4px_4px_0px_#8FBEE5] hover:bg-brand-blue-dark hover:text-brand-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_#8FBEE5] transition-all flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
          
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full bg-[#F8F9FA] py-24 px-6 md:px-12 border-t-[3px] border-brand-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-heading text-center mb-20 text-brand-black">Happy <span className="text-[#FFB5A7]">Meows</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12 px-4 md:px-6">
            {/* Review 1 - Left Speech Bubble */}
            <div className="relative bg-brand-white p-10 md:p-12 border-[3px] border-brand-black shadow-[8px_8px_0px_#111111] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#111111] transition-all duration-300 rounded-[2rem] rounded-tl-none">
              
              {/* Overlapping Avatar */}
              <div className="absolute -top-10 -left-6 md:-left-10 w-20 h-20 bg-[#FFB5A7] rounded-full border-[3px] border-brand-black flex items-center justify-center shadow-[4px_4px_0px_#111111] z-10 overflow-hidden">
                <Image src="/logo.png" alt="Cat Avatar" width={60} height={60} className="object-cover mt-2"/>
              </div>
              
              {/* Stars */}
              <div className="flex text-[#FFB5A7] gap-1 mb-6">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              
              <p className="text-xl md:text-2xl font-bold mb-8 italic text-brand-black/90 leading-relaxed">
                "Mr. Whiskers used to be so picky, but he absolutely devours Clean Bean. His coat has never been shinier!"
              </p>
              
              <div className="font-heading text-xl text-brand-blue-dark tracking-wide">- Sarah & Mr. Whiskers</div>
            </div>
            
            {/* Review 2 - Right Speech Bubble */}
            <div className="relative bg-brand-white p-10 md:p-12 border-[3px] border-brand-black shadow-[8px_8px_0px_#111111] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#111111] transition-all duration-300 rounded-[2rem] rounded-tr-none mt-10 md:mt-24">
              
              {/* Overlapping Avatar */}
              <div className="absolute -top-10 -right-6 md:-right-10 w-20 h-20 bg-brand-blue-dark rounded-full border-[3px] border-brand-black flex items-center justify-center shadow-[4px_4px_0px_#111111] z-10 overflow-hidden">
                 <Image src="/logo.png" alt="Cat Avatar" width={60} height={60} className="object-cover mt-2"/>
              </div>
              
              {/* Stars */}
              <div className="flex text-brand-blue-dark gap-1 mb-6">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              
              <p className="text-xl md:text-2xl font-bold mb-8 italic text-brand-black/90 leading-relaxed">
                "Finally, a cat litter I feel good about buying. Love the eco-friendly packaging and Luna loves how soft it is."
              </p>
              
              <div className="font-heading text-xl text-[#FFB5A7] tracking-wide">- Mark & Luna</div>
            </div>
          </div>
        </div>
      </section>

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
