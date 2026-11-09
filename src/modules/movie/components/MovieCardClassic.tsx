"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MovieItem } from "../types";
import { Play, Star, Sparkles } from "lucide-react";
import { getOptimizedImageUrl } from "../utils/imageHelper";
import { encodePlayId } from "@/lib/playCipher";
import { useLocale } from "@/i18n/LocaleContext";
import { getLocalizedMovie } from "../utils/localizeMovie";

export interface MovieCardProps {
  movie: MovieItem;
  rank?: number;
  highlightText?: string;
  className?: string;
}

export const MovieCardClassic: React.FC<MovieCardProps> = ({
  movie: rawMovie,
  rank,
  highlightText,
  className = "",
}) => {
  const { locale } = useLocale();
  const movie = getLocalizedMovie(rawMovie, locale);
  const [imgSrc, setImgSrc] = useState<string>(getOptimizedImageUrl(movie.poster));
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      // 容错降级为优雅矢量电影海报
      setImgSrc("/api/img?fallback=1");
    }
  };

  return (
    <Link
      href={`/play/${encodePlayId(movie.id)}`}
      className={`group relative flex flex-col rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900/70 border border-zinc-800/90 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer backdrop-blur-xs ${className}`}
    >
      {/* 海报封面容器 */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={imgSrc}
          alt={movie.title}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 group-hover:brightness-105"
          loading="lazy"
        />

        {/* 悬浮微光与渐变暗影 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* 悬浮播放按钮动效 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ffcf32] flex items-center justify-center text-black shadow-xl shadow-amber-500/40 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black translate-x-0.5" />
          </div>
        </div>

        {/* 顶部排行榜数字徽标 */}
        {typeof rank === "number" && (
          <div className="absolute top-2 left-2 z-10 flex items-center">
            <span
              className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg font-black tracking-wider shadow-lg ${
                rank === 1
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-amber-500/40"
                  : rank === 2
                  ? "bg-zinc-200 text-black shadow-zinc-500/30"
                  : rank === 3
                  ? "bg-amber-700 text-amber-100 shadow-amber-900/30"
                  : "bg-black/75 text-zinc-300 border border-zinc-700"
              }`}
            >
              TOP {rank}
            </span>
          </div>
        )}

        {/* 豆瓣评分徽章 */}
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-black/75 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-bold text-[#ffcf32] border border-amber-400/30 flex items-center gap-0.5 sm:gap-1 shadow-md">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#ffcf32]" />
            {movie.rating.toFixed(1)}
          </div>
        </div>

        {/* 底部更新状态或看点标签 */}
        <div className="absolute bottom-2 inset-x-2 flex items-center justify-between pointer-events-none">
          {movie.updateStatus && (
            <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-zinc-300 border border-zinc-700/80 font-medium truncate max-w-[90%]">
              {movie.updateStatus}
            </span>
          )}
        </div>
      </div>

      {/* 底部影片核心元数据 */}
      <div className="p-2 sm:p-3.5 flex flex-col justify-between flex-1 space-y-1 sm:space-y-1.5">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-zinc-100 truncate group-hover:text-[#ffcf32] transition-colors leading-snug">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-zinc-400">
            <span>{movie.year}</span>
            <span>·</span>
            <span>{movie.region}</span>
            <span>·</span>
            <span className="truncate text-zinc-300 font-medium">{movie.genres[0]}</span>
          </div>
        </div>

        {/* 如果有 AI 提炼短语或高光亮点 */}
        {(highlightText || (movie.aiHighlights && movie.aiHighlights[0])) && (
          <div className="pt-1 border-t border-zinc-800/60 flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-300/80 truncate">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ffcf32] shrink-0" />
            <span className="truncate">{highlightText || movie.aiHighlights?.[0]}</span>
          </div>
        )}
      </div>
    </Link>
  );
};
