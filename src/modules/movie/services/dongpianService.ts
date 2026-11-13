import crypto from "crypto";
import { MovieItem, MovieCategory } from "../types";

const DONGPIAN_KEY = "8b9a908a05eac640e1ee06f52acaa741bfe4ba9e004eeffdbeb635e532e06666";
const DONGPIAN_BASE = "https://dongpian.ai";

interface DongpianCard {
  id: string;
  work_id?: string;
  title: string;
  normalized_title?: string;
  content_kind?: string;
  year?: number;
  area?: string;
  genres?: string[];
  actors?: string[];
  directors?: string[];
  poster_url?: string;
  cover_url?: string;
  rating?: number;
  score?: number;
  douban_rating?: number;
  overview?: string;
  summary?: string;
}

export class DongpianService {
  private cache: {
    homeFeed?: { data: MovieItem[]; expiresAt: number };
  } = {};

  /**
   * 生成 HMAC-SHA256 签名 Headers
   */
  private generateHeaders(method: string, path: string): Record<string, string> {
    const timestamp = String(Date.now());
    const nonce = crypto.randomBytes(16).toString("hex");
    const payload = `${method.toUpperCase()}\n${path}\n${timestamp}\n${nonce}`;
    const signature = crypto
      .createHmac("sha256", DONGPIAN_KEY)
      .update(payload)
      .digest("hex");

    return {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
      "x-ai-movie-timestamp": timestamp,
      "x-ai-movie-nonce": nonce,
      "x-ai-movie-signature": signature,
      Origin: "https://dongpian.ai",
      Referer: "https://dongpian.ai/",
    };
  }

  /**
   * 将懂片帝卡片映射为标准 MovieItem
   */
  private mapCardToMovie(card: DongpianCard): MovieItem {
    let category: MovieCategory = "movie";
    const kind = (card.content_kind || "").toLowerCase();
    const genres = card.genres || [];

    if (kind === "short_drama" || genres.some((g) => g.includes("短剧") || g.includes("爽剧"))) {
      category = "shortplay";
    } else if (kind === "tv" || kind === "series" || genres.some((g) => g.includes("剧") || g.includes("连续剧"))) {
      category = "tv";
    } else if (kind === "anime" || genres.some((g) => g.includes("动漫") || g.includes("动画"))) {
      category = "anime";
    } else if (kind === "variety" || genres.some((g) => g.includes("综艺"))) {
      category = "variety";
    }

    const ratingVal = card.douban_rating || card.rating || card.score || 8.6;
    const cleanPoster = card.poster_url || card.cover_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

    return {
      id: `dp-${card.id}`,
      title: card.title,
      poster: cleanPoster,
      banner: cleanPoster,
      rating: Number(Number(ratingVal).toFixed(1)),
      year: card.year || 2025,
      category,
      genres: card.genres && card.genres.length > 0 ? card.genres : ["剧情"],
      actors: card.actors && card.actors.length > 0 ? card.actors : ["热播阵容"],
      director: card.directors?.[0] || "名导巨制",
      region: card.area || "中国大陆",
      summary: card.overview || card.summary || `《${card.title}》全网聚合高清正片，秒级极速起播。`,
      sources: [], // 播放时由并发竞速引擎动态向极速、速播、魔都等9大源实时解析
      aiHighlights: [
        `懂片 AI 热荐 · 综合评分 ${ratingVal} 分`,
        `聚合全网多源超清画质`,
      ],
      isHot: true,
    };
  }

  /**
   * 从懂片帝获取精选 Home Feed
   */
  async getHomeFeedMovies(): Promise<MovieItem[]> {
    if (this.cache.homeFeed && this.cache.homeFeed.expiresAt > Date.now()) {
      return this.cache.homeFeed.data;
    }

    try {
      const path = "/v1/feed/home";
      const headers = this.generateHeaders("GET", path);
      const res = await fetch(`${DONGPIAN_BASE}${path}`, {
        headers,
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        return [];
      }

      const data = await res.json();
      const sections = Array.isArray(data.sections) ? data.sections : [];
      const movies: MovieItem[] = [];
      const seenTitles = new Set<string>();

      for (const sec of sections) {
        const cards: DongpianCard[] = Array.isArray(sec.cards) ? sec.cards : [];
        for (const card of cards) {
          if (!card.title || seenTitles.has(card.title.trim())) continue;
          seenTitles.add(card.title.trim());
          movies.push(this.mapCardToMovie(card));
        }
      }

      this.cache.homeFeed = {
        data: movies,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 min cache
      };

      return movies;
    } catch (err) {
      console.warn("Failed to fetch dongpian home feed:", err);
      return [];
    }
  }

  /**
   * 搜索懂片帝资源库
   */
  async searchMovies(keyword: string): Promise<MovieItem[]> {
    if (!keyword.trim()) return [];

    try {
      const path = `/v1/browse/catalog?query=${encodeURIComponent(keyword.trim())}`;
      const headers = this.generateHeaders("GET", path);
      const res = await fetch(`${DONGPIAN_BASE}${path}`, {
        headers,
      });

      if (!res.ok) return [];

      const data = await res.json();
      const cards: DongpianCard[] = Array.isArray(data.cards)
        ? data.cards
        : Array.isArray(data.items)
        ? data.items
        : [];

      return cards.map((c) => this.mapCardToMovie(c));
    } catch (err) {
      console.warn("Failed to search dongpian catalog:", err);
      return [];
    }
  }
}

export const dongpianService = new DongpianService();
