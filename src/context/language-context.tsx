"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, getTranslation } from "@/lib/dictionary";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("preferred_language") as Language | null;
      if (savedLang && (savedLang === "en" || savedLang === "si")) {
        setLangState(savedLang);
      } else {
        // First-time visit: trigger language modal
        setShowModal(true);
      }
    } catch (e) {
      console.error("Failed to read preferred_language from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("preferred_language", newLang);
    } catch (e) {
      console.error("Failed to save preferred_language to localStorage", e);
    }
  };

  const selectLanguage = (selectedLang: Language) => {
    setLang(selectedLang);
    setShowModal(false);
  };

  const t = (key: string, replacements?: Record<string, string>) => {
    return getTranslation(lang, key, replacements);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
        showModal,
        setShowModal,
        selectLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
