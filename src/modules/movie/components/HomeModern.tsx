"use client";

import React from "react";
import { MovieItem } from "../types";
import { HomePageData } from "./HomeClassic";
import { HeroPanoramaModern } from "./HeroPanoramaModern";
import { DoubanTopRailModern } from "./DoubanTopRailModern";
import { MoodRecommendationModern } from "./MoodRecommendationModern";
import { MovieCardModern } from "./MovieCardModern";
import { SectionHeading } from "./SectionHeading";
import { AiFindBar } from "./AiFindBar";
import { PlaylistsRail } from "./PlaylistsRail";
import { useLocale } from "@/i18n/LocaleContext";

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
  playlists,
}) => {
  const { t } = useLocale();
  return (
    <div className="space-y-16 sm:space-y-24">
      <HeroPanoramaModern featuredMovies={featured} />
      <MoodRecommendationModern moodCollections={moodCollections} />

      {/* 懂片 AI 找片输入枢纽 */}
      <AiFindBar />

      <FilmGrid
        movies={liveUpdates}
        index="03"
        eyebrow="Live Catalogue"
        title={t.home.liveUpdatesTitle}
        description={t.home.liveUpdatesDesc}
        href="/category"
        linkLabel={t.home.liveUpdatesMore}
      />

      <DoubanTopRailModern movies={topMovies} globalMovies={globalTopMovies} />

      {/* 懂片精选 · 专题片单 */}
      {playlists && playlists.length > 0 && (
        <PlaylistsRail playlists={playlists} />
      )}

      <FilmGrid
        movies={hotTvs}
        index="05"
        eyebrow="Series"
        title={t.home.hotTvsTitle}
        description={t.home.hotTvsDesc}
        href="/category?type=tv"
        linkLabel={t.home.hotTvsMore}
        ranked
      />

      {shortPlays.length > 0 && (
        <section className="-mx-4 space-y-6 bg-[#8f201c] px-4 py-10 sm:-mx-6 sm:px-6 sm:py-14 lg:-mx-10 lg:px-10">
          <SectionHeading
            index="06"
            eyebrow="Short & Sharp"
            title={t.home.shortPlaysTitle}
            description={t.home.shortPlaysDesc}
            href="/category?type=shortplay"
            linkLabel={t.home.shortPlaysMore}
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
        title={t.home.hotMoviesTitle}
        description={t.home.hotMoviesDesc}
        href="/category?type=movie"
        linkLabel={t.home.hotMoviesMore}
      />

      <FilmGrid
        movies={animes}
        index="08"
        eyebrow="Animation"
        title={t.home.animesTitle}
        description={t.home.animesDesc}
        href="/category?type=anime"
        linkLabel={t.home.animesMore}
      />
    </div>
  );
};
