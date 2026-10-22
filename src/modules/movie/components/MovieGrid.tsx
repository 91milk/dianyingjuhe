import React from "react";
import { MovieItem } from "../types";
import { MovieCard } from "./MovieCard";
import { cn } from "@/lib/utils";

interface MovieGridProps {
  movies: MovieItem[];
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <section className={cn("my-6", className)}>
      {(title || action) && (
        <div className="flex items-end justify-between mb-4">
          <div>
            {title && <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>}
            {subtitle && <p className="text-xs text-zinc-400 mt-1">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}

      {movies.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 text-sm bg-zinc-900/40 rounded-2xl border border-zinc-800">
          暂无匹配影视资源，可点击右下角让 AI 帮您全网找片
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4 lg:gap-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
};
