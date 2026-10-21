"use client";

import React from "react";
import { PlaySource } from "@/modules/movie/types";
import { Radio } from "lucide-react";

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
  if (sources.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
      <span className="text-xs text-zinc-400 flex items-center gap-1 shrink-0 mr-1">
        <Radio className="w-3.5 h-3.5 text-[#ffcf32]" />
        线路切换:
      </span>
      {sources.map((src, idx) => {
        const isActive = src.id === activeSourceId;
        return (
          <button
            key={`${src.id}-${idx}`}
            onClick={() => onSelectSource(src.id)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all font-medium shrink-0 cursor-pointer ${
              isActive
                ? "bg-[#ffcf32] text-black shadow-md font-semibold"
                : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300"
            }`}
          >
            {src.name}
          </button>
        );
      })}
    </div>
  );
};
