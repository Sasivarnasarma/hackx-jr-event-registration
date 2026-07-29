"use client";

import React from "react";
import { useLanguage } from "@/context/language-context";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

export function LanguageModal() {
  const { showModal, selectLanguage } = useLanguage();

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010E13]/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="glass-panel w-full max-w-sm rounded-2xl p-5 border border-[#72E5F8]/30 bg-[#052E3F]/90 backdrop-blur-xl shadow-2xl text-center relative overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#72E5F8] uppercase tracking-wider mb-2">
            <Globe className="w-4 h-4" /> Select Language / මාධ්‍යය තෝරන්න
          </div>

          <p className="text-xs text-slate-300 mb-5 font-light">
            Choose your preferred language to proceed
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => selectLanguage("en")}
              className="py-3 px-4 rounded-xl border border-[#72E5F8]/30 bg-slate-900/60 hover:bg-[#72E5F8] text-white hover:text-[#010E13] font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>English</span>
            </button>

            <button
              type="button"
              onClick={() => selectLanguage("si")}
              className="py-3 px-4 rounded-xl border border-[#72E5F8]/30 bg-slate-900/60 hover:bg-[#72E5F8] text-white hover:text-[#010E13] font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>සිංහල</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
