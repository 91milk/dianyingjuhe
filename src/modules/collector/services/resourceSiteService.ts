import fs from "fs";
import path from "path";
import { ResourceSite, MacCmsResponse, MacCmsItem } from "../types";
import { MovieItem } from "@/modules/movie/types";
import { MacCmsParser } from "./maccmsParser";

const SITES_FILE_PATH = path.join(process.cwd(), "data", "resource-sites.json");
const CACHE_FILE_PATH = path.join(process.cwd(), "data", "cms-cache.json");

const DEFAULT_SITES: ResourceSite[] = [
  {
    id: "liangzi",
    name: "量子资源",
    apiUrl: "https://cj.lziapi.com/api.php/provide/vod/from/lzm3u8/at/json/",
    type: "maccms_v10",
    playFrom: "lzm3u8",
    isEnabled: true,
    weight: 95,
    status: "online",
    responseTime: 260,
    totalItems: 210000,
    lastCheckedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: "hongniu",
    name: "红牛资源",
    apiUrl: "https://www.hongniuzy2.com/api.php/provide/vod/from/hnm3u8/at/json/",
    type: "maccms_v10",
    playFrom: "hnm3u8",
    isEnabled: true,
    weight: 90,
    status: "online",
    responseTime: 280,
    totalItems: 180000,
    lastCheckedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: "maotai",
    name: "茅台资源",
    apiUrl: "https://caiji.maotai999.vip/api.php/provide/vod/from/mtm3u8/at/josn/",
    type: "maccms_v10",
    playFrom: "mtm3u8",
    isEnabled: true,
    weight: 80,
    status: "online",
    responseTime: 380,
    totalItems: 150777,
    lastCheckedAt: Date.now(),
    createdAt: Date.now(),
  },
];

export class ResourceSiteService {
  /**
   * 初始化并读取所有配置的资源站
   */
  getSites(): ResourceSite[] {
    try {
      if (!fs.existsSync(SITES_FILE_PATH)) {
        this.saveSites(DEFAULT_SITES);
        return DEFAULT_SITES;
      }
      const raw = fs.readFileSync(SITES_FILE_PATH, "utf-8");
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SITES;
    }
  }

