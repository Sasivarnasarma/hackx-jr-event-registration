"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/validation";
import { Turnstile } from "@/components/ui/turnstile";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
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

  const onSubmit = async (data: AdminLoginInput) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/admin/login", {
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
        } else if (
          result.error?.code === "PENDING_APPROVAL" ||
          result.error?.code === "ACCOUNT_REJECTED"
        ) {
          setServerError(result.message);
        } else {
          setServerError(result.message || "Invalid username or password.");
        }
        setIsSubmitting(false);
        return;
      }

      // Success, route to dashboard landing page
      router.push("/admin/dashboard");
      router.refresh();
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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-3xl p-6 md:p-8 max-w-md w-full"
      >
        <h2 className="text-xl font-black text-white tracking-wide uppercase font-heading mb-6 text-center">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {serverError && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Username */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
              <User className="w-4 h-4 text-[#72E5F8]" />
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
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
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          <div className="text-center mt-4">
            <span className="text-xs text-slate-400">Need an account? </span>
            <Link href="/admin/register" className="text-[#72E5F8] text-xs hover:underline">
              Request one here
            </Link>
          </div>
        </form>
      </motion.div>

      {/* Footer Copyright */}
      <div className="mt-8 text-center">
        <p className="text-[9px] text-slate-600 font-light tracking-wide">
          © 2026 hackX national hackathon series. All rights reserved.
        </p>
      </div>
    </div>
  );
}
