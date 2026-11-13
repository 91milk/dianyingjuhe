"use client";

import React, { useState } from "react";
import { ThematicPlaylist } from "@/modules/movie/types/playlist";
import { PlaylistCard } from "@/modules/movie/components/PlaylistCard";
import { useLocale } from "@/i18n/LocaleContext";
import { BookmarkCheck, Sparkles, Flame, Moon, Compass } from "lucide-react";

interface PlaylistsClientProps {
  playlists: ThematicPlaylist[];
}

export const PlaylistsClient: React.FC<PlaylistsClientProps> = ({ playlists }) => {
  const { locale } = useLocale();
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const allTags = ["all", "午夜剧场", "硬核科幻", "反转惊悚", "热播短剧", "爆笑解压", "治愈系"];

  const filteredPlaylists = selectedTag === "all"
    ? playlists
    : playlists.filter((p) =>
        p.tags.some((t) => t.includes(selectedTag) || selectedTag.includes(t)) ||
        p.badge.includes(selectedTag) ||
        p.title.includes(selectedTag)
      );

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 头部 Hero 展台 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/60 via-zinc-900 to-black p-6 sm:p-10 border border-purple-500/20 shadow-2xl">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500 text-white shadow-md">
              <BookmarkCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              {locale === "zh-CN" ? "懂片 · 更懂你的片单" : locale === "ja-JP" ? "テーマ別厳選シネマ" : "Curated Cinema Playlists"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {locale === "zh-CN"
              ? "专题片单广场"
              : locale === "ja-JP"
              ? "特選プレイリスト・スクエア"
              : "Thematic Playlists Square"}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {locale === "zh-CN"
              ? "拒绝无脑翻找与剧荒，专业资深影迷深度策展。从午夜赛博霓虹放映室，到诺兰时空硬核烧脑；从高能微短剧到吉卜力夏日温情，一键开播。"
              : locale === "ja-JP"
              ? "夜更けのミッドナイトシアターから、超難解サスペンス、痛快ショートドラマまで、あなたの気分にぴったりの名作をお届けします。"
              : "Say goodbye to choice fatigue. Handcrafted playlists spanning nocturnal cinema, mind-bending sci-fi, viral micro-dramas, and comforting soul healers."}
          </p>
        </div>

        {/* 快速分类过滤器 */}
        <div className="relative z-10 mt-6 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500 font-semibold mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            {locale === "zh-CN" ? "主题筛选：" : locale === "ja-JP" ? "カテゴリー：" : "Tags:"}
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                selectedTag === tag
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold"
                  : "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {tag === "all" ? (locale === "zh-CN" ? "全部片单" : locale === "ja-JP" ? "すべて" : "All") : tag}
            </button>
          ))}
        </div>
      </div>

      {/* 片单卡片瀑布流 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlaylists.map((pl) => (
          <PlaylistCard key={pl.id} playlist={pl} />
        ))}
      </div>
    </div>
  );
};
