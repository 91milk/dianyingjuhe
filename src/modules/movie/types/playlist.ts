import { MovieItem } from "../types";

export interface ThematicPlaylist {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  titleJa?: string;
  subtitle: string;
  subtitleEn?: string;
  subtitleJa?: string;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
  coverImage: string;
  badge: string;
  badgeEn?: string;
  badgeJa?: string;
  themeColor: string; // e.g. "from-amber-600/40 via-purple-900/30 to-black"
  accentColor: string; // e.g. "#ffcf32" or "#ef4b43"
  tags: string[];
  itemCount: number;
  movieKeywords: string[]; // keywords used to query/gather movies
  featuredMovieIds?: string[];
  movies?: MovieItem[];
  views?: number;
  likes?: number;
}
