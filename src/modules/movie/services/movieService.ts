import { MovieItem, FilterOptions, MovieCategory } from "../types";
import { doubanMovies } from "./doubanData";
import { globalImdbMovies, globalFeaturedMovies } from "./globalMovieData";
import { trendingMovies } from "./trendingService";
import { mockMovies } from "./mockData";
import { resourceSiteService } from "@/modules/collector/services/resourceSiteService";
import { doubanService, isCleanMovieItem } from "./doubanService";

export class MovieService {
  // 本地兜底备用片库 (仅当资源站断网时使用)
  private fallbackMovies: MovieItem[] = [...doubanMovies, ...globalImdbMovies, ...trendingMovies, ...mockMovies];

  /**
   * 获取精选轮播/焦点大片
   * 中文区优先使用豆瓣口碑与院线大片，外文国际区自动使用全球殿堂级大作 (Oppenheimer, Dune 2, Interstellar...)
   */
  async getFeaturedMovies(locale: string = "zh-CN"): Promise<MovieItem[]> {
    if (locale !== "zh-CN") {
      return globalFeaturedMovies;
    }
    return doubanService.getFeaturedMovies();
  }

  /**
   * 获取豆瓣口碑排行榜 TOP 10 (殿堂级影史丰碑与高分神作)
   */
  async getDoubanTopMovies(limit = 10): Promise<MovieItem[]> {
    return doubanService.getDoubanTopMovies(limit);
  }

  /**
   * 获取国际/外文区专属权威推荐源 (基于 IMDb Top 250 / TMDB 传奇神作)
   */
  async getGlobalTopMovies(limit = 10): Promise<MovieItem[]> {
    return globalImdbMovies.slice(0, limit);
  }

  /**
   * 根据当前用户语言区域智能分流口碑榜：
   * 中文区优先使用豆瓣口碑榜，外文国际区 (en-US / ja-JP) 自动切换为全球 IMDb / TMDB 顶级神作榜
   */
  async getRankingMoviesByLocale(locale: string = "zh-CN", limit = 10): Promise<MovieItem[]> {
    if (locale === "zh-CN") {
      return this.getDoubanTopMovies(limit);
    }
    return this.getGlobalTopMovies(limit);
  }

  /**
   * 获取全网实时动态更新流（直接拉取资源站当天最新入库，100% 过滤体育赛事、会议杂项）
   */
  async getLiveLatestMovies(limit = 12): Promise<MovieItem[]> {
    try {
      const items = await resourceSiteService.getLatestFromSites(undefined, 1, limit * 4);
      const clean = items.filter(isCleanMovieItem);
      if (clean.length >= limit) return clean.slice(0, limit);
      if (clean.length > 0) {
        // 若实时流条数不足，用豆瓣精选补齐，绝不混入体育或会议噪音
        const seen = new Set(clean.map((c) => c.title.trim().toLowerCase()));
        const extra = this.fallbackMovies.filter(
          (m) => isCleanMovieItem(m) && !seen.has(m.title.trim().toLowerCase())
        );
        return [...clean, ...extra].slice(0, limit);
      }
    } catch {
      // ignore
    }
    return this.fallbackMovies.filter(isCleanMovieItem).slice(0, limit);
  }

  /**
   * 获取热门院线大片 (100% 引用豆瓣 2024-2025 院线热映口碑大片)
   */
  async getHotMovies(limit = 8): Promise<MovieItem[]> {
    return doubanService.getHotMovies(limit);
  }

  /**
   * 获取热门连载电视剧集 (100% 引用豆瓣高分热门剧集榜单)
   */
  async getHotTvs(limit = 8): Promise<MovieItem[]> {
    return doubanService.getHotTvs(limit);
  }

  /**
   * 获取顶流国漫与高燃新番 (100% 引用豆瓣高分动漫神作榜单)
   */
  async getHotAnimes(limit = 8): Promise<MovieItem[]> {
    return doubanService.getHotAnimes(limit);
  }

  /**
   * 获取爆款微短剧爽剧精选 (优先拉取全网实时短剧库，融合豆瓣口碑高分短剧)
   */
  async getHotShortPlays(limit = 24): Promise<MovieItem[]> {
    const doubanShorts = await doubanService.getHotShortPlays(limit);
    try {
      const liveShorts = await resourceSiteService.fetchLiveShortPlays(Math.max(limit * 2, 48));
      const cleanLive = liveShorts.filter(isCleanMovieItem);
      if (cleanLive.length > 0) {
        // 优先将具有真实播放线路的短剧排在前面，并去重合并
        const map = new Map<string, MovieItem>();
        cleanLive.forEach((m) => map.set(m.title.trim().toLowerCase(), m));
        doubanShorts.forEach((d) => {
          const key = d.title.trim().toLowerCase();
          if (!map.has(key)) {
            map.set(key, d);
          }
        });
        return Array.from(map.values()).slice(0, limit);
      }
    } catch {
      // ignore
    }
    return doubanShorts;
  }

