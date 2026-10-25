"use client";

import React, { useState, useEffect } from "react";
import { MovieItem, FilterOptions, MovieCategory } from "@/modules/movie/types";
import { CategoryFilter } from "@/modules/movie/components/CategoryFilter";
import { MovieGrid } from "@/modules/movie/components/MovieGrid";
import { Search, RefreshCw, Film } from "lucide-react";

interface CategoryClientProps {
  initialMovies: MovieItem[];
  initialCategory?: MovieCategory;
  initialQuery?: string;
}

const ALL_SITES = [
  "极速资源",
  "魔都资源",
  "iKun资源",
  "百度云资源",
  "非凡资源",
  "量子资源",
  "全网资源",
  "茅台资源",
];

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
  const [displayLimit, setDisplayLimit] = useState(36);

  // 搜索进度条与状态反馈
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchStatus, setSearchStatus] = useState("");

  const isFirstMount = React.useRef(true);

  useEffect(() => {
    // 首次载入若已有服务端预取充足的 initialMovies，跳过重复的网络请求，实现页面秒开
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (initialMovies && initialMovies.length >= 12) {
        return;
      }
    }

    let active = true;

    async function applyFilters() {
      setIsSearching(true);
      setDisplayLimit(36);
      setSearchProgress(15);
      setSearchStatus("正在为您检索全网超清影视库...");

      const t1 = setTimeout(() => {
        if (active) {
          setSearchProgress(45);
          setSearchStatus("正在快速筛选全网高清片源...");
        }
      }, 300);

      const t2 = setTimeout(() => {
        if (active) {
          setSearchProgress(75);
          setSearchStatus("即将完成筛选，正在整理片单...");
        }
      }, 750);

      const t3 = setTimeout(() => {
        if (active) {
          setSearchProgress(92);
          setSearchStatus("正在准备就绪...");
        }
      }, 1300);

      try {
        const params = new URLSearchParams();
        if (query.trim()) {
          params.set("q", query.trim());
        } else {
          if (filter.category) params.set("category", filter.category);
          if (filter.genre) params.set("genre", filter.genre);
          if (filter.region) params.set("region", filter.region);
          if (filter.year) params.set("year", filter.year);
          if (filter.sort) params.set("sort", filter.sort);
        }

        const res = await fetch(`/api/movies?${params.toString()}`);
        const data = await res.json();
        if (active && data.success && Array.isArray(data.data)) {
          setMovies(data.data);
          setSearchProgress(100);
          setSearchStatus(`全网检索完毕，已成功找到 ${data.data.length} 部匹配作品`);
        }
      } catch (err) {
        console.error("Filter fetch error:", err);
        if (active) {
          setSearchProgress(100);
          setSearchStatus("检索完毕");
        }
      } finally {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        if (active) {
          setTimeout(() => {
            if (active) setIsSearching(false);
          }, 450);
        }
      }
    }

    applyFilters();

    return () => {
      active = false;
    };
  }, [filter, query]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 头部标题与快速搜索 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex flex-wrap items-center gap-2">
            影视资源发现
            {isSearching && (
              <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-400/20 text-[#ffcf32] border border-amber-400/30 font-medium flex items-center gap-1.5 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                正在全网搜索片源...
              </span>
            )}
          </h1>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 sm:mt-1">
            多维度筛选分类影视与全网热度榜单 · 实时对接全网 8 大采集站
          </p>
        </div>

        {/* 页面内快速检索 */}
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入片名、主角或题材立即全网搜片..."
            className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-[#ffcf32] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-hidden transition shadow-sm"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* 搜索片源动态进度条舱 (核心反馈卡片，避免用户认为卡住) */}
      {isSearching && (
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900/90 to-amber-500/5 border border-amber-500/30 shadow-xl space-y-2.5 sm:space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-[#ffcf32] border-t-transparent animate-spin shrink-0" />
              <span className="font-bold text-white tracking-wide">
                {searchStatus}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[#ffcf32] font-black text-xs shrink-0">
              <span>{searchProgress}%</span>
              <span className="text-[10px] text-zinc-500 font-sans font-normal">
                已并发扫频 8 大资源站
              </span>
            </div>
          </div>

          {/* 进度条轨道与光效进度 */}
          <div className="w-full bg-zinc-800/90 rounded-full h-2 overflow-hidden p-0.5 border border-zinc-700/60 shadow-inner">
            <div
              className="bg-gradient-to-r from-amber-500 via-[#ffcf32] to-emerald-400 h-full rounded-full transition-all duration-300 ease-out shadow-md shadow-amber-400/40 relative"
              style={{ width: `${searchProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* 8大资源站并发响应徽标 */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {ALL_SITES.map((siteName, idx) => {
              const isChecked = searchProgress >= (idx + 1) * 12;
              return (
                <span
                  key={siteName}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-all flex items-center gap-1 ${
                    isChecked
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-zinc-800/50 border-zinc-700/50 text-zinc-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isChecked ? "bg-emerald-400" : "bg-amber-400/50 animate-ping"
                    }`}
                  />
                  {siteName}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 分类筛选面板 */}
      <CategoryFilter filter={filter} onChange={setFilter} />

      {/* 影视卡片网格与空结果友好兜底 */}
      {!isSearching && query.trim() && movies.length === 0 ? (
        <div className="p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-center space-y-4 my-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-800/80 flex items-center justify-center text-zinc-400">
            <Film className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              全网暂未检索到与「{query}」完全匹配的片源
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 leading-relaxed">
              全网片库可能存在译名或简称差异。建议精简片名关键字，或使用流量君 AI 对话找片进行智能模糊识别。
            </p>
          </div>
          <button
            onClick={() => setQuery("")}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition cursor-pointer"
          >
            清空搜索条件查看全量片库
          </button>
        </div>
      ) : (
        <>
          <MovieGrid
            movies={movies.slice(0, displayLimit)}
            subtitle={
              isSearching
                ? "正在全网并发检索最新片源..."
                : `共找到 ${movies.length} 部匹配作品`
            }
          />
          {movies.length > displayLimit && (
            <div className="flex justify-center pt-2 pb-8">
              <button
                onClick={() => setDisplayLimit((prev) => prev + 36)}
                className="px-6 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-[#ffcf32] hover:text-black border border-zinc-700/60 hover:border-amber-400 font-bold text-xs text-zinc-300 transition-all duration-200 cursor-pointer shadow-md flex items-center gap-2"
              >
                加载更多作品 (已显示 {Math.min(displayLimit, movies.length)} / {movies.length})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
