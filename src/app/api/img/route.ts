import { NextRequest, NextResponse } from "next/server";
import { isSafeExternalUrl } from "@/lib/security";
import { siteConfig } from "@/config/site";

// 本地纯净矢量电影海报兜底，杜绝外链重定向网络延迟与失败
const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#09090b" />
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bg)"/>
  <circle cx="200" cy="260" r="46" fill="#ffcf32" fill-opacity="0.12" stroke="#ffcf32" stroke-width="2" stroke-opacity="0.4"/>
  <polygon points="192,242 218,260 192,278" fill="#ffcf32"/>
  <text x="200" y="348" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="18" font-weight="bold" fill="#f4f4f5" text-anchor="middle" letter-spacing="2">影视精选大片</text>
  <text x="200" y="378" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="12" fill="#a1a1aa" text-anchor="middle">高清原画 · 秒级起播</text>
</svg>`;

function getFallbackResponse(): NextResponse {
  return new NextResponse(FALLBACK_SVG, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl || searchParams.get("fallback") === "1") {
    return getFallbackResponse();
  }

  // 1. 深度 SSRF 防御校验：严禁访问内网 IP、私有网络、云元数据及危险协议
  const check = isSafeExternalUrl(targetUrl);
  if (!check.safe) {
    return getFallbackResponse();
  }

  const controller = new AbortController();
  const timeoutMs = Math.min(siteConfig.collector.timeoutMs || 4000, 3500);
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    };

    if (targetUrl.includes("doubanio.com") || targetUrl.includes("douban.com")) {
      headers["Referer"] = "https://movie.douban.com/";
    } else if (targetUrl.includes("hdslb.com") || targetUrl.includes("bilibili.com")) {
      headers["Referer"] = "https://www.bilibili.com/";
    } else if (targetUrl.includes("sinaimg.cn") || targetUrl.includes("weibo.com")) {
      headers["Referer"] = "https://weibo.com/";
    } else if (targetUrl.includes("qpic.cn") || targetUrl.includes("qq.com")) {
      headers["Referer"] = "https://v.qq.com/";
    } else if (targetUrl.includes("ykimg.com") || targetUrl.includes("youku.com")) {
      headers["Referer"] = "https://www.youku.com/";
    } else if (targetUrl.includes("iqiyipic.com") || targetUrl.includes("iqiyi.com")) {
      headers["Referer"] = "https://www.iqiyi.com/";
    }

    const response = await fetch(targetUrl, {
      headers,
      signal: controller.signal,
      next: { revalidate: siteConfig.collector.imageProxyCacheSeconds },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return getFallbackResponse();
    }

    // 2. 校验 MIME Content-Type，确保必须是合法的图片资源
    const contentType = response.headers.get("content-type") || "";
    if (contentType && !contentType.startsWith("image/") && !contentType.includes("octet-stream")) {
      return getFallbackResponse();
    }

    // 3. 校验 Content-Length，防止下载超大文件导致内存暴涨 DoS
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > siteConfig.collector.imageProxyMaxBytes) {
      return getFallbackResponse();
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > siteConfig.collector.imageProxyMaxBytes) {
      return getFallbackResponse();
    }

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType.startsWith("image/") ? contentType : "image/jpeg",
        "Cache-Control": `public, max-age=${siteConfig.collector.imageProxyCacheSeconds}, immutable`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    clearTimeout(timeoutId);
    return getFallbackResponse();
  }
}
