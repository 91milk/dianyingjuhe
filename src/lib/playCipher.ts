/**
 * 播放地址 ID 安全编解码/加密工具
 * 将原始影片 ID (如 cms_jinying_12345 或 douban_1292052) 转换为不透明且防爬防窥探的加密字符串
 * 在浏览器 (Client) 与 Node.js (Server) 环境中均可 100% 稳定运行
 */

const XOR_KEY = process.env.PLAY_CIPHER_KEY || "DP_PLAY_CIPHER_2026_XKEY";

/**
 * 编码并加密 movieId
 * 例: "cms_jinying_12345" -> "Jz0sDyYoNyYqJzcXdGBsBgU"
 */
export function encodePlayId(rawId: string): string {
  if (!rawId) return "";
  try {
    if (typeof window === "undefined" && typeof Buffer !== "undefined") {
      const bytes = Buffer.from(rawId, "utf-8");
      const keyBytes = Buffer.from(XOR_KEY, "utf-8");
      const xorBytes = Buffer.alloc(bytes.length);
      for (let i = 0; i < bytes.length; i++) {
        xorBytes[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
      }
      return xorBytes.toString("base64url");
    }

    // 浏览器环境
    const bytes = new TextEncoder().encode(rawId);
    const keyBytes = new TextEncoder().encode(XOR_KEY);
    const xorBytes = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      xorBytes[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
    }

    let binary = "";
    for (let i = 0; i < xorBytes.length; i++) {
      binary += String.fromCharCode(xorBytes[i]);
    }
    const b64 = btoa(binary);
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return encodeURIComponent(rawId);
  }
}

/**
 * 解密并还原 movieId
 * 兼容未加密的旧 ID (如果传入的是原始明文 ID 或解密失败，自动安全兜底返回原值)
 */
export function decodePlayId(encodedId: string): string {
  if (!encodedId) return "";
  try {
    if (typeof window === "undefined" && typeof Buffer !== "undefined") {
      const xorBytes = Buffer.from(encodedId, "base64url");
      const keyBytes = Buffer.from(XOR_KEY, "utf-8");
      const origBytes = Buffer.alloc(xorBytes.length);
      for (let i = 0; i < xorBytes.length; i++) {
        origBytes[i] = xorBytes[i] ^ keyBytes[i % keyBytes.length];
      }
      const dec = origBytes.toString("utf-8");
      if (/^[\w\-\.:_]+$/.test(dec)) {
        return dec;
      }
      return encodedId;
    }

    // 浏览器环境
    let b64 = encodedId.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) {
      b64 += "=";
    }

    const binary = atob(b64);
    const xorBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      xorBytes[i] = binary.charCodeAt(i);
    }

    const keyBytes = new TextEncoder().encode(XOR_KEY);
    const origBytes = new Uint8Array(xorBytes.length);
    for (let i = 0; i < xorBytes.length; i++) {
      origBytes[i] = xorBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    const decoded = new TextDecoder().decode(origBytes);
    if (/^[\w\-\.:_]+$/.test(decoded)) {
      return decoded;
    }
    return encodedId;
  } catch {
    return encodedId;
  }
}
