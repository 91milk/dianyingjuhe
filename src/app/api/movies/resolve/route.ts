import { NextRequest, NextResponse } from "next/server";
import { resourceSiteService } from "@/modules/collector/services/resourceSiteService";
import { PlaySource, MovieItem } from "@/modules/movie/types";
import { siteConfig } from "@/config/site";
import { sanitizeInput } from "@/lib/security";
import { deduplicateSources } from "@/modules/movie/utils/sourceDeduplicator";
import { Singleflight } from "@/lib/singleflight";
import { getMultilingualSearchKeywords } from "@/modules/movie/utils/localizeMovie";

// 响应结构定义
interface ResolveResponsePayload {
  success: boolean;
  sources: PlaySource[];
  data: { sources: PlaySource[] };
  count: number;
  matchedTitle: string;
}

// 内存 LRU / TTL 缓存：20 分钟有效期，大幅减轻上游 CMS 资源站并发压力
const resolveCache = new Map<string, { payload: ResolveResponsePayload; expireAt: number }>();

// Singleflight 单飞防抖器：抑制高频刷量，相同请求在同一时间仅向底层执行一次真实聚合
const resolveFlight = new Singleflight<ResolveResponsePayload>();

// 数字归一化映射
const CN_NUM_MAP: Record<string, string> = {
  "一": "1", "二": "2", "两": "2", "三": "3", "四": "4",
  "五": "5", "六": "6", "七": "7", "八": "8", "九": "9", "十": "10",
  "零": "0", "0": "0", "1": "1", "2": "2", "3": "3", "4": "4",
  "5": "5", "6": "6", "7": "7", "8": "8", "9": "9"
};

const ROMAN_NUM_MAP: Record<string, string> = {
  "I": "1", "II": "2", "III": "3", "IV": "4", "V": "5",
  "VI": "6", "VII": "7", "VIII": "8", "IX": "9", "X": "10"
};

/**
 * 提取用于采集站 API 检索的干净核心关键词
 * （移除括号、标点、4K、清晰度等干扰词，保证 MacCMS API 模糊搜索能命中）
 */
