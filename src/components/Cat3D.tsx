"use client";

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to -1 to +1
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      // Invert Y axis for 3D rotation
      mouse.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // Calculate target rotation
      const targetRotationY = (mouse.current.x * Math.PI) / 3;
      const targetRotationX = (mouse.current.y * Math.PI) / 6;

      // Smoothly interpolate rotation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.1);
    }
  });

  return (
    <group ref={groupRef} dispose={null} position={[0, -0.2, 0]}>
      {/* 
        The scale and position can be tweaked depending on the GLB's internal origin.
        Many Sketchfab models are large, so starting with scale 1. 
      */}
      <primitive object={scene} scale={1.3} />
    </group>
  );
}

useGLTF.preload('/cute_black_cat.glb');

export default function Cat3D() {
  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }} 
        gl={{ alpha: true }}
        eventSource={typeof window !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
        style={{ pointerEvents: 'auto' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 7]} intensity={1.5} />
        <Environment preset="city" />
        <Model url="/cute_black_cat.glb" />
      </Canvas>
    </div>
  );
}
