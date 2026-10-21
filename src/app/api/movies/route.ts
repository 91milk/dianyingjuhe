import { NextRequest, NextResponse } from "next/server";
import { movieService } from "@/modules/movie/services/movieService";
import { MovieCategory } from "@/modules/movie/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const category = (searchParams.get("category") as MovieCategory) || undefined;
  const genre = searchParams.get("genre") || undefined;
  const region = searchParams.get("region") || undefined;
  const year = searchParams.get("year") || undefined;
  const sort = (searchParams.get("sort") as "hot" | "latest" | "rating") || "hot";

  if (q) {
    const results = await movieService.searchMovies(q);
    return NextResponse.json({ success: true, data: results });
  }

  const results = await movieService.filterMovies({
    category,
    genre,
    region,
    year,
    sort,
  });

  return NextResponse.json({ success: true, data: results });
}
