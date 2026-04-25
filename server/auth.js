import crypto from "node:crypto";

const TOKEN_VERSION = 1;

function getSessionSecret() {
  // Stateless token secret. In serverless (Vercel) memory is not stable, so we
  // cannot rely on in-memory session maps without random logouts.
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "nyx";
}

function b64urlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(String(input), "utf8");
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function b64urlDecodeToString(input) {
  const s = String(input || "");
  if (!s) return "";
  const padLen = (4 - (s.length % 4)) % 4;
  const padded = s.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat(padLen);
  return Buffer.from(padded, "base64").toString("utf8");
}

function sign(payloadB64) {
  return crypto.createHmac("sha256", getSessionSecret()).update(payloadB64).digest("hex");
}

export function createSession() {
  // No expiry by design: user requested to remove "oturum süresi" behavior.
  // The token remains valid as long as ADMIN_PASSWORD/ADMIN_SESSION_SECRET doesn't change.
  const payload = JSON.stringify({ v: TOKEN_VERSION, iat: Date.now() });
  const payloadB64 = b64urlEncode(payload);
  const sig = sign(payloadB64);
  return `${payloadB64}.${sig}`;
}

export function isValidSession(token) {
  if (!token || typeof token !== "string") return false;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return false;
  const expected = sign(payloadB64);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return false;
  } catch {
    return false;
  }
  const payloadRaw = b64urlDecodeToString(payloadB64);
  try {
    const data = JSON.parse(payloadRaw);
    return data && data.v === TOKEN_VERSION;
  } catch {
    return false;
  }
}

export function revokeSession(_token) {
  // Stateless tokens can't be revoked individually without a store.
  // To "log out everywhere", rotate ADMIN_PASSWORD or ADMIN_SESSION_SECRET.
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "uzay1283.nyx";
}
