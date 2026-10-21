import { Suspense } from "react";
import { movieService } from "@/modules/movie/services/movieService";
import { MovieCategory } from "@/modules/movie/types";
import { CategoryClient } from "./CategoryClient";


interface PageProps {
  searchParams: Promise<{ type?: string; q?: string }>;
}

async function CategoryContent({ searchParamsPromise }: { searchParamsPromise: Promise<{ type?: string; q?: string }> }) {
  const searchParams = await searchParamsPromise;
  const initialCategory = searchParams.type as MovieCategory | undefined;
  const initialQuery = searchParams.q;

  let initialMovies;
  if (initialQuery) {
    initialMovies = await movieService.searchMovies(initialQuery);
  } else if (initialCategory) {
    initialMovies = await movieService.getByCategory(initialCategory, 24);
  } else {
    initialMovies = await movieService.filterMovies({});
  }

  return (
    <CategoryClient
      initialMovies={initialMovies}
      initialCategory={initialCategory}
      initialQuery={initialQuery}
    />
  );
}

export default function CategoryPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<div className="text-zinc-500 py-10 text-center text-xs">加载影视列表中...</div>}>
      <CategoryContent searchParamsPromise={searchParams} />
    </Suspense>
  );
}
