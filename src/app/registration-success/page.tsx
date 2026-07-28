"use client";

import React, { Suspense, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ShieldCheck,
  RefreshCcw,
  HelpCircle,
  Calendar,
  Globe,
  Clock,
  CheckCircle2,
  Send,
  MessageSquareHeart,
} from "lucide-react";
import Image from "next/image";

const feedbackOptions = [
  "School",
  "Teacher",
  "Friend",
  "Social Media",
  "WhatsApp",
  "Website",
  "Other",
];

function SuccessCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name") || "Participant";
  const rawId = searchParams.get("id");
  const registrationId = rawId ? parseInt(rawId, 10) : null;

  // Feedback poll state
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [customSource, setCustomSource] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

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

  const handleSelectFeedback = async (option: string) => {
    if (option === "Other") {
      setSelectedSource("Other");
      setShowCustomInput(true);
      return;
    }

    setSelectedSource(option);
    setShowCustomInput(false);
    await submitFeedback(option);
  };

  const submitFeedback = async (sourceText: string) => {
    if (!registrationId || !sourceText.trim()) return;

    setIsSubmittingFeedback(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: registrationId,
          awarenessSource: sourceText.trim(),
        }),
      });

      if (res.ok) {
        setFeedbackSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customSource.trim()) {
      await submitFeedback(customSource);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onMouseMove={handleMouseMove}
      className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between"
    >
      <div>
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

          <p className="text-slate-400 text-sm leading-relaxed font-light mb-6">
            Thank you for registering, <span className="text-white font-medium">{name}</span>. Your spot for the hackX Jr. 9.0 Online Awareness Session has been successfully reserved.
          </p>
        </motion.div>

        {/* Optional Post-Registration Feedback Survey */}
        {registrationId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="my-6 p-5 rounded-2xl border border-[#72E5F8]/20 bg-[#052E3F]/30 backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-[#72E5F8]">
              <MessageSquareHeart className="w-4 h-4" />
              How did you hear about us? <span className="text-slate-400 text-[10px] lowercase font-normal">(Optional)</span>
            </div>

            {feedbackSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-xs text-emerald-400 font-medium py-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for your feedback! ✨</span>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {feedbackOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      disabled={isSubmittingFeedback}
                      onClick={() => handleSelectFeedback(option)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                        selectedSource === option
                          ? "bg-[#72E5F8] text-[#010E13] font-bold shadow-md shadow-[#72E5F8]/20"
                          : "border border-white/10 bg-slate-900/50 text-slate-300 hover:border-[#72E5F8]/40 hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {showCustomInput && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleCustomSubmit}
                      className="flex items-center gap-2 pt-2"
                    >
                      <input
                        type="text"
                        placeholder="Please specify source..."
                        value={customSource}
                        onChange={(e) => setCustomSource(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl glass-input text-xs outline-none"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingFeedback || !customSource.trim()}
                        className="px-4 py-2 rounded-xl bg-[#72E5F8] text-[#010E13] font-bold text-xs hover:bg-[#5BB8FF] transition-all flex items-center gap-1 disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Submit
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </div>

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
          Inter-School Innovation Competition — Online Awareness Session
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
                hackX Jr. 9.0 Online Awareness Session
              </h3>
              <p className="text-sm text-[#8ba3c7] leading-relaxed text-justify">
                Join our exclusive online awareness session to learn everything about hackX Jr. 9.0 — Sri
                Lanka’s premier island-wide school innovation hackathon. Discover how to build
                groundbreaking technology solutions and succeed in the competition.
              </p>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-b border-white/5 py-4 text-center">
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
                  <Globe className="w-4 h-4 text-[#72E5F8]" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wide block">
                    Mode
                  </span>
                  <span className="text-xs font-bold text-white">Online</span>
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
