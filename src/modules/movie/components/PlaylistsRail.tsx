"use client";

import React from "react";
import Link from "next/link";
import { ThematicPlaylist } from "../types/playlist";
import { PlaylistCard } from "./PlaylistCard";
import { ChevronRight, BookmarkCheck, Flame } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

interface PlaylistsRailProps {
  playlists: ThematicPlaylist[];
  className?: string;
}

export const PlaylistsRail: React.FC<PlaylistsRailProps> = ({ playlists, className = "" }) => {
  const { t, locale } = useLocale();

  if (!playlists || playlists.length === 0) return null;

  return (
    <section className={`space-y-4 ${className}`}>
      {/* 头部标题与进入片单广场 */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
            <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
              {locale === "zh-CN" ? "懂片精选 · 专题片单" : locale === "ja-JP" ? "厳選プレイリスト" : "Curated Playlists"}
              <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {locale === "zh-CN" ? "更懂你的片单" : locale === "ja-JP" ? "テーマ特選" : "Deep Cinema"}
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
              {locale === "zh-CN"
                ? "深度主题策展 · 告别剧荒 · 午夜剧场与高分合集一键直达"
                : locale === "ja-JP"
                ? "深夜シネマ、超難解サスペンス、話題の縦型ドラマを網羅"
                : "Thematic collections, midnight cinema & viral micro-drama hits"}
            </p>
          </div>
        </div>

        <Link
          href="/playlists"
          className="text-xs font-semibold text-zinc-400 hover:text-[#ffcf32] flex items-center gap-0.5 sm:gap-1 transition group"
        >
          {locale === "zh-CN" ? "片单广场" : locale === "ja-JP" ? "すべて見る" : "All Playlists"}
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 片单卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {playlists.slice(0, 3).map((pl) => (
          <PlaylistCard key={pl.id} playlist={pl} />
        ))}
      </div>
    </section>
  );
};
