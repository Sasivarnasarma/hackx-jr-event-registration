"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ShieldCheck,
  RefreshCcw,
  HelpCircle,
  Calendar,
  Globe,
  CheckCircle2,
  Send,
  MessageSquareHeart,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

function SuccessCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const name = searchParams.get("name") || "Participant";
  const rawId = searchParams.get("id");
  const registrationId = rawId ? parseInt(rawId, 10) : null;

  // Feedback poll state
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [customSource, setCustomSource] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const feedbackOptions = [
    { label: t("survey.option.school"), val: "School" },
    { label: t("survey.option.teacher"), val: "Teacher" },
    { label: t("survey.option.friend"), val: "Friend" },
    { label: t("survey.option.socialMedia"), val: "Social Media" },
    { label: t("survey.option.whatsapp"), val: "WhatsApp" },
    { label: t("survey.option.website"), val: "Website" },
    { label: t("survey.option.other"), val: "Other" },
  ];

  const handleSelectFeedback = async (optionValue: string) => {
    if (optionValue === "Other") {
      setSelectedSource("Other");
      setShowCustomInput(true);
      return;
    }

    setSelectedSource(optionValue);
    setShowCustomInput(false);
    await submitFeedback(optionValue);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
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
            <ShieldCheck className="w-3.5 h-3.5" /> {t("success.badge")}
          </span>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-heading uppercase mb-4">
            {t("success.title")}
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed font-light mb-6">
            {t("success.message", { name })}
          </p>
        </motion.div>

        {/* Prominent WhatsApp Group Join Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="my-6 p-6 rounded-3xl border-2 border-[#25D366]/50 bg-gradient-to-br from-[#022c16]/90 via-[#052E3F]/95 to-[#022c16]/90 backdrop-blur-xl relative overflow-hidden text-center shadow-[0_0_40px_rgba(37,211,102,0.25)]"
        >
          {/* Subtle background glow effect */}
          <div className="absolute -right-12 -top-12 w-36 h-36 bg-[#25D366]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-[#72E5F8]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] text-xs font-extrabold uppercase tracking-wider mb-3">
              <MessageCircle className="w-4 h-4" /> {t("whatsapp.badge")}
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white mb-2 font-heading uppercase tracking-wide">
              {t("whatsapp.title")}
            </h2>

            <p className="text-xs md:text-sm text-slate-300 mb-6 leading-relaxed max-w-lg font-light">
              {t("whatsapp.desc")}
            </p>

            <a
              href="https://chat.whatsapp.com/DDfWs4BA12t2Dgtx0NJkef"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 md:py-5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-[#010E13] font-black text-base md:text-xl tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:shadow-[0_0_50px_rgba(37,211,102,0.9)] flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
            >
              <svg className="w-7 h-7 md:w-8 md:h-8 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>{t("whatsapp.button")}</span>
              <ArrowRight className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:translate-x-1.5 flex-shrink-0" />
            </a>
          </div>
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
              {t("survey.question")}{" "}
              <span className="text-slate-400 text-[10px] lowercase font-normal">
                {t("survey.optional")}
              </span>
            </div>

            {feedbackSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-xs text-emerald-400 font-medium py-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t("survey.thanks")}</span>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {feedbackOptions.map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      disabled={isSubmittingFeedback}
                      onClick={() => handleSelectFeedback(opt.val)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                        selectedSource === opt.val
                          ? "bg-[#72E5F8] text-[#010E13] font-bold shadow-md shadow-[#72E5F8]/20"
                          : "border border-white/10 bg-slate-900/50 text-slate-300 hover:border-[#72E5F8]/40 hover:text-white"
                      }`}
                    >
                      {opt.label}
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
                        placeholder={t("survey.placeholder.other")}
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
                        {t("survey.button.submit")}
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
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-light">
          <HelpCircle className="w-4 h-4 text-[#72E5F8] flex-shrink-0" />
          <span>
            {t("success.assistance")}{" "}
            <a
              href="https://hackxjr.lk/#oc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#72E5F8] hover:underline transition-all"
            >
              {t("success.contactUs")}
            </a>
          </span>
        </div>

        <button
          onClick={() => router.push("/register")}
          className="w-full py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
            border border-[#0A5C72]/30 bg-slate-900/40 hover:bg-slate-900 text-slate-300 hover:text-white"
        >
          <RefreshCcw className="w-4 h-4" />
          {t("success.button.registerAnother")}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function RegistrationSuccessPage() {
  const { t, lang } = useLanguage();

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
                  <span className="text-xs font-bold text-white">{t("info.meta.modeValue")}</span>
                </div>
              </div>
            </div>

            {/* Highlight Points */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#5BB8FF] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-white">{t("info.point1.title")}</strong>{" "}
                  {t("info.point1.desc")}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#5BB8FF] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-white">{t("info.point2.title")}</strong>{" "}
                  {t("info.point2.desc")}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#5BB8FF] flex-shrink-0 mt-0.5" />
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
