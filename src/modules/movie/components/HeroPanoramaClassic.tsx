"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MovieItem } from "../types";
import { Play, Info, Star, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { getOptimizedImageUrl } from "../utils/imageHelper";
import { encodePlayId } from "@/lib/playCipher";
import { useLocale } from "@/i18n/LocaleContext";

interface HeroPanoramaProps {
  featuredMovies: MovieItem[];
}

export const HeroPanoramaClassic: React.FC<HeroPanoramaProps> = ({ featuredMovies }) => {
  const { t } = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 保证有影片可轮播
  const movies = featuredMovies.length > 0 ? featuredMovies : [];

  // 每 7 秒自动轮播
  useEffect(() => {
    if (movies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (movies.length === 0) return null;

  const current = movies[currentIndex];

  return (
    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 min-h-[460px] md:min-h-[580px] lg:min-h-[640px] flex items-end overflow-hidden group select-none">
      {/* 渐变遮罩层与背景海报 */}
      <div className="absolute inset-0 z-0">
        <img
          src={getOptimizedImageUrl(current.banner || current.poster)}
          alt={current.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "/api/img?fallback=1";
          }}
          className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-102 transition-transform duration-1000 ease-out"
        />
        {/* 四重电影级无缝渐变遮罩 (底部融合页面主背景 #0d0d0f，左侧突出文字对比度) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0f] via-[#0d0d0f]/70 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* 核心主展区 */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-16 pt-32 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        {/* 左侧：精炼影视信息卡 */}
        <div className="max-w-2xl space-y-3.5 animate-fade-in key={current.id}">
          {/* 标签属性阵列 */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#ffcf32] text-black font-extrabold flex items-center gap-1 shadow-md shadow-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-black" />
              {current.rating.toFixed(1)} 豆瓣高分
            </span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 backdrop-blur-md text-zinc-300 border border-zinc-700/60 font-medium">
              {current.year}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 backdrop-blur-md text-zinc-300 border border-zinc-700/60 font-medium">
              {current.region}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 backdrop-blur-md text-amber-300 border border-amber-500/30 font-medium">
              {current.genres.join(" / ")}
            </span>
            {current.updateStatus && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                {current.updateStatus}
              </span>
            )}
          </div>

          {/* 巨幕标题 */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md leading-tight">
            {current.title}
          </h1>

          {/* 原名或英文名 */}
          {current.originalTitle && (
            <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#ffcf32]/70">
              {current.originalTitle}
            </p>
          )}

          {/* 剧情概括 */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3 max-w-xl drop-shadow">
            {current.summary}
          </p>

          {/* AI 精彩看点胶囊 */}
          {current.aiHighlights && current.aiHighlights[0] && (
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/70 backdrop-blur-md border border-amber-500/30 text-xs text-amber-200/90 w-fit max-w-full">
              <div className="w-5 h-5 rounded-lg bg-[#ffcf32] flex items-center justify-center text-black shrink-0">
                <Sparkles className="w-3 h-3 fill-black" />
              </div>
              <span className="truncate font-medium">
                AI 精彩看点：{current.aiHighlights[0]}
              </span>
            </div>
          )}

          {/* 播放与交互按键 */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <Link
              href={`/play/${encodePlayId(current.id)}`}
              className="flex items-center gap-2 bg-[#ffcf32] hover:bg-yellow-300 text-black font-extrabold px-7 py-3.5 rounded-2xl shadow-xl shadow-amber-500/25 transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
            >
              <Play className="w-5 h-5 fill-black" />
              {t.home.playFeaturedBt}
            </Link>

            <Link
              href={`/play/${encodePlayId(current.id)}`}
              className="flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold px-5 py-3.5 rounded-2xl backdrop-blur-md border border-zinc-700/80 transition-all text-sm cursor-pointer"
            >
              <Info className="w-4 h-4 text-zinc-400" />
              {t.home.viewArchiveBt}
            </Link>
          </div>
        </div>

        {/* 右侧：交互式微型画廊选片栏 (仿 Apple TV+ 悬浮缩略导航) */}
        <div className="hidden lg:flex flex-col gap-3 shrink-0">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>{t.home.nowScreening} ({currentIndex + 1} / {movies.length})</span>
            <span className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)}
                className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                aria-label="上一个"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % movies.length)}
                className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                aria-label="下一个"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </span>
          </span>

          <div className="flex items-center gap-2.5">
            {movies.slice(0, 5).map((m, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-20 h-28 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border-2 ${
                    isActive
                      ? "border-[#ffcf32] scale-105 shadow-xl shadow-amber-500/30 ring-2 ring-[#ffcf32]/30"
                      : "border-transparent opacity-50 hover:opacity-100 hover:scale-100"
                  }`}
                >
                  <img
                    src={getOptimizedImageUrl(m.poster)}
                    alt={m.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-1">
                    <span className="text-[10px] text-white font-bold truncate leading-tight">
                      {m.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
