import { MovieItem, MovieCategory } from "../types";
import { doubanMovies } from "./doubanData";

// 噪音过滤规则：过滤所有体育赛事、会议论坛、晚会盛典、非正片花絮
const NOISE_KEYWORDS = [
  // 体育赛事与重播
  "NBA",
  "CBA",
  "WNBA",
  "赛季",
  "常规赛",
  "季后赛",
  "总决赛",
  "预选赛",
  "热身赛",
  "联赛",
  "锦标赛",
  "巡回赛",
  "公开赛",
  "超级联赛",
  "足球",
  "篮球",
  "排球",
  "乒乓球",
  "羽毛球",
  "网球",
  "台球",
  "拳击",
  "赛事",
  "重播",
  "集锦",
  "世界杯",
  "欧冠",
  "亚冠",
  "中超",
  "英超",
  "西甲",
  "德甲",
  "意甲",
  "法甲",
  "对决",
  "VS",
  "vs",
  // 会议与非影视实况
  "研讨会",
  "发布会",
  "闭幕式",
  "开幕式",
  "论坛",
  "特别节目",
  "秋晚",
  "春晚",
  "戏剧节",
  "动画周",
  "合伙人",
  "座谈",
  "展播",
  "盛典",
  "晚会",
  "峰会",
  "年会",
  "汇报演出",
  "招商",
  // 非正片片段
  "预告",
  "花絮",
  "特辑",
  "采访",
  "片段",
  "盘点",
  "幕后",
  "解说",
];

export function isCleanMovieItem(m: MovieItem): boolean {
  if (!m || !m.title) return false;
  const title = m.title.trim();
  if (title.length < 2) return false;

  const upper = title.toUpperCase();
  for (const kw of NOISE_KEYWORDS) {
    if (upper.includes(kw.toUpperCase())) return false;
  }

  // 过滤包含 “第X届” 的非影视会议/赛事 (保留如《第二十条》等影视作品名)
  if (/第[一二三四五六七八九十百0-9]+届/.test(title)) return false;

  // 过滤包含明显对阵格式的比赛
  if (/\bvs\b/i.test(title)) return false;

  return true;
}

export class DoubanService {
  /**
   * 获取精选焦点大片 (100% 引用豆瓣高分与年度现象级爆款大作，绝无杂乱会议/晚会)
   */
  async getFeaturedMovies(): Promise<MovieItem[]> {
    const featuredList = doubanMovies.filter(
      (m) =>
        m.isFeatured &&
        m.banner &&
        m.poster &&
        m.rating >= 7.0 &&
        isCleanMovieItem(m)
    );

    if (featuredList.length >= 4) {
      return featuredList.slice(0, 6);
    }

    return doubanMovies.slice(0, 6);
  }

  /**
   * 获取豆瓣口碑排行榜 TOP 10 (殿堂级影史丰碑与高分神作，家喻户晓的豆瓣电影 TOP 250 传奇)
   */
  async getDoubanTopMovies(limit = 10): Promise<MovieItem[]> {
    // 优先返回权威精修的豆瓣影史 TOP 经典（如《肖申克的救赎》《霸王别姬》《阿甘正传》《星际穿越》等）
    const topHallOfFame = doubanMovies
      .filter((m) => m.id.startsWith("douban-top-") && m.category === "movie")
      .sort((a, b) => b.rating - a.rating);

    if (topHallOfFame.length >= limit) {
      return topHallOfFame.slice(0, limit);
    }

    // 补充其他高分影视
    const allMovies = doubanMovies
      .filter((m) => m.category === "movie" && isCleanMovieItem(m))
      .sort((a, b) => b.rating - a.rating);

    return allMovies.slice(0, limit);
  }

  /**
   * 获取豆瓣院线热映口碑大片 (2024-2025 现象级院线爆款)
   */
  async getHotMovies(limit = 8): Promise<MovieItem[]> {
    const hotTheatrical = doubanMovies.filter(
      (m) =>
        m.category === "movie" &&
        m.id.startsWith("hot-") &&
        isCleanMovieItem(m)
    );

    if (hotTheatrical.length >= limit) {
      return hotTheatrical.slice(0, limit);
    }

    return doubanMovies
      .filter((m) => m.category === "movie" && isCleanMovieItem(m))
      .slice(0, limit);
  }

  /**
   * 获取豆瓣高分热门剧集 (繁花、庆余年、狂飙、三体、漫长的季节等国民剧王)
   */
  async getHotTvs(limit = 8): Promise<MovieItem[]> {
    const tvs = doubanMovies.filter(
      (m) => m.category === "tv" && isCleanMovieItem(m)
    );
    return tvs.slice(0, limit);
  }

  /**
   * 获取豆瓣高分顶流国漫与新番神作 (凡人修仙传、鬼灭之刃、葬送的芙莉莲、千与千寻等)
   */
  async getHotAnimes(limit = 8): Promise<MovieItem[]> {
    const animes = doubanMovies.filter(
      (m) => m.category === "anime" && isCleanMovieItem(m)
    );
    return animes.slice(0, limit);
  }

  /**
   * 获取爆款微短剧爽剧精选
   */
  async getHotShortPlays(limit = 6): Promise<MovieItem[]> {
    const shorts = doubanMovies.filter(
      (m) => m.category === "shortplay" && isCleanMovieItem(m)
    );
    return shorts.slice(0, limit);
  }

  /**
   * 获取豆瓣热门影视按分类推荐
   */
  async getDoubanByCategory(
    category: MovieCategory,
    limit = 8
  ): Promise<MovieItem[]> {
    if (category === "movie") return this.getHotMovies(limit);
    if (category === "tv") return this.getHotTvs(limit);
    if (category === "anime") return this.getHotAnimes(limit);
    if (category === "shortplay") return this.getHotShortPlays(limit);

    const list = doubanMovies.filter(
      (m) => m.category === category && isCleanMovieItem(m)
    );
    return list.slice(0, limit);
  }

  /**
   * 根据 ID 或标题获取豆瓣详尽资料
   */
  getDoubanById(id: string): MovieItem | undefined {
    return doubanMovies.find((m) => m.id === id);
  }

  getDoubanByTitle(title: string): MovieItem | undefined {
    const cleanTitle = title.trim().toLowerCase();
    return doubanMovies.find(
      (m) =>
        m.title.trim().toLowerCase() === cleanTitle ||
        (m.originalTitle && m.originalTitle.toLowerCase() === cleanTitle)
    );
  }
}

export const doubanService = new DoubanService();
