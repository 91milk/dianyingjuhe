"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieItem } from "../types";
import { MovieCardModern } from "./MovieCardModern";
import { SectionHeading } from "./SectionHeading";

interface DoubanTopRailProps {
  movies: MovieItem[];
}

export const DoubanTopRailModern: React.FC<DoubanTopRailProps> = ({ movies }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (movies.length === 0) return null;

  const scroll = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: direction * 640, behavior: "smooth" });
  };

  return (
    <section className="space-y-6">
      <div className="relative">
        <SectionHeading
          index="04"
          eyebrow="Audience Ranking"
          title="本周口碑榜"
          description="把真正值得看的影片放在前面，排名来自口碑、热度与持续讨论。"
        />
        <div className="absolute bottom-0 right-0 hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-10 w-10 items-center justify-center border border-white/15 text-[#aaa9a5] transition hover:border-white/45 hover:text-white"
            aria-label="向前浏览"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-10 w-10 items-center justify-center border border-white/15 text-[#aaa9a5] transition hover:border-white/45 hover:text-white"
            aria-label="向后浏览"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        {movies.map((movie, index) => (
          <div key={movie.id} className="w-[170px] shrink-0 sm:w-[220px]">
            <MovieCardModern movie={movie} rank={index + 1} />
          </div>
        ))}
      </div>
    </section>
  );
};
