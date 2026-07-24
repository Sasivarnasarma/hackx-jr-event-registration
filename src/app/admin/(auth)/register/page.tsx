"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { adminRegisterSchema, type AdminRegisterInput } from "@/lib/validation";
import { Turnstile } from "@/components/ui/turnstile";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AdminRegisterInput>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      turnstileToken: "",
    },
  });

  const onTurnstileVerify = useCallback(
    (token: string) => {
      setTurnstileToken(token);
      setValue("turnstileToken", token, { shouldValidate: true });
    },
    [setValue]
  );

  React.useEffect(() => {
    const isLocal =
      process.env.NODE_ENV === "development" ||
      (typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"));

    if (isLocal) {
      onTurnstileVerify("dummy");
    }
  }, [onTurnstileVerify]);

  const onSubmit = async (data: AdminRegisterInput) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error?.code === "VALIDATION_ERROR" && result.error.fields) {
          Object.keys(result.error.fields).forEach((key) => {
            const messages = result.error.fields[key];
            setError(key as any, { type: "server", message: messages[0] });
          });
        } else if (result.error?.code === "DUPLICATE_USERNAME") {
          setError("username", { type: "server", message: result.message });
        } else {
          setServerError(result.message || "An unexpected error occurred. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      setIsRegistered(true);
    } catch (err) {
      console.error(err);
      setServerError("Connection failed. Please check your internet connection.");
      setIsSubmitting(false);
    }
  };

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-12 relative z-10">
      {/* Brand Header with Logo */}
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
            width={220}
            height={68}
            priority
            className="h-14 w-auto object-contain drop-shadow-[0_0_20px_rgba(114,229,248,0.25)]"
          />
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {!isRegistered ? (
          <motion.div
            key="register-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glass-panel rounded-3xl p-6 md:p-8 max-w-md w-full"
          >
            <h2 className="text-xl font-black text-white tracking-wide uppercase font-heading mb-6 text-center">
              Admin Registration
            </h2>

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
                  Full Name
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

              {/* Username */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                  <User className="w-4 h-4 text-[#72E5F8]" />
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. admin_username"
                  {...register("username")}
                  suppressHydrationWarning
                  className={`w-full px-4 py-3 rounded-xl glass-input outline-none text-sm ${
                    errors.username ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                />
                {errors.username && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-light">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#72E5F8]" />
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  suppressHydrationWarning
                  className={`w-full px-4 py-3 rounded-xl glass-input outline-none text-sm ${
                    errors.password ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-light">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.password.message}
                  </p>
                )}
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
                    Registering...
                  </>
                ) : (
                  <>
                    Request Admin Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              <div className="text-center mt-4">
                <span className="text-xs text-slate-400">Already registered? </span>
                <Link href="/admin/login" className="text-[#72E5F8] text-xs hover:underline">
                  Log in here
                </Link>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-panel rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
          >
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-[#72E5F8] drop-shadow-[0_0_15px_rgba(114,229,248,0.3)]" />
            </div>

            <h3 className="text-xl font-extrabold text-white tracking-tight font-heading uppercase mb-3">
              Request Submitted
            </h3>

            <p className="text-slate-400 text-sm leading-relaxed font-light mb-6">
              Your registration request has been successfully saved. It is currently <b>PENDING</b>{" "}
              approval by an Admin.
            </p>

            <Link
              href="/admin/login"
              className="inline-flex w-full py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 items-center justify-center gap-2 border border-[#0A5C72]/30 bg-slate-900/40 hover:bg-slate-900 text-slate-300 hover:text-white"
            >
              Go to Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Copyright */}
      <div className="mt-8 text-center">
        <p className="text-[9px] text-slate-600 font-light tracking-wide">
          © 2026 hackX national hackathon series. All rights reserved.
        </p>
      </div>
    </div>
  );
}
