"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ShieldCheck, RefreshCcw, HelpCircle } from "lucide-react";
import Image from "next/image";

function SuccessCard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name") || "Participant";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-3xl p-8 max-w-lg w-full text-center relative overflow-hidden"
    >
      {/* Decorative corner glows */}
      <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#18A0C0]/10 rounded-full blur-xl" />
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#72E5F8]/10 rounded-full blur-xl" />

      {/* Brand Logo in Header */}
      <div className="flex justify-center mb-6">
        <Image
          src="/Logos/hackxJr-logo.webp"
          alt="hackX Jr. 9.0 Logo"
          width={130}
          height={40}
          priority
          className="h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(114,229,248,0.15)]"
        />
      </div>

      {/* Success Icon Animation */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0A5C72] to-[#72E5F8] flex items-center justify-center p-1 shadow-lg shadow-[#18A0C0]/20"
        >
          <div className="w-full h-full rounded-full bg-[#010E13] flex items-center justify-center">
            <Check className="w-10 h-10 text-[#72E5F8]" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#72E5F8]/30 bg-[#72E5F8]/5 text-[#72E5F8] text-xs font-semibold tracking-wide uppercase mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified Submission
        </span>
        
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-heading uppercase">
          Registration Complete!
        </h1>
        
        <p className="text-slate-400 mt-3 text-sm leading-relaxed font-light">
          Thank you for registering, <span className="text-white font-medium">{name}</span>. 
          Your seat for the hackX Jr. 9.0 Awareness Session has been successfully reserved.
        </p>
      </motion.div>

      {/* Footer support details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="border-t border-slate-800 pt-6 flex flex-col gap-4"
      >
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-light">
          <HelpCircle className="w-4 h-4 text-[#72E5F8]" />
          <span>Need assistance? Contact us at support@hackxjr.lk</span>
        </div>

        <button
          onClick={() => router.push("/register")}
          className="w-full py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
            border border-[#0A5C72]/30 bg-slate-900/40 hover:bg-slate-900 text-slate-300 hover:text-white"
        >
          <RefreshCcw className="w-4 h-4" />
          Register Another Person
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <Suspense
        fallback={
          <div className="glass-panel rounded-3xl p-8 max-w-lg w-full text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-12 h-12 rounded-full border-4 border-[#72E5F8]/20 border-t-[#72E5F8] animate-spin mb-4" />
            <div className="text-slate-400 text-sm">Retrieving registration details...</div>
          </div>
        }
      >
        <SuccessCard />
      </Suspense>
    </div>
  );
}
