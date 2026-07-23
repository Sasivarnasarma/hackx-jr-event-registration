"use client";

import React, { useEffect, useState } from "react";

/**
 * Renders the hackX Jr. ocean-themed particles and ambient light gradients.
 * Uses useEffect to prevent Next.js hydration mismatches for random parameters.
 */
export function OceanBackground() {
  const [bubbles, setBubbles] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 25 }).map((_, i) => {
      const size = ((i * 7 + 13) % 4) + 1.5;
      const left = (i * 23) % 100;
      const duration = ((i * 11 + 7) % 12) + 10;
      const delay = (i * 17) % 10;
      return {
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        },
      };
    });
    setBubbles(generated);
  }, []);

  return (
    <>
      {/* Ambient gradient blobs */}
      <div className="ocean-ambient">
        <div className="ambient-light-1" />
        <div className="ambient-light-2" />
      </div>

      {/* Floating micro-particles */}
      <div className="bubbles-container">
        {bubbles.map((bubble) => (
          <div key={bubble.id} className="bubble" style={bubble.style} />
        ))}
      </div>
    </>
  );
}
