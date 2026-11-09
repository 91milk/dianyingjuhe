"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MovieItem } from "../types";
import { Play, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getOptimizedImageUrl } from "../utils/imageHelper";
import { encodePlayId } from "@/lib/playCipher";
import { useLocale } from "@/i18n/LocaleContext";

interface HeroPanoramaProps {
  featuredMovies: MovieItem[];
}

export const HeroPanoramaModern: React.FC<HeroPanoramaProps> = ({ featuredMovies }) => {
  const { t } = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const movies = featuredMovies.slice(0, 5);

  useEffect(() => {
    if (movies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % movies.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (movies.length === 0) return null;

  const current = movies[currentIndex];
  const encodedId = encodePlayId(current.id);

  return (
    <section className="relative -mx-4 -mt-5 min-h-[580px] overflow-hidden border-b border-white/10 sm:-mx-6 sm:-mt-8 sm:min-h-[660px] lg:-mx-10 lg:min-h-[720px]">
      <div className="absolute inset-0">
        <img
          src={getOptimizedImageUrl(current.banner || current.poster)}
          alt=""
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "/api/img?fallback=1";
          }}
          className="h-full w-full object-cover object-center brightness-[0.72] filter transition duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080a0b_0%,rgba(8,10,11,.86)_45%,rgba(8,10,11,.62)_75%,rgba(8,10,11,.85)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0b] via-[#080a0b]/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-full min-h-[580px] max-w-[1440px] flex-col justify-end px-4 pb-12 pt-28 sm:min-h-[660px] sm:px-8 sm:pb-16 lg:min-h-[720px] lg:px-12">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#ef4b43]">
              <span className="flex items-center gap-1 font-bold text-white">
                <Star className="h-3.5 w-3.5 fill-[#ef4b43] text-[#ef4b43]" />
                {current.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span className="text-[#d8d5cf]">{current.year}</span>
              <span>·</span>
              <span className="text-[#d8d5cf]">{current.region}</span>
              <span>·</span>
              <span className="text-[#d8d5cf]">{current.genres.join(" / ")}</span>
            </div>

            <p className="mt-4 text-[11px] font-black uppercase tracking-[0.28em] text-[#ef4b43]">
              {t.home.editorialFeature}
            </p>
            <h1 className="text-balance text-5xl font-black leading-[0.94] tracking-[-0.065em] text-[#f2efe9] sm:text-7xl lg:text-[92px]">
              {current.title}
            </h1>
            {current.originalTitle && (
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#b2b1ad]">
                {current.originalTitle}
              </p>
            )}
            <p className="mt-6 max-w-xl line-clamp-3 text-sm leading-7 text-[#c3c0ba] sm:text-base">
              {current.summary}
            </p>

            {current.aiHighlights?.[0] && (
              <p className="mt-5 border-l-2 border-[#ef4b43] pl-4 text-xs leading-5 text-[#aaa9a5]">
                {t.home.aiInsight}{current.aiHighlights[0]}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/play/${encodedId}`}
                className="flex min-h-12 items-center gap-2 bg-[#ef4b43] px-6 text-sm font-black text-white transition hover:bg-[#ff5a52]"
              >
                <Play className="h-4 w-4 fill-current" />
                {t.home.playFeaturedBt}
              </Link>
              <Link
                href={`/movie/${encodedId}`}
                className="flex min-h-12 items-center gap-2 border border-white/25 bg-black/20 px-6 text-sm font-bold text-[#f2efe9] transition hover:border-white/60 hover:bg-white/5"
              >
                <Info className="h-4 w-4" />
                {t.home.viewArchiveBt}
              </Link>
            </div>
          </div>

          <div className="hidden items-end gap-3 lg:flex">
            <div className="mr-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setCurrentIndex((index) => (index - 1 + movies.length) % movies.length)}
                className="flex h-10 w-10 items-center justify-center border border-white/20 bg-black/30 text-white transition hover:border-white/60"
                aria-label="上一部焦点影片"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((index) => (index + 1) % movies.length)}
                className="flex h-10 w-10 items-center justify-center border border-white/20 bg-black/30 text-white transition hover:border-white/60"
                aria-label="下一部焦点影片"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {movies.map((movie, index) => (
              <button
                key={movie.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`relative h-36 w-24 overflow-hidden border transition ${index === currentIndex ? "border-[#ef4b43] opacity-100" : "border-white/15 opacity-55 hover:opacity-100"}`}
                aria-label={`切换到《${movie.title}》`}
                aria-pressed={index === currentIndex}
              >
                <img src={getOptimizedImageUrl(movie.poster)} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                <span className="absolute bottom-2 left-2 text-3xl font-black text-white/90">0{index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute left-4 top-24 hidden text-[120px] font-black leading-none text-white/[0.035] xl:block">
        0{currentIndex + 1}
      </div>
    </section>
  );
};
