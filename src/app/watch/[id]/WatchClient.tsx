"use client";

import React, { useState, useEffect } from "react";
import { MovieItem, PlaySource, Episode } from "@/modules/movie/types";
import { VideoPlayer } from "@/modules/player/components/VideoPlayer";
import { SourceSelector } from "@/modules/player/components/SourceSelector";
import { EpisodeSelector } from "@/modules/player/components/EpisodeSelector";
import { historyService } from "@/modules/user/services/historyService";
import { MovieCard } from "@/modules/movie/components/MovieCard";
import { Sparkles, Star, Film, Eye } from "lucide-react";

interface WatchClientProps {
  movie: MovieItem;
  similarMovies: MovieItem[];
  initialSourceId?: string;
  initialEpisodeId?: string;
}

export const WatchClient: React.FC<WatchClientProps> = ({
  movie,
  similarMovies,
  initialSourceId,
  initialEpisodeId,
}) => {
  // 当前线路
  const [activeSource, setActiveSource] = useState<PlaySource>(
    movie.sources.find((s) => s.id === initialSourceId) || movie.sources[0]
  );

  // 当前集数
  const [activeEpisode, setActiveEpisode] = useState<Episode>(
    activeSource.episodes.find((e) => e.id === initialEpisodeId) || activeSource.episodes[0]
  );

  // 记忆进度
  const [initialTime, setInitialTime] = useState<number>(0);

  useEffect(() => {
    // 从历史记录中恢复播放进度
    const progress = historyService.getMovieProgress(movie.id);
    if (progress && progress.currentTime > 5) {
      setInitialTime(progress.currentTime);
    }
  }, [movie.id]);

  const handleSelectSource = (sourceId: string) => {
    const src = movie.sources.find((s) => s.id === sourceId);
    if (src) {
      setActiveSource(src);
      // 切换线路时尽可能对应同名集数
      const matched = src.episodes.find((e) => e.name === activeEpisode.name) || src.episodes[0];
      setActiveEpisode(matched);
    }
  };

  const handleSelectEpisode = (ep: Episode) => {
    setActiveEpisode(ep);
  };

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    // 保存至播放历史
    historyService.saveProgress({
      movieId: movie.id,
      movieTitle: movie.title,
      poster: movie.poster,
      sourceId: activeSource.id,
      sourceName: activeSource.name,
      episodeId: activeEpisode.id,
      episodeName: activeEpisode.name,
      currentTime,
      duration,
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="space-y-8">
      {/* 顶部主播放器与选集面板区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧大播放器 */}
        <div className="lg:col-span-2 space-y-4">
          <VideoPlayer
            url={activeEpisode?.url || ""}
            poster={movie.banner || movie.poster}
            title={`${movie.title} - ${activeEpisode?.name}`}
            initialTime={initialTime}
            onTimeUpdate={handleTimeUpdate}
          />

          {/* 播放器下方控制：线路切换 */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                {movie.title}
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-[#ffcf32]">
                  {activeEpisode?.name}
                </span>
              </h1>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                <span>{movie.year}</span>
                <span>·</span>
                <span>{movie.region}</span>
                <span>·</span>
                <span>{movie.genres.join(" / ")}</span>
              </div>
            </div>

            {/* 线路选择器 */}
            <SourceSelector
              sources={movie.sources}
              activeSourceId={activeSource.id}
              onSelectSource={handleSelectSource}
            />
          </div>

          {/* 移动端/大屏选集列表 */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl">
            <EpisodeSelector
              episodes={activeSource.episodes}
              activeEpisodeId={activeEpisode.id}
              onSelectEpisode={handleSelectEpisode}
            />
          </div>
        </div>

        {/* 右侧：AI 看点分析与影片详细档案 */}
        <div className="space-y-6">
          {/* AI 剧情速览与高能看点 */}
          <div className="bg-gradient-to-b from-amber-950/30 to-zinc-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#ffcf32] flex items-center justify-center text-black">
                <Sparkles className="w-3.5 h-3.5 fill-black" />
              </div>
              <h3 className="font-bold text-sm text-white">懂片 AI 剧情速览与看点</h3>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              {movie.aiHighlights && movie.aiHighlights.length > 0 ? (
                movie.aiHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-zinc-800/80">
                    <span className="text-[#ffcf32] font-bold">0{idx + 1}</span>
                    <p className="leading-relaxed">{highlight}</p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-400">AI 正在为本片生成深度情节剖析...</p>
              )}
            </div>
          </div>

          {/* 影片基本资料卡 */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-zinc-400">综合评分</span>
              <span className="font-bold text-[#ffcf32] flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-[#ffcf32]" />
                {movie.rating.toFixed(1)} / 10
              </span>
            </div>

            {movie.director && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">导演</span>
                <span className="text-zinc-200">{movie.director}</span>
              </div>
            )}

            {movie.actors && movie.actors.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-zinc-400">主演阵容</span>
                <span className="text-zinc-300 leading-relaxed">
                  {movie.actors.join("、")}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-800">
              <span className="text-zinc-400 block mb-1">剧情简介</span>
              <p className="text-zinc-300 leading-relaxed text-[11px] max-h-36 overflow-y-auto pr-1">
                {movie.summary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 相似影片 / 同好推荐 */}
      {similarMovies.length > 0 && (
        <section className="pt-6 border-t border-zinc-800">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Film className="w-4 h-4 text-[#ffcf32]" />
            喜欢这部作品的影迷还在看
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similarMovies.map((sim) => (
              <MovieCard key={sim.id} movie={sim} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
