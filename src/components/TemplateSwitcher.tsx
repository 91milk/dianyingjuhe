"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTemplate, TEMPLATES, SiteTemplate } from "@/context/TemplateContext";
import { Palette, Check, Sparkles, Flame, Zap } from "lucide-react";

interface TemplateSwitcherProps {
  variant?: "navbar" | "compact" | "cards";
  className?: string;
}

export const TemplateSwitcher: React.FC<TemplateSwitcherProps> = ({
  variant = "navbar",
  className = "",
}) => {
  const { template, setTemplate, toggleTemplate } = useTemplate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
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

  if (variant === "cards") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
        {(Object.keys(TEMPLATES) as SiteTemplate[]).map((key) => {
          const item = TEMPLATES[key];
          const isSelected = template === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTemplate(key)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? key === "classic"
                    ? "border-amber-400 bg-amber-400/10 text-white shadow-lg shadow-amber-500/10"
                    : "border-[#ef4b43] bg-[#ef4b43]/10 text-white shadow-lg shadow-red-500/10"
                  : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm flex items-center gap-1.5 text-white">
                  {key === "classic" ? (
                    <Zap className="w-4 h-4 text-[#ffcf32] fill-[#ffcf32]" />
                  ) : (
                    <Flame className="w-4 h-4 text-[#ef4b43] fill-[#ef4b43]" />
                  )}
                  {item.name}
                </span>
                {isSelected && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold text-black ${
                      key === "classic" ? "bg-[#ffcf32]" : "bg-[#ef4b43] text-white"
                    }`}
                  >
                    当前激活
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-2">{item.tagline}</p>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
          template === "classic"
            ? "bg-zinc-900/90 text-zinc-200 border-amber-500/30 hover:border-amber-400 hover:text-[#ffcf32]"
            : "bg-white/[0.05] text-[#b8b7b3] border-white/15 hover:border-[#ef4b43]/60 hover:text-white"
        }`}
        title="切换主题模板"
        aria-label="切换网站视觉模板"
      >
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {template === "classic" ? "经典暖金" : "先锋红影"}
        </span>
        <span
          className={`w-2 h-2 rounded-full ${
            template === "classic" ? "bg-[#ffcf32] animate-pulse" : "bg-[#ef4b43]"
          }`}
        />
      </button>

      {/* 下拉面板 */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-64 rounded-2xl p-2 z-50 border shadow-2xl backdrop-blur-xl animate-fade-in ${
            template === "classic"
              ? "bg-zinc-950/95 border-zinc-800 text-zinc-200"
              : "bg-[#121516]/95 border-white/15 text-[#f2efe9]"
          }`}
        >
          <div className="px-2.5 py-2 border-b border-white/10 mb-1 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">选择界面视觉风格</span>
            <span className="text-[10px] text-zinc-500">秒级无缝切换</span>
          </div>

          <div className="space-y-1">
            {(Object.keys(TEMPLATES) as SiteTemplate[]).map((key) => {
              const item = TEMPLATES[key];
              const isSelected = template === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setTemplate(key);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? key === "classic"
                        ? "bg-amber-400/15 border border-amber-400/40 text-amber-300 font-bold"
                        : "bg-red-500/15 border border-red-500/40 text-[#ff7872] font-bold"
                      : "hover:bg-white/5 text-zinc-400 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                      {key === "classic" ? (
                        <Zap className="w-3.5 h-3.5 text-[#ffcf32] fill-[#ffcf32]" />
                      ) : (
                        <Flame className="w-3.5 h-3.5 text-[#ef4b43] fill-[#ef4b43]" />
                      )}
                      <span>{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/10 text-zinc-300 font-normal">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400">{item.tagline}</p>
                  </div>

                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
