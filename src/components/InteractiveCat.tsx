"use client";

import { useState, useEffect, useRef } from 'react';

const TOTAL_WAVE_FRAMES = 80;

export default function InteractiveCat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const waveImagesRef = useRef<HTMLImageElement[]>([]);
  const [waveImagesLoaded, setWaveImagesLoaded] = useState(false);

  // References for animation loop to avoid React re-renders
  const requestRef = useRef<number | null>(null);

  // Wave state
  const isWavingRef = useRef(false);
  const waveFrameRef = useRef(1);
  const lastWaveTimeRef = useRef(0);

  // Preload waving frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    
    for (let i = 1; i <= TOTAL_WAVE_FRAMES; i++) {
      const img = new Image();
      const frameString = i.toString().padStart(4, '0');
      img.src = `/cat_wave_frames_transparent/frame_${frameString}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_WAVE_FRAMES) {
          setWaveImagesLoaded(true);
        }
      };
      images.push(img);
    }
    waveImagesRef.current = images;
  }, []);

  // Central animation and rendering loop
  useEffect(() => {
    if (!waveImagesLoaded) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      let imgToDraw = null;

      if (isWavingRef.current) {
        // Waving animation timing (play at roughly 30 fps)
        const now = Date.now();
        if (now - lastWaveTimeRef.current > 1000 / 30) {
          waveFrameRef.current++;
          lastWaveTimeRef.current = now;
        }

        if (waveFrameRef.current > TOTAL_WAVE_FRAMES) {
          // Animation finished, return to idle
          isWavingRef.current = false;
          waveFrameRef.current = 1;
          imgToDraw = waveImagesRef.current[0];
        } else {
          imgToDraw = waveImagesRef.current[waveFrameRef.current - 1];
        }
      } else {
        // Idle frame (first frame of wave animation)
        imgToDraw = waveImagesRef.current[0];
      }

      // Draw the frame
      if (imgToDraw) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / imgToDraw.width, canvas.height / imgToDraw.height);
        const x = (canvas.width / 2) - (imgToDraw.width / 2) * scale;
        const y = (canvas.height / 2) - (imgToDraw.height / 2) * scale;
        
        ctx.drawImage(imgToDraw, x, y, imgToDraw.width * scale, imgToDraw.height * scale);
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [waveImagesLoaded]);

  const handleInteract = () => {
    if (!isWavingRef.current && waveImagesLoaded) {
      isWavingRef.current = true;
      waveFrameRef.current = 1;
      lastWaveTimeRef.current = Date.now();
    }
  };

  return (
    <div className="w-full h-full relative pointer-events-none flex items-center justify-center">

      {/* SSR / Hydration Fallback Image: Shows instantly on page load */}
      <img 
        src="/cat_wave_frames_transparent/frame_0001.png"
        alt="Interactive Cat"
        className={`absolute w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${waveImagesLoaded ? 'opacity-0' : 'opacity-100'}`}
      />
      
      {/* Interactive Canvas: Fades in once frames are loaded */}
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={800} 
        onMouseEnter={handleInteract}
        onClick={handleInteract}
        className={`w-full h-full object-contain pointer-events-auto transition-opacity duration-300 ${waveImagesLoaded ? 'opacity-100 cursor-pointer' : 'opacity-0'}`}
      />
    </div>
  );
}
