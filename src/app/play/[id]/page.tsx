import { Suspense } from "react";
import type { Metadata } from "next";
import { movieService } from "@/modules/movie/services/movieService";
import { notFound } from "next/navigation";
import { WatchClient } from "./WatchClient";
import { ShortPlayClient } from "./ShortPlayClient";
import { WatchPageSkeleton } from "@/components/SkeletonLoaders";
import { decodePlayId } from "@/lib/playCipher";
import { siteConfig } from "@/config/site";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ source?: string; ep?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const realMovieId = decodePlayId(id);
  const movie = await movieService.getMovieById(realMovieId);

  if (!movie) {
    return {
      title: "影片不存在或已下架",
      description: "抱歉，您访问的影片资源不存在或已从资源库中移除。",
    };
  }

  const categoryNameMap: Record<string, string> = {
    movie: "电影",
    tv: "电视剧",
    shortplay: "热播短剧",
    anime: "动漫新番",
    variety: "综艺节目",
  };

  const catName = categoryNameMap[movie.category] || "影视大片";
  const genreStr = movie.genres.join("/");
  const actorStr = (movie.actors || []).slice(0, 4).join("、");
  const yearStr = movie.year ? `(${movie.year})` : "";

  const title = `《${movie.title}》${yearStr} 高清全集在线免费观看 - ${catName}`;
  const descPrefix = movie.director
    ? `《${movie.title}》是由${movie.director}执导`
    : `《${movie.title}》`;
  const descActors = actorStr ? `，由${actorStr}等主演` : "";
  const descGenres = genreStr ? `的${genreStr}作品` : "";
  const rawDesc = movie.summary || "全网多线路高清画质秒级起播，智能选集，无广告纯净播放体验。";
  const description = `${descPrefix}${descActors}${descGenres}。剧情简介：${rawDesc.slice(0, 150)}...`;

  const keywords = Array.from(
    new Set([
      movie.title,
      `${movie.title}在线播放`,
      `${movie.title}高清完整版`,
      `${movie.title}全集`,
      `${movie.title}免费看`,
      movie.director,
      ...(movie.actors || []),
      ...movie.genres,
      catName,
      ...siteConfig.keywords,
    ])
  ).filter(Boolean) as string[];

  const posterUrl = movie.poster.startsWith("http")
    ? movie.poster
    : `${siteConfig.url}${movie.poster}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/movie/${id}`,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      type: "video.movie",
      title: `《${movie.title}》高清在线播放 - ${siteConfig.shortName}`,
      description,
      url: `${siteConfig.url}/movie/${id}`,
      images: [
        {
          url: posterUrl,
          alt: movie.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `《${movie.title}》高清在线播放`,
      description,
      images: [posterUrl],
    },
  };
}

async function PlayContent({
  paramsPromise,
  searchParamsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
  searchParamsPromise: Promise<{ source?: string; ep?: string }>;
}) {
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;

  // 将加密地址解码为真实的影片 ID (兼容未加密旧 ID)
  const realMovieId = decodePlayId(params.id);

  const movie = await movieService.getMovieById(realMovieId);
  if (!movie) {
    notFound();
  }

  const similarMovies = await movieService.getSimilarMovies(movie.id, 6);

  // 针对短剧品类：自动呈现专享定制的左右分屏布局 (左侧视窗，右侧信息选集与弹幕)
  const isShortPlay =
    movie.category === "shortplay" ||
    movie.genres.some((g) => g.includes("短剧") || g.includes("爽剧") || g.includes("战神") || g.includes("逆袭"));

  // 生成电影详情与视频结构化数据 (Schema.org JSON-LD)
  const movieJsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    image: movie.poster,
    description: movie.summary || `《${movie.title}》高清全集在线观看`,
    dateCreated: movie.year ? String(movie.year) : undefined,
    genre: movie.genres,
    director: movie.director ? { "@type": "Person", name: movie.director } : undefined,
    actor: (movie.actors || []).map((actorName) => ({
      "@type": "Person",
      name: actorName,
    })),
    aggregateRating: movie.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: movie.rating,
          bestRating: "10",
          worstRating: "1",
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd) }}
      />
      {isShortPlay ? (
        <ShortPlayClient
          movie={movie}
          similarMovies={similarMovies}
          initialSourceId={searchParams.source}
          initialEpisodeId={searchParams.ep}
        />
      ) : (
        <WatchClient
          movie={movie}
          similarMovies={similarMovies}
          initialSourceId={searchParams.source}
          initialEpisodeId={searchParams.ep}
        />
      )}
    </>
  );
}

export default function PlayPage({ params, searchParams }: PageProps) {
  return (
    <Suspense fallback={<WatchPageSkeleton />}>
      <PlayContent paramsPromise={params} searchParamsPromise={searchParams} />
    </Suspense>
  );
}
