import { MovieItem } from "../types";
import { MoodType, MoodMeta, MOOD_DEFINITIONS } from "../types/mood";
import { doubanMovies } from "./doubanData";
import { globalImdbMovies } from "./globalMovieData";
import { trendingMovies } from "./trendingService";
import { mockMovies } from "./mockData";
import { resourceSiteService } from "@/modules/collector/services/resourceSiteService";
import { isCleanMovieItem } from "./doubanService";

export { MOOD_DEFINITIONS };
export type { MoodType, MoodMeta };

class MoodRecommendationService {
  private fallbackPoolZh: MovieItem[] = [...doubanMovies, ...trendingMovies, ...mockMovies];
  private fallbackPoolGlobal: MovieItem[] = [...globalImdbMovies, ...mockMovies, ...doubanMovies];

  /**
   * 获取指定场景/情绪下的全部推荐候选片单
   */
  async getMoodCandidatePool(mood: MoodType, locale: string = "zh-CN"): Promise<MovieItem[]> {
    const isGlobal = locale !== "zh-CN";
    const basePool = isGlobal ? this.fallbackPoolGlobal : this.fallbackPoolZh;

    let livePool: MovieItem[] = [];
    try {
      livePool = await resourceSiteService.getLivePool();
    } catch {
      livePool = [];
    }

    // 优先呈现权威精选（中文用豆瓣高分，外文用IMDb全球大作）
    const cleanLive = livePool.filter(isCleanMovieItem);
    const allMovies = [...basePool.filter(isCleanMovieItem), ...cleanLive];
    const seen = new Set<string>();
    const deduplicated: MovieItem[] = [];

    for (const m of allMovies) {
      if (!m || !m.title) continue;
      const key = m.title.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(m);
      }
    }

    let filtered: MovieItem[] = [];

    switch (mood) {
      case "weekend":
        // 高评分科幻/奇幻/动作大片
        filtered = deduplicated.filter(
          (m) =>
            m.category === "movie" &&
            (m.genres.some((g) => ["科幻", "冒险", "奇幻", "动作"].includes(g)) ||
              m.rating >= 7.8)
        );
        break;

      case "dinner":
        // 轻松、喜剧、剧情、情景剧
        filtered = deduplicated.filter(
          (m) =>
            m.genres.some((g) => ["喜剧", "爱情", "剧情", "动画"].includes(g)) ||
            m.summary.includes("喜剧") ||
            m.summary.includes("搞笑") ||
            m.summary.includes("轻松")
        );
        break;

      case "mindbend":
        // 悬疑、犯罪、惊悚、推理、反转
        filtered = deduplicated.filter(
          (m) =>
            m.genres.some((g) => ["悬疑", "犯罪", "惊悚"].includes(g)) ||
            m.summary.includes("悬疑") ||
            m.summary.includes("反转") ||
            m.summary.includes("凶手") ||
            m.summary.includes("真相") ||
            m.summary.includes("破案")
        );
        break;

      case "adrenaline":
        // 爽剧、微短剧、逆袭、战神
        filtered = deduplicated.filter(
          (m) =>
            m.category === "shortplay" ||
            m.genres.some((g) => ["战神", "逆袭", "爽剧", "动作"].includes(g)) ||
            m.title.includes("战神") ||
            m.title.includes("归来") ||
            m.title.includes("逆袭") ||
            m.summary.includes("打脸") ||
            m.summary.includes("复仇") ||
            m.summary.includes("逆袭")
        );
        break;

      case "healing":
        // 温情、家庭、成长、治愈
        filtered = deduplicated.filter(
          (m) =>
            m.genres.some((g) => ["剧情", "爱情", "家庭", "治愈"].includes(g)) ||
            m.summary.includes("温情") ||
            m.summary.includes("治愈") ||
            m.summary.includes("感动") ||
            m.summary.includes("成长") ||
            m.summary.includes("陪伴")
        );
        break;

      case "thriller":
        // 惊悚、灾难、丧尸、恐怖
        filtered = deduplicated.filter(
          (m) =>
            m.genres.some((g) => ["惊悚", "恐怖", "灾难"].includes(g)) ||
            m.summary.includes("恐怖") ||
            m.summary.includes("尖叫") ||
            m.summary.includes("灾难") ||
            m.summary.includes("怪物") ||
            m.summary.includes("末日")
        );
        break;
    }

    // 若某场景匹配数量较少，从备用池中智能补齐
    if (filtered.length < 8) {
      const extra = basePool.filter(
        (m) => !seen.has(m.title.trim().toLowerCase())
      );
      filtered = [...filtered, ...extra.slice(0, 8 - filtered.length)];
    }

    return filtered;
  }

  /**
   * 预取全部 6 大场景的片库字典，供首页客户端零延迟秒切
   */
  async getInitialMoodCollections(locale: string = "zh-CN"): Promise<Record<MoodType, MovieItem[]>> {
    const results: Partial<Record<MoodType, MovieItem[]>> = {};
    for (const mood of MOOD_DEFINITIONS) {
      results[mood.id] = await this.getMoodCandidatePool(mood.id, locale);
    }
    return results as Record<MoodType, MovieItem[]>;
  }
}

export const moodRecommendationService = new MoodRecommendationService();
