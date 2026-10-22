import { MovieItem, PlaySource, Episode, MovieCategory } from "@/modules/movie/types";
import { MacCmsItem, ResourceSite } from "../types";
import { cleanSiteName, deduplicateSources } from "@/modules/movie/utils/sourceDeduplicator";

export class MacCmsParser {
  /**
   * 将苹果CMS分类名称映射为系统的 MovieCategory
   */
  /**
   * 将苹果CMS分类名称精确映射为系统的 MovieCategory
   */
  static parseCategory(
    typeName: string = "",
    typeId1?: number | string,
    vodClass?: string
  ): MovieCategory {
    // 0. 若父级分类明确为短剧 (MacCMS 标准父分类 ID 30)
    if (Number(typeId1) === 30) {
      return "shortplay";
    }

    const t = (typeName + " " + (vodClass || "")).toLowerCase();

    // 1. 微短剧 (高频细分标签与典型分类名)
    if (
      t.includes("短剧") ||
      t.includes("爽剧") ||
      t.includes("现代都市") ||
      t.includes("古装仙侠") ||
      t.includes("穿越年代") ||
      t.includes("言情总裁") ||
      t.includes("重生民国") ||
      t.includes("反转爽剧") ||
      t.includes("脑洞悬疑") ||
      t.includes("漫剧") ||
      t.includes("逆袭") ||
      t.includes("战神")
    ) {
      return "shortplay";
    }

    // 2. 动漫
    if (t.includes("动漫") || t.includes("动画") || t.includes("番剧") || t.includes("二次元")) {
      return "anime";
    }

    // 3. 综艺
    if (t.includes("综艺") || t.includes("娱乐") || t.includes("脱口秀") || t.includes("真人秀")) {
      return "variety";
    }

    // 4. 电影 (动作片、科幻片、剧情片、喜剧片等)
    if (t.includes("片") || t.includes("电影") || t.includes("影院")) {
      return "movie";
    }

    // 5. 电视剧 (欧美剧、内地剧、韩剧、日剧等)
    if (t.includes("剧")) {
      return "tv";
    }

    return "movie";
  }

  /**
   * 清理 HTML 标签
   */
  static cleanHtml(html: string = ""): string {
    return html.replace(/<[^>]*>?/gm, "").trim();
  }

  /**
   * 智能规范化播放地址（补全缺少 index.m3u8 的流地址，并安全编码特殊字符）
   */
  static normalizePlayUrl(rawUrl: string): string {
    let url = rawUrl.trim();
    if (!url) return "";

    // 1. 如果是以 /play/xxxx 结尾且没有扩展名（酷客/全网源/暴风等特定直链流）
    if (/\/play\/[a-zA-Z0-9_-]+$/.test(url)) {
      url = `${url}/index.m3u8`;
    }

    // 2. 避免中文或特殊字符路径导致播放器请求 400 失败
    try {
      url = encodeURI(decodeURI(url));
    } catch {
      // ignore
    }

    return url;
  }

  /**
   * 解析播放线路与集数
   * 格式: vod_play_from: "mtm3u8$$$other"
   * vod_play_url: "第01集$url1#第02集$url2$$$第01集$url3"
   */
  static parsePlaySources(
    item: MacCmsItem,
    siteName: string = "采集源",
    siteId: string = "cms"
  ): PlaySource[] {
    const fromStr = item.vod_play_from || "默认线路";
    const urlStr = item.vod_play_url || "";

    const fromList = fromStr.split("$$$");
    const urlList = urlStr.split("$$$");

    const sources: PlaySource[] = [];

    fromList.forEach((fromName, idx) => {
      const episodesChunk = urlList[idx] || "";
      if (!episodesChunk.trim()) return;

      const episodes: Episode[] = episodesChunk
        .split("#")
        .filter(Boolean)
        .map((epItem, epIdx) => {
          const parts = epItem.split("$");
          const name = parts[0] ? parts[0].trim() : `第${epIdx + 1}集`;
          const rawUrl = parts[1] ? parts[1].trim() : "";
          const url = this.normalizePlayUrl(rawUrl);
          return {
            id: `ep-${epIdx + 1}`,
            name,
            url,
          };
        })
        .filter((ep) => ep.url.length > 0);

      if (episodes.length > 0) {
        const cleanName = cleanSiteName(siteName);
        sources.push({
          id: `src-${siteId}-${item.vod_id}-${fromName}-${idx}`,
          name: cleanName,
          episodes,
        });
      }
    });

    return deduplicateSources(sources);
  }

  /**
   * 将 MacCMS 单条数据映射为标准 MovieItem
   */
  static toMovieItem(item: MacCmsItem, site: ResourceSite): MovieItem {
    const category = this.parseCategory(item.type_name, item.type_id_1, item.vod_class);
    const sources = this.parsePlaySources(item, site.name, site.id);

    const rawRating = parseFloat(item.vod_score || "0");
    const rating = rawRating > 0 ? rawRating : 8.5; // 无评分时给予高基准推荐评分

    const year = parseInt(item.vod_year || "2024", 10) || 2024;
    const summary =
      this.cleanHtml(item.vod_content || item.vod_blurb) || "暂无详细剧情简介";

    const actors = item.vod_actor
      ? item.vod_actor.split(/[,，/ ]+/).map((a) => a.trim()).filter(Boolean)
      : [];

    const genres: string[] = [];
    if (item.type_name) genres.push(item.type_name);
    if (item.vod_class) {
      item.vod_class.split(/[,，/ ]+/).forEach((c) => {
        if (c && !genres.includes(c)) genres.push(c);
      });
    }
    if (genres.length === 0) genres.push("剧情");

    return {
      id: `cms_${site.id}_${item.vod_id}`,
      title: item.vod_name,
      originalTitle: item.vod_en,
      poster: item.vod_pic || "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      banner: item.vod_pic,
      rating,
      year,
      region: item.vod_area || "中国大陆",
      genres,
      director: item.vod_director,
      actors,
      summary,
      category,
      updateStatus: item.vod_remarks || "高清正片",
      isHot: true,
      sources,
      aiHighlights: [
        `来源【${site.name}】实时同步数据`,
        `当前状态：${item.vod_remarks || "更新中"}`,
        `全网聚合线路，支持多码率秒级播放`
      ],
    };
  }
}
