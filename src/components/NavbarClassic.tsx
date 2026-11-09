"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Film, Clock, Camera, Sparkles, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { TemplateSwitcher } from "./TemplateSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleContext";

interface NavbarProps {
  onOpenAiChat?: () => void;
  onOpenHistory?: () => void;
  onOpenVisionSearch?: () => void;
}

export const NavbarClassic: React.FC<NavbarProps> = ({
  onOpenAiChat,
  onOpenHistory,
  onOpenVisionSearch,
}) => {
  const router = useRouter();
  const { t } = useLocale();
  const [keyword, setKeyword] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/category?q=${encodeURIComponent(keyword.trim())}`);
    setIsMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* 站点 Logo 品牌区 */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-[#ffcf32] flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Film className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-1">
              {siteConfig.name}
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-[#ffcf32] border border-amber-400/30 font-bold">
                极速4K
              </span>
            </span>
            <span className="text-[9px] text-zinc-500 hidden sm:inline -mt-0.5">
              全网影视聚合 · AI 智能找片
            </span>
          </div>
        </Link>

        {/* 桌面端主分类导航 */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-zinc-300">
          {siteConfig.navItems.map((item) => {
            const isShortPlay = item.href.includes("shortplay");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  isShortPlay
                    ? "bg-gradient-to-r from-rose-500/20 to-amber-500/20 text-amber-300 font-bold border border-rose-500/40 hover:border-amber-400/60 shadow-xs"
                    : "hover:text-[#ffcf32] hover:bg-zinc-800/60"
                }`}
              >
                {isShortPlay && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                )}
                {item.title}
                {isShortPlay && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500 text-white font-extrabold uppercase leading-none">
                    HOT
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* 桌面端搜索栏 */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-md hidden sm:flex items-center relative"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-[#ffcf32] rounded-full pl-9 pr-10 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-hidden transition"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
        </form>

        {/* 功能按钮群 */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* 语言国际化切换器 */}
          <LanguageSwitcher />

          {/* 模板切换器 */}
          <TemplateSwitcher />

          {/* 移动端搜索按钮 */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="sm:hidden p-2 text-zinc-300 hover:text-[#ffcf32] hover:bg-zinc-800/80 rounded-xl transition cursor-pointer"
            title="搜索"
          >
            {isMobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          {/* 识图搜片 */}
          {siteConfig.modules.enableVisionSearch && (
            <button
              type="button"
              onClick={onOpenVisionSearch}
              className="p-2 text-zinc-300 hover:text-[#ffcf32] hover:bg-zinc-800/80 rounded-xl transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="以图搜片 / 剧照识片"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden lg:inline">以图识片</span>
            </button>
          )}

          {/* 观看历史 */}
          {siteConfig.modules.enableHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="p-2 text-zinc-300 hover:text-[#ffcf32] hover:bg-zinc-800/80 rounded-xl transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="播放历史"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden lg:inline">历史</span>
            </button>
          )}
        </div>
      </div>

      {/* 移动端展开搜索栏 */}
      {isMobileSearchOpen && (
        <div className="sm:hidden px-3 py-2 bg-zinc-900/95 border-t border-zinc-800">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索电影、电视剧、演员..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#ffcf32]"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#ffcf32] hover:bg-[#ffe066] text-black font-bold text-xs rounded-full cursor-pointer shrink-0"
            >
              搜索
            </button>
          </form>
        </div>
      )}

      {/* 移动端全品类快速导航栏 */}
      <div className="flex md:hidden items-center gap-2 px-3 py-1.5 overflow-x-auto no-scrollbar border-t border-zinc-800/60 bg-black/40">
        {siteConfig.navItems.map((item) => {
          const isShortPlay = item.href.includes("shortplay");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 px-2.5 py-1 text-xs rounded-lg transition whitespace-nowrap ${
                isShortPlay
                  ? "bg-gradient-to-r from-rose-500/20 to-amber-500/20 text-amber-300 font-bold border border-rose-500/40 flex items-center gap-1.5 shadow-xs"
                  : "text-zinc-400 hover:text-white bg-zinc-900/60"
              }`}
            >
              {isShortPlay && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
              {item.title}
              {isShortPlay && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500 text-white font-extrabold uppercase leading-none">
                  HOT
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </header>
  );
};
