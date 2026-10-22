"use client";

import React, { useEffect, useState } from "react";
import { HistoryRecord } from "../types";
import { historyService } from "../services/historyService";
import { X, Clock, Play, Trash2 } from "lucide-react";
import Link from "next/link";
import { encodePlayId } from "@/lib/playCipher";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [prevOpen, setPrevOpen] = useState(false);

  if (isOpen && !prevOpen) {
    setPrevOpen(true);
    setHistory(historyService.getHistory());
  } else if (!isOpen && prevOpen) {
    setPrevOpen(false);
  }

  if (!isOpen) return null;

  const handleClear = () => {
    historyService.clearAll();
    setHistory([]);
  };

  const handleRemove = (e: React.MouseEvent, movieId: string) => {
    e.preventDefault();
    historyService.removeHistory(movieId);
    setHistory(historyService.getHistory());
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="flex-1" onClick={onClose} />

      <div className="w-full max-w-sm h-full bg-[#141416] border-l border-zinc-800 flex flex-col shadow-2xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ffcf32]" />
            <h3 className="font-bold text-white text-sm">播放历史与进度</h3>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="text-[11px] text-zinc-400 hover:text-red-400 px-2 py-1 rounded hover:bg-zinc-800 transition cursor-pointer"
              >
                清空记录
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-20 text-xs text-zinc-500">暂无观影历史</div>
          ) : (
            history.map((item) => {
              const progressPercent = item.duration
                ? Math.min(100, Math.round((item.currentTime / item.duration) * 100))
                : 0;

              return (
                <Link
                  key={item.movieId}
                  href={`/play/${encodePlayId(item.movieId)}?source=${item.sourceId}&ep=${item.episodeId}`}
                  onClick={onClose}
                  className="group relative flex gap-3 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 transition"
                >
                  <img
                    src={item.poster}
                    alt={item.movieTitle}
                    className="w-16 h-22 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-[#ffcf32] transition-colors">
                        {item.movieTitle}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-1 truncate">
                        上次观看: {item.episodeName}
                      </p>
                    </div>

                    <div>
                      {/* 进度条 */}
                      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-[#ffcf32]"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                        <span>进度 {progressPercent}%</span>
                        <span className="flex items-center gap-0.5 text-amber-300">
                          <Play className="w-2.5 h-2.5 fill-[#ffcf32]" /> 继续播放
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleRemove(e, item.movieId)}
                    className="absolute top-2 right-2 text-zinc-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition"
                    title="删除记录"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
