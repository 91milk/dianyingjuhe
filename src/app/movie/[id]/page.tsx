import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Star } from "lucide-react";
import { siteConfig } from "@/config/site";
import { decodePlayId } from "@/lib/playCipher";
import { MovieCard } from "@/modules/movie/components/MovieCard";
import { SectionHeading } from "@/modules/movie/components/SectionHeading";
import { movieService } from "@/modules/movie/services/movieService";
import { getOptimizedImageUrl } from "@/modules/movie/utils/imageHelper";

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await movieService.getMovieById(decodePlayId(id));

  if (!movie) {
    return { title: "影片不存在", robots: { index: false, follow: true } };
  }

  const description = movie.summary.slice(0, 160);
  return {
    title: `《${movie.title}》影片介绍、演员与剧情简介`,
    description,
    alternates: { canonical: `/movie/${id}` },
    openGraph: {
      type: "video.movie",
      title: `《${movie.title}》影片介绍 - ${siteConfig.shortName}`,
      description,
      images: [{ url: movie.poster, alt: movie.title }],
    },
  };
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  const movie = await movieService.getMovieById(decodePlayId(id));
  if (!movie) notFound();

  const similarMovies = await movieService.getSimilarMovies(movie.id, 4);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    image: movie.poster,
    description: movie.summary,
    dateCreated: movie.year ? String(movie.year) : undefined,
    genre: movie.genres,
    director: movie.director ? { "@type": "Person", name: movie.director } : undefined,
    actor: (movie.actors || []).map((name) => ({ "@type": "Person", name })),
  };

  return (
    <div className="space-y-16 pb-8 sm:space-y-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative -mx-4 -mt-5 overflow-hidden border-b border-white/10 sm:-mx-6 sm:-mt-8 lg:-mx-10">
        <img
          src={getOptimizedImageUrl(movie.banner || movie.poster)}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080a0b_0%,rgba(8,10,11,.82)_55%,rgba(8,10,11,.72)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0b] via-transparent to-black/35" />

        <div className="relative z-10 mx-auto grid min-h-[620px] max-w-[1440px] items-end gap-8 px-4 pb-12 pt-28 sm:px-8 md:grid-cols-[260px_1fr] lg:px-12">
          <img
            src={getOptimizedImageUrl(movie.poster)}
            alt={`《${movie.title}》海报`}
            referrerPolicy="no-referrer"
            className="hidden aspect-[2/3] w-full border border-white/15 object-cover shadow-2xl md:block"
          />

          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ef4b43]">Movie Profile</p>
            <h1 className="mt-3 text-balance text-5xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl">
              {movie.title}
            </h1>
            {movie.originalTitle && (
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">{movie.originalTitle}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-white/70">
              <span className="flex items-center gap-1 font-black text-white">
                <Star className="h-3.5 w-3.5 fill-[#ef4b43] text-[#ef4b43]" />
                {movie.rating.toFixed(1)}
              </span>
              <span>{movie.year}</span>
              <span>{movie.region}</span>
              <span>{movie.genres.join(" / ")}</span>
              {movie.updateStatus && <span>{movie.updateStatus}</span>}
            </div>
            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">{movie.summary}</p>
            <Link
              href={`/play/${id}`}
              className="mt-8 inline-flex min-h-12 items-center gap-2 bg-[#ef4b43] px-7 text-sm font-black text-white transition hover:bg-[#ff5a52]"
            >
              <Play className="h-4 w-4 fill-current" />
              立即播放
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-8 border-t border-white/12 pt-6 lg:grid-cols-[180px_1fr]">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ef4b43]">About</p>
          <h2 className="mt-2 text-2xl font-black text-white">影片简介</h2>
        </div>
        <div className="grid gap-8 text-sm leading-7 text-[#bbb9b4] sm:grid-cols-[1fr_240px]">
          <p>{movie.summary}</p>
          <dl className="space-y-4 border-l border-white/10 pl-5 text-xs">
            {movie.director && (
              <div><dt className="text-[#777875]">导演</dt><dd className="mt-1 text-[#f2efe9]">{movie.director}</dd></div>
            )}
            {movie.actors && movie.actors.length > 0 && (
              <div><dt className="text-[#777875]">主演</dt><dd className="mt-1 text-[#f2efe9]">{movie.actors.slice(0, 8).join("、")}</dd></div>
            )}
            <div><dt className="text-[#777875]">类型</dt><dd className="mt-1 text-[#f2efe9]">{movie.genres.join("、")}</dd></div>
          </dl>
        </div>
      </section>

      {similarMovies.length > 0 && (
        <section className="space-y-6">
          <SectionHeading
            index="02"
            eyebrow="More Like This"
            title="相似影片"
            description="从同类型与相近气质中，继续发现下一部值得看的作品。"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {similarMovies.map((item) => <MovieCard key={item.id} movie={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}
