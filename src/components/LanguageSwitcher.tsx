"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { LOCALES, SupportedLocale } from "@/i18n/config";
import { Globe, Check } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = "" }) => {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/12 bg-white/[0.045] text-xs font-semibold text-[#f2efe9] hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer shadow-xs"
        aria-label="选择语言 / Select Language"
        title="选择语言 / Select Language"
      >
        <Globe className="h-3.5 w-3.5 text-zinc-400" />
        <span className="text-[11px]">{LOCALES[locale].flag}</span>
        <span className="text-[11px] font-bold hidden sm:inline">{LOCALES[locale].shortName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-white/15 bg-zinc-950/95 p-1.5 text-xs text-white shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 origin-top-right z-50">
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/10 mb-1">
            Language / 语言
          </div>
          {(Object.keys(LOCALES) as SupportedLocale[]).map((key) => {
            const isSelected = locale === key;
            const item = LOCALES[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setLocale(key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition cursor-pointer ${
                  isSelected
                    ? "bg-amber-400/15 text-amber-300 font-bold"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{item.flag}</span>
                  <span>{item.name}</span>
                </span>
                {isSelected && <Check className="h-3.5 w-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
