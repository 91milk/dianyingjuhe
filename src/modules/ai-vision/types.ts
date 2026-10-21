import { MovieItem } from "@/modules/movie/types";

export interface VisionSearchResult {
  movie: MovieItem;
  similarity: number; // 0~100
  matchedSceneDescription?: string; // 识别到的名场面描述
}
