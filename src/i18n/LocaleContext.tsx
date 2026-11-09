"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  SupportedLocale,
  DEFAULT_LOCALE,
  LOCALES,
  LocaleDefinition,
  LOCALE_COOKIE_NAME,
  LOCALE_STORAGE_KEY,
} from "./config";
import { TRANSLATIONS, Translations } from "./translations";

interface LocaleContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: Translations;
  localeConfig: LocaleDefinition;
  isChinese: boolean;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: TRANSLATIONS[DEFAULT_LOCALE],
  localeConfig: LOCALES[DEFAULT_LOCALE],
  isChinese: true,
});

export const LocaleProvider: React.FC<{
  children: React.ReactNode;
  initialLocale?: SupportedLocale;
}> = ({ children, initialLocale = DEFAULT_LOCALE }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);

  // 初始化从 localStorage 检查偏好
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as SupportedLocale;
      if (saved && LOCALES[saved] && saved !== locale) {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // ignore
    }
  }, [locale]);

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    if (!LOCALES[newLocale]) return;
    setLocaleState(newLocale);
    document.documentElement.lang = newLocale;

    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  }, []);

  const t = TRANSLATIONS[locale] || TRANSLATIONS[DEFAULT_LOCALE];
  const localeConfig = LOCALES[locale] || LOCALES[DEFAULT_LOCALE];
  const isChinese = locale === "zh-CN";

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t,
        localeConfig,
        isChinese,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
