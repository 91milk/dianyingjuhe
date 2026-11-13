"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThematicPlaylist } from "../types/playlist";
import { useLocale } from "@/i18n/LocaleContext";
import { Flame, Eye, Film, Sparkles } from "lucide-react";

interface PlaylistCardProps {
  playlist: ThematicPlaylist;
  className?: string;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, className = "" }) => {
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

  const badge =
    locale === "ja-JP"
      ? playlist.badgeJa || playlist.badge
      : locale === "en-US"
      ? playlist.badgeEn || playlist.badge
      : playlist.badge;

  return (
    <Link
      href={`/playlists/${playlist.slug}`}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-black/60 cursor-pointer ${className}`}
    >
      {/* 封面全景背景 */}
      <div className="absolute inset-0 z-0">
        <Image
          src={playlist.coverImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover opacity-35 transition-transform duration-500 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${playlist.themeColor}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/80 to-transparent" />
      </div>

      {/* 顶部标签与计数值 */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-md"
          style={{ backgroundColor: `${playlist.accentColor}25`, color: playlist.accentColor, borderColor: `${playlist.accentColor}50`, borderWidth: 1 }}
        >
          <Sparkles className="w-3 h-3" />
          {badge}
        </span>

        <span className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md border border-zinc-800">
          <Film className="w-3 h-3 text-amber-400" />
          <span>{playlist.itemCount} 部精选</span>
        </span>
      </div>

      {/* 底部信息标题与简介 */}
      <div className="relative z-10 mt-20 space-y-2">
        <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
          {subtitle}
        </p>

        {/* 标签列表 */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          {playlist.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900/80 text-zinc-400 border border-zinc-800 group-hover:border-zinc-700 transition"
            >
              #{tag}
            </span>
          ))}
          {playlist.views && (
            <span className="ml-auto flex items-center gap-1 text-[10px] text-zinc-500">
              <Eye className="w-3 h-3" />
              {(playlist.views / 1000).toFixed(1)}k
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
