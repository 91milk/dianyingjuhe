import { PlaySource } from "@/modules/movie/types";

// 常见 MacCMS 技术播放器代号（如 BFZYM3U8, HNM3U8, LZM3U8, JINYINGYUN, FFM3U8, YUN, MP4 等）
const TECH_SUFFIX_REGEX = /[\s·\-_/]+(?:[a-zA-Z0-9_-]*(?:m3u8|yun|zy|api|bfzym3u8|lzm3u8|hnm3u8|ffm3u8|mtm3u8|jinyingyun|ruyi|modum3u8|dplayer|iframe|play|line))[a-zA-Z0-9_-]*/gi;

/**
 * 提取并规范化资源站纯净名称（去除技术代号黑话，统一品牌名）
 */
export function cleanSiteName(rawName: string = ""): string {
  if (!rawName) return "优质专线";

  // 1. 替换历史残留词汇
  let name = rawName.replace(/金鹰/g, "全网").trim();

  // 2. 清理括号内的代号，如 (bfzym3u8), [m3u8] 等
  name = name.replace(/[\(\[（【][a-zA-Z0-9_-]*(?:m3u8|yun|zy|api|play)[a-zA-Z0-9_-]*[\)\]）】]/gi, "").trim();

  // 3. 清理类似 " · BFZYM3U8", "-HNm3u8", "_lzm3u8", " 1线", " 2线" 等技术播放器编码或历史线号
  name = name.replace(TECH_SUFFIX_REGEX, "").trim();
  name = name.replace(/[\s·\-_/]+[0-9]+线$/i, "").trim();

  // 4. 移除末尾遗留的标点符号
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
 * 1. 同一资源站严格只保留 1 条最佳资源（绝对优先 m3u8 直链；仅当完全无 m3u8 时才降级保留云播）
 * 2. 同一个资源站绝不重复展示 2 种或多条资源，杜绝 "1线 / 2线" 本质同一资源的冗余
 * 3. 跨站点识别相同切片地址，剔除完全镜像的冗余源
 * 4. 纯净展示资源站品牌名称（如 "暴风资源"、"茅台资源"、"全网资源"），界面清爽
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

  // 3. 对各资源站严格筛选【唯一最佳线路】（同一个资源站严格只保留 1 条）
  siteGroupMap.forEach((group, siteName) => {
    // 找出该资源站的最大集数
    const maxEpisodes = Math.max(...group.map((g) => g.episodes.length));

    // 如果该剧集有多个集数（如微短剧或电视剧，集数 > 3），则剔除只有 1 集的残缺源或解说/预告片
    let candidates = group.filter((g) => {
      if (maxEpisodes > 3 && g.episodes.length <= 1) {
        return false;
      }
      return true;
    });

    if (candidates.length === 0) {
      candidates = group;
    }

    // 优先 m3u8 规则：如果该资源站有包含 m3u8/mp4 的线路，彻底过滤掉纯网页/云播放器/iframe
    const m3u8Candidates = candidates.filter((g) => {
      const url = g.episodes[0]?.url || "";
      return url.includes(".m3u8") || url.includes(".mp4");
    });

    // 如果存在 m3u8 候选线路，则只在 m3u8 线路中挑选，彻底剔除云播放器
    const pool = m3u8Candidates.length > 0 ? m3u8Candidates : candidates;

    // 排序优先级：集数最多 > 有效直链 > ID稳定
    pool.sort((a, b) => {
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

    // 每个站点严格只保留 1 条最佳线路
    for (const item of pool) {
      const firstEpUrl = normalizeUrlForCompare(item.episodes[0]?.url);

      // 全局切片地址去重（若其他先入站点的切片地址完全一样，跳过镜像源）
      if (globalSeenUrls.has(firstEpUrl)) {
        continue;
      }

      globalSeenUrls.add(firstEpUrl);
      result.push({
        ...item,
        name: siteName, // 纯净站点名，不加 1线 / 2线
      });
      break; // 同一个资源站严格只保留 1 条！
    }
  });

  return result;
}
