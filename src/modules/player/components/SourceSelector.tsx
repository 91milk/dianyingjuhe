"use client";

import React, { useMemo } from "react";
import { PlaySource } from "@/modules/movie/types";
import { Radio, HelpCircle } from "lucide-react";
import { deduplicateSources } from "@/modules/movie/utils/sourceDeduplicator";
import { useLocale } from "@/i18n/LocaleContext";

interface SourceSelectorProps {
  sources: PlaySource[];
  activeSourceId: string;
  onSelectSource: (sourceId: string) => void;
}

export const SourceSelector: React.FC<SourceSelectorProps> = ({
  sources,
  activeSourceId,
  onSelectSource,
}) => {
  const { t } = useLocale();
  const cleanSources = useMemo(() => deduplicateSources(sources), [sources]);
  if (!cleanSources || cleanSources.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* 头部标题与换源小贴士 (懂片帝风格) */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
          <Radio className="w-4 h-4 text-[#ffcf32]" />
          {t.player.switchSource}
          <span className="text-[11px] font-normal text-zinc-500">
            ({t.player.sourceCount.replace("{count}", String(cleanSources.length))})
          </span>
        </span>

        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-zinc-400" />
          {t.player.sourceHelpTip}
        </span>
      </div>

      {/* 资源选择 一行两列 网格布局 */}
      <div className="grid grid-cols-2 gap-2">
        {cleanSources.map((src, idx) => {
          const isActive = src.id === activeSourceId || src.name === cleanSources.find((s) => s.id === activeSourceId)?.name;
          const isTop = idx === 0;

          return (
            <button
              key={`${src.id}-${idx}`}
              onClick={() => onSelectSource(src.id)}
              className={`relative p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer border ${
                isActive
                  ? "bg-[#ffcf32] text-black border-[#ffcf32] font-bold shadow-lg shadow-amber-500/20 scale-[1.01]"
                  : "bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80"
              }`}
            >
              {/* 线路名称与状态 */}
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isActive ? "bg-black animate-pulse" : "bg-emerald-400"
                  }`}
                />
                <span className="truncate font-semibold">{src.name}</span>
              </div>

              {/* 推荐微标 / 集数 */}
              {isTop ? (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                    isActive ? "bg-black text-[#ffcf32]" : "bg-amber-400/20 text-[#ffcf32]"
                  }`}
                >
                  秒播
                </span>
              ) : (
                <span
                  className={`text-[10px] shrink-0 ${
                    isActive ? "text-zinc-800" : "text-zinc-500"
                  }`}
                >
                  {src.episodes?.length ? `${src.episodes.length}集` : "正片"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
