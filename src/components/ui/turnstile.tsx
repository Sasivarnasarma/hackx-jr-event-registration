"use client";

import { useEffect, useRef, useState } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

/**
 * A simple, robust Cloudflare Turnstile React wrapper.
 */
export function Turnstile({ siteKey, onVerify }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const widgetIdRef = useRef<string | null>(null);

  // 1. Inject script and check global availability
  useEffect(() => {
    const scriptId = "cloudflare-turnstile-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const interval = setInterval(() => {
      if ((window as any).turnstile) {
        clearInterval(interval);
        setLoaded(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // 2. Render Widget once container and window.turnstile are available
  useEffect(() => {
    if (!loaded || !containerRef.current) return;

    try {
      if (widgetIdRef.current && (window as any).turnstile) {
        (window as any).turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = (window as any).turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        theme: "dark",
      });
    } catch (err) {
      console.error("Failed to render Cloudflare Turnstile:", err);
    }

    return () => {
      if (widgetIdRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore
        }
      }
    };
  }, [loaded, siteKey, onVerify]);

  return (
    <div className="flex justify-center my-4">
      <div ref={containerRef} />
    </div>
  );
}
