"use client";

import React, { useState, useEffect } from "react";
import { MovieItem, PlaySource, Episode } from "@/modules/movie/types";
import { VideoPlayer } from "@/modules/player/components/VideoPlayer";
import { FloatingSourceSelector } from "@/modules/player/components/FloatingSourceSelector";
import { SourceSelector } from "@/modules/player/components/SourceSelector";
import { EpisodeSelector } from "@/modules/player/components/EpisodeSelector";
import { historyService } from "@/modules/user/services/historyService";
import { MovieCard } from "@/modules/movie/components/MovieCard";
import { DanmakuItem } from "@/modules/player/types";
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Flame,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  TrendingUp,
  Smartphone,
  Tv,
  Send,
} from "lucide-react";
import { deduplicateSources } from "@/modules/movie/utils/sourceDeduplicator";

interface ShortPlayClientProps {
  movie: MovieItem;
  similarMovies: MovieItem[];
  initialSourceId?: string;
  initialEpisodeId?: string;
}

export const ShortPlayClient: React.FC<ShortPlayClientProps> = ({
  movie,
  similarMovies,
  initialSourceId,
  initialEpisodeId,
}) => {
  const [sources, setSources] = useState<PlaySource[]>(() => deduplicateSources(movie.sources || []));
  const [activeSource, setActiveSource] = useState<PlaySource | null>(() => {
    const initSources = deduplicateSources(movie.sources || []);
    return initSources.find((s) => s.id === initialSourceId) || initSources[0] || null;
  });
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(
    activeSource?.episodes?.find((e) => e.id === initialEpisodeId) || activeSource?.episodes?.[0] || null
  );

  // 真实互动剧评与弹幕状态
  const [comments, setComments] = useState<DanmakuItem[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [isResolving, setIsResolving] = useState<boolean>(true);
  const [resolveMessage, setResolveMessage] = useState<string>("正在并发探测全网短剧资源站...");
  const [resolveProgress, setResolveProgress] = useState<number>(20);
  const [initialTime, setInitialTime] = useState<number>(() => {
    const progress = historyService.getMovieProgress(movie.id);
    return progress && progress.currentTime > 5 ? progress.currentTime : 0;
  });
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // 短剧画幅模式：默认自动识别实际流画幅，亦可随时手动在竖屏(9:16)与横屏(16:9)之间切换
  const [aspectMode, setAspectMode] = useState<"9/16" | "16/9">("9/16");
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);

  // 视频加载元数据后自动回调：若视频宽度大于高度自动切为横屏，反之切为竖屏
  const handleOrientationDetected = (isLandscape: boolean) => {
    if (!isManualOverride) {
      setAspectMode(isLandscape ? "16/9" : "9/16");
    }
  };

  const toggleAspectMode = () => {
    setIsManualOverride(true);
    setAspectMode((prev) => (prev === "9/16" ? "16/9" : "9/16"));
  };

  // 并发多线路动态解析
  useEffect(() => {
    let isMounted = true;
    const abortCtrl = new AbortController();

    async function resolveLiveSources() {
      setIsResolving(true);
      setResolveProgress(20);

      const t1 = setTimeout(() => {
        if (isMounted) setResolveProgress(60);
      }, 350);

      // 前端 5 秒软超时保护：防止极端弱网下长时间卡在优选状态
      const safetyTimer = setTimeout(() => {
        if (isMounted) {
          abortCtrl.abort();
          setResolveProgress(100);
          setResolveMessage(`已载入当前首选播放源 (共 ${movie.sources?.length || 1} 条)`);
          setIsResolving(false);
        }
      }, 5000);

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
          : [];

        if (isMounted && data.success && rawSources.length > 0) {
          const remoteSources = deduplicateSources(rawSources);
          setSources(remoteSources);
          setResolveProgress(100);

          setActiveSource((prev) => {
            if (prev && rawSources.some((s: PlaySource) => s.id === prev.id)) {
              return rawSources.find((s: PlaySource) => s.id === prev.id)!;
            }
            return rawSources[0];
          });

          setActiveEpisode((prevEp) => {
            const currentActive =
              rawSources.find((s: PlaySource) => s.id === initialSourceId) || rawSources[0];
            if (!currentActive?.episodes?.length) return null;
            if (prevEp) {
              const matched = currentActive.episodes.find((e: Episode) => e.name === prevEp.name);
              if (matched) return matched;
            }
            return currentActive.episodes[0];
          });

          setResolveMessage(`已成功聚合 ${rawSources.length} 条全网高速短剧线路`);
        } else if (isMounted) {
          setResolveProgress(100);
          setResolveMessage(`已载入当前首选播放源 (共 ${movie.sources?.length || 1} 条)`);
        }
      } catch (err: unknown) {
        const isAbort = err instanceof Error && err.name === "AbortError";
        if (isMounted) {
          setResolveProgress(100);
          setResolveMessage(`已载入当前首选播放源 (共 ${movie.sources?.length || 1} 条)`);
        }
        if (!isAbort) {
          console.error("Failed to resolve live shortplay sources:", err);
        }
      } finally {
        clearTimeout(t1);
        clearTimeout(safetyTimer);
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
    setIsManualOverride(false); // 切换新剧集时重新允许自动识别
  };

  // 拉取当前剧集真实弹幕与剧评列表
  useEffect(() => {
    let isMounted = true;
    async function loadEpisodeComments() {
      try {
        const epId = activeEpisode?.id || "ep-1";
        const res = await fetch(
          `/api/danmaku?movieId=${encodeURIComponent(movie.id)}&episodeId=${encodeURIComponent(epId)}`
        );
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setComments(json.data);
        }
      } catch (err) {
        console.warn("Failed to load comments:", err);
      }
    }
    loadEpisodeComments();
    return () => {
      isMounted = false;
    };
  }, [movie.id, activeEpisode?.id]);

  // 格式化时间
  const formatTimeAgo = (timestamp?: number) => {
    if (!timestamp) return "刚刚";
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return "刚刚";
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    return `${Math.floor(diff / 86400)}天前`;
  };

  // 从右侧剧评栏发送弹幕/评论
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInput.trim();
    if (!text || isSubmittingComment) return;

    setIsSubmittingComment(true);
    const newComment: DanmakuItem = {
      id: `local_${Date.now()}`,
      movieId: movie.id,
      episodeId: activeEpisode?.id || "ep-1",
      text,
      time: 0,
      color: "#ffcf32",
      type: "scroll",
      user: "我",
      createdAt: Date.now(),
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
    setCommentInput("");

    try {
      await fetch("/api/danmaku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movie.id,
          episodeId: activeEpisode?.id || "ep-1",
          text,
          time: 0,
          color: "#ffcf32",
          type: "scroll",
          user: "我",
        }),
      });
    } catch {
      // ignore
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 弹幕/评论点赞
  const handleLikeComment = async (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: (c.likes || 0) + 1 } : c))
    );
    try {
      await fetch("/api/danmaku/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      // ignore
    }
  };

  // 视频播放器发送弹幕时的同步回调
  const handlePlayerSendDanmaku = (danmaku: DanmakuItem) => {
    setComments((prev) => [danmaku, ...prev]);
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
      setResolveMessage(`当前线路加载失败，已为您自动切换至备用线路【${nextSource.name}】`);
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
      {/* 顶部短剧专区高光标识条 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-amber-950/30 border border-rose-500/30 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-black shadow-md shadow-rose-500/20">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white flex items-center gap-2">
              {movie.title}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase font-black tracking-wider">
                微短剧沉浸影院
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              专享左右分屏极简布局 · 左侧竖屏高清视窗 · 右侧剧情档案与互动弹幕
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* 实时画幅模式指示与手动切换按钮 */}
          <button
            onClick={toggleAspectMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
              aspectMode === "9/16"
                ? "bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30"
                : "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
            }`}
            title="已开启智能自动识别画幅，亦可随时手动点击在竖屏(9:16)与横屏(16:9)之间切换"
          >
            {aspectMode === "9/16" ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                <span>画幅: 竖屏 9:16</span>
              </>
            ) : (
              <>
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>画幅: 横屏 16:9</span>
              </>
            )}
            <span className="text-[10px] opacity-70 font-normal ml-0.5">点击切换</span>
          </button>

          {isResolving ? (
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              {resolveMessage}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              已汇聚 {sources.length} 条短剧源
            </span>
          )}
        </div>
      </div>

      {/* 核心短剧专属「左右布局」架构 (自适应竖屏 9:16 或横屏 16:9) */}
      <div
        className={`grid grid-cols-1 ${
          aspectMode === "9/16"
            ? "lg:grid-cols-12 gap-8"
            : "md:grid-cols-12 lg:grid-cols-12 gap-6"
        } items-start transition-all duration-300`}
      >
        {/* 左侧：短剧播放器 (竖屏占 5 列居中呈现，横屏占 7~8 列宽屏影院视窗) */}
        <div
          className={`${
            aspectMode === "9/16"
              ? "lg:col-span-5 flex flex-col items-center"
              : "md:col-span-7 lg:col-span-8 flex flex-col"
          } transition-all duration-300`}
        >
          <div
            className={`relative w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-zinc-800/90 flex items-center justify-center transition-all duration-300 ${
              aspectMode === "9/16"
                ? "max-w-[380px] sm:max-w-[420px] aspect-[9/16] min-h-[540px] max-h-[750px] mx-auto"
                : "aspect-video min-h-[360px] sm:min-h-[460px] w-full"
            }`}
          >
            {activeEpisode?.url ? (
              <VideoPlayer
                key={`${activeSource?.id}-${activeEpisode.id}`}
                url={activeEpisode.url}
                poster={movie.banner || movie.poster}
                movieId={movie.id}
                episodeId={activeEpisode.id}
                initialTime={initialTime}
                enableDanmaku={true}
                aspectRatio={aspectMode}
                onOrientationDetected={handleOrientationDetected}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onPlaybackError={handlePlaybackFailure}
              >
                {/* 播放器左上角：画幅横屏/竖屏快速切换按钮 */}
                <div className="absolute top-3 left-3 z-40 select-none">
                  <button
                    onClick={toggleAspectMode}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/80 hover:bg-black/95 text-white border border-zinc-700/80 hover:border-amber-400/80 backdrop-blur-md shadow-2xl cursor-pointer transition-all hover:scale-105 active:scale-95 group text-xs font-bold"
                    title={`当前为${aspectMode === "9/16" ? "竖屏 (9:16)" : "横屏 (16:9)"}，支持自动判断，点击可手动切换`}
                  >
                    {aspectMode === "9/16" ? (
                      <>
                        <Smartphone className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-90 transition-transform" />
                        <span className="text-zinc-200 group-hover:text-amber-300">竖屏 9:16</span>
                      </>
                    ) : (
                      <>
                        <Tv className="w-3.5 h-3.5 text-amber-400 group-hover:-rotate-90 transition-transform" />
                        <span className="text-zinc-200 group-hover:text-amber-300">横屏 16:9</span>
                      </>
                    )}
                    <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300">切换</span>
                  </button>
                </div>

                {/* 播放器右上角悬浮换线 (高层级 z-50，置于最顶层，点击放大选择，选择后自动收起) */}
                {sources.length > 0 && activeSource && (
                  <FloatingSourceSelector
                    sources={sources}
                    activeSource={activeSource}
                    onSelectSource={handleSelectSource}
                  />
                )}
              </VideoPlayer>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center p-6">
                <div className="w-12 h-12 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
                <span className="text-sm font-bold text-white">正在拉取短剧最新集数与播放直链...</span>
              </div>
            )}
          </div>

          {/* 横屏模式 (16:9)：短剧通常多达50~100集，选集放置在左侧大播放器下方宽幅展开，彻底解决挤压问题 */}
          {aspectMode === "16/9" && activeSource && activeSource.episodes && activeSource.episodes.length > 0 && (
            <div className="w-full p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-3 shadow-xl">
              <EpisodeSelector
                episodes={activeSource.episodes}
                activeEpisodeId={activeEpisode?.id || ""}
                onSelectEpisode={handleSelectEpisode}
                layout="default"
              />
            </div>
          )}
        </div>

        {/* 右侧：短剧专属信息、选集与实时弹幕互动侧边栏 (竖屏占 7 列，横屏占 5~4 列) */}
        <div
          className={`${
            aspectMode === "9/16"
              ? "lg:col-span-7"
              : "md:col-span-5 lg:col-span-4"
          } space-y-5 transition-all duration-300`}
        >
          {/* 1. 剧情与看点卡片 */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-3.5 backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  {movie.title}
                  {activeEpisode?.name && (
                    <span className="text-xs px-2 py-0.5 rounded-lg bg-amber-400/20 text-[#ffcf32] border border-amber-400/30">
                      {activeEpisode.name}
                    </span>
                  )}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-1">
                  <span>{movie.year}</span>
                  <span>·</span>
                  <span>{movie.region}</span>
                  <span>·</span>
                  <span className="text-zinc-300 font-medium">{movie.genres.join(" / ")}</span>
                </div>
              </div>

              {/* 互动动作按钮 */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    liked
                      ? "bg-rose-500/20 border-rose-500 text-rose-400"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
                  }`}
                  title="为本剧点赞"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    bookmarked
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
                  }`}
                  title="追剧收藏"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI 高光爽点提炼 */}
            {movie.aiHighlights && movie.aiHighlights.length > 0 && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-black/40 to-rose-500/10 border border-amber-500/30 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffcf32]" />
                  <span>流量君 AI 核心亮点速评：</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[11px]">{movie.aiHighlights[0]}</p>
              </div>
            )}

            {/* 简介 */}
            <div className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-2.5">
              <span className="font-semibold text-zinc-300 block mb-1">本剧看点：</span>
              <p className="text-zinc-300 text-[11px] line-clamp-3">{movie.summary}</p>
            </div>
          </div>

          {/* 播放线路/资源选择 (一行两列网格布局) */}
          {sources.length > 1 && (
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-lg">
              <SourceSelector
                sources={sources}
                activeSourceId={activeSource?.id || ""}
                onSelectSource={handleSelectSource}
              />
            </div>
          )}

          {/* 2. 剧集选集栏：仅在竖屏(9:16)模式下放在右侧 (横屏16:9时自动移至左侧宽幅展开，避免挤压) */}
          {aspectMode === "9/16" && activeSource && activeSource.episodes && activeSource.episodes.length > 0 && (
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-3">
              <EpisodeSelector
                episodes={activeSource.episodes}
                activeEpisodeId={activeEpisode?.id || ""}
                onSelectEpisode={handleSelectEpisode}
                layout="sidebar"
              />
            </div>
          )}

          {/* 3. 右侧互动短评与弹幕精选 (真实持久化 + 即时发送互动) */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-3.5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#ffcf32]" />
                本集热门剧评与弹幕
                <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-amber-400/20 text-[#ffcf32]">
                  {comments.length}
                </span>
              </h3>
              <span className="text-[10px] text-zinc-500">双向同步</span>
            </div>

            {/* 剧评列表 */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar scrollbar-none pr-0.5">
              {comments.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500">
                  暂无弹幕剧评，发一条抢占首发吧~
                </div>
              ) : (
                comments.map((c) => {
                  const timeFormatted =
                    c.time && c.time > 0
                      ? `${Math.floor(c.time / 60)}:${String(Math.floor(c.time % 60)).padStart(2, "0")}`
                      : "";

                  return (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl bg-black/40 border border-zinc-800/80 text-xs space-y-1 hover:border-zinc-700/80 transition"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          {c.user || "观众"}
                          {timeFormatted && (
                            <span className="text-[9px] font-normal px-1 py-0.2 rounded bg-zinc-800 text-zinc-400">
                              {timeFormatted}
                            </span>
                          )}
                        </span>
                        <span className="text-zinc-500 text-[10px]">
                          {c.createdAt ? formatTimeAgo(c.createdAt) : "刚刚"}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-[11px] leading-relaxed break-all" style={{ color: c.color || undefined }}>
                        {c.text}
                      </p>
                      <div className="flex items-center justify-end gap-1.5 text-[10px] text-zinc-500 pt-0.5">
                        <button
                          onClick={() => handleLikeComment(c.id)}
                          className="flex items-center gap-1 hover:text-amber-400 transition cursor-pointer"
                          title="点赞"
                        >
                          <ThumbsUp className="w-2.5 h-2.5 text-zinc-400 hover:text-amber-400" />
                          <span>{c.likes || 0}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 边栏发表评论/弹幕框 */}
            <form onSubmit={handleSubmitComment} className="flex items-center gap-1.5 pt-1 border-t border-zinc-800/80">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="说点什么发弹幕参与互动..."
                maxLength={60}
                className="flex-1 bg-black/50 border border-zinc-700/80 focus:border-amber-400 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-hidden transition"
              />
              <button
                type="submit"
                disabled={!commentInput.trim() || isSubmittingComment}
                className="p-2 rounded-xl bg-[#ffcf32] text-black font-bold hover:bg-amber-400 disabled:opacity-30 transition cursor-pointer flex items-center justify-center shrink-0"
                title="发送剧评"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 底部：同类高分爆款爽剧推荐 */}
      {similarMovies.length > 0 && (
        <section className="pt-8 border-t border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              正在追更本剧的观众还喜欢
            </h2>
            <span className="text-xs text-zinc-400">同题材爆款爽剧精选</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarMovies.slice(0, 6).map((sim) => (
              <MovieCard key={sim.id} movie={sim} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
