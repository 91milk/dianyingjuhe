"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Camera, Clock, Film, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onOpenAiChat?: () => void;
  onOpenVisionSearch: () => void;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenVisionSearch,
  onOpenHistory,
}) => {
  const [keyword, setKeyword] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/category?q=${encodeURIComponent(keyword.trim())}`);
    setIsMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121214]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* 品牌 LOGO */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#ffcf32] flex items-center justify-center text-black font-extrabold shadow-md shadow-amber-400/20 group-hover:scale-105 transition-transform">
              <Film className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1">
                流量君<span className="text-[#ffcf32]">AI</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-zinc-400 tracking-wider hidden xs:block">
                智能影视助手
              </span>
            </div>
          </Link>

          {/* 导航链接 (桌面端) */}
          <nav className="hidden md:flex items-center gap-1.5">
            {siteConfig.navItems.map((item) => {
              const isShortPlay = item.href.includes("shortplay");
              if (isShortPlay) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-3 py-1 text-xs font-bold text-amber-300 hover:text-white bg-gradient-to-r from-amber-500/15 to-rose-500/15 hover:from-amber-500/25 hover:to-rose-500/25 rounded-lg transition border border-amber-500/30 flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>热门短剧</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black leading-tight">
                      HOT
                    </span>
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg transition"
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 桌面端搜索栏 */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-md hidden sm:flex items-center relative"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索电影、电视剧、演员..."
            className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-[#ffcf32] rounded-full pl-9 pr-10 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-hidden transition"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
        </form>

        {/* 功能按钮群 */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* 移动端搜索按钮 */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="sm:hidden p-2 text-zinc-300 hover:text-[#ffcf32] hover:bg-zinc-800/80 rounded-xl transition cursor-pointer"
            title="搜索"
          >
            {isMobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          {/* 识图搜片 */}
          {siteConfig.modules.enableVisionSearch && (
            <button
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
