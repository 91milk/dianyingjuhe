"use client";

import React from "react";
import { FilterOptions, MovieCategory } from "../types";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

interface CategoryFilterProps {
  filter: FilterOptions;
  onChange: (newFilter: FilterOptions) => void;
}

const categories: { label: string; value: MovieCategory | undefined }[] = [
  { label: "全部品类", value: undefined },
  { label: "电影", value: "movie" },
  { label: "电视剧", value: "tv" },
  { label: "🔥 热门短剧", value: "shortplay" },
  { label: "动漫", value: "anime" },
  { label: "综艺", value: "variety" },
];

const genres = [
  "全部",
  "科幻",
  "悬疑",
  "剧情",
  "爱情",
  "犯罪",
  "动作",
  "冒险",
  "战神",
  "逆袭",
  "甜宠",
  "奇幻",
];

const regions = ["全部", "中国大陆", "欧美", "日本", "韩国", "中国香港"];
const years = ["全部", "2026", "2025", "2024", "2023", "2022", "更早"];
const sorts: { label: string; value: "hot" | "latest" | "rating" }[] = [
  { label: "🔥 热度最高", value: "hot" },
  { label: "⚡ 最新上线", value: "latest" },
  { label: "⭐ 高分好评", value: "rating" },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ filter, onChange }) => {
  const hasActiveFilters =
    Boolean(filter.category) ||
    Boolean(filter.genre) ||
    Boolean(filter.region) ||
    Boolean(filter.year) ||
    filter.sort !== "hot";

  const handleReset = () => {
    onChange({
      category: undefined,
      genre: undefined,
      region: undefined,
      year: undefined,
      sort: "hot",
    });
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-xl sm:rounded-2xl p-3 sm:p-5 space-y-2 sm:space-y-3.5 mb-6 text-xs backdrop-blur-md shadow-lg">
      {/* 顶部标题与重置按钮 */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
        <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#ffcf32]" />
          多维条件筛选
        </span>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-[11px] text-zinc-400 hover:text-[#ffcf32] flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            重置筛选
          </button>
        )}
      </div>

      {/* 品类 */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 shrink-0 w-10 sm:w-12 font-medium">品类:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap pb-1 sm:pb-0">
          {categories.map((c) => {
            const isActive = filter.category === c.value;
            return (
              <button
                key={c.label}
                onClick={() => onChange({ ...filter, category: c.value })}
                className={`shrink-0 px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs whitespace-nowrap ${
                  isActive
                    ? "bg-[#ffcf32] text-black font-bold shadow-xs"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800/80 bg-zinc-950/40"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 类型 */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 shrink-0 w-10 sm:w-12 font-medium">类型:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap pb-1 sm:pb-0">
          {genres.map((g) => {
            const isActive = (filter.genre || "全部") === g;
            return (
              <button
                key={g}
                onClick={() => onChange({ ...filter, genre: g === "全部" ? undefined : g })}
                className={`shrink-0 px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs whitespace-nowrap ${
                  isActive
                    ? "bg-[#ffcf32] text-black font-bold shadow-xs"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800/80 bg-zinc-950/40"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* 地区 */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 shrink-0 w-10 sm:w-12 font-medium">地区:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap pb-1 sm:pb-0">
          {regions.map((r) => {
            const isActive = (filter.region || "全部") === r;
            return (
              <button
                key={r}
                onClick={() => onChange({ ...filter, region: r === "全部" ? undefined : r })}
                className={`shrink-0 px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs whitespace-nowrap ${
                  isActive
                    ? "bg-[#ffcf32] text-black font-bold shadow-xs"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800/80 bg-zinc-950/40"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* 年份 */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 shrink-0 w-10 sm:w-12 font-medium">年份:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap pb-1 sm:pb-0">
          {years.map((y) => {
            const isActive = (filter.year || "全部") === y;
            return (
              <button
                key={y}
                onClick={() => onChange({ ...filter, year: y === "全部" ? undefined : y })}
                className={`shrink-0 px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs whitespace-nowrap ${
                  isActive
                    ? "bg-[#ffcf32] text-black font-bold shadow-xs"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800/80 bg-zinc-950/40"
                }`}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>

      {/* 排序 */}
      <div className="flex items-center gap-2 pt-0.5">
        <span className="text-zinc-400 shrink-0 w-10 sm:w-12 font-medium">排序:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap pb-1 sm:pb-0">
          {sorts.map((s) => {
            const isActive = (filter.sort || "hot") === s.value;
            return (
              <button
                key={s.value}
                onClick={() => onChange({ ...filter, sort: s.value })}
                className={`shrink-0 px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs whitespace-nowrap ${
                  isActive
                    ? "bg-[#ffcf32] text-black font-bold shadow-xs"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800/80 bg-zinc-950/40"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
