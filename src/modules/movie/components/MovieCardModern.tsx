"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MovieItem } from "../types";
import { Play, Star } from "lucide-react";
import { getOptimizedImageUrl } from "../utils/imageHelper";
import { encodePlayId } from "@/lib/playCipher";
import { MovieCardProps } from "./MovieCardClassic";

export const MovieCardModern: React.FC<MovieCardProps> = ({
  movie,
  rank,
  highlightText,
  className = "",
}) => {
  const [imgSrc, setImgSrc] = useState(getOptimizedImageUrl(movie.poster));
  const [hasError, setHasError] = useState(false);
  const encodedId = encodePlayId(movie.id);
  const detailHref = `/movie/${encodedId}`;
  const playHref = `/play/${encodedId}`;
  const highlight = highlightText || movie.aiHighlights?.[0];

  const handleImageError = () => {
    if (hasError) return;
    setHasError(true);
    setImgSrc("/api/img?fallback=1");
  };

  return (
    <article className={`group min-w-0 border border-white/10 bg-[#101314] transition duration-300 hover:-translate-y-1 hover:border-white/25 ${className}`}>
      <Link href={detailHref} className="relative block aspect-[2/3] overflow-hidden bg-[#121516]" aria-label={`查看《${movie.title}》详情`}>
        <img
          src={imgSrc}
          alt={movie.title}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

        {typeof rank === "number" && (
          <span className="absolute left-2 top-2 bg-[#ef4b43] px-2 py-1 text-[10px] font-black tracking-[0.12em] text-white">
            TOP {rank}
          </span>
        )}

        <span className="absolute right-2 top-2 flex items-center gap-1 bg-black/75 px-2 py-1 text-[10px] font-bold text-[#f2efe9]">
          <Star className="h-3 w-3 fill-[#ef4b43] text-[#ef4b43]" />
          {movie.rating.toFixed(1)}
        </span>

        {movie.updateStatus && (
          <span className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate bg-black/75 px-2 py-1 text-[10px] font-medium text-[#d8d5cf]">
            {movie.updateStatus}
          </span>
        )}
      </Link>

      <div className="flex min-h-[132px] flex-col p-3 sm:min-h-[142px] sm:p-4">
        <Link href={detailHref} className="truncate text-sm font-bold text-[#f2efe9] transition hover:text-[#ef4b43] sm:text-base">
          {movie.title}
        </Link>
        <p className="mt-1 truncate text-[10px] text-[#8f908d] sm:text-xs">
          {movie.year} · {movie.region} · {movie.genres[0] || "影视"}
        </p>
        {highlight && <p className="mt-2 truncate text-[10px] text-[#aaa9a5] sm:text-xs">{highlight}</p>}

        <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
          <Link
            href={detailHref}
            className="flex min-h-9 items-center justify-center border border-white/20 px-1 text-center text-[11px] font-bold text-[#f2efe9] transition hover:border-white/50 hover:bg-white/5 sm:text-xs"
          >
            查看详情
          </Link>
          <Link
            href={playHref}
            className="flex min-h-9 items-center justify-center gap-1 bg-[#ef4b43] px-1 text-center text-[11px] font-bold text-white transition hover:bg-[#ff5a52] sm:text-xs"
          >
            <Play className="h-3 w-3 fill-current" />
            立即播放
          </Link>
        </div>
      </div>
    </article>
  );
};
