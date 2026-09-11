"use client";

import * as React from "react";

/* ----------------------------------------------------------------
 * ScrollReelTestimonials
 *
 * Counter-rotating scroll reel + per-character text rise.
 * The middle column is a real vertical list of portraits that
 * translates by one "pitch" per step; the outer columns counter-
 * rotate the opposite way. Text animates in character-by-character
 * with a stagger; the old block exits as a whole before the new
 * characters rise in sequence.
 * ---------------------------------------------------------------- */

export interface ScrollReelTestimonial {
  /** The quote text */
  quote: string;
  /** Author name shown below the quote */
  author: string;
  /** Portrait image URL for the featured tile */
  image: string;
  /** Optional alt text for the portrait */
  alt?: string;
}

export interface ScrollReelTestimonialsProps {
  /** Testimonials to cycle through (one featured tile is generated per entry) */
  testimonials: ScrollReelTestimonial[];
  /** Per-character stagger in ms (default 6) */
  charStaggerMs?: number;
  /** Extra classes for the outer container */
  className?: string;
  /** Active index if controlled externally (e.g. via scroll progress) */
  activeIndex?: number;
  /** Callback when index changes */
  onIndexChange?: (index: number) => void;
  /** Callback to request navigation to a specific index */
  onNavigate?: (index: number) => void;
  /** Visual variant: "card" (default) or "fullpage" */
  variant?: "card" | "fullpage";
  /** Color theme: "light" (default) or "dark" */
  theme?: "light" | "dark";
  /** Whether to render the internal controls bar (default true) */
  showControls?: boolean;
}

/* Geometry — middle column pitch between portrait centers:
 * 3 * (cell 121.33px + gap 8px) = 388px */
const CELL = 121.33;
const GAP = 8;
const STEP = 3 * (CELL + GAP);

const EXIT_MS = 240; // old text removed / new text mounted
const SLIDE_MS = 800; // column slide duration + interaction lock

const EASE_INOUT = "cubic-bezier(0.65,0,0.35,1)";

const QUOTE_CLASSES =
  "m-0 text-lg font-medium leading-[1.3] tracking-[-0.02em] text-foreground sm:text-[22px]";
const AUTHOR_CLASSES =
  "m-0 text-sm font-medium leading-[1.3] text-muted-foreground";

const FEATURED_SHADOW =
  "0 1.008px 0.705px -0.563px rgba(0,0,0,0.18), 0 2.389px 1.672px -1.125px rgba(0,0,0,0.17), 0 4.357px 3.05px -1.688px rgba(0,0,0,0.17), 0 7.244px 5.07px -2.25px rgba(0,0,0,0.16), 0 11.698px 8.188px -2.813px rgba(0,0,0,0.15), 0 19.148px 13.404px -3.375px rgba(0,0,0,0.13), 0 32.972px 23.08px -3.938px rgba(0,0,0,0.09), 0 60px 42px -4.5px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.6)";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* Blurred placeholder cell */
function Cell() {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 rounded-xl border border-border bg-gradient-to-b from-secondary to-card blur-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_2px_0_rgba(255,255,255,1)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]"
      style={{ width: CELL, height: CELL }}
    />
  );
}

