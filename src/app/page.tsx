import { Suspense } from "react";
import Link from "next/link";
import { movieService } from "@/modules/movie/services/movieService";
import { moodRecommendationService } from "@/modules/movie/services/moodRecommendationService";
import { HeroPanorama } from "@/modules/movie/components/HeroPanorama";
import { DoubanTopRail } from "@/modules/movie/components/DoubanTopRail";
import { MoodRecommendationSection } from "@/modules/movie/components/MoodRecommendationSection";
import { AiFindBar } from "@/modules/movie/components/AiFindBar";
import { MovieCard } from "@/modules/movie/components/MovieCard";
import {
  Film,
  Tv,
  Zap,
  ChevronRight,
  Clapperboard,
  Clock,
} from "lucide-react";

// 强制动态渲染与实时刷新，杜绝服务端与客户端路由脏缓存
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function HomeContent() {
  // 并发聚合全站真实数据：轮播大片、情绪场景候选池、豆瓣热映、实时同步流、电影、剧集、短剧、动漫番剧
  const [
    featured,
    moodCollections,
    topMovies,
    liveUpdates,
    hotMovies,
    hotTvs,
    shortPlays,
    animes,
  ] = await Promise.all([
    movieService.getFeaturedMovies(),
    moodRecommendationService.getInitialMoodCollections(),
    movieService.getDoubanTopMovies(10),
    movieService.getLiveLatestMovies(8),
    movieService.getHotMovies(8),
    movieService.getHotTvs(8),
    movieService.getHotShortPlays(6),
    movieService.getHotAnimes(8),
  ]);

  return (
    <div className="space-y-7 sm:space-y-12">
      {/* 1. 突破框架的沉浸式无界 Hero 巨幕舞台 (动态直连采集源最新焦点大片) */}
      <HeroPanorama featuredMovies={featured} />

      {/* 2. 方案 A：场景与情绪灵感选片舱 (按心情秒切 + 换一批) */}
      <MoodRecommendationSection moodCollections={moodCollections} />

      {/* 3. 今日全网实时同步更新流 (直接连接采集站今日入库，秒级呈现最新片源) */}
      {liveUpdates.length > 0 && (
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 sm:pb-3">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-black shadow-lg shadow-emerald-500/20">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
                  今日全网实时同步流
                  <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    今日实时更新
                  </span>
                </h2>
                <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                  每日精选全网最新剧集与大片 · 极速实时更新
                </p>
              </div>
            </div>

            <Link
              href="/category"
              className="text-xs font-semibold text-zinc-400 hover:text-emerald-400 flex items-center gap-0.5 sm:gap-1 transition group"
            >
              更新库{" "}
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {liveUpdates.slice(0, 8).map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        </section>
      )}

      {/* 4. 最新院线大片热搜口碑榜 (超大镂空排位艺术字) */}
      {topMovies.length > 0 && <DoubanTopRail movies={topMovies} />}

      {/* 5. 热门连载电视剧集 (直连资源站电视剧专区) */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 sm:pb-3">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-amber-400 to-[#ffcf32] text-black shadow-lg shadow-amber-500/20">
              <Tv className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
                热门连载电视剧集
                <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-400/20 text-[#ffcf32] border border-amber-400/30">
                  同步追更
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
            <MovieCard key={tv.id} movie={tv} rank={idx < 3 ? idx + 1 : undefined} />
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
            <MovieCard key={sp.id} movie={sp} className="bg-zinc-950/80" />
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
            <MovieCard key={movie.id} movie={movie} />
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
            <MovieCard key={anime.id} movie={anime} />
          ))}
        </div>
      </section>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Hero 骨架屏 */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 min-h-[460px] md:min-h-[580px] rounded-2xl bg-zinc-900/60 relative overflow-hidden flex flex-col justify-end p-8 sm:p-12">
        <div className="w-48 h-6 bg-zinc-800 rounded-full mb-4" />
        <div className="w-80 h-10 bg-zinc-800 rounded-xl mb-3" />
        <div className="w-64 h-4 bg-zinc-800/80 rounded-lg mb-6" />
        <div className="flex gap-4">
          <div className="w-32 h-11 bg-zinc-800 rounded-xl" />
          <div className="w-28 h-11 bg-zinc-800/60 rounded-xl" />
        </div>
      </div>

      {/* AI 找片栏骨架屏 */}
      <div className="h-16 rounded-2xl bg-zinc-900/50 border border-zinc-800/50" />

      {/* 实时更新网格骨架屏 */}
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
