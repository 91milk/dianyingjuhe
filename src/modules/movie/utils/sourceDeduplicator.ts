import { PlaySource } from "@/modules/movie/types";

// 常见 MacCMS 技术播放器代号（如 BFZYM3U8, HNM3U8, LZM3U8, JINYINGYUN, FFM3U8 等）
const TECH_SUFFIX_REGEX = /[\s·\-_/]+(?:[a-zA-Z0-9_-]*(?:m3u8|yun|zy|api|bfzym3u8|lzm3u8|hnm3u8|ffm3u8|mtm3u8|jinyingyun|ruyi|modum3u8|dplayer|iframe))[a-zA-Z0-9_-]*/gi;

/**
 * 提取并规范化资源站纯净名称（去除技术代号黑话，统一品牌名）
 */
export function cleanSiteName(rawName: string = ""): string {
  if (!rawName) return "优质专线";

  // 1. 替换历史残留词汇
  let name = rawName.replace(/金鹰/g, "全网").trim();

  // 2. 清理类似 " · BFZYM3U8", "-HNm3u8", "_lzm3u8" 等技术播放器编码
  name = name.replace(TECH_SUFFIX_REGEX, "").trim();

  // 3. 移除末尾遗留的标点符号
  name = name.replace(/[\s·\-_/:：]+$/, "").trim();

  return name || "全网资源";
}

/**
 * 归一化播放地址用于相似度比对（去协议、域名大小写、参数）
 */
function normalizeUrlForCompare(url: string = ""): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    return (u.hostname + u.pathname).toLowerCase().replace(/\/index\.m3u8$/, "");
  } catch {
    return url.split("?")[0].toLowerCase().replace(/^https?:\/\//, "");
  }
}

/**
 * 智能聚合与去重算法：
 * 1. 同一资源站只保留集数最完整、最高清的线路，自动剔除只有 1 集的残缺项/预告片
 * 2. 跨站点识别相同切片地址，剔除完全镜像的冗余源
 * 3. 彻底清除 BFZYM3U8、LZM3U8 等技术后缀，呈现清爽名称
 */
export function deduplicateSources(sources: PlaySource[]): PlaySource[] {
  if (!Array.isArray(sources) || sources.length === 0) return [];

  // 1. 过滤完全没有有效集数的无效源
  const validSources = sources.filter(
    (s) => s && Array.isArray(s.episodes) && s.episodes.length > 0 && s.episodes[0]?.url
  );

  if (validSources.length === 0) return [];

  // 2. 按纯净站点名称分组
  const siteGroupMap = new Map<string, PlaySource[]>();

  for (const src of validSources) {
    const siteKey = cleanSiteName(src.name);
    if (!siteGroupMap.has(siteKey)) {
      siteGroupMap.set(siteKey, []);
    }
    siteGroupMap.get(siteKey)!.push(src);
  }

  const result: PlaySource[] = [];
  const globalSeenUrls = new Set<string>();

  // 3. 对各站点的多条线路进行清洗与择优筛选
  siteGroupMap.forEach((group, siteName) => {
    // 找出该资源站的最大集数
    const maxEpisodes = Math.max(...group.map((g) => g.episodes.length));

    // 如果该剧集有多个集数（如微短剧或电视剧，集数 > 3），则剔除只有 1 集的残缺源或解说/预告片
    const candidates = group.filter((g) => {
      if (maxEpisodes > 3 && g.episodes.length <= 1) {
        return false;
      }
      return true;
    });

    // 排序优先级：集数最多 > 原生 m3u8/mp4 > ID稳定
    candidates.sort((a, b) => {
      if (b.episodes.length !== a.episodes.length) {
        return b.episodes.length - a.episodes.length;
      }
      const aUrl = a.episodes[0]?.url || "";
      const bUrl = b.episodes[0]?.url || "";
      const aIsM3u8 = aUrl.includes(".m3u8") || aUrl.includes(".mp4");
      const bIsM3u8 = bUrl.includes(".m3u8") || bUrl.includes(".mp4");
      if (aIsM3u8 && !bIsM3u8) return -1;
      if (!aIsM3u8 && bIsM3u8) return 1;
      return 0;
    });

    const retainedForSite: PlaySource[] = [];
    const siteSeenUrls = new Set<string>();

    for (const item of candidates) {
      const firstEpUrl = normalizeUrlForCompare(item.episodes[0]?.url);

      // 如果当前资源站已经存在该 URL，或者全局已经有完全一致的播放流，跳过
      if (siteSeenUrls.has(firstEpUrl) || globalSeenUrls.has(firstEpUrl)) {
        continue;
      }

      siteSeenUrls.add(firstEpUrl);
      globalSeenUrls.add(firstEpUrl);
      retainedForSite.push(item);

      // 单个站点最多保留 2 条不重复的高质线路，避免刷屏
      if (retainedForSite.length >= 2) break;
    }

    // 若去重后无候选（极端情况），兜底保留排序第一的源
    if (retainedForSite.length === 0 && candidates[0]) {
      retainedForSite.push(candidates[0]);
    }

    // 格式化命名：如果该站只有 1 条则直接叫站点名；若有 2 条则标为 "1线"、"2线"
    retainedForSite.forEach((item, idx) => {
      const formattedName =
        retainedForSite.length > 1 ? `${siteName} ${idx + 1}线` : siteName;

      result.push({
        ...item,
        name: formattedName,
      });
    });
  });

  return result;
}
