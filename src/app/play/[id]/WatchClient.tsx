"use client";

import React, { useState, useEffect } from "react";
import { MovieItem, PlaySource, Episode } from "@/modules/movie/types";
import { VideoPlayer } from "@/modules/player/components/VideoPlayer";
import { FloatingSourceSelector } from "@/modules/player/components/FloatingSourceSelector";
import { SourceSelector } from "@/modules/player/components/SourceSelector";
import { EpisodeSelector } from "@/modules/player/components/EpisodeSelector";
import { historyService } from "@/modules/user/services/historyService";
import { MovieCard } from "@/modules/movie/components/MovieCard";
import { Sparkles, Star, Film, Zap, RefreshCw, CheckCircle2 } from "lucide-react";
import { deduplicateSources } from "@/modules/movie/utils/sourceDeduplicator";

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
  // 动态聚合的播放线路列表（自动去重过滤）
  const [sources, setSources] = useState<PlaySource[]>(() => deduplicateSources(movie.sources || []));

  // 当前选中的播放线路与集数
  const [activeSource, setActiveSource] = useState<PlaySource | null>(() => {
    const initSources = deduplicateSources(movie.sources || []);
    return initSources.find((s) => s.id === initialSourceId) || initSources[0] || null;
  });

  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(
    activeSource?.episodes?.find((e) => e.id === initialEpisodeId) || activeSource?.episodes?.[0] || null
  );

  // 异步获取多源状态与进度
  const [isResolving, setIsResolving] = useState<boolean>(true);
  const [resolveMessage, setResolveMessage] = useState<string>("正在为您准备高清播放线路...");
  const [resolveProgress, setResolveProgress] = useState<number>(20);

  // 记忆进度 (懒初始化恢复播放进度)
  const [initialTime, setInitialTime] = useState<number>(() => {
    const progress = historyService.getMovieProgress(movie.id);
    return progress && progress.currentTime > 5 ? progress.currentTime : 0;
  });

  // 核心：异步并发获取各个资源的播放地址，优先获取优先展示！
  useEffect(() => {
    let isMounted = true;
    const abortCtrl = new AbortController();

    async function resolveLiveSources() {
      setIsResolving(true);
      setResolveProgress(20);
      setResolveMessage("正在为您优选全网高清播放线路...");

      const t1 = setTimeout(() => {
        if (isMounted) {
          setResolveProgress(55);
          setResolveMessage("正在为您连接全网优质高清播放线路...");
        }
      }, 350);

      const t2 = setTimeout(() => {
        if (isMounted) {
          setResolveProgress(85);
          setResolveMessage("优质线路已就绪，即将开播...");
        }
      }, 850);

      try {
        const queryTitle = movie.title.replace(/[（(].*?[）)]/g, "").trim();
        const res = await fetch(
          `/api/movies/resolve?id=${encodeURIComponent(movie.id)}&title=${encodeURIComponent(
            queryTitle
          )}`,
          { signal: abortCtrl.signal }
        );
        const data = await res.json();
        const rawSources = Array.isArray(data.sources)
          ? data.sources
          : Array.isArray(data.data?.sources)
          ? data.data.sources
          : Array.isArray(data.data)
          ? data.data
          : [];

        if (isMounted && data.success && rawSources.length > 0) {
          const remoteSources: PlaySource[] = deduplicateSources(rawSources);

          setSources(remoteSources);
          setResolveProgress(100);

          // 优先激活匹配源或第 1 条有效线路
          setActiveSource((prev) => {
            if (prev && remoteSources.some((s) => s.id === prev.id)) {
              const refreshed = remoteSources.find((s) => s.id === prev.id)!;
              return refreshed;
            }
            return remoteSources[0];
          });

          // 自动同步或保持对应选集
          setActiveEpisode((prevEp) => {
            const currentActive =
              remoteSources.find((s) => s.id === initialSourceId) || remoteSources[0];
            if (!currentActive?.episodes?.length) return null;

            if (prevEp) {
              const matched = currentActive.episodes.find((e) => e.name === prevEp.name);
              if (matched) return matched;
            }
            return currentActive.episodes[0];
          });

          setResolveMessage(
            `已为您准备 ${remoteSources.length} 条全网高清播放线路`
          );
        } else if (isMounted) {
          setResolveProgress(100);
          setResolveMessage(`已为您载入当前默认播放线路 (共 ${movie.sources?.length || 1} 条)`);
        }
      } catch (err: unknown) {
        const isAbort = err instanceof Error && err.name === "AbortError";
        if (!isAbort) {
          console.error("Failed to resolve live sources:", err);
          setResolveProgress(100);
          setResolveMessage("网络响应稍慢，已切换至备用优质线路");
        }
      } finally {
        clearTimeout(t1);
        clearTimeout(t2);
        if (isMounted) {
          setTimeout(() => {
            if (isMounted) setIsResolving(false);
          }, 600);
        }
      }
    }

    resolveLiveSources();

    return () => {
      isMounted = false;
      abortCtrl.abort();
    };
  }, [movie.id, movie.title]);

  const handleSelectSource = (srcOrId: PlaySource | string) => {
    const srcId = typeof srcOrId === "string" ? srcOrId : srcOrId.id;
    const src = sources.find((s) => s.id === srcId) || (typeof srcOrId !== "string" ? srcOrId : null);
    if (src) {
      setActiveSource(src);
      const matched = src.episodes.find((e) => e.name === activeEpisode?.name) || src.episodes[0];
      setActiveEpisode(matched);
    }
  };

  const handleSelectEpisode = (ep: Episode) => {
    setActiveEpisode(ep);
  };

  // 播放异常自动秒级故障转移切源
  const handlePlaybackFailure = React.useCallback(() => {
    if (!sources || sources.length <= 1) return;
    const currentIndex = sources.findIndex((s) => s.id === activeSource?.id);
    if (currentIndex !== -1 && currentIndex + 1 < sources.length) {
      const nextSource = sources[currentIndex + 1];
      setActiveSource(nextSource);
      const matched = nextSource.episodes.find((e) => e.name === activeEpisode?.name) || nextSource.episodes[0];
      setActiveEpisode(matched);
      setResolveMessage(`当前线路加载失败，已为您自动平滑切换至【${nextSource.name}】`);
    }
  }, [activeEpisode?.name, activeSource?.id, sources]);

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
    <div className="space-y-6">
      {/* 顶部多源探测状态胶囊 (并发竞速状态展示与动态进度条) */}
      <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs shadow-md space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isResolving ? (
              <RefreshCw className="w-4 h-4 text-[#ffcf32] animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="text-zinc-200 font-medium">{resolveMessage}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isResolving && (
              <span className="font-mono font-bold text-[#ffcf32] text-xs">
                {resolveProgress}%
              </span>
            )}
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/10 text-[#ffcf32] border border-amber-400/20 font-medium">
              并发竞速 · 线路切换请点击播放器右上角
            </span>
          </div>
        </div>

        {/* 动态进度条 */}
        {isResolving && (
          <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 via-[#ffcf32] to-emerald-400 h-full rounded-full transition-all duration-300 ease-out shadow-xs shadow-amber-400/50"
              style={{ width: `${resolveProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* 主播放器与右侧栏 (非短剧类影视左右布局：左侧播放器与视频信息，右侧选集与AI看点) */}
      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 items-start">
        {/* 左侧大播放器与基本信息 (占 7~8 列，左侧底部无任何线路列表与选集，极为干净) */}
        <div className="md:col-span-7 lg:col-span-8 space-y-4">
          {/* 播放器容器 (挂载右上角浮动放大选择器) */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800">
            {activeEpisode?.url ? (
              <VideoPlayer
                key={`${activeSource?.id}-${activeEpisode.id}`}
                url={activeEpisode.url}
                poster={movie.banner || movie.poster}
                movieId={movie.id}
                episodeId={activeEpisode.id}
                initialTime={initialTime}
                onTimeUpdate={handleTimeUpdate}
                onPlaybackError={handlePlaybackFailure}
              >
                {/* 核心亮点：播放器右上角悬浮线路选择器，点击放大选择，选择后自动缩小 */}
                {sources.length > 0 && activeSource && (
                  <FloatingSourceSelector
                    sources={sources}
                    activeSource={activeSource}
                    onSelectSource={handleSelectSource}
                  />
                )}
              </VideoPlayer>
            ) : (
              <div className="relative w-full aspect-video min-h-[320px] sm:min-h-[420px] md:min-h-[480px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center gap-3">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-xs"
                  style={{ backgroundImage: `url(${movie.poster})` }}
                />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#ffcf32] border-t-transparent animate-spin" />
                  <span className="text-sm font-semibold text-white">
                    正在为您准备超清播放线路...
                  </span>
                  <span className="text-xs text-zinc-400">
                    已连接全网优质高清线路，即将开启秒级流畅播放
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 播放器下方核心信息 (线路切换仅保留在播放器右上角) */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 sm:p-5 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  {movie.title}
                  {activeEpisode?.name && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-[#ffcf32] border border-zinc-700">
                      {activeEpisode.name}
                    </span>
                  )}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-1.5">
                  <span>{movie.year}</span>
                  <span>·</span>
                  <span>{movie.region}</span>
                  <span>·</span>
                  <span>{movie.genres.join(" / ")}</span>
                  {activeSource && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <Zap className="w-3 h-3" />
                        当前线路: {activeSource.name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-xs text-zinc-400 flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-zinc-800 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>全网共聚合 {sources.length} 条播放源</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧栏：线路选择 + 剧集选集 + AI 看点分析与影片档案 (占 5~4 列) */}
        <div className="md:col-span-5 lg:col-span-4 space-y-5">
          {/* 1. 播放线路/资源选择 (一行两列网格布局，方便用户同屏一键切源) */}
          {sources.length > 1 && (
            <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-2xl shadow-xl">
              <SourceSelector
                sources={sources}
                activeSourceId={activeSource?.id || ""}
                onSelectSource={handleSelectSource}
              />
            </div>
          )}

          {/* 2. 剧集选集面板 (全部统一在右侧栏展示，桌面端并排同屏选集) */}
          {activeSource && activeSource.episodes && activeSource.episodes.length > 0 && (
            <div className="bg-zinc-900/70 border border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <EpisodeSelector
                episodes={activeSource.episodes}
                activeEpisodeId={activeEpisode?.id || ""}
                onSelectEpisode={handleSelectEpisode}
                layout="sidebar"
              />
            </div>
          )}

          {/* 2. AI 剧情速览 */}
          <div className="bg-gradient-to-b from-amber-950/30 to-zinc-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#ffcf32] flex items-center justify-center text-black">
                <Sparkles className="w-3.5 h-3.5 fill-black" />
              </div>
              <h3 className="font-bold text-sm text-white">流量君 AI 剧情速览与看点</h3>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              {movie.aiHighlights && movie.aiHighlights.length > 0 ? (
                movie.aiHighlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-zinc-800/80"
                  >
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
              <p className="text-zinc-300 leading-relaxed text-[11px] max-h-48 overflow-y-auto pr-1">
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
