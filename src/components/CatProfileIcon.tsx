"use client";

import React from "react";

interface CatProfileIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function CatProfileIcon({
  className = "w-7 h-7",
  ...props
}: CatProfileIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Cat Head Outline with Pointy Ears */}
      <path d="M12 20c-5.2 0-8.2-3.8-8.2-7.8 0-2.2.6-3.8 1.2-4.8L5.2 4.2l4.2 3.2c.8-.3 1.7-.4 2.6-.4s1.8.1 2.6.4l4.2-3.2.2 3.2c.6 1 1.2 2.6 1.2 4.8 0 4-3 7.8-8.2 7.8Z" />
      {/* Eyes */}
      <circle cx="8.5" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
      {/* Nose */}
      <polygon points="12,14.5 11,16 13,16" fill="currentColor" stroke="none" />
      {/* Whiskers */}
      <path d="M3.2 12l2.6.5M3.2 14.5l2.6-.5M20.8 12l-2.6.5M20.8 14.5l-2.6-.5" />
    </svg>
  );
}
