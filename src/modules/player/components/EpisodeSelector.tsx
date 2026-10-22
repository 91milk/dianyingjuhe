"use client";

import React, { useState, useMemo } from "react";
import { Episode } from "@/modules/movie/types";
import { ListVideo, ChevronLeft, ChevronRight } from "lucide-react";

interface EpisodeSelectorProps {
  episodes: Episode[];
  activeEpisodeId: string;
  onSelectEpisode: (episode: Episode) => void;
  layout?: "sidebar" | "default";
  className?: string;
}

const PAGE_SIZE = 30; // 每页展示30集 (参考懂片帝分页 Tab)

export const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  episodes = [],
  activeEpisodeId,
  onSelectEpisode,
  layout = "default",
  className = "",
}) => {
  const safeEpisodes = episodes || [];

  // 找到当前选中的集数索引
  const currentIndex = safeEpisodes.findIndex((e) => e.id === activeEpisodeId);

  // 计算分组 Tabs
  const totalPages = Math.ceil(safeEpisodes.length / PAGE_SIZE);

  // 默认定位到包含当前播放集的那个 Tab
  const defaultTab = Math.max(0, Math.floor((currentIndex === -1 ? 0 : currentIndex) / PAGE_SIZE));
  const [activeTab, setActiveTab] = useState<number>(defaultTab);

  // 当前分页下的集数列表
  const visibleEpisodes = useMemo(() => {
    const start = activeTab * PAGE_SIZE;
    return safeEpisodes.slice(start, start + PAGE_SIZE);
  }, [safeEpisodes, activeTab]);

  if (safeEpisodes.length === 0) return null;

  // 上一集 / 下一集快捷操作
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < episodes.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      const prevEp = episodes[currentIndex - 1];
      onSelectEpisode(prevEp);
      const targetTab = Math.floor((currentIndex - 1) / PAGE_SIZE);
      if (targetTab !== activeTab) setActiveTab(targetTab);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const nextEp = episodes[currentIndex + 1];
      onSelectEpisode(nextEp);
      const targetTab = Math.floor((currentIndex + 1) / PAGE_SIZE);
      if (targetTab !== activeTab) setActiveTab(targetTab);
    }
  };

  return (
    <div className="space-y-3">
      {/* 头部标题与上一集/下一集快捷跳转 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <ListVideo className="w-4 h-4 text-[#ffcf32]" />
            剧集选集
          </h3>
          <span className="text-xs text-zinc-400 font-medium">
            共 {episodes.length} {episodes.length > 1 ? "集" : "部"}
          </span>
        </div>

        {/* 上一集 / 下一集快捷控制 (懂片帝便携按钮) */}
        {episodes.length > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 transition flex items-center gap-0.5 cursor-pointer"
              title="播放上一集"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> 上一集
            </button>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 transition flex items-center gap-0.5 cursor-pointer"
              title="播放下一集"
            >
              下一集 <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 集数多于30集时的分页 Tab 栏 (类似懂片帝 1-30, 31-60 分页) */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-800/80">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const startEp = idx * PAGE_SIZE + 1;
            const endEp = Math.min((idx + 1) * PAGE_SIZE, episodes.length);
            const isTabActive = activeTab === idx;

            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1 text-xs rounded-lg transition font-medium shrink-0 cursor-pointer ${
                  isTabActive
                    ? "bg-[#ffcf32]/20 text-[#ffcf32] border border-[#ffcf32]/40 font-bold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
              >
                {startEp}-{endEp}
              </button>
            );
          })}
        </div>
      )}

      {/* 集数卡片网格 */}
      <div
        className={`grid gap-2 overflow-y-auto no-scrollbar ${
          layout === "sidebar"
            ? "grid-cols-4 sm:grid-cols-5 max-h-[380px]"
            : "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 max-h-60"
        } ${className}`}
      >
        {visibleEpisodes.map((ep) => {
          const isActive = ep.id === activeEpisodeId;

          return (
            <button
              key={ep.id}
              onClick={() => onSelectEpisode(ep)}
              className={`relative py-2.5 px-1.5 text-center text-xs rounded-xl font-medium transition-all truncate cursor-pointer flex flex-col items-center justify-center border ${
                isActive
                  ? "bg-[#ffcf32] text-black border-[#ffcf32] font-black shadow-lg shadow-amber-500/20 scale-[1.03]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
              }`}
              title={ep.name}
            >
              <span className="truncate w-full text-center">{ep.name}</span>

              {/* 正在播放的动态波浪指示器 */}
              {isActive && (
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="w-1 h-2 bg-black rounded-full animate-bounce" />
                  <span className="w-1 h-3 bg-black rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-2 bg-black rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
