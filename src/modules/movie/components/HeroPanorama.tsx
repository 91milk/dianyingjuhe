"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MovieItem } from "../types";
import { Play, Star, Sparkles, Flame, ChevronRight, ChevronLeft, Volume2, Info } from "lucide-react";
import { getOptimizedImageUrl } from "../utils/imageHelper";
import { encodePlayId } from "@/lib/playCipher";

interface HeroPanoramaProps {
  featuredMovies: MovieItem[];
}

export const HeroPanorama: React.FC<HeroPanoramaProps> = ({ featuredMovies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const movies = featuredMovies.length > 0 ? featuredMovies : [];
  const current = movies[currentIndex] || movies[0];

  useEffect(() => {
    if (isPaused || movies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, movies.length]);

  if (!current) return null;

  return (
    <div
      className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6 sm:mb-12 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 巨幕背景图与多重艺术氛围渐变 */}
      <div className="relative w-full min-h-[460px] md:min-h-[580px] lg:min-h-[640px] flex items-end">
        {/* 背景动态海报 */}
        <div
          key={current.id}
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out scale-105 filter brightness-75 contrast-110"
          style={{
            backgroundImage: `url(${getOptimizedImageUrl(current.banner || current.poster)})`,
          }}
        />

        {/* 顶部防盗链暗角与底部大景深渐变 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/60 to-[#0d0d0f]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0f] via-[#0d0d0f]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d0d0f] to-transparent pointer-events-none" />

        {/* 悬浮光斑微粒动效 */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 巨幕核心内容展示区 */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-12 pt-28 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          {/* 左侧主要信息 */}
          <div className="max-w-2xl space-y-4">
            {/* 顶栏徽章组 */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-[#ffcf32] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
                <Flame className="w-3.5 h-3.5 fill-black" /> 今日重磅焦点
              </span>

              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 text-[#ffcf32] text-xs font-bold flex items-center gap-1 shadow-md">
                <Star className="w-3.5 h-3.5 fill-[#ffcf32]" />
                豆瓣高分 {current.rating.toFixed(1)}
              </span>

              <span className="text-zinc-400 text-xs font-medium">
                {current.year} · {current.region} · {current.genres.join(" / ")}
              </span>
            </div>

            {/* 电影标题 (超大视觉冲击) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-2xl leading-none">
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
                立即播放正片
              </Link>

              <Link
                href={`/play/${encodePlayId(current.id)}`}
                className="flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold px-5 py-3.5 rounded-2xl backdrop-blur-md border border-zinc-700/80 transition-all text-sm cursor-pointer"
              >
                <Info className="w-4 h-4 text-zinc-400" />
                影评与看点档案
              </Link>
            </div>
          </div>

          {/* 右侧：交互式微型画廊选片栏 (仿 Apple TV+ 悬浮缩略导航) */}
          <div className="hidden lg:flex flex-col gap-3 shrink-0">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>正在展映推荐 ({currentIndex + 1} / {movies.length})</span>
              <span className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)}
                  className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % movies.length)}
                  className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
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
    </div>
  );
};
