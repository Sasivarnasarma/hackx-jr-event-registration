"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  School,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Calendar,
  Globe,
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
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function RegisterPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);

  // State for tracking selected participant type
  const [selectedPartType, setSelectedPartType] = useState<string>("");

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
      participantType: undefined,
      school: "",
      grade: "",
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
        message: t("val.captcha.required"),
      });
      setIsSubmitting(false);
      return;
    }

    // Prepare payload with resolved token
    const payload = {
      ...data,
      turnstileToken: currentToken,
    };

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
          setError("mobileNumber", { type: "server", message: t("val.duplicate.whatsapp") });
        } else {
          setServerError(result.message || t("val.connection.error"));
        }
        setIsSubmitting(false);
        return;
      }

      const regId = result.data?.id ? `&id=${result.data.id}` : "";
      router.push(`/registration-success?name=${encodeURIComponent(data.fullName)}${regId}`);
    } catch (err) {
      console.error(err);
      setServerError(t("val.connection.error"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 relative z-10">
      {/* Top Floating Language Switcher Header */}
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>

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
          className="text-xs md:text-sm font-semibold tracking-widest text-[#8ba3c7] uppercase text-center leading-relaxed"
        >
          {t("header.tagline")}
        </motion.p>
      </div>

      {/* Main Split-Style Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Registration Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel order-2 lg:order-1 lg:col-span-8 rounded-3xl p-6 md:p-10 relative overflow-hidden h-full flex flex-col"
        >
          <div className="mb-6 relative z-10">
            <h2 className="text-xl md:text-3xl font-black font-heading text-white tracking-wide uppercase">
              {lang === "en" ? (
                <>
                  <span className="subtle-sweep-online">ONLINE</span> AWARENESS SESSION REGISTRATION
                </>
              ) : (
                <>
                  <span className="subtle-sweep-online">ONLINE</span> දැනුවත් කිරීමේ වැඩසටහන සඳහා ලියාපදිංචිය
                </>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 font-light">{t("form.subtitle")}</p>
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
                <User className="w-4 h-4 text-[#72E5F8]" />
                {t("form.label.fullName")} <span className="text-[#72E5F8]">*</span>
              </label>
              <input
                type="text"
                placeholder={t("form.placeholder.fullName")}
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

            {/* WhatsApp Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#72E5F8]" />
                {t("form.label.whatsapp")} <span className="text-[#72E5F8]">*</span>
              </label>
              <input
                type="tel"
                placeholder={t("form.placeholder.whatsapp")}
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

            {/* Participant Details Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Participant Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                  <User className="w-4 h-4 text-[#72E5F8]" />
                  {t("form.label.participantType")} <span className="text-[#72E5F8]">*</span>
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
                    {t("form.option.defaultType")}
                  </option>
                  <option value="STUDENT">{t("form.option.student")}</option>
                  <option value="TEACHER">{t("form.option.teacher")}</option>
                  <option value="PRINCIPAL">{t("form.option.principal")}</option>
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
                  {t("form.label.school")} <span className="text-[#72E5F8]">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t("form.placeholder.school")}
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

            {/* Conditional Grade Dropdown - Shown ONLY for Student */}
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
                    {t("form.label.grade")} <span className="text-[#72E5F8]">*</span>
                  </label>
                  <select
                    {...register("grade")}
                    className={`w-full px-4 py-3.5 rounded-xl glass-select outline-none text-sm ${
                      errors.grade ? "border-red-500/50 focus:border-red-500" : ""
                    }`}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {t("form.option.defaultGrade")}
                    </option>
                    <option value="Grade 8">{t("form.option.grade8")}</option>
                    <option value="Grade 9">{t("form.option.grade9")}</option>
                    <option value="Grade 10">{t("form.option.grade10")}</option>
                    <option value="Grade 11">{t("form.option.grade11")}</option>
                    <option value="Grade 12">{t("form.option.grade12")}</option>
                    <option value="Grade 13">{t("form.option.grade13")}</option>
                    <option value="Other">{t("form.option.otherGrade")}</option>
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
                  {t("form.button.submitting")}
                </>
              ) : (
                <>
                  {t("form.button.submit")}
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
                {t("info.title")}
              </h3>
              <p lang={lang} className="text-sm text-[#8ba3c7] leading-relaxed text-justify [text-align-last:left] hyphens-auto [word-break:break-word]">
                {t("info.description")}
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
                    {t("info.meta.dateLabel")}
                  </span>
                  <span className="text-xs font-bold text-white">{t("info.meta.dateValue")}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#052E3F] border border-[#72E5F8]/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-[#72E5F8]" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wide block">
                    {t("info.meta.modeLabel")}
                  </span>
                  <span className="text-xs font-bold text-white leading-tight block">
                    {t("info.meta.modeValue")}
                  </span>
                </div>
              </div>
            </div>

            {/* Highlight Points */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#72E5F8] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-white">{t("info.point1.title")}</strong>{" "}
                  {t("info.point1.desc")}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#72E5F8] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-white">{t("info.point2.title")}</strong>{" "}
                  {t("info.point2.desc")}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#72E5F8] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-white">{t("info.point3.title")}</strong>{" "}
                  {t("info.point3.desc")}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-[10px] text-[#8ba3c7] uppercase tracking-wider font-semibold">
              {t("info.org.line1")}
            </p>
            <p className="text-[9px] text-slate-500 mt-1">{t("info.org.line2")}</p>
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
        <p className="text-xs text-slate-500 font-light tracking-wide">{t("info.footer.copyright")}</p>
      </motion.div>
    </div>
  );
}
