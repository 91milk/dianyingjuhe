"use client";

import React from "react";
import Link from "next/link";
import { MovieItem } from "../types";
import { Play, Star } from "lucide-react";

interface MovieCardProps {
  movie: MovieItem;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link
      href={`/watch/${movie.id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* 海报封面 */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-800">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* 悬浮遮罩与播放图标 */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#ffcf32] flex items-center justify-center text-black shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          </div>
        </div>

        {/* 顶部标签 */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <div className="bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-bold text-[#ffcf32] flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#ffcf32]" />
            {movie.rating.toFixed(1)}
          </div>
        </div>

        {/* 底部更新状态 */}
        {movie.updateStatus && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-zinc-300 font-medium">
            {movie.updateStatus}
          </div>
        )}
      </div>

      {/* 底部信息 */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-sm text-zinc-100 truncate group-hover:text-[#ffcf32] transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
            <span>{movie.year}</span>
            <span>·</span>
            <span>{movie.region}</span>
            <span>·</span>
            <span className="truncate">{movie.genres[0]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
