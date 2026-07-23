"use client";

import { useEffect, useRef } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  theme?: "light" | "dark" | "auto";
}

/**
 * A lightweight, dependency-free Cloudflare Turnstile React wrapper.
 */
export function Turnstile({ siteKey, onVerify, theme = "dark" }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const onVerifyRef = useRef(onVerify);
  
  // Keep the ref updated with the latest callback
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    // 1. Define global callbacks
    const callbackName = `cf_verify_callback_${Math.random().toString(36).substring(2, 9)}`;
    (window as any)[callbackName] = (token: string) => {
      onVerifyRef.current(token);
    };

    // 2. Initialize onload callback
    const onloadCallbackName = "onloadTurnstileCallback";
    (window as any)[onloadCallbackName] = () => {
      renderWidget();
    };

    // 3. Render function
    const renderWidget = () => {
      if (containerRef.current && (window as any).turnstile) {
        try {
          // If already rendered, reset/remove it
          if (widgetIdRef.current) {
            (window as any).turnstile.remove(widgetIdRef.current);
          }
          
          widgetIdRef.current = (window as any).turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: callbackName,
            theme: theme,
          });
        } catch (err) {
          console.error("Failed to render Cloudflare Turnstile:", err);
        }
      }
    };

    // 4. Dynamically inject Cloudflare Turnstile script
    const scriptId = "cloudflare-turnstile-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${onloadCallbackName}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else if ((window as any).turnstile) {
      // Script is already loaded and turnstile object is ready
      renderWidget();
    }

    // 5. Cleanup on unmount
    return () => {
      if (widgetIdRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore
        }
      }
      delete (window as any)[callbackName];
    };
  }, [siteKey, theme]);

  return (
    <div className="flex justify-center my-4">
      <div ref={containerRef} id="turnstile-container" />
    </div>
  );
}
