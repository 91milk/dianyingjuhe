import { MovieItem, PlaySource, Episode, MovieCategory } from "@/modules/movie/types";
import { MacCmsItem, ResourceSite } from "../types";

export class MacCmsParser {
  /**
   * 将苹果CMS分类名称映射为系统的 MovieCategory
   */
  static parseCategory(typeName: string = ""): MovieCategory {
    const t = typeName.toLowerCase();
    if (t.includes("短剧") || t.includes("爽剧")) return "shortplay";
    if (t.includes("动漫") || t.includes("动画") || t.includes("番剧")) return "anime";
    if (t.includes("综艺") || t.includes("娱乐")) return "variety";
    if (
      t.includes("电视剧") ||
      t.includes("国产剧") ||
      t.includes("日剧") ||
      t.includes("韩剧") ||
      t.includes("美剧") ||
      t.includes("泰剧") ||
      t.includes("海外剧")
    ) {
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
          const url = parts[1] ? parts[1].trim() : "";
          return {
            id: `ep-${epIdx + 1}`,
            name,
            url,
          };
        })
        .filter((ep) => ep.url.length > 0);

      if (episodes.length > 0) {
        sources.push({
          id: `src-${siteId}-${item.vod_id}-${fromName}-${idx}`,
          name: `${siteName} · ${fromName.toUpperCase()}`,
          episodes,
        });
      }
    });

    return sources;
  }

  /**
   * 将 MacCMS 单条数据映射为标准 MovieItem
   */
  static toMovieItem(item: MacCmsItem, site: ResourceSite): MovieItem {
    const category = this.parseCategory(item.type_name);
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
