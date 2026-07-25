"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide preloader as soon as component mounts / window loads
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#010E13] text-[#f0f4ff]"
        >
          {/* Ambient glow behind logo */}
          <div className="absolute w-72 h-72 rounded-full bg-[#72E5F8]/10 blur-3xl animate-pulse pointer-events-none" />

          <div className="flex flex-col items-center gap-6 relative z-10">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src="/Logos/hackxJr-logo.webp"
                alt="hackX Jr. 9.0"
                width={220}
                height={70}
                priority
                className="h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(114,229,248,0.4)]"
              />
            </motion.div>

            {/* Custom Spinner */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#72E5F8]/20" />
              <div className="absolute inset-0 rounded-full border-2 border-[#72E5F8] border-t-transparent animate-spin" />
            </div>

            {/* Subtext */}
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-[11px] font-bold tracking-[0.25em] text-[#8ba3c7] uppercase"
            >
              Loading Experience...
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
