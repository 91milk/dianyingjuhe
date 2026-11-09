"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Dices, Play, Sparkles } from "lucide-react";
import { MovieItem } from "../types";
import { MoodType, MOOD_DEFINITIONS } from "../types/mood";
import { MovieCardModern } from "./MovieCardModern";
import { SectionHeading } from "./SectionHeading";
import { getOptimizedImageUrl } from "../utils/imageHelper";
import { encodePlayId } from "@/lib/playCipher";
import { useLocale } from "@/i18n/LocaleContext";
import { getLocalizedMovie } from "../utils/localizeMovie";

interface MoodRecommendationSectionProps {
  moodCollections: Record<MoodType, MovieItem[]>;
}

export const MoodRecommendationModern: React.FC<MoodRecommendationSectionProps> = ({ moodCollections }) => {
  const { t, locale } = useLocale();
  const [activeMood, setActiveMood] = useState<MoodType>("weekend");
  const [refreshStep, setRefreshStep] = useState(0);
  const activeMeta = MOOD_DEFINITIONS.find((mood) => mood.id === activeMood) || MOOD_DEFINITIONS[0];
  const candidates = moodCollections[activeMood] || [];
  const start = candidates.length > 0 ? (refreshStep * 5) % candidates.length : 0;
  const rawDisplayed = [...candidates.slice(start), ...candidates.slice(0, start)].slice(0, 5);
  const displayed = rawDisplayed.map((m) => getLocalizedMovie(m, locale));
  const feature = displayed[0];

  return (
    <section className="space-y-6">
      <SectionHeading
        index="02"
        eyebrow="For Your Mood"
        title={t.home.moodTitle}
        description={t.home.moodDesc}
        href={`/category?q=${encodeURIComponent(activeMeta.title)}`}
        linkLabel={t.common.viewAll}
      />

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {MOOD_DEFINITIONS.map((mood) => {
          const active = mood.id === activeMood;
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => {
                setActiveMood(mood.id);
                setRefreshStep(0);
              }}
              className={`shrink-0 border px-4 py-2 text-xs font-bold transition ${active ? "border-[#ef4b43] bg-[#ef4b43] text-white" : "border-white/12 bg-transparent text-[#aaa9a5] hover:border-white/35 hover:text-white"}`}
            >
              {mood.icon} {mood.title}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setRefreshStep((step) => step + 1)}
          className="ml-auto flex shrink-0 items-center gap-2 border border-white/12 px-4 py-2 text-xs font-bold text-[#aaa9a5] transition hover:border-white/35 hover:text-white"
        >
          <Dices className="h-3.5 w-3.5 text-[#ef4b43]" />
          换一批
        </button>
      </div>

      {feature && (
        <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <article className="relative min-h-[360px] overflow-hidden border border-white/10 lg:min-h-[500px]">
            <img
              src={getOptimizedImageUrl(feature.banner || feature.poster)}
              alt={feature.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ef4b43]">
                <Sparkles className="h-3.5 w-3.5" />
                AI Pick
              </p>
              <h3 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">{feature.title}</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">{activeMeta.aiQuote}</p>
              <Link
                href={`/play/${encodePlayId(feature.id)}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[#ef4b43] px-5 text-xs font-black text-white hover:bg-[#ff5a52]"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                立即播放
              </Link>
            </div>
          </article>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {displayed.slice(1, 5).map((movie) => (
              <MovieCardModern key={`${activeMood}-${movie.id}`} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
