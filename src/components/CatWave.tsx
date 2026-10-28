"use client";

import React, { useEffect, useRef } from "react";

/**
 * Frame-sequence animation of the peeking cat, positioned on top of the hero artwork exactly
 * where the (now removed) baked-in cat used to sit. Plays once on page visit, then again every
 * time the visitor hovers (desktop) or taps (touch) the cat.
 *
 * `rect` is expressed as percentages of the artwork container so the cat scales with the art.
 */
type CatWaveProps = {
  frameSet: "lg" | "sm";
  rect: { left: number; top: number; width: number; height: number };
  /** Extra classes for the wrapper (used for responsive show/hide). */
  className?: string;
};

const FRAME_COUNT = 96;
const FPS = 24;
const FRAME_SIZE = { lg: { w: 840, h: 560 }, sm: { w: 420, h: 280 } } as const;

function frameSrc(set: "lg" | "sm", index: number) {
  return `/cat-wave/${set}/${String(index + 1).padStart(3, "0")}.webp`;
}

export default function CatWave({ frameSet, rect, className = "" }: CatWaveProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const readyRef = useRef(false);
  const playingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const { w, h } = FRAME_SIZE[frameSet];
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let loadStarted = false;

    const isVisible = () => wrapper.getClientRects().length > 0;

    const draw = (index: number) => {
      const img = framesRef.current[index];
      if (!img) return;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
    };

    const stop = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      playingRef.current = false;
    };

    const play = () => {
      if (!readyRef.current || playingRef.current || cancelled) return;
      playingRef.current = true;
      const start = performance.now();
      let last = -1;
      const tick = (now: number) => {
        const index = Math.floor(((now - start) / 1000) * FPS);
        if (index >= FRAME_COUNT) {
          draw(0);
          stop();
          return;
        }
        if (index !== last) {
          draw(index);
          last = index;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const loadFrames = () => {
      if (loadStarted) return;
      loadStarted = true;
      let loaded = 0;
      const frames: HTMLImageElement[] = new Array(FRAME_COUNT);
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.decoding = "async";
        const done = () => {
          loaded += 1;
          if (loaded === FRAME_COUNT && !cancelled) {
            framesRef.current = frames;
            readyRef.current = true;
            draw(0);
            canvas.style.opacity = "1";
            if (posterRef.current) posterRef.current.style.opacity = "0";
            // Greet the visitor once the sequence is in memory.
            window.setTimeout(play, 350);
          }
        };
        img.onload = done;
        img.onerror = done;
        img.src = frameSrc(frameSet, i);
        frames[i] = img;
      }
    };

    // Only download frames for the variant that is actually on screen (mobile vs laptop).
    const maybeLoad = () => {
      if (isVisible()) loadFrames();
    };
    maybeLoad();
    window.addEventListener("resize", maybeLoad);

    // Hover / tap detection is done by hit-testing the pointer against the cat's box so overlays
    // stacked above the hero (bag, text, carousel) cannot swallow the events.
    const hit = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      if (r.width === 0) return false;
      return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const inside = hit(e.clientX, e.clientY);
      if (inside && !hoveringRef.current) play();
      hoveringRef.current = inside;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      if (hit(e.clientX, e.clientY)) play();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      cancelled = true;
      stop();
      window.removeEventListener("resize", maybeLoad);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [frameSet]);

  return (
    <div
      ref={wrapperRef}
      className={`absolute pointer-events-none ${className}`}
      style={{
        left: `${rect.left}%`,
        top: `${rect.top}%`,
        width: `${rect.width}%`,
        height: `${rect.height}%`,      }}
      aria-hidden="true"
    >
      {/* Static first frame so the cat is visible immediately, before the sequence has loaded. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={posterRef}
        src={frameSrc(frameSet, 0)}
        alt=""
        draggable={false}
        fetchPriority="high"
        className="absolute inset-0 w-full h-full select-none"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0 }}
      />
      {/* White floor in front of the chin, its top edge a shallow arc dipping between the paws so
          the cat looks tucked behind a curved ledge. The arc sits just above the chin's lowest
          edge in every frame: the frames' chin has a hard alpha cut that shifts as the head tilts,
          and leaving it exposed makes the base line flicker during the wave. */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        <path d="M0.198 1 V0.848 C0.31 0.89 0.69 0.89 0.802 0.848 V1 Z" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
