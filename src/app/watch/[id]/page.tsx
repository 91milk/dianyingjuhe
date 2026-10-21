import { Suspense } from "react";
import { movieService } from "@/modules/movie/services/movieService";
import { notFound } from "next/navigation";
import { WatchClient } from "./WatchClient";


interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ source?: string; ep?: string }>;
}

async function WatchContent({
  paramsPromise,
  searchParamsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
  searchParamsPromise: Promise<{ source?: string; ep?: string }>;
}) {
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;

  const movie = await movieService.getMovieById(params.id);
  if (!movie) {
    notFound();
  }

  const similarMovies = await movieService.getSimilarMovies(movie.id, 4);

  return (
    <WatchClient
      movie={movie}
      similarMovies={similarMovies}
      initialSourceId={searchParams.source}
      initialEpisodeId={searchParams.ep}
    />
  );
}

export default function WatchPage({ params, searchParams }: PageProps) {
  return (
    <Suspense fallback={<div className="text-zinc-500 py-10 text-center text-xs">加载播放器中...</div>}>
      <WatchContent paramsPromise={params} searchParamsPromise={searchParams} />
    </Suspense>
  );
}
