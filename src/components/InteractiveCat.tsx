"use client";

import { useState, useEffect, useRef } from 'react';

const TOTAL_FRAMES = 192;
const TOTAL_WAVE_FRAMES = 80;
// We assume the 192 frames are mapped as a grid of mouse positions.
// A common grid for 192 is 16 columns by 12 rows (16x12=192), mapping to screen X/Y.
const COLS = 16;
const ROWS = 12;

export default function InteractiveCat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const waveImagesRef = useRef<HTMLImageElement[]>([]);
  
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [waveImagesLoaded, setWaveImagesLoaded] = useState(false);

  // References for animation loop to avoid React re-renders
  const targetPos = useRef({ x: 0.5, y: 0.5 });
  const currentPos = useRef({ x: 0.5, y: 0.5 });
  const currentFrameRef = useRef(1);
  const requestRef = useRef<number | null>(null);

  // Wave state
  const isWavingRef = useRef(false);
  const waveFrameRef = useRef(1);
  const lastWaveTimeRef = useRef(0);

  // Preload eye tracking frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameString = i.toString().padStart(4, '0');
      img.src = `/cat_eye_video_frames_transparent/frame_${frameString}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
          currentFrameRef.current = Math.floor(TOTAL_FRAMES / 2);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

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

  // Update target based on mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const { clientX, clientY } = event;
      const rect = canvasRef.current.getBoundingClientRect();
      
      const catCenterX = rect.left + rect.width / 2;
      const catCenterY = rect.top + rect.height / 2;
      
      const dx = clientX - catCenterX;
      const dy = clientY - catCenterY;
      
      const maxDx = dx < 0 ? catCenterX : window.innerWidth - catCenterX;
      const maxDy = dy < 0 ? catCenterY : window.innerHeight - catCenterY;
      
      const safeMaxDx = Math.max(1, maxDx);
      const safeMaxDy = Math.max(1, maxDy);

      const normalizedX = Math.max(-1, Math.min(1, dx / safeMaxDx));
      const normalizedY = Math.max(-1, Math.min(1, dy / safeMaxDy));
      
      targetPos.current.x = (normalizedX + 1) / 2;
      targetPos.current.y = (normalizedY + 1) / 2;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Central animation and rendering loop
  useEffect(() => {
    if (!imagesLoaded || !waveImagesLoaded) return;
    
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
          // Animation finished, return to eye tracking
          isWavingRef.current = false;
          waveFrameRef.current = 1;
          imgToDraw = imagesRef.current[currentFrameRef.current - 1];
        } else {
          imgToDraw = waveImagesRef.current[waveFrameRef.current - 1];
        }
      } else {
        // Smoothly interpolate (lerp) towards the target with a much lower factor for smoother animation
        currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.05;
        currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.05;
        
        const col = Math.floor(currentPos.current.x * (COLS - 1));
        const row = Math.floor(currentPos.current.y * (ROWS - 1));
        
        const frameIndex = row * COLS + col + 1;
        
        if (frameIndex >= 1 && frameIndex <= TOTAL_FRAMES) {
          currentFrameRef.current = frameIndex;
        }
        
        imgToDraw = imagesRef.current[currentFrameRef.current - 1];
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
  }, [imagesLoaded, waveImagesLoaded]);

  const handleInteract = () => {
    if (!isWavingRef.current && waveImagesLoaded) {
      isWavingRef.current = true;
      waveFrameRef.current = 1;
      lastWaveTimeRef.current = Date.now();
    }
  };

  const isReady = imagesLoaded && waveImagesLoaded;

  return (
    <div className="w-full h-full relative pointer-events-none flex items-center justify-center">

      {/* SSR / Hydration Fallback Image: Shows instantly on page load */}
      <img 
        src="/cat_eye_video_frames_transparent/frame_0096.png"
        alt="Interactive Cat"
        className={`absolute w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${isReady ? 'opacity-0' : 'opacity-100'}`}
      />
      
      {/* Interactive Canvas: Fades in once frames are loaded */}
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={800} 
        onMouseEnter={handleInteract}
        onClick={handleInteract}
        className={`w-full h-full object-contain pointer-events-auto transition-opacity duration-300 ${isReady ? 'opacity-100 cursor-pointer' : 'opacity-0'}`}
      />
    </div>
  );
}
