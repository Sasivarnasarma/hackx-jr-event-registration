"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  School,
  GraduationCap,
  Eye,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  registrationSchema,
  type RegistrationInput,
  gradeOptions,
  participantTypes,
} from "@/lib/validation";
import { Turnstile } from "@/components/ui/turnstile";

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);

  // Countdown Timer Logic
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    const target = new Date("2026-08-01T09:00:00");

    const calculate = () => {
      const difference = +target - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculate());
    const timer = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Spotlight mouse effect position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Custom states for tracking conditional selection triggers
  const [selectedPartType, setSelectedPartType] = useState<string>("");
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [customSource, setCustomSource] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      email: "",
      participantType: undefined,
      school: "",
      grade: "",
      awarenessSource: "",
      turnstileToken: "",
    },
  });

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  const onTurnstileVerify = useCallback(
    (token: string) => {
      setTurnstileToken(token);
      setValue("turnstileToken", token, { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = async (data: RegistrationInput) => {
    setIsSubmitting(true);
    setServerError(null);

    // Dynamic Turnstile Token Resolution
    let currentToken = turnstileToken;
    const isLocalOrDummy =
      process.env.NODE_ENV === "development" ||
      siteKey === "1x00000000000000000000AA" ||
      (typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"));

    if (isLocalOrDummy && !currentToken) {
      currentToken = "dummy";
    }

    if (!currentToken) {
      setError("turnstileToken", {
        type: "manual",
        message: "Bot verification is required. Please solve the captcha.",
      });
      setIsSubmitting(false);
      return;
    }

    // Prepare payload with resolved token
    const payload = {
      ...data,
      turnstileToken: currentToken,
    };

    // If "Other" source was selected, override awarenessSource with the custom text input
    if (selectedSource === "Other") {
      if (!customSource.trim()) {
        setError("awarenessSource", {
          type: "manual",
          message: "Please specify how you heard about the session",
        });
        setIsSubmitting(false);
        return;
      }
      payload.awarenessSource = customSource;
    }

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error?.code === "VALIDATION_ERROR" && result.error.fields) {
          Object.keys(result.error.fields).forEach((key) => {
            const messages = result.error.fields[key];
            setError(key as any, { type: "server", message: messages[0] });
          });
        } else if (result.error?.code === "DUPLICATE_MOBILE") {
          setError("mobileNumber", { type: "server", message: result.message });
        } else if (result.error?.code === "DUPLICATE_EMAIL") {
          setError("email", { type: "server", message: result.message });
        } else {
          setServerError(result.message || "An unexpected error occurred. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      router.push(`/registration-success?name=${encodeURIComponent(data.fullName)}`);
    } catch (err) {
      console.error(err);
      setServerError("Connection failed. Please check your internet connection.");
      setIsSubmitting(false);
    }
  };

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
        {/* Registration Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onMouseMove={handleMouseMove}
          style={
            {
              "--mouse-x": `${mousePosition.x}px`,
              "--mouse-y": `${mousePosition.y}px`,
            } as React.CSSProperties
          }
          className="glass-panel order-2 lg:order-1 lg:col-span-8 rounded-3xl p-6 md:p-10 relative overflow-hidden h-full flex flex-col"
        >
          <div className="mouse-spotlight" />

          <div className="mb-6 relative z-10">
            <h2 className="text-xl md:text-2xl font-black font-heading text-white tracking-wide uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-[#72E5F8]">
              Reserve Your Spot
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-light">
              Fill out the details below to complete your registration.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10" noValidate>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{serverError}</span>
              </motion.div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                <User className="w-4 h-4 text-[#5BB8FF]" />
                Full Name <span className="text-[#5BB8FF]">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register("fullName")}
                suppressHydrationWarning
                className={`w-full px-4 py-3.5 rounded-xl glass-input outline-none text-sm ${
                  errors.fullName ? "border-red-500/50 focus:border-red-500" : ""
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-light">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Contact Details Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#5BB8FF]" />
                  Mobile Number <span className="text-[#5BB8FF]">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0771234567"
                  {...register("mobileNumber")}
                  suppressHydrationWarning
                  className={`w-full px-4 py-3.5 rounded-xl glass-input outline-none text-sm ${
                    errors.mobileNumber ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-light">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#5BB8FF]" />
                  Email Address <span className="text-slate-500 text-[10px]">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@example.com"
                  {...register("email")}
                  suppressHydrationWarning
                  className={`w-full px-4 py-3.5 rounded-xl glass-input outline-none text-sm ${
                    errors.email ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-light">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Participant Details Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Participant Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                  <User className="w-4 h-4 text-[#5BB8FF]" />
                  Participant Type <span className="text-[#5BB8FF]">*</span>
                </label>
                <select
                  {...register("participantType", {
                    onChange: (e) => {
                      setSelectedPartType(e.target.value);
                      if (e.target.value !== "STUDENT") {
                        setValue("grade", "");
                      }
                    },
                  })}
                  className={`w-full px-4 py-3.5 rounded-xl glass-select outline-none text-sm ${
                    errors.participantType ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {participantTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                {errors.participantType && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-light">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.participantType.message}
                  </p>
                )}
              </div>

              {/* School */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                  <School className="w-4 h-4 text-[#5BB8FF]" />
                  School <span className="text-[#5BB8FF]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your school name"
                  {...register("school")}
                  suppressHydrationWarning
                  className={`w-full px-4 py-3.5 rounded-xl glass-input outline-none text-sm ${
                    errors.school ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                />
                {errors.school && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-light">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.school.message}
                  </p>
                )}
              </div>
            </div>

            {/* Conditional Grade Dropdown */}
            <AnimatePresence>
              {selectedPartType === "STUDENT" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#5BB8FF]" />
                    Grade <span className="text-[#5BB8FF]">*</span>
                  </label>
                  <select
                    {...register("grade")}
                    className={`w-full px-4 py-3.5 rounded-xl glass-select outline-none text-sm ${
                      errors.grade ? "border-red-500/50 focus:border-red-500" : ""
                    }`}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Grade
                    </option>
                    {gradeOptions.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                  {errors.grade && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-light">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.grade.message}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Awareness Source selection */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#5BB8FF]" />
                  How did you hear about this session?{" "}
                  <span className="text-slate-500 text-[10px]">(Optional)</span>
                </label>
                <select
                  {...register("awarenessSource", {
                    onChange: (e) => {
                      setSelectedSource(e.target.value);
                    },
                  })}
                  className={`w-full px-4 py-3.5 rounded-xl glass-select outline-none text-sm ${
                    errors.awarenessSource ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Source (Optional)
                  </option>
                  <option value="School">School</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Friend">Friend</option>
                  <option value="Social media">Social Media</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Website">Website</option>
                  <option value="Other">Other (Please specify)</option>
                </select>
                {errors.awarenessSource && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-light">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.awarenessSource.message}
                  </p>
                )}
              </div>

              {/* Conditional Other Source text input */}
              <AnimatePresence>
                {selectedSource === "Other" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Please specify source <span className="text-[#5BB8FF]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Newspaper, flyer, billboard"
                      value={customSource}
                      onChange={(e) => setCustomSource(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl glass-input outline-none text-sm"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cloudflare Turnstile */}
            <div className="space-y-2">
              <Turnstile siteKey={siteKey} onVerify={onTurnstileVerify} />
              {errors.turnstileToken && (
                <p className="text-xs text-red-400 text-center flex items-center justify-center gap-1 font-light">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.turnstileToken.message}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-45 disabled:cursor-not-allowed mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Registration
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Right Info Column (Info Panel Layout) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-panel order-1 lg:order-2 lg:col-span-4 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 h-full"
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

            {/* Event Countdown Timer */}
            {mounted && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block text-center font-bold">
                  Event Starts In
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-[#052E3F]/40 border border-white/5 rounded-2xl p-3 text-center flex flex-col items-center justify-center">
                    <span className="text-xl font-heading font-black text-[#72E5F8] tracking-tight">
                      {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] uppercase tracking-wide text-slate-400 font-bold mt-0.5">
                      Days
                    </span>
                  </div>

                  <div className="bg-[#052E3F]/40 border border-white/5 rounded-2xl p-3 text-center flex flex-col items-center justify-center">
                    <span className="text-xl font-heading font-black text-[#72E5F8] tracking-tight">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] uppercase tracking-wide text-slate-400 font-bold mt-0.5">
                      Hours
                    </span>
                  </div>

                  <div className="bg-[#052E3F]/40 border border-white/5 rounded-2xl p-3 text-center flex flex-col items-center justify-center">
                    <span className="text-xl font-heading font-black text-[#72E5F8] tracking-tight">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] uppercase tracking-wide text-slate-400 font-bold mt-0.5">
                      Mins
                    </span>
                  </div>

                  <div className="bg-[#052E3F]/40 border border-white/5 rounded-2xl p-3 text-center flex flex-col items-center justify-center relative overflow-hidden group">
                    <span className="text-xl font-heading font-black text-[#72E5F8] tracking-tight">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] uppercase tracking-wide text-slate-400 font-bold mt-0.5">
                      Secs
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Event Details Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-b border-white/5 py-4 text-center">
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
