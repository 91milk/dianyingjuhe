import fs from "fs";
import path from "path";
import { ResourceSite, MacCmsResponse, MacCmsItem } from "../types";
import { MovieItem } from "@/modules/movie/types";
import { MacCmsParser } from "./maccmsParser";
import { isSafeExternalUrl } from "@/lib/security";
import { siteConfig } from "@/config/site";
import { deduplicateSources } from "@/modules/movie/utils/sourceDeduplicator";
import { siteCircuitBreaker } from "./circuitBreaker";
import { Singleflight } from "@/lib/singleflight";

const SITES_FILE_PATH = path.join(process.cwd(), "data", "resource-sites.json");
const CACHE_FILE_PATH = path.join(process.cwd(), "data", "cms-cache.json");

const DEFAULT_SITES: ResourceSite[] = [
  {
    id: "feifan",
    name: "非凡资源",
    apiUrl: "http://cj.ffzyapi.com/api.php/provide/vod/from/ffm3u8/at/json/",
    type: "maccms_v10",
    playFrom: "ffm3u8",
    isEnabled: true,
    weight: 99,
    status: "online",
    responseTime: 180,
    totalItems: 99093,
    lastCheckedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: "subo",
    name: "速播资源",
    apiUrl: "https://subocaiji.com/api.php/provide/vod/from/subm3u8/at/json/",
    type: "maccms_v10",
    playFrom: "subm3u8",
    isEnabled: true,
    weight: 98,
    status: "online",
    responseTime: 220,
    totalItems: 118084,
    lastCheckedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: "jisu",
    name: "极速资源",
    apiUrl: "https://jszyapi.com/api.php/provide/vod/from/jsm3u8/at/json",
    type: "maccms_v10",
    playFrom: "jsm3u8",
    isEnabled: true,
    weight: 96,
    status: "online",
    responseTime: 240,
    totalItems: 116491,
    lastCheckedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: "modu",
    name: "魔都资源",
    apiUrl: "https://caiji.moduapi.cc/api.php/provide/vod/from/modum3u8/at/json/",
    type: "maccms_v10",
    playFrom: "modum3u8",
    isEnabled: true,
    weight: 95,
    status: "online",
    responseTime: 250,
    totalItems: 91706,
    lastCheckedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: "huya",
    name: "虎牙资源",
    apiUrl: "https://www.huyaapi.com/api.php/provide/vod/from/hym3u8/at/json/",
    type: "maccms_v10",
    playFrom: "hym3u8",
    isEnabled: true,
    weight: 94,
    status: "online",
    responseTime: 280,
    totalItems: 117080,
    lastCheckedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: "guangsu",
    name: "光速云资源",
    apiUrl: "https://api.guangsuapi.com/api.php/provide/vod/at/json/",
    type: "maccms_v10",
    playFrom: "gsm3u8",
    isEnabled: true,
    weight: 92,
    status: "online",
    responseTime: 300,
    totalItems: 118157,
    lastCheckedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: "liangzi",
    name: "量子资源",
    apiUrl: "https://cj.lziapi.com/api.php/provide/vod/from/lzm3u8/at/json/",
    type: "maccms_v10",
    playFrom: "lzm3u8",
    isEnabled: true,
    weight: 90,
    status: "online",
    responseTime: 320,
    totalItems: 163576,
    lastCheckedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: "ikun",
    name: "iKun资源",
    apiUrl: "https://ikunzyapi.com/api.php/provide/vod/from/ikm3u8/at/json",
    type: "maccms_v10",
    playFrom: "ikm3u8",
    isEnabled: true,
    weight: 88,
    status: "online",
    responseTime: 330,
    totalItems: 67674,
    lastCheckedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: "baiduyun",
    name: "百度云资源",
    apiUrl: "https://api.apibdzy.com/api.php/provide/vod/from/dbm3u8/at/json",
    type: "maccms_v10",
    playFrom: "dbm3u8",
    isEnabled: true,
    weight: 85,
    status: "online",
    responseTime: 350,
    totalItems: 49667,
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
    const trimmedUrl = input.apiUrl.trim();
    const check = isSafeExternalUrl(trimmedUrl);
    if (!check.safe) {
      throw new Error(`非法的资源站 API 地址: ${check.reason}`);
    }

    const sites = this.getSites();
    const id = `site_${Date.now()}`;
    const newSite: ResourceSite = {
      id,
      name: input.name.trim(),
      apiUrl: trimmedUrl,
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
    const check = isSafeExternalUrl(site.apiUrl);
    if (!check.safe) {
      return { status: "offline", responseTime: 0, error: `禁止请求该地址: ${check.reason}` };
    }

    const start = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), siteConfig.collector.timeoutMs);

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

  // 1. 全局请求单飞防抖器 (Singleflight)：抑制同一时刻对同名影片的并发重复向外请求
  private searchFlight = new Singleflight<MovieItem[]>();
  // 2. 搜索内存 LRU 缓存：TTL 3 分钟，杜绝频繁高刷外网
  private searchCache = new Map<string, { items: MovieItem[]; expireAt: number }>();

  /**
   * 并发全网搜索：跨所有已启用的资源站同时发起检索
   * 包含：Singleflight 请求合并、3 分钟内存缓存、自适应熔断过滤与 3 秒极速超时保护
   */
  async searchAcrossSites(query: string, maxItems = 40): Promise<MovieItem[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const now = Date.now();
    const cached = this.searchCache.get(q);
    if (cached && now < cached.expireAt) {
      return cached.items.slice(0, maxItems);
    }

    // 采用 Singleflight 单飞保护：瞬间 100 个请求只会触发 1 次真实底层外网请求
    return this.searchFlight.do(q, async () => {
      // 二次检查缓存 (Double-checked locking)
      const c2 = this.searchCache.get(q);
      if (c2 && Date.now() < c2.expireAt) {
        return c2.items.slice(0, maxItems);
      }

      // 仅挑选已启用且未熔断的健康站点 (若某站连续报错则直接跳过，耗时 0ms)
      const enabledSites = this.getSites()
        .filter((s) => s.isEnabled && siteCircuitBreaker.isAvailable(s.id))
        .sort((a, b) => b.weight - a.weight);

      // 单站超时严格限制在 3000ms 内，绝不死等
      const timeoutMs = Math.min(siteConfig.collector.timeoutMs || 3000, 3000);

      // 1. 尝试直接向支持关键词的远端接口发起搜索
      const fetchPromises = enabledSites.map(async (site) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const sep = site.apiUrl.includes("?") ? "&" : "?";
          const url = `${site.apiUrl}${sep}ac=videolist&wd=${encodeURIComponent(q)}`;
          const res = await fetch(url, {
            signal: controller.signal,
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
          });
          clearTimeout(timer);

          if (!res.ok) {
            if (res.status >= 500 || res.status === 429) {
              siteCircuitBreaker.recordFailure(site.id, `HTTP ${res.status}`);
            }
            return [];
          }
          const data = await res.json();
          // 若远端提示禁止搜索 (code: 1002)，返回空数组走缓存召回
          if (data.code === 1002 || !data.list || !Array.isArray(data.list)) return [];

          // 请求成功，重置熔断失败计数
          siteCircuitBreaker.recordSuccess(site.id);
          return data.list.map((item: MacCmsItem) => MacCmsParser.toMovieItem(item, site));
        } catch (err: unknown) {
          clearTimeout(timer);
          const reason = err instanceof Error ? err.message : String(err);
          siteCircuitBreaker.recordFailure(site.id, reason);
          return [];
        }
      });

      const settledResults = await Promise.allSettled(fetchPromises);
      const remoteCombined: MovieItem[] = [];
      settledResults.forEach((res) => {
        if (res.status === "fulfilled" && Array.isArray(res.value)) {
          remoteCombined.push(...res.value);
        }
      });

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

      // 3. 去重合并影片与线路
      const movieMap = new Map<string, MovieItem>();
      [...remoteCombined, ...cachedItems].forEach((item) => {
        const key = item.title.trim().toLowerCase();
        if (!movieMap.has(key)) {
          movieMap.set(key, {
            ...item,
            sources: deduplicateSources(item.sources),
          });
        } else {
          const existing = movieMap.get(key)!;
          existing.sources = deduplicateSources([...existing.sources, ...item.sources]);
        }
      });

      const finalResult = Array.from(movieMap.values());

      // 写入内存 LRU 缓存，控制总数不超过 500 个搜索词
      if (this.searchCache.size > 500) {
        const keys = Array.from(this.searchCache.keys());
        for (let i = 0; i < 100; i++) {
          this.searchCache.delete(keys[i]);
        }
      }
      this.searchCache.set(q, {
        items: finalResult,
        expireAt: Date.now() + 3 * 60 * 1000,
      });

      return finalResult.slice(0, maxItems);
    });
  }

  /**
   * 获取指定资源站的影片详情与完整播放列表 (熔断保护 + 3500ms 超时)
   */
  async getDetailFromSite(siteId: string, vodId: string): Promise<MovieItem | null> {
    const site = this.getSites().find((s) => s.id === siteId);
    if (!site) return null;

    if (!siteCircuitBreaker.isAvailable(siteId)) {
      console.warn(`[getDetailFromSite] 站点 [${siteId}] 处于熔断保护期，自动跳过详情拉取`);
      return null;
    }

    const timeoutMs = Math.min(siteConfig.collector.detailTimeoutMs || 3500, 3500);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const sep = site.apiUrl.includes("?") ? "&" : "?";
      const url = `${site.apiUrl}${sep}ac=videolist&ids=${encodeURIComponent(vodId)}`;
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      });
      clearTimeout(timer);

      if (!res.ok) {
        if (res.status >= 500 || res.status === 429) {
          siteCircuitBreaker.recordFailure(siteId, `HTTP ${res.status}`);
        }
        return null;
      }
      const data: MacCmsResponse = await res.json();
      if (!data.list || !data.list[0]) return null;

      siteCircuitBreaker.recordSuccess(siteId);
      return MacCmsParser.toMovieItem(data.list[0], site);
    } catch (e: unknown) {
      clearTimeout(timer);
      const reason = e instanceof Error ? e.message : String(e);
      siteCircuitBreaker.recordFailure(siteId, reason);
      console.error("Failed to fetch detail from site:", e);
      return null;
    }
  }

  private livePoolCache: { timestamp: number; items: MovieItem[] } | null = null;
  private shortPlaysCache: { timestamp: number; items: MovieItem[] } | null = null;
  private categoryCache = new Map<number, { timestamp: number; items: MovieItem[] }>();
  private isRefreshingLivePool = false;
  private isRefreshingShortPlays = false;
  private refreshingCategories = new Set<number>();

  /**
   * 极速获取实时片库 (SWR 策略：本地持久化秒开 + 内存毫秒级返回 + 后台异步静默增量刷新)
   */
  async getLivePool(): Promise<MovieItem[]> {
    // 1. 若内存缓存不存在，先从本地已保存的增量缓存秒开
    if (!this.livePoolCache) {
      const diskCached = this.getCachedItems();
      if (diskCached.length > 0) {
        this.livePoolCache = { timestamp: performance.now(), items: diskCached };
        this.refreshLivePoolInBackground();
        return this.livePoolCache.items;
      }
    }

    // 2. 若内存缓存处于 10 分钟有效期内，0 延迟极速返回
    if (this.livePoolCache && performance.now() - this.livePoolCache.timestamp < 1000 * 60 * 10) {
      return this.livePoolCache.items;
    }

    // 3. 若缓存已过期但存在旧数据：遵循 SWR 策略，优先立即返回旧数据保障页面秒开，同时在后台静默拉取最新
    if (this.livePoolCache && this.livePoolCache.items.length > 0) {
      this.refreshLivePoolInBackground();
      return this.livePoolCache.items;
    }

    // 4. 仅当完全没有任何数据（全新空盘启动）时，才同步等待拉取
    return this.refreshLivePool();
  }

  private refreshLivePoolInBackground(): void {
    if (this.isRefreshingLivePool) return;
    this.isRefreshingLivePool = true;
    this.refreshLivePool()
      .catch((err) => {
        console.error("Background live pool refresh error:", err);
      })
      .finally(() => {
        this.isRefreshingLivePool = false;
      });
  }

  /**
   * 真实并发拉取三大核心资源站最新片源并聚合持久化
   */
  async refreshLivePool(): Promise<MovieItem[]> {
    const enabledSites = this.getSites()
      .filter((s) => s.isEnabled)
      .slice(0, 3); // 优先并发聚合前3大核心资源站 (金鹰、茅台、如意)

    if (enabledSites.length === 0) {
      return this.getCachedItems();
    }

    const fetchTasks: Promise<MovieItem[]>[] = [];

    enabledSites.forEach((site) => {
      // 拉取第 1 页
      fetchTasks.push(
        (async () => {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 4500);
          try {
            const sep = site.apiUrl.includes("?") ? "&" : "?";
            const url = `${site.apiUrl}${sep}ac=videolist&pg=1`;
            const res = await fetch(url, {
              signal: controller.signal,
              headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
            });
            clearTimeout(timer);
            if (!res.ok) return [];
            const data: MacCmsResponse = await res.json();
            if (!data.list || !Array.isArray(data.list)) return [];
            return data.list.map((item) => MacCmsParser.toMovieItem(item, site));
          } catch {
            clearTimeout(timer);
            return [];
          }
        })()
      );

      // 针对极速、魔都等主力资源站并发拉取第 2 页与专属分类，扩充全网片源丰富度
      if (site.id === "jisu" || site.id === "modu") {
        fetchTasks.push(
          (async () => {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 4500);
            try {
              const sep = site.apiUrl.includes("?") ? "&" : "?";
              const url = `${site.apiUrl}${sep}ac=videolist&pg=2`;
              const res = await fetch(url, {
                signal: controller.signal,
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
              });
              clearTimeout(timer);
              if (!res.ok) return [];
              const data: MacCmsResponse = await res.json();
              if (!data.list || !Array.isArray(data.list)) return [];
              return data.list.map((item) => MacCmsParser.toMovieItem(item, site));
            } catch {
              clearTimeout(timer);
              return [];
            }
          })()
        );

        // 核心加固：拉取电影专区与微短剧专区
        if (site.id === "jisu") {
          // 极速资源: 电影(t=2), 动作片(t=9), 现代都市短剧(t=46), 反转爽剧短剧(t=50)
          const jisuTypes = [2, 9, 46, 50];
          for (const tid of jisuTypes) {
            fetchTasks.push(
              (async () => {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 4500);
                try {
                  const sep = site.apiUrl.includes("?") ? "&" : "?";
                  const url = `${site.apiUrl}${sep}ac=videolist&t=${tid}&pg=1`;
                  const res = await fetch(url, {
                    signal: controller.signal,
                    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
                  });
                  clearTimeout(timer);
                  if (!res.ok) return [];
                  const data: MacCmsResponse = await res.json();
                  if (!data.list || !Array.isArray(data.list)) return [];
                  return data.list.map((item) => MacCmsParser.toMovieItem(item, site));
                } catch {
                  clearTimeout(timer);
                  return [];
                }
              })()
            );
          }
        } else if (site.id === "modu") {
          // 魔都资源: 电影(t=7), 短剧专区(t=38 第1页与第2页)
          const moduTasks = [
            `${site.apiUrl}${site.apiUrl.includes("?") ? "&" : "?"}ac=videolist&t=7&pg=1`,
            `${site.apiUrl}${site.apiUrl.includes("?") ? "&" : "?"}ac=videolist&t=38&pg=1`,
            `${site.apiUrl}${site.apiUrl.includes("?") ? "&" : "?"}ac=videolist&t=38&pg=2`,
          ];
          for (const targetUrl of moduTasks) {
            fetchTasks.push(
              (async () => {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 4500);
                try {
                  const res = await fetch(targetUrl, {
                    signal: controller.signal,
                    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
                  });
                  clearTimeout(timer);
                  if (!res.ok) return [];
                  const data: MacCmsResponse = await res.json();
                  if (!data.list || !Array.isArray(data.list)) return [];
                  return data.list.map((item) => MacCmsParser.toMovieItem(item, site));
                } catch {
                  clearTimeout(timer);
                  return [];
                }
              })()
            );
          }
        }
      }
    });

    try {
      const results = await Promise.allSettled(fetchTasks);
      const combined: MovieItem[] = [];

      results.forEach((res) => {
        if (res.status === "fulfilled" && Array.isArray(res.value)) {
          combined.push(...res.value);
        }
      });

      if (combined.length > 0) {
        // 去重合并
        const map = new Map<string, MovieItem>();
        combined.forEach((item) => {
          const key = item.title.trim().toLowerCase();
          if (!map.has(key)) {
            map.set(key, item);
          } else {
            const exist = map.get(key)!;
            exist.sources.push(...item.sources);
          }
        });

        const distinctItems = Array.from(map.values()).filter((item) => {
          const text = (item.title + " " + item.genres.join(" ")).toLowerCase();
          return (
            !text.includes("伦理") &&
            !text.includes("情色") &&
            !text.includes("擦边") &&
            !text.includes("福利")
          );
        });

        this.livePoolCache = { timestamp: performance.now(), items: distinctItems };

        // 异步持久化到本地缓存文件，供断网或冷启动秒开兜底
        try {
          fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(distinctItems.slice(0, 120), null, 2));
        } catch {
          // ignore
        }

        return distinctItems;
      }
    } catch (e) {
      console.error("Failed to aggregate live pool:", e);
    }

    // 若网络请求受限，退回使用本地持久化缓存
    const fallbackCached = this.getCachedItems();
    if (fallbackCached.length > 0) return fallbackCached;

    return [];
  }

  /**
   * 动态穿透拉取特定类型的影视数据 (支持 SWR 内存缓存秒开)
   */
  async fetchLiveCategory(typeId: number, limit = 24): Promise<MovieItem[]> {
    const cached = this.categoryCache.get(typeId);
    if (cached) {
      if (performance.now() - cached.timestamp < 1000 * 60 * 10) {
        return cached.items.slice(0, limit);
      }
      this.refreshCategoryInBackground(typeId, limit);
      return cached.items.slice(0, limit);
    }

    return this.executeFetchCategory(typeId, limit);
  }

  private refreshCategoryInBackground(typeId: number, limit: number): void {
    if (this.refreshingCategories.has(typeId)) return;
    this.refreshingCategories.add(typeId);
    this.executeFetchCategory(typeId, limit)
      .catch((err) => console.error(`Background refresh category ${typeId} error:`, err))
      .finally(() => {
        this.refreshingCategories.delete(typeId);
      });
  }

  private async executeFetchCategory(typeId: number, limit = 24): Promise<MovieItem[]> {
    const enabledSites = this.getSites().filter((s) => s.isEnabled);
    const targetSite =
      enabledSites.find((s) => s.id === "jisu") ||
      enabledSites.find((s) => s.id === "modu") ||
      enabledSites[0];

    if (!targetSite) return [];

    const tasks = [1, 2].map((pg) =>
      (async () => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4500);
        try {
          const sep = targetSite.apiUrl.includes("?") ? "&" : "?";
          const url = `${targetSite.apiUrl}${sep}ac=videolist&t=${typeId}&pg=${pg}`;
          const res = await fetch(url, {
            signal: controller.signal,
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
          });
          clearTimeout(timer);
          if (!res.ok) return [];
          const data: MacCmsResponse = await res.json();
          if (!data.list || !Array.isArray(data.list)) return [];
          return data.list.map((item) => MacCmsParser.toMovieItem(item, targetSite));
        } catch {
          clearTimeout(timer);
          return [];
        }
      })()
    );

    const settled = await Promise.allSettled(tasks);
    const allItems: MovieItem[] = [];
    settled.forEach((s) => {
      if (s.status === "fulfilled" && Array.isArray(s.value)) {
        allItems.push(...s.value);
      }
    });

    const map = new Map<string, MovieItem>();
    allItems.forEach((m) => {
      if (!map.has(m.title)) map.set(m.title, m);
    });

    const distinct = Array.from(map.values());
    this.categoryCache.set(typeId, { timestamp: performance.now(), items: distinct });
    return distinct.slice(0, limit);
  }

  /**
   * 独立快速穿透抓取真实微短剧列表 (支持多源聚合与 SWR 秒开)
   */
  async fetchLiveShortPlays(limit = 36): Promise<MovieItem[]> {
    if (this.shortPlaysCache && this.shortPlaysCache.items.length >= 24) {
      if (performance.now() - this.shortPlaysCache.timestamp < 1000 * 60 * 15) {
        return this.shortPlaysCache.items.slice(0, limit);
      }
      this.refreshShortPlaysInBackground(limit);
      return this.shortPlaysCache.items.slice(0, limit);
    }

    return this.executeFetchShortPlays(limit);
  }

  private refreshShortPlaysInBackground(limit: number): void {
    if (this.isRefreshingShortPlays) return;
    this.isRefreshingShortPlays = true;
    this.executeFetchShortPlays(limit)
      .catch((err) => console.error("Background refresh short plays error:", err))
      .finally(() => {
        this.isRefreshingShortPlays = false;
      });
  }

  private async executeFetchShortPlays(limit = 36): Promise<MovieItem[]> {
    const enabledSites = this.getSites().filter((s) => s.isEnabled);
    const jisuSite = enabledSites.find((s) => s.id === "jisu");
    const moduSite = enabledSites.find((s) => s.id === "modu");
    const ikunSite = enabledSites.find((s) => s.id === "ikun");
    const feifanSite = enabledSites.find((s) => s.id === "feifan");

    const requests: { site: ResourceSite; typeId: number; page: number }[] = [];

    // 魔都短剧专区 (35,000+ 部短剧，第 1 页与第 2 页并发)
    if (moduSite) {
      requests.push({ site: moduSite, typeId: 38, page: 1 });
      requests.push({ site: moduSite, typeId: 38, page: 2 });
    }

    // 极速短剧细分大类 (现代都市、反转爽剧、言情总裁、古装仙侠、穿越年代)
    if (jisuSite) {
      requests.push({ site: jisuSite, typeId: 46, page: 1 }); // 现代都市 (15,000+ 部)
      requests.push({ site: jisuSite, typeId: 50, page: 1 }); // 反转爽剧 (4,700+ 部)
      requests.push({ site: jisuSite, typeId: 48, page: 1 }); // 言情总裁
      requests.push({ site: jisuSite, typeId: 45, page: 1 }); // 古装仙侠
      requests.push({ site: jisuSite, typeId: 47, page: 1 }); // 穿越年代
    }

    // iKun 爽文短剧专区
    if (ikunSite) {
      requests.push({ site: ikunSite, typeId: 45, page: 1 });
    }

    // 非凡短剧专区
    if (feifanSite) {
      requests.push({ site: feifanSite, typeId: 36, page: 1 });
    }

    if (requests.length === 0 && enabledSites.length > 0) {
      requests.push({ site: enabledSites[0], typeId: 38, page: 1 });
      requests.push({ site: enabledSites[0], typeId: 46, page: 1 });
    }

    const tasks = requests.map(async ({ site, typeId, page }) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4500);
      try {
        const sep = site.apiUrl.includes("?") ? "&" : "?";
        const url = `${site.apiUrl}${sep}ac=videolist&t=${typeId}&pg=${page}`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        });
        clearTimeout(timer);
        if (!res.ok) return [];
        const data: MacCmsResponse = await res.json();
        if (!data.list || !Array.isArray(data.list)) return [];
        return data.list.map((item) => MacCmsParser.toMovieItem(item, site));
      } catch {
        clearTimeout(timer);
        return [];
      }
    });

    const settled = await Promise.allSettled(tasks);
    const allItems: MovieItem[] = [];
    settled.forEach((s) => {
      if (s.status === "fulfilled" && Array.isArray(s.value)) {
        allItems.push(...s.value);
      }
    });

    const map = new Map<string, MovieItem>();
    allItems.forEach((m) => {
      const title = m.title?.trim();
      if (!title) return;
      if (!map.has(title)) {
        map.set(title, m);
      } else {
        const exist = map.get(title)!;
        exist.sources.push(...m.sources);
      }
    });

    const distinctShorts = Array.from(map.values()).filter((item) => {
      const text = (item.title + " " + item.genres.join(" ")).toLowerCase();
      return (
        !text.includes("伦理") &&
        !text.includes("情色") &&
        !text.includes("擦边") &&
        !text.includes("福利")
      );
    });

    if (distinctShorts.length > 0) {
      this.shortPlaysCache = { timestamp: performance.now(), items: distinctShorts };

      // 同步合并到本地实时池与磁盘缓存
      if (this.livePoolCache) {
        const poolMap = new Map<string, MovieItem>();
        this.livePoolCache.items.forEach((item) => poolMap.set(item.title.trim().toLowerCase(), item));
        distinctShorts.forEach((item) => poolMap.set(item.title.trim().toLowerCase(), item));
        this.livePoolCache.items = Array.from(poolMap.values());
      }
    }

    return distinctShorts.slice(0, limit);
  }

  /**
   * 从已启用的高权重资源站拉取最新入库的影片 (支持分类过滤)
   */
  async getLatestFromSites(categoryName?: string, page = 1, limit = 18): Promise<MovieItem[]> {
    const pool = await this.getLivePool();
    let filtered = pool;
    if (categoryName) {
      filtered = filtered.filter((m) => m.category === categoryName);
    }
    // 若请求电影但池中较少，启动实时穿透拉取动作/科幻/喜剧电影
    if (categoryName === "movie" && filtered.length < 16) {
      try {
        const liveMovies = await this.fetchLiveCategory(2, limit); // t=2 为电影全量
        if (liveMovies.length > 0) {
          const map = new Map<string, MovieItem>();
          [...liveMovies, ...filtered].forEach((m) => {
            if (!map.has(m.title)) map.set(m.title, m);
          });
          return Array.from(map.values()).slice(0, limit);
        }
      } catch {
        // ignore
      }
    }

    // 若请求短剧但内存池较少，启动实时穿透拉取
    if (categoryName === "shortplay" && filtered.length < 24) {
      try {
        const liveShorts = await this.fetchLiveShortPlays(limit);
        if (liveShorts.length > 0) {
          return liveShorts.slice(0, limit);
        }
      } catch {
        // ignore
      }
    }
    return filtered.slice(0, limit);
  }
}

export const resourceSiteService = new ResourceSiteService();
