"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThematicPlaylist } from "@/modules/movie/types/playlist";
import { MovieCard } from "@/modules/movie/components/MovieCard";
import { useLocale } from "@/i18n/LocaleContext";
import { getLocalizedMovie } from "@/modules/movie/utils/localizeMovie";
import { ArrowLeft, Play, Sparkles, Film, Eye, ThumbsUp, Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PlaylistDetailClientProps {
  playlist: ThematicPlaylist;
}

export const PlaylistDetailClient: React.FC<PlaylistDetailClientProps> = ({ playlist }) => {
  const router = useRouter();
  const { locale } = useLocale();

  const title =
    locale === "ja-JP"
      ? playlist.titleJa || playlist.title
      : locale === "en-US"
      ? playlist.titleEn || playlist.title
      : playlist.title;

  const subtitle =
    locale === "ja-JP"
      ? playlist.subtitleJa || playlist.subtitle
      : locale === "en-US"
      ? playlist.subtitleEn || playlist.subtitle
      : playlist.subtitle;

  const description =
    locale === "ja-JP"
      ? playlist.descriptionJa || playlist.description
      : locale === "en-US"
      ? playlist.descriptionEn || playlist.description
      : playlist.description;

  const movies = playlist.movies || [];

  const handleRandomPlay = () => {
    if (movies.length === 0) return;
    const randomIdx = Math.floor(Math.random() * movies.length);
    router.push(`/play/${movies[randomIdx].id}`);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 返回上级 */}
      <div>
        <Link
          href="/playlists"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{locale === "zh-CN" ? "返回全部片单" : locale === "ja-JP" ? "プレイリスト一覧へ" : "Back to Playlists"}</span>
        </Link>
      </div>

      {/* 片单专属沉浸巨幕 Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <Image
            src={playlist.coverImage}
            alt={title}
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-25"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${playlist.themeColor}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-md"
              style={{
                backgroundColor: `${playlist.accentColor}25`,
                color: playlist.accentColor,
                borderColor: `${playlist.accentColor}60`,
                borderWidth: 1,
              }}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              {playlist.badge}
            </span>

            <span className="text-xs text-zinc-400 bg-black/60 px-2.5 py-1 rounded-full border border-zinc-800">
              共 {movies.length} 部精选作品
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base font-medium text-amber-300">
            {subtitle}
          </p>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {description}
          </p>

          {/* 标签与操作按钮组 */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            {movies.length > 0 && (
              <button
                type="button"
                onClick={handleRandomPlay}
                className="px-5 py-2.5 rounded-2xl bg-[#ffcf32] hover:bg-yellow-300 text-black font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <Shuffle className="w-4 h-4" />
                <span>{locale === "zh-CN" ? "随机开一部" : locale === "ja-JP" ? "ランダム再生" : "Random Pick"}</span>
              </button>
            )}

            {movies.length > 0 && (
              <Link
                href={`/play/${movies[0].id}`}
                className="px-5 py-2.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 border border-zinc-700 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{locale === "zh-CN" ? "从第一部开播" : locale === "ja-JP" ? "最初から再生" : "Play from Start"}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 片单所包含的影片列表 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <span>片单收录影片</span>
            <span className="text-xs font-normal text-zinc-400">({movies.length})</span>
          </h2>
        </div>

        {movies.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-sm">
            正在聚合全网超清资源，请稍后刷新重试...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={getLocalizedMovie(m, locale)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
