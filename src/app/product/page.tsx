import Image from "next/image";
import Link from "next/link";

export default function ProductPage() {
  return (
    <div className="bg-[#F8F9FA] font-sans text-brand-black selection:bg-brand-black selection:text-brand-white">
      {/* Header */}
      <header className="w-full z-50 px-6 py-4 md:px-12 bg-[#EBF4FC] flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2 bg-brand-white rounded-full border-[3px] border-brand-black shadow-[2px_2px_0px_#111111] flex items-center justify-center overflow-hidden">
             <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-cover mt-2" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-brand-black">MeowGanics</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/" className="font-heading font-bold hover:text-brand-blue-dark transition-colors text-brand-black">Shop</Link>
          <Link href="#" className="font-heading font-bold hover:text-brand-blue-dark transition-colors text-brand-black/70">About</Link>
          <Link href="#" className="font-heading font-bold hover:text-brand-blue-dark transition-colors text-brand-black/70">Sustainability</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
          </button>
          <button className="p-2 hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-[#FFEDEA] border-[3px] border-brand-black flex items-center justify-center shadow-[2px_2px_0px_#111111] hover:scale-105 cursor-pointer transition-transform">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
        </div>
      </header>

      <main className="w-full">
        {/* Product Hero Section */}
        <section className="w-full bg-[#EBF4FC] pb-24 pt-10 lg:pt-16 px-6 md:px-12 border-b-[3px] border-brand-black relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Product Gallery */}
            <div className="relative group flex flex-col items-center lg:items-start w-full">
              {/* Main Image Container */}
              <div className="w-full bg-brand-white rounded-[2.5rem] border-[3px] border-brand-black p-8 shadow-[8px_8px_0px_#111111] hover:shadow-[12px_12px_0px_#111111] hover:-translate-y-1 transition-all duration-300 aspect-[4/3] lg:aspect-[4/5] flex items-center justify-center relative overflow-visible">
                {/* Product Image */}
                <img className="w-full max-w-[280px] lg:max-w-[350px] h-auto object-contain transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl z-10" src="/product-bag.png" alt="Clean Bean Product" />
                
                {/* Decorative Badge */}
                <div className="absolute top-6 left-6 bg-[#FFEDEA] text-brand-black font-heading font-bold text-lg px-5 py-2 rounded-full border-[3px] border-brand-black transform -rotate-12 shadow-[4px_4px_0px_#111111] z-20">
                  Best Seller!
                </div>
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-4 mt-8 w-full justify-center lg:justify-start">
                <button className="w-20 h-20 bg-[#F8F9FA] rounded-2xl border-[3px] border-brand-black shadow-[4px_4px_0px_#111111] p-2 hover:-translate-y-1 transition-transform relative overflow-hidden">
                  <img className="w-full h-full object-cover rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2NG8cLJna9qKPA6YSj__CZlnosfQ5I5Vut54ujMcCwJ4TlX4DWxREtUciIdUgkgOoBmZ7Fs38qvZ18-pgC7f563e9pYOF89nYBxPauQSQNZAstssy_8M3uTYbpnf47g6ry7ak6FLLt7DtS8uwlEi1JAZKUFESRKhObAttBlePtwrWPBjPVKwiaBOnZFV6MkS7XfOseymxNhOfFgTRnTDZyHK3Ej5unjcihKEo_idpiyRWk4_kk565rQ" alt="Thumbnail 1" />
                </button>
                <button className="w-20 h-20 bg-brand-white rounded-2xl border-[3px] border-brand-black/20 p-2 hover:border-brand-black hover:shadow-[4px_4px_0px_#111111] transition-all relative overflow-hidden group">
                  <img className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSTlQ3L-DCk2OqKn8zc2h22eELujBEtmosOZPJ1KFpn4hUbaaHpbkJ7w7CsVzZROMM5_5q9Vg1bIkqp563wGxM9xEviu2i6rfbdXVJ-eqqaXfDszyDFWs1fEl1zmqasZ5I6gA1OZy6KEz9de9CiaMYHQniXpXKw_TDU6KkKSpd-0QxzIhGwDca2OPfZmM8pm_MGqZsYvkuLyVtNInw38V9xUKv8JeY0Z5fSzW4_hL5H-zSd4scaIyN_g" alt="Thumbnail 2" />
                </button>
                <button className="w-20 h-20 bg-brand-white rounded-2xl border-[3px] border-brand-black/20 p-2 hover:border-brand-black hover:shadow-[4px_4px_0px_#111111] transition-all relative overflow-hidden group">
                  <img className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmIUzO-5ZXtPrj6eUbrX--u-nZBVGwz71C6H7Z3ux1uqrB9cRcqxeJK8RDij7e0kIuL2s1ks3jJS628rRddsYOBth7KVOu9QQ7Wbkz-iAqYRSt6M5lk7lPyQlrQMSfvbAVCLIxDMSE_cfICgSG4nAHqgc2Z_p4B5n4saQZGcxgGEs6wpaPzgyrLbzerC69HfbjVbY8I4jPd1OmWzFG5QNcHjRFuyVoY7_n8UeDC5xf2yeQEmfV52N5Lw" alt="Thumbnail 3" />
                </button>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col justify-center">
              {/* Ratings */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-brand-black">
                  {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                </div>
                <span className="text-brand-black/70 font-bold text-sm">(4.8 from 1,240 Reviews)</span>
              </div>
              
              {/* Title & Price */}
              <h1 className="text-5xl md:text-7xl font-heading text-brand-black mb-4 leading-none tracking-tight">
                Original Clean Bean
              </h1>
              <div className="text-3xl md:text-4xl font-heading text-[#2B7A5D] mb-6 flex items-baseline gap-2">
                $24.99 <span className="text-xl text-brand-black/70 font-sans font-bold">/ 6L Bag</span>
              </div>
              
              {/* Short Desc */}
              <p className="text-lg md:text-xl font-bold opacity-80 text-brand-black mb-8 max-w-lg leading-relaxed">
                The revolutionary organic cat litter that started it all. Say goodbye to dust clouds and heavy clay, and hello to effortless, flushable scooping. Plant-based and purr-fectly safe.
              </p>
              
              {/* Chips */}
              <div className="flex flex-wrap gap-4 mb-10">
                <div className="bg-brand-white flex items-center gap-2 px-5 py-2.5 rounded-full border-[3px] border-brand-black shadow-[4px_4px_0px_#111111] font-bold text-sm hover:-translate-y-1 transition-transform cursor-default">
                  🌱 Plant Based
                </div>
                <div className="bg-brand-white flex items-center gap-2 px-5 py-2.5 rounded-full border-[3px] border-brand-black shadow-[4px_4px_0px_#111111] font-bold text-sm hover:-translate-y-1 transition-transform cursor-default">
                  💧 Strong Clumping
                </div>
                <div className="bg-brand-white flex items-center gap-2 px-5 py-2.5 rounded-full border-[3px] border-brand-black shadow-[4px_4px_0px_#111111] font-bold text-sm hover:-translate-y-1 transition-transform cursor-default">
                  🚽 Flushable
                </div>
              </div>
              
              {/* Action Area */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-6 md:p-8 bg-brand-white rounded-[2rem] border-[3px] border-brand-black shadow-[8px_8px_0px_#111111]">
                {/* Quantity */}
                <div className="flex items-center bg-[#F8F9FA] border-[3px] border-brand-black rounded-full h-14 w-full sm:w-auto shadow-[4px_4px_0px_#111111]">
                  <button className="w-14 h-full flex items-center justify-center hover:bg-black/5 rounded-l-full transition-colors font-bold text-2xl">-</button>
                  <div className="w-12 text-center font-bold text-xl text-brand-black">1</div>
                  <button className="w-14 h-full flex items-center justify-center hover:bg-black/5 rounded-r-full transition-colors font-bold text-2xl">+</button>
                </div>
                {/* Add to Cart */}
                <button className="flex-1 w-full bg-brand-black text-brand-white h-14 rounded-full font-heading text-xl flex items-center justify-center gap-3 border-[3px] border-brand-black shadow-[4px_4px_0px_#A9D3F4] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#A9D3F4] transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Section */}
        <section className="w-full py-24 px-6 md:px-12 bg-[#F8F9FA] relative border-b-[3px] border-brand-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left: Accordions */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h2 className="font-heading text-4xl text-brand-black mb-6">The Nitty Gritty</h2>
              
              {/* Accordion Item 1 */}
              <div className="border-[3px] border-brand-black rounded-[2.5rem] bg-[#D1F0E4] shadow-[8px_8px_0px_#111111] overflow-hidden group">
                <button className="w-full p-6 lg:p-8 flex items-center justify-between text-left focus:outline-none">
                  <span className="font-heading text-2xl text-brand-black">Key Benefits</span>
                  <div className="w-10 h-10 rounded-full bg-brand-black text-brand-white flex items-center justify-center transform group-hover:rotate-90 transition-transform duration-300 shadow-[2px_2px_0px_#111111]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                </button>
                <div className="px-6 lg:px-8 pb-8 pt-0 text-lg text-brand-black font-bold opacity-90">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full border-2 border-brand-black flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                      <span><strong>99% Dust-Free:</strong> Keeps your home clean and your cat's lungs clear.</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full border-2 border-brand-black flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                      <span><strong>Odor Control:</strong> Natural enzymes break down ammonia on contact.</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full border-2 border-brand-black flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                      <span><strong>Soft on Paws:</strong> Smooth, cylindrical pellets that won't track around the house.</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Accordion Item 2 */}
              <div className="border-[3px] border-brand-black rounded-[2.5rem] bg-[#F8F9FA] shadow-[4px_4px_0px_#111111] hover:shadow-[8px_8px_0px_#111111] hover:-translate-y-1 transition-all overflow-hidden group">
                <button className="w-full p-6 lg:p-8 flex items-center justify-between text-left focus:outline-none">
                  <span className="font-heading text-2xl text-brand-black">Ingredients</span>
                  <div className="w-10 h-10 rounded-full bg-[#F8F9FA] border-[3px] border-brand-black text-brand-black flex items-center justify-center group-hover:bg-brand-black group-hover:text-brand-white transition-colors shadow-[2px_2px_0px_#111111]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                </button>
              </div>
              
              {/* Accordion Item 3 */}
              <div className="border-[3px] border-brand-black rounded-[2.5rem] bg-[#F8F9FA] shadow-[4px_4px_0px_#111111] hover:shadow-[8px_8px_0px_#111111] hover:-translate-y-1 transition-all overflow-hidden group">
                <button className="w-full p-6 lg:p-8 flex items-center justify-between text-left focus:outline-none">
                  <span className="font-heading text-2xl text-brand-black">How to Use</span>
                  <div className="w-10 h-10 rounded-full bg-[#F8F9FA] border-[3px] border-brand-black text-brand-black flex items-center justify-center group-hover:bg-brand-black group-hover:text-brand-white transition-colors shadow-[2px_2px_0px_#111111]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Right: Eco Badge & Visuals */}
            <div className="lg:col-span-5 flex flex-col justify-center relative mt-12 lg:mt-0">
              <div className="relative z-10 bg-[#FFEDEA] border-[3px] border-brand-black rounded-[3rem] p-10 md:p-12 shadow-[12px_12px_0px_#111111] flex flex-col items-center text-center transform lg:rotate-3">
                <div className="w-20 h-20 bg-brand-white rounded-full border-[3px] border-brand-black shadow-[4px_4px_0px_#111111] flex items-center justify-center mb-6">
                  <span className="text-4xl">🌍</span>
                </div>
                <h3 className="font-heading text-2xl md:text-3xl text-brand-black mb-4">Mother Nature Approved</h3>
                <p className="text-lg font-bold opacity-80 text-brand-black mb-8 leading-relaxed">
                  Made entirely from upcycled food-grade soybean fiber and corn starch. It's completely biodegradable. You can safely flush it (in small amounts) or compost it.
                </p>
                <div className="w-full max-w-[200px] bg-brand-white border-[3px] border-brand-black shadow-[4px_4px_0px_#111111] rounded-2xl flex items-center justify-center overflow-hidden">
                   <img className="w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwpm7FBhpKqzTqssJ7_cARgsUBxAE55C7K0L90oMH3M6goqJtJKA42jqUUQO5xiKh5rttiZPL8ftiqKOHu_Xfs56lZEiXVk9rS0lKM1luhwXTQyRViVU-pHkJJgnf3fzlsaVCjGTbEknYRrxr9J3KWJfrvWg8JUV0hQq4dLZXG8uJNDCRbmf7wpuwCEPcSPODG8b7yUi846CVIjorNivoydTdHZ73xrrCE9tENcm5deq_FwD33-BzJRQ" alt="Eco Graphic" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-sell Section */}
        <section className="w-full py-24 px-6 md:px-12 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="font-heading text-4xl md:text-5xl text-brand-black mb-2 tracking-tight">Pairs Purr-fectly With</h2>
                <p className="text-xl font-bold opacity-80 text-brand-black">Complete your cat's bathroom routine.</p>
              </div>
              <Link href="#" className="inline-flex items-center gap-2 font-heading font-bold text-brand-black hover:text-brand-blue-dark transition-colors uppercase tracking-widest text-sm border-b-[3px] border-brand-black pb-1">
                Shop All Accessories <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Cross-sell Item 1 */}
              <div className="bg-brand-white border-[3px] border-brand-black rounded-[2.5rem] p-6 shadow-[8px_8px_0px_#111111] group hover:-translate-y-2 hover:shadow-[12px_12px_0px_#111111] transition-all duration-300 flex flex-col h-full">
                <div className="bg-[#D1F0E4] rounded-3xl aspect-[4/3] mb-6 border-[3px] border-brand-black flex items-center justify-center relative overflow-hidden">
                  <img className="w-3/4 h-auto object-contain z-10 group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtiklLxp0LZ8tFu1pHOXrG2r2nzfCVLFyAGP_3GhWviqGrPoHw4oOdQOqPprMBPXdDOtSXIcRDqyiKGRAzusLTVO12CpG_bRw_Q0ptBd29JKtvdJrDBEbDyIVZt6z2lS2W04igJkD7yCIn5i1nmG4QeXdoLE8N43ih5eOT31San0Hiisn8sN9aP1RrLg71gpttaeB7klqbNNdSaVwYrMcPdPlGvbq5TQlKdRcS5eRh_Nb6T5q4adqcbw" alt="Scoop" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-2xl text-brand-black mb-2">The Zen Scoop</h3>
                    <p className="text-base font-bold opacity-75 text-brand-black mb-4">Ergonomic, non-stick, and designed to sift Tofu pellets perfectly.</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t-[3px] border-brand-black/10">
                    <span className="font-heading text-2xl text-brand-black">$18.00</span>
                    <button className="w-12 h-12 bg-brand-black text-brand-white rounded-full flex items-center justify-center hover:bg-brand-blue-dark transition-colors shadow-[2px_2px_0px_#A9D3F4]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Cross-sell Item 2 */}
              <div className="bg-brand-white border-[3px] border-brand-black rounded-[2.5rem] p-6 shadow-[8px_8px_0px_#111111] group hover:-translate-y-2 hover:shadow-[12px_12px_0px_#111111] transition-all duration-300 flex flex-col h-full">
                <div className="bg-[#CFE5F8] rounded-3xl aspect-[4/3] mb-6 border-[3px] border-brand-black flex items-center justify-center relative overflow-hidden">
                  <img className="w-3/4 h-auto object-contain z-10 group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJIJ8YIwS4JGLFOacjVlPRlAT8Q9kDMcRL_2M-7coliPbt7d-3Bk-y2RuGSUJpPl3ctJJm0mloQ4ZAKOENidd3I_JsiD1zd7M_x6r5Am6hJ25UYwqK12udKa0CmD0lzLzhmQe6xtQ6Z8fHdMmsKBHWc_u0G5ZcgY6DNFF_WSYxQylWHS8Y9N0WUUQ1gNVgmRBYC2sH-RYDzzBffLNe2FIskKb8xnlYKj9MPw1VIup6f8moMdIG8nWqWA" alt="Mat" />
                  <div className="absolute top-4 left-4 bg-brand-white text-brand-black text-xs font-heading font-bold px-3 py-1.5 rounded-full border-[3px] border-brand-black z-20 shadow-[2px_2px_0px_#111111]">New</div>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-2xl text-brand-black mb-2">Cloud Trap Mat</h3>
                    <p className="text-base font-bold opacity-75 text-brand-black mb-4">Catches stray pellets before they make it to your rugs. Easy pour design.</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t-[3px] border-brand-black/10">
                    <span className="font-heading text-2xl text-brand-black">$28.00</span>
                    <button className="w-12 h-12 bg-brand-black text-brand-white rounded-full flex items-center justify-center hover:bg-brand-blue-dark transition-colors shadow-[2px_2px_0px_#A9D3F4]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Cross-sell Item 3 (Subscribe) */}
              <div className="bg-[#4A3D3C] border-[3px] border-brand-black rounded-[2.5rem] p-8 shadow-[8px_8px_0px_#111111] flex flex-col items-center justify-center text-center relative overflow-hidden group">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-brand-white rounded-full border-[3px] border-brand-black flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300 shadow-[4px_4px_0px_#111111]">
                    <span className="text-3xl">📦</span>
                  </div>
                  <h3 className="font-heading text-3xl text-brand-white mb-4">Subscribe & Save</h3>
                  <p className="text-lg font-bold text-brand-white/90 mb-8 max-w-[250px]">Get Clean Bean delivered every month and save 15% on every order.</p>
                  <button className="bg-brand-white text-brand-black font-heading text-lg px-8 py-4 rounded-full border-[3px] border-brand-black shadow-[4px_4px_0px_#111111] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111111] transition-all w-full">
                    View Subscriptions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#EBEBEB] border-t-[3px] border-brand-black py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h2 className="font-heading text-3xl text-brand-black mb-4">MeowGanics</h2>
            <p className="text-lg font-bold opacity-75 text-brand-black mb-8">Organic nutrition for the modern feline lifestyle.</p>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border-[3px] border-brand-black flex items-center justify-center text-brand-black hover:bg-brand-black hover:text-brand-white transition-colors cursor-pointer shadow-[2px_2px_0px_#111111]">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </div>
              <div className="w-12 h-12 rounded-full border-[3px] border-brand-black flex items-center justify-center text-brand-black hover:bg-brand-black hover:text-brand-white transition-colors cursor-pointer shadow-[2px_2px_0px_#111111]">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-brand-black uppercase tracking-wider mb-2 text-lg">Support</h4>
            <Link href="#" className="font-bold text-brand-black/70 hover:text-brand-blue-dark">Shipping</Link>
            <Link href="#" className="font-bold text-brand-black/70 hover:text-brand-blue-dark">Returns</Link>
            <Link href="#" className="font-bold text-brand-black/70 hover:text-brand-blue-dark">FAQ</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-brand-black uppercase tracking-wider mb-2 text-lg">Company</h4>
            <Link href="#" className="font-bold text-brand-black/70 hover:text-brand-blue-dark">Our Story</Link>
            <Link href="#" className="font-bold text-brand-black/70 hover:text-brand-blue-dark">Careers</Link>
            <Link href="#" className="font-bold text-brand-black/70 hover:text-brand-blue-dark">Wholesale</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-brand-black uppercase tracking-wider mb-2 text-lg">Newsletter</h4>
            <p className="font-bold text-brand-black/70 mb-2">Join our circle of eco-conscious pet parents.</p>
            <div className="relative flex items-center">
              <input type="email" placeholder="Your email" className="w-full bg-brand-white border-[3px] border-brand-black rounded-full py-3 px-6 font-bold outline-none shadow-[2px_2px_0px_#111111] focus:shadow-[4px_4px_0px_#111111] transition-shadow" />
              <button className="absolute right-2 w-10 h-10 bg-brand-black rounded-full flex items-center justify-center text-brand-white hover:bg-brand-blue-dark transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t-[3px] border-brand-black/10 text-center font-bold text-brand-black/60">
          © {new Date().getFullYear()} MeowGanics Inc. Purely Feline.
        </div>
      </footer>
    </div>
  );
}
