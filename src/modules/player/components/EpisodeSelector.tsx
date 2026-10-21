"use client";

import React from "react";
import { Episode } from "@/modules/movie/types";
import { ListVideo } from "lucide-react";

interface EpisodeSelectorProps {
  episodes: Episode[];
  activeEpisodeId: string;
  onSelectEpisode: (episode: Episode) => void;
}

export const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  episodes,
  activeEpisodeId,
  onSelectEpisode,
}) => {
  if (episodes.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">
          <ListVideo className="w-4 h-4 text-[#ffcf32]" />
          剧集选集
        </h3>
        <span className="text-xs text-zinc-400">共 {episodes.length} 集</span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-56 overflow-y-auto pr-1">
        {episodes.map((ep) => {
          const isActive = ep.id === activeEpisodeId;
          return (
            <button
              key={ep.id}
              onClick={() => onSelectEpisode(ep)}
              className={`py-2 px-1 text-center text-xs rounded-xl font-medium transition-all truncate cursor-pointer ${
                isActive
                  ? "bg-[#ffcf32] text-black shadow-lg font-bold scale-[1.02]"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"
              }`}
              title={ep.name}
            >
              {ep.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
