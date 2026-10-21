import { MovieItem, FilterOptions, MovieCategory } from "../types";
import { mockMovies } from "./mockData";
import { resourceSiteService } from "@/modules/collector/services/resourceSiteService";

export class MovieService {
  private localMovies: MovieItem[] = mockMovies;

  /**
   * 获取精选轮播/焦点影片
   */
  async getFeaturedMovies(): Promise<MovieItem[]> {
    return this.localMovies.filter((m) => m.isFeatured);
  }

  /**
   * 获取热门爆款推荐
   */
  async getHotMovies(limit = 8): Promise<MovieItem[]> {
    return this.localMovies.filter((m) => m.isHot).slice(0, limit);
  }

  /**
   * 按分类获取影片列表（结合本地精选与资源站最新采集流）
   */
  async getByCategory(category: MovieCategory, limit = 12): Promise<MovieItem[]> {
    const local = this.localMovies.filter((m) => m.category === category);
    try {
      const cmsItems = await resourceSiteService.getLatestFromSites(category, 1, limit);
      // 合并去重
      const map = new Map<string, MovieItem>();
      local.forEach((m) => map.set(m.title, m));
      cmsItems.forEach((m) => {
        if (!map.has(m.title)) map.set(m.title, m);
      });
      return Array.from(map.values()).slice(0, limit);
    } catch {
      return local.slice(0, limit);
    }
  }

  /**
   * 根据 ID 查询影片详情（支持 cms_siteId_vodId 格式实时穿透采集源）
   */
  async getMovieById(id: string): Promise<MovieItem | null> {
    if (id.startsWith("cms_")) {
      const parts = id.split("_");
      if (parts.length >= 3) {
        const siteId = parts[1];
        const vodId = parts.slice(2).join("_");
        const cmsMovie = await resourceSiteService.getDetailFromSite(siteId, vodId);
        if (cmsMovie) return cmsMovie;
      }
    }
    const movie = this.localMovies.find((m) => m.id === id);
    return movie || null;
  }

  /**
   * 综合多条件筛选
   */
  async filterMovies(options: FilterOptions): Promise<MovieItem[]> {
    return this.localMovies.filter((item) => {
      if (options.category && item.category !== options.category) {
        return false;
      }
      if (options.genre && options.genre !== "全部" && !item.genres.includes(options.genre)) {
        return false;
      }
      if (options.region && options.region !== "全部" && item.region !== options.region) {
        return false;
      }
      if (options.year && options.year !== "全部" && item.year.toString() !== options.year) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (options.sort === "rating") return b.rating - a.rating;
      if (options.sort === "latest") return b.year - a.year;
      return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
    });
  }

  /**
   * 关键字全网与多源聚合搜索
   */
  async searchMovies(query: string): Promise<MovieItem[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // 1. 本地匹配
    const localResults = this.localMovies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
        (m.director && m.director.toLowerCase().includes(q)) ||
        (m.actors && m.actors.some((a) => a.toLowerCase().includes(q))) ||
        m.genres.some((g) => g.toLowerCase().includes(q)) ||
        m.summary.toLowerCase().includes(q)
    );

    // 2. 实时跨资源站聚合搜索 (已接入茅台等所有启用资源站)
    try {
      const cmsResults = await resourceSiteService.searchAcrossSites(query);

      // 去重合并
      const map = new Map<string, MovieItem>();
      localResults.forEach((m) => map.set(m.title, m));
      cmsResults.forEach((m) => {
        if (!map.has(m.title)) {
          map.set(m.title, m);
        } else {
          // 若已有，合并其播放线路
          const existing = map.get(m.title)!;
          existing.sources.push(...m.sources);
        }
      });

      return Array.from(map.values());
    } catch (e) {
      console.error("Multi-site search error:", e);
      return localResults;
    }
  }

  /**
   * 获取相似电影推荐
   */
  async getSimilarMovies(id: string, limit = 4): Promise<MovieItem[]> {
    const target = await this.getMovieById(id);
    if (!target) return [];
    return this.localMovies
      .filter((m) => m.id !== id && (m.category === target.category || m.genres.some((g) => target.genres.includes(g))))
      .slice(0, limit);
  }
}

export const movieService = new MovieService();
