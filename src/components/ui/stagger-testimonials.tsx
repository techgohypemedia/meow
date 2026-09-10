"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

export interface TestimonialItem {
  tempId?: number;
  testimonial: string;
  by: string;
  imgSrc: string;
}

const defaultTestimonials: TestimonialItem[] = [
  {
    tempId: 0,
    testimonial: "My cats stopped sneezing immediately after switching to Clean Bean. Zero dust in the air!",
    by: "Sarah M., Portland, OR",
    imgSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 1,
    testimonial: "I can't believe how well this clumps with only natural ingredients. Flushing it is a lifesaver.",
    by: "Marcus T., Austin, TX",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 2,
    testimonial: "The Green Tea matcha scent is subtle and fresh. My apartment no longer smells like a litter box.",
    by: "Elena R., Brooklyn, NY",
    imgSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 3,
    testimonial: "No tracking paws across my hardwood floors! Worth every single penny of the subscription.",
    by: "David K., Seattle, WA",
    imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 4,
    testimonial: "If I could give 11 stars, I'd give 12. Both my senior cats adjusted to it on day one.",
    by: "Andre, Head of Design at CreativeSolutions",
    imgSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 5,
    testimonial: "SO SO SO HAPPY WE FOUND YOU GUYS! Saved me hours of scraping the bottom of the box.",
    by: "Jeremy, Product Manager at TimeWise",
    imgSrc: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 6,
    testimonial: "Took some convincing, but now that we're on Clean Bean, we're never going back to clay.",
    by: "Pam, Cat Foster Parent",
    imgSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 7,
    testimonial: "100% natural, biodegradable and safe if my kitten accidentally ingests a pellet. Total peace of mind.",
    by: "Dr. Daniel L., DVM",
    imgSrc: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 8,
    testimonial: "It's just the best. Period. The 15% Subscribe & Save delivers right on schedule.",
    by: "Fernando, Multi-Cat Owner",
    imgSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 9,
    testimonial: "Switched 6 months ago and never looked back. The unscented charcoal keeps odors 100% locked in.",
    by: "Andy, DevOps Engineer",
    imgSrc: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&auto=format&fit=crop&q=80"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: TestimonialItem;
  handleMove: (steps: number) => void;
  cardSize: number;
  isMobile?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize,
  isMobile = false
}) => {
  const isCenter = position === 0;
  
  // Hide cards that are far away from viewport to prevent overflow & optimize performance
  if (Math.abs(position) > (isMobile ? 2 : 4)) {
    return null;
  }

  const stepWidth = isMobile ? cardSize * 0.75 : cardSize / 1.5;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-[2.5px] sm:border-[3px] p-6 sm:p-8 transition-all duration-500 ease-in-out select-none",
        isCenter 
          ? "z-20 bg-brand-black text-brand-white border-brand-black shadow-[6px_6px_0px_#A9D3F4]" 
          : "z-10 bg-brand-white text-brand-black border-brand-black/80 hover:border-brand-black shadow-[3px_3px_0px_rgba(0,0,0,0.15)] opacity-85 hover:opacity-100"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(40px 0%, calc(100% - 40px) 0%, 100% 40px, 100% 100%, calc(100% - 40px) 100%, 40px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${stepWidth * position}px)
          translateY(${isCenter ? (isMobile ? -40 : -55) : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
          scale(${isCenter ? 1 : 0.92})
        `,
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-brand-black/30"
        style={{
          right: -2,
          top: 38,
          width: SQRT_5000,
          height: 2
        }}
      />
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <img
          src={testimonial.imgSrc}
          alt={`${testimonial.by.split(',')[0]}`}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-current object-cover object-top shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
        />
        <div>
          <div className="flex text-amber-400 text-xs sm:text-sm">
            {"★".repeat(5)}
          </div>
          <span className={cn(
            "text-[10px] sm:text-xs font-bold uppercase tracking-wider",
            isCenter ? "text-brand-white/70" : "text-brand-black/60"
          )}>
            Verified Buyer
          </span>
        </div>
      </div>
      <h3 className={cn(
        "text-xs sm:text-sm md:text-base font-heading font-medium leading-snug line-clamp-4",
        isCenter ? "text-brand-white" : "text-brand-black"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-4 sm:bottom-6 left-6 sm:left-8 right-6 sm:right-8 text-xs sm:text-sm font-bold truncate",
        isCenter ? "text-brand-white/80" : "text-brand-black/70"
      )}>
        — {testimonial.by}
      </p>
    </div>
  );
};

export interface StaggerTestimonialsProps {
  items?: TestimonialItem[];
  className?: string;
}

export const StaggerTestimonials: React.FC<StaggerTestimonialsProps> = ({
  items,
  className
}) => {
  const initialData = (items && items.length > 0 ? items : defaultTestimonials).map(
    (item, idx) => ({ ...item, tempId: item.tempId ?? idx })
  );

  const [cardSize, setCardSize] = useState(350);
  const [isMobile, setIsMobile] = useState(false);
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>(initialData);
  const touchStartX = useRef<number | null>(null);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 440) {
        setCardSize(270);
        setIsMobile(true);
      } else if (width < 640) {
        setCardSize(295);
        setIsMobile(true);
      } else if (width < 1024) {
        setCardSize(330);
        setIsMobile(false);
      } else {
        setCardSize(360);
        setIsMobile(false);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleMove(1);
      } else {
        handleMove(-1);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border-[2.5px] sm:border-[3px] border-brand-black bg-[#EBF4FC] shadow-[6px_6px_0px_#111111] sm:shadow-[8px_8px_0px_#111111]",
        className
      )}
      style={{ height: isMobile ? 480 : 540 }}
    >
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.06] pointer-events-none" />

      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - Math.floor((testimonialsList.length + 1) / 2)
          : index - Math.floor(testimonialsList.length / 2);
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
            isMobile={isMobile}
          />
        );
      })}

      {/* Navigation Controls */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 z-30">
        <button
          onClick={() => handleMove(-1)}
          className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-brand-white text-brand-black border-2 sm:border-[3px] border-brand-black shadow-[3px_3px_0px_#111111] hover:-translate-y-0.5 hover:bg-brand-blue active:translate-y-0 transition-all cursor-pointer"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <span className="text-[11px] sm:text-xs font-heading font-bold px-3 py-1 bg-brand-white border-2 border-brand-black rounded-full shadow-[2px_2px_0px_#111111]">
          Tap / Swipe to rotate
        </span>

        <button
          onClick={() => handleMove(1)}
          className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-brand-white text-brand-black border-2 sm:border-[3px] border-brand-black shadow-[3px_3px_0px_#111111] hover:-translate-y-0.5 hover:bg-brand-blue active:translate-y-0 transition-all cursor-pointer"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};
