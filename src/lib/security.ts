/**
 * 懂片AI - 全局安全防护与漏洞防御工具库
 * 包含 SSRF 防护、开放重定向检测、防时序攻击、输入清洗与危险协议拦截
 */

// 危险/保留 IPv4 私有网段与本地环回正则
const PRIVATE_IPV4_REGEX = /^(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|127\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|169\.254\.\d{1,3}\.\d{1,3}|0\.0\.0\.0)$/;

// 常见危险的主机名（内网或云元数据）
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "[::1]",
  "instance-data",
  "metadata.google.internal",
  "169.254.169.254",
]);

// 允许请求的安全端口（防止端口扫描内部服务如 22, 3306, 6379, 27017）
const ALLOWED_PORTS = new Set(["", "80", "443", "8080", "8443"]);

/**
 * 深度 SSRF 检查：判断目标 URL 是否为合法的公网 Web 资源
 * 严格禁止非 HTTP/HTTPS 协议、禁止内网 IP、私有网段、云元数据及敏感端口
 */
export function isSafeExternalUrl(rawUrl: string): { safe: boolean; reason?: string } {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { safe: false, reason: "URL 为空或格式无效" };
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length > 2048) {
    return { safe: false, reason: "URL 长度超出安全限制" };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { safe: false, reason: "URL 无法正常解析" };
  }

  // 1. 严格限制仅支持 http 与 https 协议 (杜绝 file://, ftp://, gopher:// 等)
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { safe: false, reason: "仅允许 HTTP/HTTPS 协议" };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 2. 检查黑名单主机
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { safe: false, reason: "禁止访问内网或保留主机名" };
  }

  // 3. 检查常见内网私有网段与环回地址
  if (PRIVATE_IPV4_REGEX.test(hostname)) {
    return { safe: false, reason: "禁止请求内网/局域网私有 IP" };
  }

  // 4. IPv6 本地/私有检查
  if (hostname.startsWith("[") && hostname.endsWith("]")) {
    const ipv6 = hostname.slice(1, -1).toLowerCase();
    if (ipv6 === "::1" || ipv6.startsWith("fe80:") || ipv6.startsWith("fc00:") || ipv6.startsWith("fd00:")) {
      return { safe: false, reason: "禁止请求 IPv6 私有/本地网络" };
    }
  }

  // 5. 端口检查 (防止利用代理探测内网数据库、SSH 等服务)
  if (parsed.port && !ALLOWED_PORTS.has(parsed.port)) {
    return { safe: false, reason: `端口 ${parsed.port} 不在允许的安全列表中` };
  }

  return { safe: true };
}

/**
 * 校验是否为安全的内部重定向路径（防止 Open Redirect 开放重定向漏洞）
 * 只允许以特定相对路径（默认 /admin）开头，严禁包含协议头、双斜杠、反斜杠等
 */
export function isSafeInternalRedirect(target: string | null | undefined, prefix = "/admin"): boolean {
  if (!target || typeof target !== "string") return false;
  const trimmed = target.trim();

  // 必须以指定的安全前缀开头
  if (!trimmed.startsWith(prefix)) return false;

  // 严禁包含协议方案 (如 http://, javascript:)、双斜杠协议相对 (//evil.com) 或反斜杠 (\evil.com)
  if (
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\") ||
    trimmed.includes(":") ||
    trimmed.includes("\\")
  ) {
    return false;
  }

  return true;
}

/**
 * 恒定时间字符串比对（防时序攻击 Timing Attack）
 * 基于 Web Crypto API 与字符逐位 XOR 比较，避免长度与字符耗时泄露
 */
export function safeTimingEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;

  const enc = new TextEncoder();
  const aBuf = enc.encode(a);
  const bBuf = enc.encode(b);

  if (aBuf.byteLength !== bBuf.byteLength) {
    // 长度不等时仍做虚拟比对避免耗时差异
    let dummy = 0;
    for (let i = 0; i < aBuf.byteLength; i++) {
      dummy |= aBuf[i] ^ 0;
    }
    return false;
  }

  let result = 0;
  for (let i = 0; i < aBuf.byteLength; i++) {
    result |= aBuf[i] ^ bBuf[i];
  }

  return result === 0;
}

/**
 * 清洗并截断用户输入的检索或文本内容（防止超长 payload 导致 DoS）
 */
export function sanitizeInput(input: unknown, maxLength = 200): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}
