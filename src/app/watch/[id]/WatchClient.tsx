"use client";

import React, { useState, useEffect } from "react";
import { MovieItem, PlaySource, Episode } from "@/modules/movie/types";
import { VideoPlayer } from "@/modules/player/components/VideoPlayer";
import { SourceSelector } from "@/modules/player/components/SourceSelector";
import { EpisodeSelector } from "@/modules/player/components/EpisodeSelector";
import { historyService } from "@/modules/user/services/historyService";
import { MovieCard } from "@/modules/movie/components/MovieCard";
import { Sparkles, Star, Film, Zap, RefreshCw, CheckCircle2 } from "lucide-react";

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
  // 动态聚合的播放线路列表
  const [sources, setSources] = useState<PlaySource[]>(movie.sources || []);

  // 当前选中的播放线路与集数
  const [activeSource, setActiveSource] = useState<PlaySource | null>(
    movie.sources?.find((s) => s.id === initialSourceId) || movie.sources?.[0] || null
  );

  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(
    activeSource?.episodes?.find((e) => e.id === initialEpisodeId) || activeSource?.episodes?.[0] || null
  );

  // 异步获取多源状态
  const [isResolving, setIsResolving] = useState<boolean>(true);
  const [resolveMessage, setResolveMessage] = useState<string>("正在并发探测全网资源线路...");

  // 记忆进度
  const [initialTime, setInitialTime] = useState<number>(0);

  useEffect(() => {
    // 从历史记录中恢复播放进度
    const progress = historyService.getMovieProgress(movie.id);
    if (progress && progress.currentTime > 5) {
      setInitialTime(progress.currentTime);
    }
  }, [movie.id]);

  // 核心：异步并发获取各个资源的播放地址，优先获取优先展示！
  useEffect(() => {
    let isMounted = true;

    async function resolveLiveSources() {
      setIsResolving(true);
      setResolveMessage("正在并发向全网资源站探测播放源...");

      try {
        const query = new URLSearchParams();
        if (movie.id) query.set("id", movie.id);
        if (movie.title) query.set("title", movie.title);

        const res = await fetch(`/api/movies/resolve?${query.toString()}`);
        const data = await res.json();

        if (isMounted && data.success && Array.isArray(data.sources) && data.sources.length > 0) {
          const newSources: PlaySource[] = data.sources;

          setSources((prev) => {
            // 合并现有与新发现的线路
            const map = new Map<string, PlaySource>();
            prev.forEach((s) => map.set(s.id, s));
            newSources.forEach((s) => map.set(s.id, s));
            return Array.from(map.values());
          });

          // 如果当前尚未开始播放任何有效源，立即优先展示并播放最快返回的第 1 条线路！
          setActiveSource((current) => {
            if (!current || !current.episodes || current.episodes.length === 0) {
              const firstReady = newSources[0];
              setActiveEpisode(firstReady.episodes[0] || null);
              return firstReady;
            }
            return current;
          });

          setResolveMessage(`已成功获取 ${newSources.length} 条全网高清线路，已优先匹配最快源播放`);
        } else if (isMounted) {
          setResolveMessage("全网探测完毕，当前已就绪");
        }
      } catch (err) {
        if (isMounted) {
          setResolveMessage("部分资源站响应超时，已加载备用源");
        }
      } finally {
        if (isMounted) {
          setIsResolving(false);
        }
      }
    }

    resolveLiveSources();

    return () => {
      isMounted = false;
    };
  }, [movie.id, movie.title]);

  const handleSelectSource = (sourceId: string) => {
    const src = sources.find((s) => s.id === sourceId);
    if (src) {
      setActiveSource(src);
      const matched = src.episodes.find((e) => e.name === activeEpisode?.name) || src.episodes[0];
      setActiveEpisode(matched);
    }
  };

  const handleSelectEpisode = (ep: Episode) => {
    setActiveEpisode(ep);
  };

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    if (!activeSource || !activeEpisode) return;
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
      {/* 顶部多源探测状态胶囊 (让用户明确感知正在异步竞速获取) */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          {isResolving ? (
            <RefreshCw className="w-4 h-4 text-[#ffcf32] animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span className="text-zinc-200 font-medium">{resolveMessage}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400/10 text-[#ffcf32] border border-amber-400/20 font-medium">
            并发竞速：优先获取优先播放
          </span>
        </div>
      </div>

      {/* 主播放器与选集面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧大播放器 */}
        <div className="lg:col-span-2 space-y-4">
          {activeEpisode?.url ? (
            <VideoPlayer
              key={`${activeSource?.id}-${activeEpisode.id}`}
              url={activeEpisode.url}
              poster={movie.banner || movie.poster}
              initialTime={initialTime}
              onTimeUpdate={handleTimeUpdate}
            />
          ) : (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center gap-3">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-xs"
                style={{ backgroundImage: `url(${movie.poster})` }}
              />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#ffcf32] border-t-transparent animate-spin" />
                <span className="text-sm font-semibold text-white">
                  正在跨多个资源站竞速解析播放流...
                </span>
                <span className="text-xs text-zinc-400">优先获取成功的线路将即刻为您开播</span>
              </div>
            </div>
          )}

          {/* 播放器下方控制：线路切换 */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                {movie.title}
                {activeEpisode?.name && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-[#ffcf32]">
                    {activeEpisode.name}
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                <span>{movie.year}</span>
                <span>·</span>
                <span>{movie.region}</span>
                <span>·</span>
                <span>{movie.genres.join(" / ")}</span>
                {activeSource && (
                  <>
                    <span>·</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      当前线路: {activeSource.name}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* 线路选择器 (支持动态异步增加新返回的线路) */}
            {sources.length > 0 && activeSource && (
              <SourceSelector
                sources={sources}
                activeSourceId={activeSource.id}
                onSelectSource={handleSelectSource}
              />
            )}
          </div>

          {/* 剧集选集列表 */}
          {activeSource && activeSource.episodes && activeSource.episodes.length > 0 && (
            <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl">
              <EpisodeSelector
                episodes={activeSource.episodes}
                activeEpisodeId={activeEpisode?.id || ""}
                onSelectEpisode={handleSelectEpisode}
              />
            </div>
          )}
        </div>

        {/* 右侧：AI 看点分析与影片档案 */}
        <div className="space-y-6">
          {/* AI 剧情速览 */}
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

      {/* 相似影片 */}
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
