import { MACHINE_CLOCK_SKEW_SECONDS } from "./constants.mjs";
import { constantTimeEqual, hmacBase64url, secretKey, sha256Hex } from "./crypto.mjs";
import { requireEnv } from "./env.mjs";
import { unauthorized } from "./errors.mjs";
import { storageInternals } from "./storage.mjs";

function automationKey() {
  return secretKey(requireEnv("MONTREAL_AUTOMATION_HMAC_SECRET"));
}

export function canonicalMachineRequest(method, publicPathname, timestamp, nonce, rawBody, precondition = "") {
  const bodyDigest = sha256Hex(rawBody);
  const preconditionLine = precondition ? `\n${precondition}` : "";
  return `${method.toUpperCase()}\n${publicPathname}\n${timestamp}\n${nonce}\n${bodyDigest}${preconditionLine}`;
}

export function signMachineRequest({ method, publicPathname, timestamp, nonce, rawBody, key, precondition = "" }) {
  return `v1=${hmacBase64url(
    key,
    canonicalMachineRequest(method, publicPathname, timestamp, nonce, rawBody, precondition),
  )}`;
}

export async function requireMachineSignature(request, store, options) {
  let requestPathname;
  try {
    requestPathname = new URL(request.url).pathname;
  } catch {
    throw unauthorized();
  }
  if (requestPathname !== options.publicPathname) throw unauthorized();

  const timestampHeader = request.headers.get("x-montreal-timestamp") ?? "";
  const nonce = request.headers.get("x-montreal-nonce") ?? "";
  const signature = request.headers.get("x-montreal-signature") ?? "";
  if (!/^\d{10}$/u.test(timestampHeader) || !/^[A-Za-z0-9._:-]{16,128}$/u.test(nonce)) {
    throw unauthorized();
  }

  const timestamp = Number(timestampHeader);
  const now = options.now ?? Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(timestamp) || Math.abs(now - timestamp) > MACHINE_CLOCK_SKEW_SECONDS) {
    throw unauthorized();
  }
  if (!/^v1=[A-Za-z0-9_-]{43}$/u.test(signature)) throw unauthorized();

  const rawBody = options.rawBody ?? new Uint8Array();
  const expected = signMachineRequest({
    method: request.method,
    publicPathname: options.publicPathname,
    timestamp: timestampHeader,
    nonce,
    rawBody,
    key: options.key ?? automationKey(),
    precondition: options.precondition ?? "",
  });
  if (!constantTimeEqual(expected, signature)) throw unauthorized();

  const replayKey = `machine-replay/${new Date(timestamp * 1000).toISOString().slice(0, 10)}/${sha256Hex(`${timestampHeader}:${nonce}`)}`;
  const replayClaim = await storageInternals.setJson(
    store,
    replayKey,
    {
      version: 1,
      timestamp,
      requestDigest: sha256Hex(expected),
      recordedAt: new Date(now * 1000).toISOString(),
    },
    { onlyIfNew: true },
  );
  if (!replayClaim.modified) throw unauthorized();
}
