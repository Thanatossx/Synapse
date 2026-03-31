import crypto from "crypto";

const SESSION_MS = 24 * 60 * 60 * 1000;
const sessions = new Map();

export function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now());
  return token;
}

export function isValidSession(token) {
  if (!token || typeof token !== "string") return false;
  const t = sessions.get(token);
  if (t == null) return false;
  if (Date.now() - t > SESSION_MS) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function revokeSession(token) {
  sessions.delete(token);
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "snapchatratsynax40_!";
}
