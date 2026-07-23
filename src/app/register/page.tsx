"use client";

import React, { useState, useCallback } from "react";
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
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { registrationSchema, type RegistrationInput, gradeOptions, participantTypes } from "@/lib/validation";
import { Turnstile } from "@/components/ui/turnstile";

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);
  
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
    }
  });

  const onTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
    setValue("turnstileToken", token, { shouldValidate: true });
  }, [setValue]);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      onTurnstileVerify("dummy");
    }
  }, [onTurnstileVerify]);

  const onSubmit = async (data: RegistrationInput) => {
    setIsSubmitting(true);
    setServerError(null);

    // If "Other" source was selected, override awarenessSource with the custom text input
    let payload = { ...data };
    if (selectedSource === "Other") {
      if (!customSource.trim()) {
        setError("awarenessSource", { 
          type: "manual", 
          message: "Please specify how you heard about the session" 
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

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 relative z-10">
      
      {/* Brand Header with Logo only */}
      <div className="text-center mb-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-2"
        >
          <Image
            src="/Logos/hackxJr-logo.webp"
            alt="hackX Jr. 9.0 Logo"
            width={260}
            height={80}
            priority
            className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_20px_rgba(114,229,248,0.25)]"
          />
        </motion.div>
      </div>

      {/* Registration Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel rounded-3xl p-6 md:p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {serverError && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
              <User className="w-4 h-4 text-[#72E5F8]" />
              Full Name <span className="text-[#72E5F8]">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("fullName")}
              suppressHydrationWarning
              className={`w-full px-4 py-3 rounded-xl glass-input outline-none text-sm ${
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
                <Phone className="w-4 h-4 text-[#72E5F8]" />
                Mobile Number <span className="text-[#72E5F8]">*</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 0771234567"
                {...register("mobileNumber")}
                suppressHydrationWarning
                className={`w-full px-4 py-3 rounded-xl glass-input outline-none text-sm ${
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
                <Mail className="w-4 h-4 text-[#72E5F8]" />
                Email Address <span className="text-slate-500 text-[10px]">(Optional)</span>
              </label>
              <input
                type="email"
                placeholder="e.g. name@example.com"
                {...register("email")}
                suppressHydrationWarning
                className={`w-full px-4 py-3 rounded-xl glass-input outline-none text-sm ${
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
                <User className="w-4 h-4 text-[#72E5F8]" />
                Participant Type <span className="text-[#72E5F8]">*</span>
              </label>
              <select
                {...register("participantType", {
                  onChange: (e) => {
                    setSelectedPartType(e.target.value);
                    if (e.target.value !== "STUDENT") {
                      setValue("grade", ""); 
                    }
                  }
                })}
                className={`w-full px-4 py-3 rounded-xl glass-select outline-none text-sm ${
                  errors.participantType ? "border-red-500/50 focus:border-red-500" : ""
                }`}
                defaultValue=""
              >
                <option value="" disabled>Select Type</option>
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
                <School className="w-4 h-4 text-[#72E5F8]" />
                School <span className="text-[#72E5F8]">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your school name"
                {...register("school")}
                suppressHydrationWarning
                className={`w-full px-4 py-3 rounded-xl glass-input outline-none text-sm ${
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
                  <GraduationCap className="w-4 h-4 text-[#72E5F8]" />
                  Grade <span className="text-[#72E5F8]">*</span>
                </label>
                <select
                  {...register("grade")}
                  className={`w-full px-4 py-3 rounded-xl glass-select outline-none text-sm ${
                    errors.grade ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>Select Grade</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
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
                <Eye className="w-4 h-4 text-[#72E5F8]" />
                How did you hear about this session? <span className="text-slate-500 text-[10px]">(Optional)</span>
              </label>
              <select
                {...register("awarenessSource", {
                  onChange: (e) => {
                    setSelectedSource(e.target.value);
                  }
                })}
                className={`w-full px-4 py-3 rounded-xl glass-select outline-none text-sm ${
                  errors.awarenessSource ? "border-red-500/50 focus:border-red-500" : ""
                }`}
                defaultValue=""
              >
                <option value="" disabled>Select Source (Optional)</option>
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
                    Please specify source <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Newspaper, flyer, billboard"
                    value={customSource}
                    onChange={(e) => setCustomSource(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input outline-none text-sm"
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
            disabled={isSubmitting || !turnstileToken}
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

      {/* Footer Copyright only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-[9px] text-slate-600 font-light tracking-wide">
          © 2026 hackX national hackathon series. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
