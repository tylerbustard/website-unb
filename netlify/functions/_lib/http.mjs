import { badRequest } from "./errors.mjs";

export async function readJson(request, maxBytes) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw badRequest("Content-Type must be application/json");
  }
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw badRequest("Request body is too large");
  }
  const raw = new Uint8Array(await request.arrayBuffer());
  if (raw.byteLength === 0 || raw.byteLength > maxBytes) {
    throw badRequest(raw.byteLength === 0 ? "Request body is required" : "Request body is too large");
  }
  try {
    return { value: JSON.parse(new TextDecoder().decode(raw)), raw };
  } catch {
    throw badRequest("Request body must be valid JSON");
  }
}

export function methodNotAllowed(allowed) {
  return new Response(null, {
    status: 405,
    headers: {
      Allow: allowed.join(", "),
      "Cache-Control": "private, no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}