  /**
   * 按分类获取最新真实影片 (优先结合豆瓣口碑与采集站干净影视)
   */
  async getByCategory(category: MovieCategory, limit = 24): Promise<MovieItem[]> {
    if (category === "shortplay") return this.getHotShortPlays(limit);
    if (category === "tv") return this.getHotTvs(limit);
    if (category === "movie") return this.getHotMovies(limit);
    if (category === "anime") return this.getHotAnimes(limit);

    try {
      const liveItems = await resourceSiteService.getLatestFromSites(category, 1, limit * 2);
      const clean = liveItems.filter(isCleanMovieItem);
      if (clean.length > 0) {
        return clean.slice(0, limit);
      }
    } catch {
      // ignore
    }
    return this.fallbackMovies.filter((m) => m.category === category && isCleanMovieItem(m)).slice(0, limit);
  }

  /**
   * 根据 ID 查询影片详情 (支持直连CMS ID、豆瓣专用ID及全网匹配)
   */
  async getMovieById(id: string): Promise<MovieItem | null> {
    // 1. 如果是直连采集站ID
    if (id.startsWith("cms_")) {
      const parts = id.split("_");
      if (parts.length >= 3) {
        const siteId = parts[1];
        const vodId = parts.slice(2).join("_");
        const cmsMovie = await resourceSiteService.getDetailFromSite(siteId, vodId);
        if (cmsMovie) return cmsMovie;
      }
    }

    // 2. 豆瓣专用库及缓存优先查询 (支持 db_xxx, douban_xxx, hot-2024-xxx)
    const doubanMovie = doubanService.getDoubanById(id);
    if (doubanMovie) return doubanMovie;

    // 3. 实时采集站缓存池匹配
    try {
      const livePool = await resourceSiteService.getLivePool();
      const match = livePool.find((m) => m.id === id);
      if (match) return match;
    } catch {
      // ignore
    }

    // 4. 兜底片库
    return this.fallbackMovies.find((m) => m.id === id) || null;
  }

  /**
   * 综合多条件筛选 (优先呈现豆瓣口碑精品，并结合实时纯净片库)
   */
  async filterMovies(options: FilterOptions): Promise<MovieItem[]> {
    let pool = this.fallbackMovies.filter(isCleanMovieItem);
    try {
      const live = await resourceSiteService.getLivePool();
      if (live.length > 0) {
        const cleanLive = live.filter(isCleanMovieItem);
        const seen = new Set(pool.map((m) => m.title.trim().toLowerCase()));
        const uniqueLive = cleanLive.filter((m) => !seen.has(m.title.trim().toLowerCase()));
        pool = [...pool, ...uniqueLive];
      }
    } catch {
      // ignore
    }

    // 若按短剧筛选，直接穿透加载最新全量短剧并合并（优先采用采集站真实有效播放线路）
    if (options.category === "shortplay") {
      try {
        const liveShorts = await resourceSiteService.fetchLiveShortPlays(60);
        if (liveShorts.length > 0) {
          const cleanShorts = liveShorts.filter(isCleanMovieItem);
          const titleMap = new Map<string, MovieItem>();
          pool.forEach((item) => titleMap.set(item.title.trim().toLowerCase(), item));
          cleanShorts.forEach((liveItem) => {
            const key = liveItem.title.trim().toLowerCase();
            if (titleMap.has(key)) {
              const exist = titleMap.get(key)!;
              if (!exist.sources || exist.sources.length === 0) {
                titleMap.set(key, liveItem);
              } else {
                exist.sources.push(...liveItem.sources);
              }
            } else {
              titleMap.set(key, liveItem);
            }
          });
          pool = Array.from(titleMap.values());
        }
      } catch {
        // ignore
      }
    }

    return pool
      .filter((item) => {
        if (!isCleanMovieItem(item)) return false;
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
      })
      .sort((a, b) => {
        if (options.sort === "rating") return b.rating - a.rating;
        if (options.sort === "latest") return b.year - a.year;
        return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
      });
  }

  /**
   * 关键字全网聚合搜索 (实时跨资源站并发展开检索，过滤非影视杂项)
   */
  async searchMovies(query: string): Promise<MovieItem[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    try {
      const cmsResults = await resourceSiteService.searchAcrossSites(query);
      if (cmsResults.length > 0) {
        const cleanResults = cmsResults.filter(isCleanMovieItem);
        if (cleanResults.length > 0) return cleanResults;
      }
    } catch {
      // ignore
    }

    return this.fallbackMovies.filter(
      (m) =>
        isCleanMovieItem(m) && (
          m.title.toLowerCase().includes(q) ||
          (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
          (m.director && m.director.toLowerCase().includes(q)) ||
          (m.actors && m.actors.some((a) => a.toLowerCase().includes(q))) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          m.summary.toLowerCase().includes(q)
        )
    );
  }

  /**
   * 获取相似电影推荐
   */
  async getSimilarMovies(id: string, limit = 4): Promise<MovieItem[]> {
    const target = await this.getMovieById(id);
    if (!target) return [];

    let pool = this.fallbackMovies;
    try {
      const live = await resourceSiteService.getLivePool();
      if (live.length > 0) pool = live;
    } catch {
      // ignore
    }

    return pool
      .filter((m) => m.id !== id && (m.category === target.category || m.genres.some((g) => target.genres.includes(g))))
      .slice(0, limit);
  }
}

export const movieService = new MovieService();
