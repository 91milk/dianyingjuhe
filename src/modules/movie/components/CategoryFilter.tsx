"use client";

import React from "react";
import { FilterOptions, MovieCategory } from "../types";

interface CategoryFilterProps {
  filter: FilterOptions;
  onChange: (newFilter: FilterOptions) => void;
}

const categories: { label: string; value: MovieCategory | undefined }[] = [
  { label: "全部品类", value: undefined },
  { label: "电影", value: "movie" },
  { label: "电视剧", value: "tv" },
  { label: "微短剧", value: "shortplay" },
  { label: "动漫", value: "anime" },
  { label: "综艺", value: "variety" },
];

const genres = ["全部", "科幻", "悬疑", "剧情", "爱情", "犯罪", "动作", "冒险", "战神", "逆袭", "甜宠", "奇幻"];
const regions = ["全部", "中国大陆", "欧美", "日本", "韩国", "中国香港"];
const years = ["全部", "2024", "2023", "2022", "2020-2021", "2010-2019"];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ filter, onChange }) => {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-3.5 mb-8 text-xs backdrop-blur-md">
      {/* 分类 */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 shrink-0 w-12 font-medium">分类:</span>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => {
            const isActive = filter.category === c.value;
            return (
              <button
                key={c.label}
                onClick={() => onChange({ ...filter, category: c.value })}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#ffcf32] text-black font-bold shadow-xs"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
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
        <span className="text-zinc-400 shrink-0 w-12 font-medium">类型:</span>
        <div className="flex flex-wrap gap-1.5">
          {genres.map((g) => {
            const isActive = (filter.genre || "全部") === g;
            return (
              <button
                key={g}
                onClick={() => onChange({ ...filter, genre: g === "全部" ? undefined : g })}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#ffcf32] text-black font-bold shadow-xs"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
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
        <span className="text-zinc-400 shrink-0 w-12 font-medium">地区:</span>
        <div className="flex flex-wrap gap-1.5">
          {regions.map((r) => {
            const isActive = (filter.region || "全部") === r;
            return (
              <button
                key={r}
                onClick={() => onChange({ ...filter, region: r === "全部" ? undefined : r })}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#ffcf32] text-black font-bold shadow-xs"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
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
        <span className="text-zinc-400 shrink-0 w-12 font-medium">年份:</span>
        <div className="flex flex-wrap gap-1.5">
          {years.map((y) => {
            const isActive = (filter.year || "全部") === y;
            return (
              <button
                key={y}
                onClick={() => onChange({ ...filter, year: y === "全部" ? undefined : y })}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#ffcf32] text-black font-bold shadow-xs"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