/* Featured portrait tile with desaturation + gradient sheen overlays */
function Featured({ src, alt }: { src: string; alt?: string }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-xl bg-muted dark:ring-1 dark:ring-white/10"
      style={{ width: CELL, height: CELL, boxShadow: FEATURED_SHADOW }}
    >
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />
      {/* desaturate via saturation blend */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] bg-white mix-blend-saturation"
      />
      {/* diagonal gradient sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] blur-[6px] mix-blend-overlay"
        style={{
          background:
            "linear-gradient(220.99deg, rgba(108,92,255,0) 32%, rgb(108,92,255) 41%, rgb(173,177,255) 47%, rgba(130,189,237,0.57) 54%, rgba(130,189,237,0) 65%)",
        }}
      />
    </div>
  );
}

/* Per-character split. Spaces live between word spans as plain text
 * nodes so natural line-wrapping is preserved. Each char rises in
 * with an inline animation-delay; while the block is exiting, the
 * char animation is removed so in-flight rises are killed. */
function Chars({
  text,
  startIndex,
  staggerMs,
}: {
  text: string;
  startIndex: number;
  staggerMs: number;
}) {
  let idx = startIndex;
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => {
        const wordSpan = (
          <span key={wi} className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => {
              const delay = idx * staggerMs;
              idx++;
              return (
                <span
                  key={ci}
                  className="scroll-reel-char"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
        if (wi < words.length - 1) idx++;
        return (
          <React.Fragment key={wi}>
            {wordSpan}
            {wi < words.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

export function ScrollReelTestimonials({
  testimonials,
  charStaggerMs = 6,
  className,
  activeIndex,
  onIndexChange,
  onNavigate,
  variant = "card",
  theme = "light",
  showControls = true,
}: ScrollReelTestimonialsProps) {
  /* Navigation state vs display state are kept separate so the
   * exiting block and the entering block never render together. */
  const [index, setIndex] = React.useState(0);
  const [displayIndex, setDisplayIndex] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const animating = React.useRef(false);
  const timeouts = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const count = testimonials.length;

  React.useEffect(() => {
    /* Enable column transitions only after first paint so the reel
     * appears at its starting offset without a slide-in. */
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setMounted(true))
    );
    return () => {
      cancelAnimationFrame(raf);
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  const goToIndex = React.useCallback(
    (target: number) => {
      if (target === index || target < 0 || target >= count) return;
      
      // Clear in-flight timeouts to avoid queued lag
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];

      setIndex(target);
      setExiting(true);

      timeouts.current.push(
        setTimeout(() => {
          setDisplayIndex(target);
          setExiting(false);
        }, EXIT_MS)
      );
      timeouts.current.push(
        setTimeout(() => {
          animating.current = false;
        }, SLIDE_MS)
      );
      onIndexChange?.(target);
    },
    [index, count, onIndexChange]
  );

  // Sync external activeIndex changes (e.g. from scroll trigger)
  React.useEffect(() => {
    if (activeIndex !== undefined && activeIndex !== index) {
      goToIndex(activeIndex);
    }
  }, [activeIndex, index, goToIndex]);

  const paginate = React.useCallback(
    (dir: 1 | -1) => {
      const next = index + dir;
      if (next < 0 || next >= count) return;
      if (onNavigate) {
        onNavigate(next);
      } else {
        goToIndex(next);
      }
    },
    [index, count, onNavigate, goToIndex]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      paginate(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      paginate(-1);
    }
  };

  /* Middle column: 3 leading cells, then featured + 2 cells between
   * each testimonial, then 3 trailing cells. */
  const middleItems = React.useMemo(() => {
    const items: Array<{ type: "cell" } | { type: "featured"; i: number }> = [];
    for (let i = 0; i < 3; i++) items.push({ type: "cell" });
    testimonials.forEach((_, i) => {
      items.push({ type: "featured", i });
      if (i < count - 1) {
        items.push({ type: "cell" }, { type: "cell" });
      }
    });
    for (let i = 0; i < 3; i++) items.push({ type: "cell" });
    return items;
  }, [testimonials, count]);

  const sideCellCount = 4 + 2 * count;
  const centerIdx = (count - 1) / 2;
  const middleY = (centerIdx - index) * STEP;
  const sideY = -middleY;

  const colStyle = (y: number): React.CSSProperties => ({
    transform: `translateY(${y}px)`,
    transition: mounted ? `transform ${SLIDE_MS}ms ${EASE_INOUT}` : "none",
  });

  const current = testimonials[displayIndex];
  const isFullPage = variant === "fullpage";
  const isDark = theme === "dark";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn(
        isFullPage
          ? isDark
            ? "relative flex w-full max-w-5xl flex-col items-center justify-between gap-4 md:gap-7 overflow-hidden rounded-2xl border border-white/15 bg-[#12202E]/95 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl outline-none md:min-h-[280px] lg:min-h-[300px] md:flex-row p-3 sm:p-5 md:p-6"
            : "relative flex w-full max-w-5xl flex-col items-center justify-between gap-4 md:gap-7 overflow-hidden rounded-2xl border-2 border-brand-black bg-brand-white text-brand-black shadow-[6px_6px_0px_#111111] outline-none focus-visible:ring-2 focus-visible:ring-brand-blue md:min-h-[280px] lg:min-h-[300px] md:flex-row p-3 sm:p-5 md:p-6"
          : isDark
            ? "relative flex w-full max-w-[1060px] flex-col items-stretch gap-2.5 overflow-hidden rounded-2xl border border-white/15 bg-[#12202E] text-white shadow-[0_15px_30px_rgba(0,0,0,0.5)] md:min-h-[320px] md:flex-row"
            : "relative flex w-full max-w-[1060px] flex-col items-stretch gap-2.5 overflow-hidden rounded-2xl border-2 border-brand-black bg-brand-white text-brand-black shadow-[6px_6px_0px_#111111] outline-none focus-visible:ring-2 focus-visible:ring-brand-blue md:min-h-[320px] md:flex-row",
        className
      )}
    >
      {/* Reel section */}
      <div
        aria-hidden="true"
        className={cn(
          "relative shrink-0 self-stretch overflow-hidden rounded-2xl",
          isDark ? "bg-white/[0.04] border border-white/10" : "bg-brand-black/[0.03] border border-brand-black/10",
          isFullPage ? "h-44 w-full md:h-[260px] lg:h-[280px] md:w-[270px] lg:w-[290px]" : "h-56 w-full md:h-auto md:w-[380px]"
        )}
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          {/* Left column */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>

          {/* Middle column */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(middleY)}
          >
            {middleItems.map((item, i) =>
              item.type === "featured" ? (
                <Featured
                  key={i}
                  src={testimonials[item.i].image}
                  alt={testimonials[item.i].alt}
                />
              ) : (
                <Cell key={i} />
              )
            )}
          </div>

          {/* Right column */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col justify-between self-stretch",
          isFullPage ? "px-2 sm:px-4 py-1 md:py-2" : "px-6 py-8 md:py-10"
        )}
      >
        <div className="flex flex-col gap-2.5 md:gap-3.5">
          <div className="flex items-center justify-between">
            {isFullPage && (
              <div className="flex items-center gap-1.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className={cn(
                  "ml-1.5 font-heading font-black text-xs",
                  isDark ? "text-white/80" : "text-brand-black/70"
                )}>
                  5.0 / 5.0 Star Rating
                </span>
              </div>
            )}
            <svg
              className="block h-7 w-7 md:h-9 md:w-9 text-brand-blue"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M4.58 17.32C3.55 16.23 3 15 3 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18zm10 0C13.55 16.23 13 15 13 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18z" />
            </svg>
          </div>

          {/* Text stage */}
          <div
            className={cn(
              "relative w-full overflow-hidden",
              isFullPage ? "max-w-2xl" : "max-w-[440px]"
            )}
            aria-live="polite"
          >
            {/* Invisible in-flow copy sizes the stage to the current
              * quote at any viewport width, so wrapped text never clips. */}
            <div
              aria-hidden="true"
              className={cn(
                "invisible flex flex-col gap-2.5 md:gap-3",
                isFullPage ? "min-h-[85px] md:min-h-[105px]" : "min-h-[140px]"
              )}
            >
              <p
                className={
                  isFullPage
                    ? cn("m-0 font-heading text-base sm:text-xl md:text-[22px] lg:text-[24px] font-black leading-[1.3]", isDark ? "text-white" : "text-brand-black")
                    : cn(QUOTE_CLASSES, isDark && "text-white")
                }
              >
                {current.quote}
              </p>
              <p
                className={
                  isFullPage
                    ? cn("m-0 font-sans text-xs sm:text-sm font-bold", isDark ? "text-white/60" : "text-brand-black/60")
                    : cn(AUTHOR_CLASSES, isDark && "text-white/60")
                }
              >
                {current.author}
              </p>
            </div>
            <div
              key={displayIndex}
              className={cn(
                "absolute inset-x-0 top-0 flex flex-col gap-2.5 md:gap-3 will-change-[transform,opacity]",
                exiting && "scroll-reel-exit"
              )}
            >
              <p
                className={
                  isFullPage
                    ? cn("m-0 font-heading text-base sm:text-xl md:text-[22px] lg:text-[24px] font-black leading-[1.3]", isDark ? "text-white" : "text-brand-black")
                    : cn("m-0 font-heading text-lg font-bold leading-[1.3] tracking-[-0.01em] sm:text-[22px]", isDark ? "text-white" : "text-brand-black")
                }
              >
                <Chars
                  text={current.quote}
                  startIndex={0}
                  staggerMs={charStaggerMs}
                />
              </p>
              <div className="flex items-center gap-2">
                {isFullPage && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
                )}
                <p
                  className={
                    isFullPage
                      ? cn("m-0 font-sans text-sm sm:text-base font-bold", isDark ? "text-white/80" : "text-brand-black/70")
                      : cn("m-0 font-sans text-sm font-bold leading-[1.3]", isDark ? "text-white/80" : "text-brand-black/60")
                  }
                >
                  <Chars
                    text={current.author}
                    startIndex={current.quote.length + 6}
                    staggerMs={charStaggerMs}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className={cn(
            "mt-6 flex items-center justify-between gap-3 pt-3 border-t",
            isDark ? "border-white/10" : "border-brand-black/10"
          )}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => paginate(-1)}
                disabled={index === 0}
                aria-label="Previous testimonial"
                className={cn(
                  "grid h-8 w-8 cursor-pointer place-items-center rounded-full border-2 border-brand-black bg-brand-blue text-brand-black shadow-[2px_2px_0px_#111111] transition-all hover:enabled:scale-105 active:enabled:scale-95 disabled:cursor-default disabled:opacity-40 focus-visible:outline-none",
                  isDark && "border-white/20 shadow-[0_0_10px_rgba(169,211,244,0.3)]"
                )}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7.5 2.5 3.5 6l4 3.5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => paginate(1)}
                disabled={index === count - 1}
                aria-label="Next testimonial"
                className={cn(
                  "grid h-8 w-8 cursor-pointer place-items-center rounded-full border-2 border-brand-black bg-brand-blue text-brand-black shadow-[2px_2px_0px_#111111] transition-all hover:enabled:scale-105 active:enabled:scale-95 disabled:cursor-default disabled:opacity-40 focus-visible:outline-none",
                  isDark && "border-white/20 shadow-[0_0_10px_rgba(169,211,244,0.3)]"
                )}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m4.5 2.5 4 3.5-4 3.5" />
                </svg>
              </button>
              <span className={cn(
                "ml-2 font-heading text-xs sm:text-sm font-black",
                isDark ? "text-white/70" : "text-brand-black/70"
              )}>
                0{index + 1} / 0{count}
              </span>
            </div>

            {/* Stepper dots in fullpage variant */}
            {isFullPage && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => (onNavigate ? onNavigate(i) : goToIndex(i))}
                    aria-label={`Jump to review 0${i + 1}`}
                    className={cn(
                      "transition-all rounded-full cursor-pointer",
                      i === index
                        ? isDark
                          ? "w-7 sm:w-9 h-2.5 bg-brand-blue border border-white shadow-[0_0_12px_rgba(169,211,244,0.8)]"
                          : "w-7 sm:w-9 h-2.5 bg-brand-blue border-2 border-brand-black shadow-[1px_1px_0px_#111111]"
                        : isDark
                          ? "w-2.5 h-2.5 bg-white/20 hover:bg-white/50"
                          : "w-2.5 h-2.5 bg-brand-black/20 hover:bg-brand-black/50"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScrollReelTestimonials;
