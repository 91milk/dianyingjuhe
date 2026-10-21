import { NextRequest, NextResponse } from "next/server";
import { movieService } from "@/modules/movie/services/movieService";
import { MovieCategory } from "@/modules/movie/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category") as MovieCategory | null;

  if (q) {
    const results = await movieService.searchMovies(q);
    return NextResponse.json({ success: true, data: results });
  }

  if (category) {
    const results = await movieService.getByCategory(category, 50);
    return NextResponse.json({ success: true, data: results });
  }

  const all = await movieService.filterMovies({});
  return NextResponse.json({ success: true, data: all });
}
