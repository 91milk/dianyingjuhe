"use client";

import React from "react";
import { MovieItem } from "../types";
import { HomePageData } from "./HomeClassic";
import { HeroPanoramaModern } from "./HeroPanoramaModern";
import { DoubanTopRailModern } from "./DoubanTopRailModern";
import { MoodRecommendationModern } from "./MoodRecommendationModern";
import { MovieCardModern } from "./MovieCardModern";
import { SectionHeading } from "./SectionHeading";

interface FilmGridProps {
  movies: MovieItem[];
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  ranked?: boolean;
}

function FilmGrid({ movies, index, eyebrow, title, description, href, linkLabel, ranked }: FilmGridProps) {
  if (movies.length === 0) return null;

  return (
    <section className="space-y-6">
      <SectionHeading
        index={index}
        eyebrow={eyebrow}
        title={title}
        description={description}
        href={href}
        linkLabel={linkLabel}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:gap-5">
        {movies.slice(0, 8).map((movie, movieIndex) => (
          <MovieCardModern key={movie.id} movie={movie} rank={ranked && movieIndex < 3 ? movieIndex + 1 : undefined} />
        ))}
      </div>
    </section>
  );
}

export const HomeModern: React.FC<HomePageData> = ({
  featured,
  moodCollections,
  topMovies,
  globalTopMovies,
  liveUpdates,
  hotMovies,
  hotTvs,
  shortPlays,
  animes,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24">
      <HeroPanoramaModern featuredMovies={featured} />
      <MoodRecommendationModern moodCollections={moodCollections} />

      <FilmGrid
        movies={liveUpdates}
        index="03"
        eyebrow="Live Catalogue"
        title="今日全网实时更新"
        description="连接多资源站的最新入库内容，把刚刚更新的剧集和电影第一时间呈现。"
        href="/category"
        linkLabel="查看更新库"
      />

      <DoubanTopRailModern movies={topMovies} globalMovies={globalTopMovies} />

      <FilmGrid
        movies={hotTvs}
        index="05"
        eyebrow="Series"
        title="热门连载电视剧"
        description="国产大剧、欧美精选与高口碑悬疑，持续同步最新进度。"
        href="/category?type=tv"
        linkLabel="全部剧集"
        ranked
      />

      {shortPlays.length > 0 && (
        <section className="-mx-4 space-y-6 bg-[#8f201c] px-4 py-10 sm:-mx-6 sm:px-6 sm:py-14 lg:-mx-10 lg:px-10">
          <SectionHeading
            index="06"
            eyebrow="Short & Sharp"
            title="爆款微短剧"
            description="短、快、直接进入情绪高点。都市逆袭、甜宠古装与高能爽剧集中呈现。"
            href="/category?type=shortplay"
            linkLabel="短剧专区"
            inverse
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {shortPlays.slice(0, 8).map((movie) => (
              <MovieCardModern key={movie.id} movie={movie} className="border-white/15 bg-[#160b0a]" />
            ))}
          </div>
        </section>
      )}

      <FilmGrid
        movies={hotMovies}
        index="07"
        eyebrow="Now Showing"
        title="院线与热映电影"
        description="动作、犯罪、科幻与奇幻，把大银幕的新鲜感带到每一次播放。"
        href="/category?type=movie"
        linkLabel="更多电影"
      />

      <FilmGrid
        movies={animes}
        index="08"
        eyebrow="Animation"
        title="国漫与高燃新番"
        description="玄幻仙侠、热血战斗与季度新番，追更不用错过每一次更新。"
        href="/category?type=anime"
        linkLabel="全部动漫"
      />
    </div>
  );
};