  saveSites(sites: ResourceSite[]): void {
    try {
      const dir = path.dirname(SITES_FILE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(SITES_FILE_PATH, JSON.stringify(sites, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to save resource sites:", e);
    }
  }

  /**
   * 读取本地采集同步的片库缓存
   */
  getCachedItems(): MovieItem[] {
    try {
      if (!fs.existsSync(CACHE_FILE_PATH)) return [];
      const raw = fs.readFileSync(CACHE_FILE_PATH, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveCachedItems(items: MovieItem[]): void {
    try {
      const dir = path.dirname(CACHE_FILE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to save cached items:", e);
    }
  }

  /**
   * 添加新资源站
   */
  async addSite(input: {
    name: string;
    apiUrl: string;
    playFrom?: string;
    weight?: number;
  }): Promise<ResourceSite> {
    const sites = this.getSites();
    const id = `site_${Date.now()}`;
    const newSite: ResourceSite = {
      id,
      name: input.name.trim(),
      apiUrl: input.apiUrl.trim(),
      type: "maccms_v10",
      playFrom: input.playFrom?.trim() || "m3u8",
      isEnabled: true,
      weight: input.weight || 50,
      status: "untested",
      createdAt: Date.now(),
    };

    const testResult = await this.testSite(newSite);
    newSite.status = testResult.status;
    newSite.responseTime = testResult.responseTime;
    newSite.totalItems = testResult.totalItems;
    newSite.lastCheckedAt = Date.now();

    sites.unshift(newSite);
    this.saveSites(sites);
    return newSite;
  }

  updateSite(id: string, updates: Partial<ResourceSite>): ResourceSite | null {
    const sites = this.getSites();
    const index = sites.findIndex((s) => s.id === id);
    if (index === -1) return null;

    sites[index] = { ...sites[index], ...updates };
    this.saveSites(sites);
    return sites[index];
  }

  deleteSite(id: string): boolean {
    const sites = this.getSites();
    const filtered = sites.filter((s) => s.id !== id);
    if (filtered.length === sites.length) return false;
    this.saveSites(filtered);
    return true;
  }

  /**
   * 测试单个资源站的连通性与延迟
   */
  async testSite(site: ResourceSite): Promise<{
    status: "online" | "offline";
    responseTime: number;
    totalItems?: number;
    error?: string;
  }> {
    const start = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    try {
      const sep = site.apiUrl.includes("?") ? "&" : "?";
      const targetUrl = `${site.apiUrl}${sep}ac=videolist&pg=1`;

      const res = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      clearTimeout(timer);

      if (!res.ok) {
        return { status: "offline", responseTime: Date.now() - start, error: `HTTP ${res.status}` };
      }

      const data: MacCmsResponse = await res.json();
      const responseTime = Date.now() - start;
      const totalItems = parseInt(String(data.total || "0"), 10) || 0;

      return {
        status: "online",
        responseTime,
        totalItems,
      };
    } catch (err: unknown) {
      clearTimeout(timer);
      const msg = err instanceof Error ? err.message : String(err);
      return {
        status: "offline",
        responseTime: Date.now() - start,
        error: msg,
      };
    }
  }

  /**
   * 同步采集指定站点的最新数据（默认抓取最近24小时/前5页最新入库）
   */
  async syncRecentFromSite(siteId: string, hours = 24): Promise<{ count: number; total: number }> {
    const site = this.getSites().find((s) => s.id === siteId);
    if (!site) return { count: 0, total: 0 };

    const sep = site.apiUrl.includes("?") ? "&" : "?";
    // 优先采用 h=24 增量采集参数
    const url = `${site.apiUrl}${sep}ac=videolist&h=${hours}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      });
      clearTimeout(timer);

      if (!res.ok) return { count: 0, total: 0 };
      const data: MacCmsResponse = await res.json();
      if (!data.list || !Array.isArray(data.list)) return { count: 0, total: 0 };

      const parsedItems = data.list.map((item) => MacCmsParser.toMovieItem(item, site));

      // 合并到本地增量缓存
      const cached = this.getCachedItems();
      const map = new Map<string, MovieItem>();
      cached.forEach((item) => map.set(item.id, item));
      parsedItems.forEach((item) => map.set(item.id, item));

      const updated = Array.from(map.values());
      this.saveCachedItems(updated);

      return { count: parsedItems.length, total: updated.length };
    } catch (e) {
      clearTimeout(timer);
      console.error("Sync error:", e);
      return { count: 0, total: 0 };
    }
  }

  /**
   * 并发全网搜索：跨所有已启用的资源站同时发起检索
   * 兼顾开放 wd= 搜索的资源站以及防爬站的本地增量索引
   */
  async searchAcrossSites(query: string, maxItems = 40): Promise<MovieItem[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const enabledSites = this.getSites()
      .filter((s) => s.isEnabled)
      .sort((a, b) => b.weight - a.weight);

    // 1. 尝试直接向支持关键词的远端接口发起搜索
    const fetchPromises = enabledSites.map(async (site) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 9000);
      try {
        const sep = site.apiUrl.includes("?") ? "&" : "?";
        const url = `${site.apiUrl}${sep}ac=videolist&wd=${encodeURIComponent(q)}`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        });
        clearTimeout(timer);

        if (!res.ok) return [];
        const data = await res.json();
        // 若远端提示禁止搜索 (code: 1002)，返回空数组走缓存召回
        if (data.code === 1002 || !data.list || !Array.isArray(data.list)) return [];

        return data.list.map((item: MacCmsItem) => MacCmsParser.toMovieItem(item, site));
      } catch {
        clearTimeout(timer);
        return [];
      }
    });

    const resultsArray = await Promise.all(fetchPromises);
    const remoteCombined = resultsArray.flat();

    // 2. 同时在本地同步采集缓存库中检索（完美应对禁止 wd= 的资源站）
    const cachedItems = this.getCachedItems().filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
        (m.director && m.director.toLowerCase().includes(q)) ||
        (m.actors && m.actors.some((a) => a.toLowerCase().includes(q))) ||
        m.genres.some((g) => g.toLowerCase().includes(q)) ||
        m.summary.toLowerCase().includes(q)
    );

    // 3. 去重合并
    const movieMap = new Map<string, MovieItem>();
    [...remoteCombined, ...cachedItems].forEach((item) => {
      const key = item.title.trim().toLowerCase();
      if (!movieMap.has(key)) {
        movieMap.set(key, item);
      } else {
        const existing = movieMap.get(key)!;
        existing.sources.push(...item.sources);
      }
    });

    return Array.from(movieMap.values()).slice(0, maxItems);
  }

  /**
   * 获取指定资源站的影片详情与完整播放列表
   */
  async getDetailFromSite(siteId: string, vodId: string): Promise<MovieItem | null> {
    const site = this.getSites().find((s) => s.id === siteId);
    if (!site) return null;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    try {
      const sep = site.apiUrl.includes("?") ? "&" : "?";
      const url = `${site.apiUrl}${sep}ac=videolist&ids=${vodId}`;
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      });
      clearTimeout(timer);

      if (!res.ok) return null;
      const data: MacCmsResponse = await res.json();
      if (!data.list || !data.list[0]) return null;

      return MacCmsParser.toMovieItem(data.list[0], site);
    } catch (e) {
      clearTimeout(timer);
      console.error("Failed to fetch detail from site:", e);
      return null;
    }
  }

  /**
   * 从已启用的高权重资源站拉取最新入库的影片
   */
  async getLatestFromSites(categoryName?: string, page = 1, limit = 18): Promise<MovieItem[]> {
    const primarySite = this.getSites().find((s) => s.isEnabled) || this.getSites()[0];
    if (!primarySite) return [];

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const sep = primarySite.apiUrl.includes("?") ? "&" : "?";
      const url = `${primarySite.apiUrl}${sep}ac=videolist&pg=${page}`;
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      });
      clearTimeout(timer);

      if (!res.ok) return [];
      const data: MacCmsResponse = await res.json();
      if (!data.list || !Array.isArray(data.list)) return [];

      let list = data.list.map((item) => MacCmsParser.toMovieItem(item, primarySite));
      if (categoryName) {
        list = list.filter((m) => m.category === categoryName);
      }
      return list.slice(0, limit);
    } catch {
      clearTimeout(timer);
      return [];
    }
  }
}

export const resourceSiteService = new ResourceSiteService();
