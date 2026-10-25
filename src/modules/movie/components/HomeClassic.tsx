"use client";

import React from "react";
import Link from "next/link";
import { MovieItem } from "../types";
import { MoodType } from "../types/mood";
import { HeroPanoramaClassic } from "./HeroPanoramaClassic";
import { DoubanTopRailClassic } from "./DoubanTopRailClassic";
import { MoodRecommendationClassic } from "./MoodRecommendationClassic";
import { AiFindBar } from "./AiFindBar";
import { MovieCardClassic } from "./MovieCardClassic";
import { Film, Tv, Zap, ChevronRight, Clapperboard, Clock } from "lucide-react";

export interface HomePageData {
  featured: MovieItem[];
  moodCollections: Record<MoodType, MovieItem[]>;
  topMovies: MovieItem[];
  liveUpdates: MovieItem[];
  hotMovies: MovieItem[];
  hotTvs: MovieItem[];
  shortPlays: MovieItem[];
  animes: MovieItem[];
}

export const HomeClassic: React.FC<HomePageData> = ({
  featured,
  moodCollections,
  topMovies,
  liveUpdates,
  hotMovies,
  hotTvs,
  shortPlays,
  animes,
}) => {
  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 1. 顶部 Apple TV+ 风格巨幕全景轮播 */}
      <HeroPanoramaClassic featuredMovies={featured} />

      {/* 2. 情绪场景与灵感选片舱 (AI 情绪找片) */}
      <MoodRecommendationClassic moodCollections={moodCollections} />

      {/* 3. 今日全网实时更新流 */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 sm:pb-3">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-amber-400 to-[#ffcf32] text-black shadow-lg shadow-amber-500/20">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
                今日全网实时更新
                <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  实时同步
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                8大采集站极速入库 · 连载追更零时差 · 超清直连播放
              </p>
            </div>
          </div>

          <Link
            href="/category"
            className="text-xs font-semibold text-zinc-400 hover:text-[#ffcf32] flex items-center gap-0.5 sm:gap-1 transition group"
          >
            查看更新库{" "}
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {liveUpdates.slice(0, 8).map((movie) => (
            <MovieCardClassic key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* 4. 豆瓣高分口碑榜单 (TOP 10 封神长廊) */}
      <DoubanTopRailClassic movies={topMovies} />

      {/* AI 自然语言灵感搜片条 */}
      <AiFindBar />

      {/* 5. 热门连载电视剧 (直连资源站剧集专区) */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 sm:pb-3">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-amber-400 to-[#ffcf32] text-black shadow-lg shadow-amber-500/20">
              <Tv className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
                热门连载电视剧
                <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  追剧必看
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                国产大剧 · 欧美精选 · 悬疑探案 · 同步连载更新
              </p>
            </div>
          </div>

          <Link
            href="/category?type=tv"
            className="text-xs font-semibold text-zinc-400 hover:text-[#ffcf32] flex items-center gap-0.5 sm:gap-1 transition group"
          >
            全部剧集{" "}
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {hotTvs.slice(0, 8).map((tv, idx) => (
            <MovieCardClassic key={tv.id} movie={tv} rank={idx < 3 ? idx + 1 : undefined} />
          ))}
        </div>
      </section>

      {/* 6. 爆款微短剧爽剧快车道 (直连资源站短剧专区) */}
      <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-950/30 via-zinc-900 to-zinc-950 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        {/* 背景光斑 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#ffcf32] text-black font-black shadow-lg shadow-amber-500/30">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-1.5 sm:gap-2">
                爆款微短剧爽剧快车道
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                  HOT 爽剧
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                现代都市 · 逆袭打脸 · 战神归来 · 甜宠古装全集
              </p>
            </div>
          </div>

          <Link
            href="/category?type=shortplay"
            className="text-xs font-bold text-[#ffcf32] hover:text-yellow-300 flex items-center gap-1 self-start sm:self-auto bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20 transition"
          >
            短剧专区 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-4">
          {shortPlays.map((sp) => (
            <MovieCardClassic key={sp.id} movie={sp} className="bg-zinc-950/80" />
          ))}
        </div>
      </section>

      {/* 7. 最新院线大片与热映电影 (直连资源站电影专区) */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 sm:pb-3">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-amber-400 to-[#ffcf32] text-black shadow-lg shadow-amber-500/20">
              <Film className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
                最新院线大片与热映电影
                <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-400/20 text-[#ffcf32] border border-amber-400/30">
                  超清正片
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                动作犯罪 · 科幻奇幻 · 院线公映 · 抢先超清画质
              </p>
            </div>
          </div>

          <Link
            href="/category?type=movie"
            className="text-xs font-semibold text-zinc-400 hover:text-[#ffcf32] flex items-center gap-0.5 sm:gap-1 transition group"
          >
            更多大片{" "}
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {hotMovies.slice(0, 8).map((movie) => (
            <MovieCardClassic key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* 8. 顶流国漫与高燃新番 (直连资源站动漫专区) */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 sm:pb-3">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-amber-400 to-[#ffcf32] text-black shadow-lg shadow-amber-500/20">
              <Clapperboard className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
                顶流国漫与高燃新番
                <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  二次元热搜
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                玄幻仙侠 · 热血战斗 · 季番连载 · 视效盛宴
              </p>
            </div>
          </div>

          <Link
            href="/category?type=anime"
            className="text-xs font-semibold text-zinc-400 hover:text-[#ffcf32] flex items-center gap-0.5 sm:gap-1 transition group"
          >
            全部动漫{" "}
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {animes.slice(0, 8).map((anime) => (
            <MovieCardClassic key={anime.id} movie={anime} />
          ))}
        </div>
      </section>
    </div>
  );
};
