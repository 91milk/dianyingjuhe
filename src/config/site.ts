/**
 * 站点全局通用配置
 * 遵循“能不写死尽量不写死”原则，所有配置均提供合理默认值，并全面支持通过环境变量灵活自定义
 */

const getEnvNumber = (key: string, defaultVal: number): number => {
  const val = process.env[key];
  if (!val) return defaultVal;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? defaultVal : parsed;
};

const getEnvBool = (key: string, defaultVal: boolean): boolean => {
  const val = process.env[key];
  if (val === undefined || val === "") return defaultVal;
  return val === "true" || val === "1";
};

// 默认高权重影视 SEO 关键词（纯自然用户搜索词，杜绝技术术语）
const DEFAULT_KEYWORDS = [
  "流量君 AI",
  "流量君",
  "流量君影视",
  "智能找片",
  "影视聚合",
  "在线电影",
  "热播电视剧",
  "微短剧爽剧",
  "国漫新番",
  "高清电影免费看",
  "以图搜片",
  "AI找片",
  "全网影视",
  "极速影院",
];

const parsedKeywords = process.env.NEXT_PUBLIC_SITE_KEYWORDS
  ? process.env.NEXT_PUBLIC_SITE_KEYWORDS.split(",").map((k) => k.trim()).filter(Boolean)
  : DEFAULT_KEYWORDS;

export const siteConfig = {
  // 基础标识信息
  name: process.env.NEXT_PUBLIC_SITE_NAME || "流量君 AI",
  shortName: process.env.NEXT_PUBLIC_SITE_SHORT_NAME || "流量君",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "流量君 AI - 新一代智能影视助手，支持 AI 模糊找片、情绪找片、以图识片与全网超清极速播放",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3300",
  themeColor: process.env.NEXT_PUBLIC_THEME_COLOR || "#ffcf32",
  author: process.env.NEXT_PUBLIC_SITE_AUTHOR || "LiuLiangJun AI Team",
  keywords: parsedKeywords,

  // 兜底与默认资源配置
  fallbackPlayUrl:
    process.env.FALLBACK_PLAY_URL ||
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  defaultPoster:
    process.env.DEFAULT_POSTER_URL ||
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",

  // 采集与请求性能控制参数
  collector: {
    timeoutMs: getEnvNumber("COLLECTOR_TIMEOUT_MS", 6000),
    searchLimit: getEnvNumber("COLLECTOR_SEARCH_LIMIT", 25),
    detailTimeoutMs: getEnvNumber("COLLECTOR_DETAIL_TIMEOUT_MS", 6000),
    syncHours: getEnvNumber("COLLECTOR_SYNC_HOURS", 24),
    imageProxyMaxBytes: getEnvNumber("IMAGE_PROXY_MAX_BYTES", 8 * 1024 * 1024), // 8MB
    imageProxyCacheSeconds: getEnvNumber("IMAGE_PROXY_CACHE_SECONDS", 86400 * 7), // 7 天
  },

  // 导航项定义
  navItems: [
    { title: "首页", href: "/" },
    { title: "电影", href: "/category?type=movie" },
    { title: "电视剧", href: "/category?type=tv" },
    { title: "热播短剧", href: "/category?type=shortplay" },
    { title: "动漫", href: "/category?type=anime" },
    { title: "综艺", href: "/category?type=variety" },
  ],

  // 功能模块开关
  modules: {
    enableAiChat: getEnvBool("NEXT_PUBLIC_ENABLE_AI_CHAT", true),          // 启用 AI 对话找片
    enableVisionSearch: getEnvBool("NEXT_PUBLIC_ENABLE_VISION_SEARCH", true), // 启用以图搜片
    enableHistory: getEnvBool("NEXT_PUBLIC_ENABLE_HISTORY", true),           // 启用播放历史记录
    enableShortPlay: getEnvBool("NEXT_PUBLIC_ENABLE_SHORT_PLAY", true),       // 启用微短剧专区
    enableMultiSource: getEnvBool("NEXT_PUBLIC_ENABLE_MULTI_SOURCE", true),   // 启用多线路极速播放
  },
};

export type SiteConfig = typeof siteConfig;
