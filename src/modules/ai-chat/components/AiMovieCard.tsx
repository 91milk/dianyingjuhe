"use client";

import React from "react";
import Link from "next/link";
import { MovieRecommendation } from "../types";
import { Play, Star, Sparkles } from "lucide-react";

interface AiMovieCardProps {
  recommendation: MovieRecommendation;
}

export const AiMovieCard: React.FC<AiMovieCardProps> = ({ recommendation }) => {
  const { movie, recommendReason } = recommendation;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 my-2 transition-all duration-200 shadow-lg">
      <div className="flex gap-3">
        {/* 海报 */}
        <div className="relative w-20 h-28 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] text-[#ffcf32] font-bold flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-[#ffcf32]" />
            {movie.rating}
          </div>
        </div>

        {/* 详情与推荐理由 */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-sm font-bold text-white truncate">{movie.title}</h4>
              <span className="text-[11px] text-zinc-400 shrink-0">{movie.year}</span>
            </div>

            <div className="flex flex-wrap gap-1 mt-1">
              {movie.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="px-1.5 py-0.5 bg-zinc-800 text-[10px] text-zinc-300 rounded"
                >
                  {g}
                </span>
              ))}
              <span className="px-1.5 py-0.5 bg-zinc-800 text-[10px] text-zinc-400 rounded">
                {movie.region}
              </span>
            </div>

            {/* AI 推荐精辟理由 */}
            <div className="mt-2 text-xs text-amber-300/90 bg-amber-950/30 border border-amber-500/20 rounded p-1.5 flex items-start gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#ffcf32] shrink-0 mt-0.5" />
              <p className="line-clamp-2 leading-relaxed text-[11px]">{recommendReason}</p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-2.5 flex items-center gap-2">
            <Link
              href={`/watch/${movie.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#ffcf32] hover:bg-[#ffe066] text-black font-semibold text-xs py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              立即播放
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
