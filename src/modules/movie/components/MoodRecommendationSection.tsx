"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MovieItem } from "../types";
import { MovieCard } from "./MovieCard";
import {
  MoodType,
  MOOD_DEFINITIONS,
  MoodMeta,
} from "../types/mood";
import {
  Sparkles,
  Dices,
  ChevronRight,
  Compass,
} from "lucide-react";

interface MoodRecommendationSectionProps {
  moodCollections: Record<MoodType, MovieItem[]>;
}

export const MoodRecommendationSection: React.FC<MoodRecommendationSectionProps> = ({
  moodCollections,
}) => {
  const [activeMood, setActiveMood] = useState<MoodType>("weekend");
  const [refreshStep, setRefreshStep] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const activeMeta =
    MOOD_DEFINITIONS.find((m) => m.id === activeMood) || MOOD_DEFINITIONS[0];
  const candidatePool = moodCollections[activeMood] || [];

  // 换一批计算：每页 8 部，循环滚动
  const pageSize = 8;
  const totalItems = candidatePool.length;
  const startIndex = totalItems > 0 ? (refreshStep * pageSize) % totalItems : 0;
  let displayedMovies = candidatePool.slice(startIndex, startIndex + pageSize);

  // 如果剩余不够 8 部，则从头补齐
  if (displayedMovies.length < pageSize && totalItems > pageSize) {
    displayedMovies = [
      ...displayedMovies,
      ...candidatePool.slice(0, pageSize - displayedMovies.length),
    ];
  }

  const handleRefresh = () => {
    setIsRotating(true);
    setRefreshStep((prev) => prev + 1);
    setTimeout(() => {
      setIsRotating(false);
    }, 400);
  };

  const handleMoodSelect = (moodId: MoodType) => {
    setActiveMood(moodId);
    setRefreshStep(0);
  };

  return (
    <section className="space-y-4 sm:space-y-5 my-6 sm:my-10">
      {/* 头部标题与控制器 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#ffcf32] text-black shadow-md shadow-amber-500/20">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-[#ffcf32] uppercase tracking-wider">
              场景与情绪选片舱
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            AI 灵感推荐：今天你想看点什么？
          </h2>
          <p className="text-xs text-zinc-400">
            按心情场景一键秒切 · 智能混合 8 大真实片库与高分代表作
          </p>
        </div>

        {/* 右侧动作条：换一批 + 查看片库 */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-[#ffcf32] border border-zinc-700/80 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="换一批片源"
          >
            <Dices
              className={`w-3.5 h-3.5 text-[#ffcf32] transition-transform duration-500 ${
                isRotating ? "rotate-180" : ""
              }`}
            />
            <span>换一批</span>
          </button>

          <Link
            href={`/category?q=${encodeURIComponent(activeMeta.title)}`}
            className="flex items-center gap-0.5 text-xs font-semibold text-zinc-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-zinc-800/60 transition group"
          >
            <span>更多</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* 场景与心情滑轨胶囊 (移动端丝滑横滑，桌面端整齐排列) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {MOOD_DEFINITIONS.map((mood) => {
          const isActive = mood.id === activeMood;
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer border ${
                isActive
                  ? "bg-[#ffcf32] text-black border-amber-300 shadow-lg shadow-amber-500/25 scale-[1.02]"
                  : "bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border-zinc-800"
              }`}
            >
              <span className="text-base leading-none">{mood.icon}</span>
              <span className="whitespace-nowrap">{mood.title}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase leading-tight ${
                  isActive
                    ? "bg-black/85 text-amber-300"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {mood.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* AI 灵感导语条 (随 Tab 切换平滑更新) */}
      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-start sm:items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-amber-400/20 text-[#ffcf32] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-zinc-200 font-medium">
            {activeMeta.aiQuote}
          </span>
        </div>
        <span className="text-[11px] text-zinc-400 font-normal shrink-0">
          {activeMeta.tagline}
        </span>
      </div>

      {/* 8 宫格海报流 (紧凑、顺滑) */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 transition-opacity duration-300 ${
          isRotating ? "opacity-60" : "opacity-100"
        }`}
      >
        {displayedMovies.map((movie) => (
          <MovieCard key={`${activeMood}-${movie.id}`} movie={movie} />
        ))}
      </div>
    </section>
  );
};
