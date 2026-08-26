import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "tins_desk";
const SESSION_HOURS = 12;

/**
 * The signing key. Rotating ADMIN_PASSWORD invalidates every existing session,
 * which is exactly what you want after changing it.
 */
function secret() {
  const base = process.env.AUTH_SECRET || process.env.IP_SALT || "";
  return `${base}:${process.env.ADMIN_PASSWORD ?? ""}`;
}

function sign(payload) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Compares two strings without leaking how much of them matched. */
function equal(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function credentialsConfigured() {
  return Boolean(process.env.ADMIN_USER && process.env.ADMIN_PASSWORD);
}

export function checkCredentials(user, password) {
  if (!credentialsConfigured()) return false;
  // Both are compared so a wrong username costs the same time as a wrong password.
  const userOk = equal(user ?? "", process.env.ADMIN_USER);
  const passOk = equal(password ?? "", process.env.ADMIN_PASSWORD);
  return userOk && passOk;
}

export function issueToken() {
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  const payload = Buffer.from(JSON.stringify({ u: process.env.ADMIN_USER, e: expires })).toString(
    "base64url"
  );
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token) {
  if (!token || !credentialsConfigured()) return false;
  const [payload, signature] = String(token).split(".");
  if (!payload || !signature) return false;
  if (!equal(signature, sign(payload))) return false;
  try {
    const { u, e } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return u === process.env.ADMIN_USER && typeof e === "number" && e > Date.now();
  } catch {
    return false;
  }
}

export async function isSignedIn() {
  const jar = await cookies();
  return verifyToken(jar.get(SESSION_COOKIE)?.value);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_HOURS * 3600,
};
