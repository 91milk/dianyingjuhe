export type MovieCategory = "movie" | "tv" | "shortplay" | "anime" | "variety";

export interface Episode {
  id: string;
  name: string;
  url: string; // m3u8 or mp4 url
}

export interface PlaySource {
  id: string;
  name: string; // e.g. "蓝光专线", "秒播4K", "官方极速"
  episodes: Episode[];
}

export interface MovieItem {
  id: string;
  title: string;
  originalTitle?: string;
  poster: string;
  banner?: string;
  rating: number; // e.g. 9.3
  year: number;
  region: string; // e.g. "中国大陆", "欧美", "韩国", "日本"
  genres: string[]; // e.g. ["科幻", "悬疑", "剧情"]
  director?: string;
  actors?: string[];
  summary: string;
  category: MovieCategory;
  episodesCount?: number;
  updateStatus?: string; // e.g. "全24集", "更新至第8集", "高清全片"
  isHot?: boolean;
  isFeatured?: boolean;
  aiHighlights?: string[]; // AI看点提炼
  sources: PlaySource[];
}

export interface FilterOptions {
  category?: MovieCategory;
  genre?: string;
  region?: string;
  year?: string;
  sort?: "hot" | "latest" | "rating";
}
