const RETIRED_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "Content-Type": "text/plain; charset=utf-8",
  "Content-Security-Policy": "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'",
  "Permissions-Policy": "accelerometer=(), browsing-topics=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "no-referrer",
  "Set-Cookie": "__Host-montreal_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
};

const MACHINE_METHODS = new Map([
  ["/api/private/montreal/move", new Set(["GET", "POST"])],
  ["/api/private/montreal/move-decision", new Set(["GET"])],
  ["/api/private/montreal/move-decision/clear", new Set(["POST"])],
]);

export default (request, context) => {
  let pathname;
  try {
    pathname = new URL(request.url).pathname;
  } catch {
    pathname = "";
  }

  if (MACHINE_METHODS.get(pathname)?.has(request.method)) return context.next();
  return new Response("Not found\n", {
    status: 404,
    headers: RETIRED_HEADERS,
  });
};

export const config = {
  path: [
    "/.well-known/tyler-private-release.json",
    "/private.html",
    "/private.html/*",
    "/sign-in",
    "/sign-in/*",
    "/living",
    "/living/*",
    "/dashboard/montreal",
    "/dashboard/montreal/*",
    "/.netlify/functions",
    "/.netlify/functions/*",
    "/api/private",
    "/api/private/*",
  ],
};
