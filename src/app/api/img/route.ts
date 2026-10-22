import { NextRequest, NextResponse } from "next/server";
import { isSafeExternalUrl } from "@/lib/security";
import { siteConfig } from "@/config/site";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // 1. 深度 SSRF 防御校验：严禁访问内网 IP、私有网络、云元数据及危险协议
  const check = isSafeExternalUrl(targetUrl);
  if (!check.safe) {
    return NextResponse.redirect(siteConfig.defaultPoster, { status: 302 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), siteConfig.collector.timeoutMs);

  try {
    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    };

    if (targetUrl.includes("doubanio.com") || targetUrl.includes("douban.com")) {
      headers["Referer"] = "https://movie.douban.com/";
    }

    const response = await fetch(targetUrl, {
      headers,
      signal: controller.signal,
      next: { revalidate: siteConfig.collector.imageProxyCacheSeconds },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.redirect(siteConfig.defaultPoster);
    }

    // 2. 校验 MIME Content-Type，确保必须是合法的图片资源
    const contentType = response.headers.get("content-type") || "";
    if (contentType && !contentType.startsWith("image/") && !contentType.includes("octet-stream")) {
      return NextResponse.redirect(siteConfig.defaultPoster);
    }

    // 3. 校验 Content-Length，防止下载超大文件导致内存暴涨 DoS
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > siteConfig.collector.imageProxyMaxBytes) {
      return NextResponse.redirect(siteConfig.defaultPoster);
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > siteConfig.collector.imageProxyMaxBytes) {
      return NextResponse.redirect(siteConfig.defaultPoster);
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
    // 捕获所有网络异常，返回兜底图片，不向外部泄露内部报错细节与堆栈
    return NextResponse.redirect(siteConfig.defaultPoster);
  }
}
