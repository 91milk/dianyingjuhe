import Link from "next/link";
import { movieService } from "@/modules/movie/services/movieService";
import { MovieGrid } from "@/modules/movie/components/MovieGrid";
import { Play, Sparkles, Flame, ChevronRight, Tv } from "lucide-react";

export default async function HomePage() {
  const featured = await movieService.getFeaturedMovies();
  const heroMovie = featured[0] || (await movieService.getMovieById("m-101"));

  const hotMovies = await movieService.getByCategory("movie", 6);
  const hotTvs = await movieService.getByCategory("tv", 6);
  const shortPlays = await movieService.getByCategory("shortplay", 6);
  const animes = await movieService.getByCategory("anime", 6);

  return (
    <div className="space-y-10">
      {/* 焦点 Hero Banner (仿懂片帝沉浸式头部推荐) */}
      {heroMovie && (
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-21/9 min-h-[360px] flex items-end p-6 md:p-10 shadow-2xl">
          {/* 背景大图 */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
            style={{ backgroundImage: `url(${heroMovie.banner || heroMovie.poster})` }}
          />
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0f] via-transparent to-transparent" />

          {/* 焦点内容 */}
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#ffcf32] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-black" /> 今日重磅推荐
              </span>
              <span className="text-zinc-300 text-xs font-semibold">
                ★ 豆瓣 {heroMovie.rating.toFixed(1)} 分
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {heroMovie.title}
            </h1>

            <p className="text-xs md:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
              {heroMovie.summary}
            </p>

            {/* AI 看点提炼小贴条 */}
            {heroMovie.aiHighlights && heroMovie.aiHighlights[0] && (
              <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-black/50 backdrop-blur-xs border border-amber-500/30 px-3 py-1.5 rounded-xl w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#ffcf32]" />
                <span className="font-medium">AI 懂片看点：{heroMovie.aiHighlights[0]}</span>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <Link
                href={`/watch/${heroMovie.id}`}
                className="flex items-center gap-2 bg-[#ffcf32] hover:bg-[#ffe066] text-black font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer text-sm"
              >
                <Play className="w-4 h-4 fill-black" />
                立即播放
              </Link>
              <Link
                href={`/watch/${heroMovie.id}`}
                className="px-5 py-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold transition border border-zinc-700 cursor-pointer"
              >
                查看详情
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 热门电影 */}
      <MovieGrid
        movies={hotMovies}
        title="热门高口碑电影"
        subtitle="精选全网高分院线大片与经典佳作"
        action={
          <Link
            href="/category?type=movie"
            className="text-xs text-zinc-400 hover:text-[#ffcf32] flex items-center gap-0.5 transition"
          >
            查看更多 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      {/* 爆款微短剧专区 (高流量模块) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/20 via-zinc-900 to-zinc-900 border border-amber-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#ffcf32] text-black font-bold">
              <Tv className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                爆款微短剧专区
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-amber-400/20 text-[#ffcf32] border border-amber-400/30">
                  全网热搜
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">逆袭打脸 · 战神归来 · 甜宠总裁 · 节奏爽快</p>
            </div>
          </div>

          <Link
            href="/category?type=shortplay"
            className="text-xs text-[#ffcf32] hover:underline flex items-center gap-0.5"
          >
            短剧榜单 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {shortPlays.map((item) => (
            <div key={item.id} className="relative">
              <MovieGrid movies={[item]} />
            </div>
          ))}
        </div>
      </div>

      {/* 热播电视剧 */}
      <MovieGrid
        movies={hotTvs}
        title="热播电视剧集"
        subtitle="现象级口碑好剧与同步追更"
        action={
          <Link
            href="/category?type=tv"
            className="text-xs text-zinc-400 hover:text-[#ffcf32] flex items-center gap-0.5 transition"
          >
            查看更多 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      {/* 热门动漫 */}
      <MovieGrid
        movies={animes}
        title="热门动漫番剧"
        subtitle="新番速递与高燃热血神作"
        action={
          <Link
            href="/category?type=anime"
            className="text-xs text-zinc-400 hover:text-[#ffcf32] flex items-center gap-0.5 transition"
          >
            查看更多 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        }
      />
    </div>
  );
}
