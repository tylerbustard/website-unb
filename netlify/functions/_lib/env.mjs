import { serviceUnavailable } from "./errors.mjs";

export function readEnv(name) {
  const netlifyValue = globalThis.Netlify?.env?.get?.(name);
  if (typeof netlifyValue === "string" && netlifyValue.length > 0) return netlifyValue;
  const processValue = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return typeof processValue === "string" && processValue.length > 0 ? processValue : undefined;
}

export function requireEnv(name) {
  const value = readEnv(name);
  if (!value) throw serviceUnavailable();
  return value;
}
