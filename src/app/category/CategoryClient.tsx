"use client";

import React, { useState, useEffect } from "react";
import { MovieItem, FilterOptions, MovieCategory } from "@/modules/movie/types";
import { CategoryFilter } from "@/modules/movie/components/CategoryFilter";
import { MovieGrid } from "@/modules/movie/components/MovieGrid";
import { movieService } from "@/modules/movie/services/movieService";

interface CategoryClientProps {
  initialMovies: MovieItem[];
  initialCategory?: MovieCategory;
  initialQuery?: string;
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
  initialMovies,
  initialCategory,
  initialQuery,
}) => {
  const [filter, setFilter] = useState<FilterOptions>({
    category: initialCategory,
    genre: undefined,
    region: undefined,
    year: undefined,
    sort: "hot",
  });
  const [movies, setMovies] = useState<MovieItem[]>(initialMovies);
  const [query, setQuery] = useState(initialQuery || "");

  useEffect(() => {
    let active = true;

    async function applyFilters() {
      if (query.trim()) {
        const results = await movieService.searchMovies(query);
        if (active) setMovies(results);
      } else {
        const results = await movieService.filterMovies(filter);
        if (active) setMovies(results);
      }
    }

    applyFilters();

    return () => {
      active = false;
    };
  }, [filter, query]);

  return (
    <div className="space-y-6">
      {/* 头部标题与快速搜索 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">影视资源发现</h1>
          <p className="text-xs text-zinc-400 mt-1">
            多维度筛选分类影视与全网热度榜单
          </p>
        </div>

        {/* 页面内快速检索 */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="在当前分类中过滤..."
            className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-[#ffcf32] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* 分类筛选面板 */}
      <CategoryFilter filter={filter} onChange={setFilter} />

      {/* 影视卡片网格 */}
      <MovieGrid movies={movies} subtitle={`共找到 ${movies.length} 部匹配作品`} />
    </div>
  );
};
