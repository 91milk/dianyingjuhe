"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { MovieItem } from "../types";
import { Play, Star, ChevronLeft, ChevronRight, Trophy, Flame } from "lucide-react";
import { getOptimizedImageUrl } from "../utils/imageHelper";
import { encodePlayId } from "@/lib/playCipher";
import { useLocale } from "@/i18n/LocaleContext";
import { getLocalizedMovie } from "../utils/localizeMovie";

interface DoubanTopRailProps {
  movies: MovieItem[];
  globalMovies?: MovieItem[];
}

export const DoubanTopRailClassic: React.FC<DoubanTopRailProps> = ({ movies, globalMovies = [] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isChinese, locale, t } = useLocale();

  // 中文区使用豆瓣源，外文区自动使用全球 IMDb / TMDB 传奇神作榜
  const rawDisplayMovies = (!isChinese && globalMovies.length > 0) ? globalMovies : movies;
  const displayMovies = rawDisplayMovies.map((m) => getLocalizedMovie(m, locale));

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -480 : 480;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  if (!displayMovies || displayMovies.length === 0) return null;

  return (
    <div className="relative space-y-4 my-8">
      {/* 头部标题与滑动控制器 */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#ffcf32] text-black">
              <Trophy className="w-4 h-4 fill-black" />
            </span>
            <span className="text-xs font-bold text-[#ffcf32] uppercase tracking-wider">
              {isChinese ? "本周口碑殿堂 TOP 10" : "Global Hall of Fame TOP 10"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            {isChinese ? t.home.rankingTitleDouban : t.home.rankingTitleImdb}
            <span className="text-xs font-normal text-zinc-400 hidden sm:inline">
              · {isChinese ? t.home.rankingDescDouban : t.home.rankingDescImdb}
            </span>
          </h2>
        </div>

        {/* 左右滑动指示器 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all cursor-pointer shadow-sm active:scale-95"
            title="向左滚动"
            aria-label="向左滚动"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all cursor-pointer shadow-sm active:scale-95"
            title="向右滚动"
            aria-label="向右滚动"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 横向滚动海报长廊 */}
      <div
        ref={scrollRef}
        className="flex gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1"
      >
        {displayMovies.map((movie, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;

          return (
            <Link
              key={movie.id}
              href={`/play/${encodePlayId(movie.id)}`}
              className="group relative shrink-0 w-[140px] sm:w-[168px] md:w-[180px] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer"
            >
              {/* 海报卡片 */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                <img
                  src={getOptimizedImageUrl(movie.poster)}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />

                {/* 暗影渐变 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* 排名大数字徽标 */}
                <div className="absolute top-2 left-2 z-10">
                  <div
                    className={`flex items-center justify-center font-black rounded-lg px-2 py-0.5 text-xs shadow-md ${
                      rank === 1
                        ? "bg-gradient-to-r from-amber-400 to-[#ffcf32] text-black shadow-amber-500/30"
                        : rank === 2
                        ? "bg-zinc-200 text-black shadow-zinc-500/20"
                        : rank === 3
                        ? "bg-amber-700 text-amber-100 shadow-amber-900/20"
                        : "bg-black/75 text-zinc-300 border border-zinc-700 backdrop-blur-xs"
                    }`}
                  >
                    TOP {rank}
                  </div>
                </div>

                {/* 豆瓣评分 */}
                <div className="absolute top-2 right-2 z-10">
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/75 text-[10px] font-bold text-[#ffcf32] border border-amber-500/30 backdrop-blur-xs">
                    <Star className="w-2.5 h-2.5 fill-[#ffcf32]" />
                    {movie.rating.toFixed(1)}
                  </span>
                </div>

                {/* 悬浮播放按钮动效 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#ffcf32] flex items-center justify-center text-black shadow-lg shadow-amber-500/40 transform scale-75 group-hover:scale-100 transition-transform">
                    <Play className="w-4 h-4 fill-black translate-x-0.5" />
                  </div>
                </div>

                {/* 底部短评/亮点 */}
                {movie.aiHighlights && movie.aiHighlights[0] && (
                  <div className="absolute bottom-2 inset-x-2 z-10 pointer-events-none">
                    <div className="px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] text-zinc-300 font-medium truncate border border-zinc-700/80">
                      {movie.aiHighlights[0]}
                    </div>
                  </div>
                )}
              </div>

              {/* 标题及年份 */}
              <div className="p-2 sm:p-2.5 space-y-0.5">
                <h3 className="font-bold text-xs sm:text-sm text-zinc-100 truncate group-hover:text-[#ffcf32] transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span>{movie.year} · {movie.genres[0]}</span>
                  {isTopThree && (
                    <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                      <Flame className="w-3 h-3 fill-amber-400" />
                      {isChinese ? "热映" : (locale === "ja-JP" ? "注目" : "Top")}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
