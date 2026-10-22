// 懂片AI - 独立管理后台认证与权限验证服务
// 基于标准 Web Crypto API (HMAC-SHA256)，全面兼容 Edge Middleware 与 Node.js 运行时

import { safeTimingEqual } from "./security";

export const ADMIN_COOKIE_NAME = "dp_admin_session";

// 默认管理员账号和密码（可由环境变量覆盖）
export const getAdminConfig = () => {
  const expiryHours = process.env.ADMIN_SESSION_EXPIRY_HOURS
    ? parseInt(process.env.ADMIN_SESSION_EXPIRY_HOURS, 10) || 24 * 7
    : 24 * 7;

  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin888888",
    secret: process.env.ADMIN_SESSION_SECRET || "dongpian-ai-admin-secret-key-2026-safe-token-session",
    sessionExpiryHours: expiryHours, // 默认 7 天有效期，支持环境变量覆盖
  };
};

// 基础 Base64URL 编解码
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// 获取 Web Crypto HMAC 签名密钥
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface AdminTokenPayload {
  username: string;
  iat: number;
  exp: number;
  role: "superadmin" | "admin";
}

// 签发管理会话 Token
export async function createAdminToken(username: string): Promise<string> {
  const config = getAdminConfig();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + config.sessionExpiryHours * 3600;

  const header = { alg: "HS256", typ: "JWT" };
  const payload: AdminTokenPayload = {
    username,
    iat: now,
    exp,
    role: "superadmin",
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${headerEncoded}.${payloadEncoded}`;

  const key = await getCryptoKey(config.secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(dataToSign)
  );

  const signatureBytes = new Uint8Array(signatureBuffer);
  let signatureBinary = "";
  for (let i = 0; i < signatureBytes.byteLength; i++) {
    signatureBinary += String.fromCharCode(signatureBytes[i]);
  }
  const signatureEncoded = btoa(signatureBinary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${dataToSign}.${signatureEncoded}`;
}

// 验证管理会话 Token
export async function verifyAdminToken(
  token: string | undefined | null
): Promise<{ valid: boolean; payload?: AdminTokenPayload }> {
  if (!token) return { valid: false };

  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false };

  const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
  const config = getAdminConfig();

  try {
    const key = await getCryptoKey(config.secret);
    const dataToVerify = `${headerEncoded}.${payloadEncoded}`;

    // 解码签名
    let base64Sig = signatureEncoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64Sig.length % 4) {
      base64Sig += "=";
    }
    const sigBinary = atob(base64Sig);
    const sigBytes = new Uint8Array(sigBinary.length);
    for (let i = 0; i < sigBinary.length; i++) {
      sigBytes[i] = sigBinary.charCodeAt(i);
    }

    const isValidSig = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(dataToVerify)
    );

    if (!isValidSig) return { valid: false };

    // 检查负载与过期时间
    const payloadJson = base64UrlDecode(payloadEncoded);
    const payload: AdminTokenPayload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

// 检查用户名密码凭据（使用恒定时间比较，杜绝时序攻击）
export function checkAdminCredentials(username: string, password: string): boolean {
  const config = getAdminConfig();
  const userMatches = safeTimingEqual(username.trim(), config.username.trim());
  const passMatches = safeTimingEqual(password, config.password);
  return userMatches && passMatches;
}
