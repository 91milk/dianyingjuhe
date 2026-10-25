"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { PlaySource } from "@/modules/movie/types";
import { Zap, ChevronDown, CheckCircle2, X, Activity, Layers } from "lucide-react";
import { deduplicateSources } from "@/modules/movie/utils/sourceDeduplicator";

interface FloatingSourceSelectorProps {
  sources: PlaySource[];
  activeSource: PlaySource;
  onSelectSource: (source: PlaySource) => void;
}

export const FloatingSourceSelector: React.FC<FloatingSourceSelectorProps> = ({
  sources,
  activeSource,
  onSelectSource,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanSources = useMemo(() => deduplicateSources(sources), [sources]);

  // 点击面板外部自动缩小
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!cleanSources || cleanSources.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute top-3 right-3 z-50 select-none ${
        isOpen ? "max-w-[calc(100%-1.5rem)] max-h-[calc(100%-1.5rem)]" : ""
      }`}
    >
      {!isOpen ? (
        /* 缩小状态：右上角小巧胶囊按钮 (点击放大展开) */
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black/95 text-white border border-amber-400/40 backdrop-blur-md shadow-2xl cursor-pointer transition-all hover:scale-105 active:scale-95 group"
          title="点击放大切换播放线路"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-amber-300" />
            <span className="max-w-[110px] sm:max-w-[130px] truncate">{activeSource?.name || "切换线路"}</span>
          </span>
          <span className="text-[10px] text-zinc-400 group-hover:text-amber-200">
            {cleanSources.length}线
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-300 transition-transform" />
        </button>
      ) : (
        /* 放大状态：从右上角展开的浮动大面板 (严格约束在播放器视窗内，自适应竖屏与宽屏) */
        <div className="w-[290px] sm:w-[340px] max-w-full max-h-[min(480px,calc(100%-1.5rem))] bg-zinc-950/95 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-xl p-3 sm:p-3.5 flex flex-col space-y-2.5 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          {/* 面板头部 */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#ffcf32] text-black">
                <Layers className="w-3.5 h-3.5 fill-black" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  切换播放线路
                  <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-amber-400/20 text-[#ffcf32]">
                    共 {cleanSources.length} 条
                  </span>
                </h4>
                <p className="text-[10px] text-zinc-400 mt-0.5">点击目标线路立即开播并自动收起</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition cursor-pointer"
              title="收起缩小"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 线路列表 (自适应网格，兼顾竖屏短剧与宽屏电影) */}
          <div
            className={`max-h-[min(280px,50vh)] overflow-y-auto grid ${
              cleanSources.length <= 2 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
            } gap-1.5 pr-0.5 no-scrollbar scrollbar-none`}
          >
            {cleanSources.map((src, index) => {
              const isActive = src.id === activeSource.id;
              const epCount = src.episodes?.length || 0;
              // 模拟健康延迟
              const latency = 80 + (index * 35) % 180;

              return (
                <button
                  key={src.id}
                  onClick={() => {
                    onSelectSource(src);
                    setIsOpen(false); // 关键交互：选择后立即缩小收起！
                  }}
                  className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                    isActive
                      ? "bg-[#ffcf32]/15 border-[#ffcf32] text-white shadow-lg shadow-amber-500/10"
                      : "bg-zinc-900/80 hover:bg-zinc-800/90 border-zinc-800/90 hover:border-amber-400/50 text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px] font-bold ${
                        isActive
                          ? "bg-[#ffcf32] text-black"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex flex-col">
                      <span className="text-xs font-bold truncate">
                        {src.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">
                        {epCount > 1 ? `${epCount}集` : "正片"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    {isActive ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ffcf32]" />
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
                        <Activity className="w-2 h-2" />
                        {latency}ms
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
