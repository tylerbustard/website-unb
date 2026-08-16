import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { serviceUnavailable } from "./errors.mjs";

export function decodeBase64url(value, minimumBytes = 0) {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]+$/u.test(value)) {
    throw serviceUnavailable();
  }
  const decoded = Buffer.from(value, "base64url");
  if (decoded.length < minimumBytes || decoded.toString("base64url") !== value.replace(/=+$/u, "")) {
    throw serviceUnavailable();
  }
  return decoded;
}

export function secretKey(value) {
  return decodeBase64url(value, 32);
}

export function sha256Hex(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function hmacBase64url(key, value) {
  return createHmac("sha256", key).update(value).digest("base64url");
}

export function constantTimeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}
