"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Search, Compass, Flame, Film } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

const QUICK_PROMPTS = [
  { label: "豆瓣9.5分以上殿堂神作", query: "豆瓣高分" },
  { label: "让人后背发凉的悬疑推理", query: "悬疑" },
  { label: "全程高燃逆袭微短剧", query: "逆袭" },
  { label: "硬核相对论太空科幻", query: "科幻" },
  { label: "治愈心事的吉卜力温暖风", query: "治愈" },
];

export const AiFindBar: React.FC = () => {
  const router = useRouter();
  const { t } = useLocale();
  const [inputVal, setInputVal] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    router.push(`/category?query=${encodeURIComponent(inputVal.trim())}`);
  };

  const handlePromptClick = (query: string) => {
    router.push(`/category?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative my-4 sm:my-8 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-zinc-900/90 via-zinc-900 to-amber-950/30 border border-amber-500/20 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* 氛围流光 */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#ffcf32]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* 左侧引导文案 */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#ffcf32] text-black">
              <Sparkles className="w-4 h-4 fill-black" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#ffcf32]">
              {t.common.siteName} · {t.nav.aiSearch}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {t.home.aiFindTitle}
          </h3>
          <p className="text-xs text-zinc-400">
            {t.home.aiFindDesc}
          </p>
        </div>

        {/* 右侧搜索胶囊输入框 */}
        <form onSubmit={handleSearch} className="w-full md:max-w-md">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t.home.aiFindPlaceholder}
              className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#ffcf32] focus:ring-2 focus:ring-[#ffcf32]/20 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-xl bg-[#ffcf32] hover:bg-yellow-300 text-black font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-md shadow-amber-500/20"
            >
              {t.nav.aiSearch} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* 底部灵感热搜词快捷胶囊 */}
      <div className="relative z-10 mt-5 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-zinc-500 font-semibold flex items-center gap-1">
          <Compass className="w-3 h-3 text-[#ffcf32]" /> 热门探索：
        </span>
        {QUICK_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handlePromptClick(p.query)}
            className="text-[11px] px-3 py-1 rounded-full bg-zinc-800/70 hover:bg-zinc-700/90 text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-amber-400/50 transition cursor-pointer flex items-center gap-1"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};