function cleanTitleForSearch(raw: string): string {
  if (!raw) return "";
  let s = raw.trim();
  // 1. 移除各类括号及其内部修饰词，如 【...】、[...]、（...）、(...)
  s = s.replace(/【[^】]*】/g, "")
       .replace(/\[[^\]]*\]/g, "")
       .replace(/\([^\)]*\)/g, "")
       .replace(/（[^）]*）/g, "");

  // 2. 移除常见清晰度与修饰词
  s = s.replace(/(?:4k|1080p|720p|hd|tc|ts|bluray|remux|web-dl|h264|h265|x264|x265)/gi, "");
  s = s.replace(/(?:国粤双语|国语版|粤语版|国语中字|中文字幕|双语字幕|抢先版|未删减版|加长版|完整版|全集|更新中|正片)/gi, "");

  // 3. 移除非文字/数字的符号与空格
  s = s.replace(/[\s\-_:：·,，。！？!?、\/\\|#@~`^&*]/g, " ").trim();

  return s || raw.trim();
}

/**
 * 规范化片名用于严格比对（去除年份、修饰词、统一季部数字编号）
 */
function cleanTitleForMatch(raw: string): string {
  if (!raw) return "";
  let s = raw.trim();

  // 1. 去除括号及其修饰文本：【4K】、(2024)、[国语] 等
  s = s.replace(/【[^】]*】/g, "")
       .replace(/\[[^\]]*\]/g, "")
       .replace(/\([^\)]*\)/g, "")
       .replace(/（[^）]*）/g, "");

  // 2. 移除版本/清晰度/格式黑话与非正片标记
  s = s.replace(/(?:4k|1080p|720p|hd|tc|ts|bluray|remux|web-dl|h264|h265|x264|x265)/gi, "");
  s = s.replace(/(?:国粤双语|国语版|粤语版|国语中字|中文字幕|双语字幕|抢先版|未删减版|加长版|完整版|正片|电影解说|预告片|预告|花絮|重置版|修复版|全集|完结|更新至[0-9]+集|第[0-9]+集)/gi, "");

  // 3. 规范化季/部表达：第2部 / 第二季 / 第2季 / 第二部 -> 2
  s = s.replace(/第([一二三四五六七八九十0-9]+)[季部]/g, (_, num) => {
    return CN_NUM_MAP[num] || num;
  });

  // 规范化罗马数字
  s = s.replace(/\b(I{1,3}|IV|V|VI{1,3}|IX|X)\b/gi, (m) => {
    return ROMAN_NUM_MAP[m.toUpperCase()] || m;
  });

  // 4. 移除年份后缀（如 2024, 2023）
  s = s.replace(/(?:19\d\d|20\d\d)$/, "");

  // 5. 移除非文字/数字的符号与空格
  s = s.toLowerCase().replace(/[\s\-_:：·,.，。！？!?、\/\\|#@~`^&*()（）\[\]【】"']/g, "");

  return s;
}

/**
 * 严苛影片匹配校验器：杜绝跨续集、跨同词不同片误匹配
 */
function isExactMovieMatch(targetTitle: string, candidateTitle: string): boolean {
  if (!targetTitle || !candidateTitle) return false;

  // 1. 严厉排查纯解说、预告片与花絮（杜绝将电影解说当成正片播放）
  const isTargetTrailerOrRecap = /(?:解说|预告|花絮|特辑|片段)/i.test(targetTitle);
  const isCandTrailerOrRecap = /(?:解说|预告|花絮|特辑|片段)/i.test(candidateTitle);
  if (!isTargetTrailerOrRecap && isCandTrailerOrRecap) {
    return false;
  }

  const cleanTarget = cleanTitleForMatch(targetTitle);
  const cleanCand = cleanTitleForMatch(candidateTitle);

  // 2. 严格排查续集/季号冲突（如 "沙丘" vs "沙丘2", "庆余年" vs "庆余年2"）
  const targetNumbers = cleanTarget.match(/\d+/g) || [];
  const candNumbers = cleanCand.match(/\d+/g) || [];
  if (targetNumbers.join(",") !== candNumbers.join(",")) {
    return false;
  }

  // 3. 完全一致
  if (cleanTarget === cleanCand) return true;

  // 4. 忽略年份后一致（例如一方带 2024 一方未带）
  const stripYearTarget = cleanTarget.replace(/(?:19\d\d|20\d\d)/g, "");
  const stripYearCand = cleanCand.replace(/(?:19\d\d|20\d\d)/g, "");
  if (stripYearTarget.length >= 2 && stripYearTarget === stripYearCand) {
    return true;
  }

  return false;
}

// GET /api/movies/resolve?title=xxx&id=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = sanitizeInput(searchParams.get("title"), 100);
  const id = sanitizeInput(searchParams.get("id"), 100);

  if (!title && !id) {
    return NextResponse.json({ success: false, error: "title or id is required" }, { status: 400 });
  }

  const rawKey = title || id || "";
  const cleanSearchKey = cleanTitleForSearch(rawKey);
  const cacheKey = `resolve:${id || ""}:${cleanSearchKey}`;

  // 1. 优先命中内存缓存 (0ms 极速响应，秒开且彻底消除上游并发压力)
  const now = Date.now();
  const cachedHit = resolveCache.get(cacheKey);
  if (cachedHit && now < cachedHit.expireAt) {
    return NextResponse.json(cachedHit.payload);
  }

  // 2. 借助 Singleflight 执行底层聚合，多并发仅执行 1 次真实查询
  try {
    const payload = await resolveFlight.do(cacheKey, async () => {
      // 内部双重校验
      const c2 = resolveCache.get(cacheKey);
      if (c2 && Date.now() < c2.expireAt) {
        return c2.payload;
      }

      let resolvedSources: PlaySource[] = [];
      let targetTitle = title || "";

      // 1. 如果是已知直连采集站ID格式 (cms_siteId_vodId)，先提取该站点的一手直出线路
      if (id && id.startsWith("cms_")) {
        const parts = id.split("_");
        if (parts.length >= 3) {
          const siteId = parts[1];
          const vodId = parts.slice(2).join("_");
          const cmsDetail = await resourceSiteService.getDetailFromSite(siteId, vodId);
          if (cmsDetail && cmsDetail.sources && cmsDetail.sources.length > 0) {
            resolvedSources.push(...cmsDetail.sources);
            if (!targetTitle && cmsDetail.title) {
              targetTitle = cmsDetail.title;
            }
          }
        }
      }

      // 2. 跨全网所有已启用资源站发起并发全量检索 (全网、茅台、如意、暴风、非凡、魔都、红牛等全部聚合)
      const currentRawKey = targetTitle || title || "";
      const searchKeywords = getMultilingualSearchKeywords(currentRawKey);

      for (const rawKw of searchKeywords) {
        const currentCleanKey = cleanTitleForSearch(rawKw);
        if (!currentCleanKey) continue;

        try {
          const results = await resourceSiteService.searchAcrossSites(currentCleanKey, siteConfig.collector.searchLimit);

          // 分流出严格精确匹配的影片项
          const exactMatches: MovieItem[] = [];

          for (const item of results) {
            if (isExactMovieMatch(rawKw, item.title) || isExactMovieMatch(currentRawKey, item.title)) {
              exactMatches.push(item);
            }
          }

          let matchedItems: MovieItem[] = [];

          if (exactMatches.length > 0) {
            // 绝对优先且仅采用精确匹配结果，绝不掺杂任何部分匹配的不相关影片！
            matchedItems = exactMatches;
          } else {
            // 仅当 0 个完全精确匹配时，进行极高置信度前缀兜底（严格保证集数/季数序号完全相同且无多余故事词）
            const fallbackCandidates = results.filter((item) => {
              const cTarget = cleanTitleForMatch(rawKw);
              const cCand = cleanTitleForMatch(item.title);
              const tNums = (cTarget.match(/\d+/g) || []).join(",");
              const cNums = (cCand.match(/\d+/g) || []).join(",");
              if (tNums !== cNums) return false;

              // 仅允许极细微后缀差异（如 "版"、"真人版"、"正片"），长度差不得超过 3 个字符
              if (cCand.startsWith(cTarget) || cTarget.startsWith(cCand)) {
                return Math.abs(cCand.length - cTarget.length) <= 3;
              }
              return false;
            });
            matchedItems = fallbackCandidates;
          }

          if (matchedItems.length > 0) {
            for (const item of matchedItems) {
              if (item.sources && item.sources.length > 0) {
                resolvedSources.push(...item.sources);
              }
            }
            // 找到了匹配资源，停止遍历后续备用关键词
            break;
          }
        } catch (err) {
          console.warn("[resolve] search query failed for kw:", rawKw, err);
        }
      }

      if (resolvedSources.length > 0) {
        try {
          // 执行专业级智能去重：同一个资源站严格只保留 1 条最佳 m3u8 直链线路，彻底剔除冗余云播/iframe
          resolvedSources = deduplicateSources(resolvedSources);

          // 优先展示原生直接支持播放的 m3u8/mp4 极速直链，保障立即起播
          const preferredPlatforms = ["极速", "魔都", "ikun", "iKun", "百度云"];
          resolvedSources.sort((a, b) => {
            const aUrl = a.episodes[0]?.url || "";
            const bUrl = b.episodes[0]?.url || "";
            const aIsDirect = aUrl.includes(".m3u8") || aUrl.includes(".mp4");
            const bIsDirect = bUrl.includes(".m3u8") || bUrl.includes(".mp4");
            if (aIsDirect && !bIsDirect) return -1;
            if (!aIsDirect && bIsDirect) return 1;

            // 优先将已知高稳定高可用的线路排在最前面
            const aPref = preferredPlatforms.findIndex((p) => a.name.toLowerCase().includes(p.toLowerCase()));
            const bPref = preferredPlatforms.findIndex((p) => b.name.toLowerCase().includes(p.toLowerCase()));
            if (aPref !== -1 && bPref === -1) return -1;
            if (aPref === -1 && bPref !== -1) return 1;
            if (aPref !== -1 && bPref !== -1) return aPref - bPref;

            return 0;
          });
        } catch (err) {
          console.error("Resolve sources error:", err);
        }
      }

      // 3. 只有当全网完全搜不到任何线路时才注入兜底备用线
      if (resolvedSources.length === 0) {
        resolvedSources.push({
          id: "src-fallback",
          name: "全网云播预检线 (演示)",
          episodes: [
            {
              id: "ep-1",
              name: "高清预检正片",
              url: siteConfig.fallbackPlayUrl,
            },
          ],
        });
      }

      const finalPayload: ResolveResponsePayload = {
        success: true,
        sources: resolvedSources,
        data: {
          sources: resolvedSources,
        },
        count: resolvedSources.length,
        matchedTitle: targetTitle,
      };

      // 写入内存缓存：若有有效直出线路缓存 20 分钟；若全网暂无线路缓存 60 秒（防缓存穿透）
      const hasRealSources = resolvedSources.some((s) => s.id !== "src-fallback");
      const ttl = hasRealSources ? 20 * 60 * 1000 : 60 * 1000;

      if (resolveCache.size > 1000) {
        const keys = Array.from(resolveCache.keys());
        for (let i = 0; i < 200; i++) resolveCache.delete(keys[i]);
      }
      resolveCache.set(cacheKey, { payload: finalPayload, expireAt: Date.now() + ttl });

      return finalPayload;
    });

    return NextResponse.json(payload);
  } catch (err) {
    console.error("Resolve route error:", err);
    return NextResponse.json(
      { success: false, error: "Internal resolution error", sources: [] },
      { status: 500 }
    );
  }
}
