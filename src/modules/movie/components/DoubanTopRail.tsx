"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { MovieItem } from "../types";
import { Play, Star, ChevronLeft, ChevronRight, Trophy, Flame } from "lucide-react";
import { getOptimizedImageUrl } from "../utils/imageHelper";
import { encodePlayId } from "@/lib/playCipher";

interface DoubanTopRailProps {
  movies: MovieItem[];
}

export const DoubanTopRail: React.FC<DoubanTopRailProps> = ({ movies }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -480 : 480;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative space-y-4 my-8">
      {/* 头部标题与滑动控制器 */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 text-[#ffcf32] border border-amber-400/30 text-xs font-black flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> 豆瓣电影 TOP 经典殿堂
            </span>
            <span className="text-xs text-zinc-500 font-medium">百万影迷公认影史丰碑</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            口碑神作排行榜
          </h2>
        </div>

        {/* 左右滑动快捷箭头 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center transition cursor-pointer"
            aria-label="向前滑动"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center transition cursor-pointer"
            aria-label="向后滑动"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 横向无界滑轨 (巨型排位数字突出框架的大胆设计) */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-6 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x"
        style={{ scrollbarWidth: "none" }}
      >
        {movies.map((movie, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;

          return (
            <Link
              key={movie.id}
              href={`/play/${encodePlayId(movie.id)}`}
              className="group relative flex shrink-0 items-center snap-start cursor-pointer transition-all duration-300 hover:-translate-y-2"
            >
              {/* 突出框架的超大排位艺术数字 (Netflix TOP10 风格，置于顶层 z-20，绝不遮挡) */}
              <div className="relative z-20 -mr-5 sm:-mr-8 flex items-end justify-center select-none pointer-events-none self-end pb-3">
                <span
                  className={`text-7xl sm:text-9xl font-black italic tracking-tighter leading-none select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)] ${
                    isTop3
                      ? "text-transparent bg-clip-text bg-gradient-to-t from-amber-500 via-[#ffcf32] to-yellow-100 drop-shadow-[0_10px_24px_rgba(255,207,50,0.4)]"
                      : "text-zinc-300 group-hover:text-white transition-colors"
                  }`}
                  style={{
                    WebkitTextStroke: isTop3 ? "2.5px rgba(255, 207, 50, 0.9)" : "2px rgba(212, 212, 216, 0.6)",
                  }}
                >
                  {rank}
                </span>
              </div>

              {/* 实体海报卡片 */}
              <div className="relative z-10 w-36 sm:w-44 md:w-48 aspect-[2/3] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/90 group-hover:border-[#ffcf32] transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:shadow-amber-500/20">
                <img
                  src={getOptimizedImageUrl(movie.poster)}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />

                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                {/* 排行名次精准角标 (保障双重清晰辨识) */}
                <div className="absolute top-2 left-2 z-20">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wider border shadow-md flex items-center gap-0.5 ${
                      rank === 1
                        ? "bg-[#ffcf32] text-black border-amber-300 font-extrabold shadow-amber-500/30"
                        : rank === 2
                        ? "bg-zinc-200 text-black border-white font-extrabold"
                        : rank === 3
                        ? "bg-amber-600 text-white border-amber-400 font-bold"
                        : "bg-black/75 backdrop-blur-md text-zinc-300 border-zinc-700/80 font-medium"
                    }`}
                  >
                    TOP {rank}
                  </span>
                </div>

                {/* 悬浮即播图标 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-[#ffcf32] text-black flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-black translate-x-0.5" />
                  </div>
                </div>

                {/* 顶部评分微标 */}
                <div className="absolute top-2 right-2 z-20">
                  <span className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-[#ffcf32] border border-amber-400/30 text-[11px] font-bold flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-[#ffcf32]" />
                    {movie.rating.toFixed(1)}
                  </span>
                </div>

                {/* 底部影片核心标题与名言短语 */}
                <div className="absolute bottom-2.5 inset-x-2.5 space-y-1">
                  <h3 className="font-extrabold text-sm text-white truncate group-hover:text-[#ffcf32] transition-colors drop-shadow">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-300">
                    <span>{movie.year}</span>
                    <span>·</span>
                    <span className="truncate">{movie.genres[0]}</span>
                    <span>·</span>
                    <span>{movie.region.split("/")[0].trim()}</span>
                  </div>
                  {movie.aiHighlights && movie.aiHighlights[0] && (
                    <p className="text-[10px] text-amber-200/90 truncate font-medium">
                      {movie.aiHighlights[0]}
                    </p>
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
