"use client";

import React, { Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  ShieldCheck,
  RefreshCcw,
  HelpCircle,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

function SuccessCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name") || "Participant";

  // Spotlight glow animation helper
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onMouseMove={handleMouseMove}
      className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden"
    >
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
        className="text-center"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#72E5F8]/30 bg-[#72E5F8]/5 text-[#72E5F8] text-xs font-semibold tracking-wide uppercase mb-4">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified Submission
        </span>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-heading uppercase mb-4">
          Registration Complete!
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed font-light mb-8">
          Thank you for registering, <span className="text-white font-medium">{name}</span>. Your
          seat for the hackX Jr. 9.0 Awareness Session has been successfully reserved.
        </p>
      </motion.div>

      {/* Footer support details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="border-t border-white/10 pt-6 flex flex-col gap-4"
      >
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-light">
          <HelpCircle className="w-4 h-4 text-[#72E5F8] flex-shrink-0" />
          <span>
            Need assistance?{" "}
            <a
              href="https://hackxjr.lk/#oc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#72E5F8] hover:underline transition-all"
            >
              Contact us
            </a>
          </span>
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
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 relative z-10">
      {/* Brand Header */}
      <div className="text-center mb-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <Image
            src="/Logos/hackxJr-logo.webp"
            alt="hackX Jr. 9.0 Logo"
            width={280}
            height={90}
            priority
            className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_25px_rgba(91,184,255,0.35)]"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs md:text-sm font-semibold tracking-widest text-[#8ba3c7] uppercase"
        >
          Inter-School Innovation Competition — Awareness Session
        </motion.p>
      </div>

      {/* Main Split-Style Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column (Success Box) */}
        <div className="order-1 lg:order-1 lg:col-span-8 h-full flex flex-col">
          <Suspense
            fallback={
              <div className="glass-panel rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 rounded-full border-4 border-[#72E5F8]/20 border-t-[#72E5F8] animate-spin mb-4" />
                <div className="text-slate-400 text-sm">Retrieving registration details...</div>
              </div>
            }
          >
            <SuccessCard />
          </Suspense>
        </div>

        {/* Right Info Column (Info Panel Layout) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-panel order-2 lg:order-2 lg:col-span-4 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 h-full"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-heading font-extrabold text-lg text-white mb-2 tracking-wide text-center">
                hackX Jr. 9.0 Awareness Session
              </h3>
              <p className="text-sm text-[#8ba3c7] leading-relaxed text-justify">
                Join our exclusive awareness session to learn everything about hackX Jr. 9.0 — Sri
                Lanka’s premier island-wide school innovation hackathon. Discover how to build
                groundbreaking technology solutions and succeed in the competition.
              </p>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-b border-white/5 py-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#052E3F] border border-[#72E5F8]/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-[#72E5F8]" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wide block">
                    Date
                  </span>
                  <span className="text-xs font-bold text-white">1st Aug 2026</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#052E3F] border border-[#72E5F8]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#72E5F8]" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wide block">
                    Venue
                  </span>
                  <span className="text-xs font-bold text-white">A8 Auditorium</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#052E3F] border border-[#72E5F8]/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-[#72E5F8]" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wide block">
                    Time
                  </span>
                  <span className="text-xs font-bold text-white">09:00 AM</span>
                </div>
              </div>
            </div>

            {/* Highlight Points */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#5BB8FF] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-white">National Recognition:</strong> Compete with top
                  young innovators from schools across Sri Lanka's 25 districts.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#5BB8FF] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Online Workshops:</strong> Join live online
                  sessions covering hackathons, innovation through technology, and proposal
                  crafting.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#5BB8FF] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Industry Mentorship:</strong> Semi-finalist teams
                  get paired with dedicated industry mentors to guide them through the final stage.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-[10px] text-[#8ba3c7] uppercase tracking-wider font-semibold">
              Organized by Department of Industrial Management
            </p>
            <p className="text-[9px] text-slate-500 mt-1">
              Faculty of Science, University of Kelaniya
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-xs text-slate-500 font-light tracking-wide">
          © 2026 hackX national hackathon series. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
