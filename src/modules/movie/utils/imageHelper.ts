/**
 * 智能优化图片地址，解决豆瓣防盗链、HTTP混合内容阻断等问题，确保海报 100% 稳定清晰秒出
 */
export function getOptimizedImageUrl(rawUrl?: string): string {
  if (!rawUrl) {
    return "/api/img?fallback=1";
  }

  // 本地相对路径或内置 data: 图片直接返回
  if (rawUrl.startsWith("/") || rawUrl.startsWith("data:")) {
    return rawUrl;
  }

  // 1. 针对 HTTP 明文图片 (混合内容在 HTTPS 下被浏览器安全拦截)
  // 2. 针对常见有防盗链限制的平台 (豆瓣、B站、微博、腾讯、优酷、爱奇艺)
  if (
    rawUrl.startsWith("http://") ||
    rawUrl.includes("doubanio.com") ||
    rawUrl.includes("douban.com") ||
    rawUrl.includes("sinaimg.cn") ||
    rawUrl.includes("qpic.cn") ||
    rawUrl.includes("ykimg.com") ||
    rawUrl.includes("iqiyipic.com") ||
    rawUrl.includes("hitv.com") ||
    rawUrl.includes("hdslb.com")
  ) {
    return `/api/img?url=${encodeURIComponent(rawUrl)}`;
  }

  return rawUrl;
}
