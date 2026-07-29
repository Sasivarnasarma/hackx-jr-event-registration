"use client";

import React from "react";
import { useLanguage } from "@/context/language-context";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#052E3F]/80 border border-[#72E5F8]/30 backdrop-blur-xl shadow-lg shadow-black/40 text-xs font-bold z-50">
      <div className="pl-2.5 pr-1 text-[#72E5F8] flex items-center justify-center">
        <Globe className="w-3.5 h-3.5" />
      </div>

      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer text-xs font-extrabold ${
          lang === "en"
            ? "bg-[#72E5F8] text-[#010E13] font-black shadow-sm shadow-[#72E5F8]/30"
            : "text-slate-300 hover:text-white hover:bg-white/10"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLang("si")}
        className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer text-xs font-extrabold ${
          lang === "si"
            ? "bg-[#72E5F8] text-[#010E13] font-black shadow-sm shadow-[#72E5F8]/30"
            : "text-slate-300 hover:text-white hover:bg-white/10"
        }`}
      >
        සිංහල
      </button>
    </div>
  );
}
