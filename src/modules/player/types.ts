export interface PlayerConfig {
  url: string;
  poster?: string;
  title?: string;
  autoplay?: boolean;
  autoResume?: boolean; // 自动记忆续播
}

export interface PlayProgress {
  movieId: string;
  sourceId: string;
  episodeId: string;
  currentTime: number;
  duration: number;
  updatedAt: number;
}
