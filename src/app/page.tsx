import { Suspense } from "react";
import { cookies } from "next/headers";
import { movieService } from "@/modules/movie/services/movieService";
import { moodRecommendationService } from "@/modules/movie/services/moodRecommendationService";
import { HomeContainer } from "@/modules/movie/components/HomeContainer";
import { LOCALE_COOKIE_NAME, SupportedLocale, DEFAULT_LOCALE } from "@/i18n/config";

// 强制动态渲染与实时刷新，杜绝服务端与客户端路由脏缓存
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function HomeContent() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get(LOCALE_COOKIE_NAME)?.value as SupportedLocale) || DEFAULT_LOCALE;

  const [
    featured,
    moodCollections,
    topMovies,
    globalTopMovies,
    liveUpdates,
    hotMovies,
    hotTvs,
    shortPlays,
    animes,
  ] = await Promise.all([
    movieService.getFeaturedMovies(locale),
    moodRecommendationService.getInitialMoodCollections(locale),
    movieService.getDoubanTopMovies(10),
    movieService.getGlobalTopMovies(10),
    movieService.getLiveLatestMovies(8),
    movieService.getHotMovies(8),
    movieService.getHotTvs(8),
    movieService.getHotShortPlays(8),
    movieService.getHotAnimes(8),
  ]);

  return (
    <HomeContainer
      featured={featured}
      moodCollections={moodCollections}
      topMovies={topMovies}
      globalTopMovies={globalTopMovies}
      liveUpdates={liveUpdates}
      hotMovies={hotMovies}
      hotTvs={hotTvs}
      shortPlays={shortPlays}
      animes={animes}
    />
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 min-h-[460px] md:min-h-[580px] rounded-2xl bg-zinc-900/60 relative overflow-hidden flex flex-col justify-end p-8 sm:p-12">
        <div className="w-48 h-6 bg-zinc-800 rounded-full mb-4" />
        <div className="w-80 h-10 bg-zinc-800 rounded-xl mb-3" />
        <div className="w-64 h-4 bg-zinc-800/80 rounded-lg mb-6" />
        <div className="flex gap-4">
          <div className="w-32 h-11 bg-zinc-800 rounded-xl" />
          <div className="w-28 h-11 bg-zinc-800/60 rounded-xl" />
        </div>
      </div>
      <div className="h-16 rounded-2xl bg-zinc-900/50 border border-zinc-800/50" />
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-800" />
          <div className="w-40 h-6 bg-zinc-800 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-zinc-900/60 border border-zinc-800/40" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
