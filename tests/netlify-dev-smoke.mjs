import assert from "node:assert/strict";

const baseUrl = process.env.NETLIFY_DEV_BASE_URL ?? "http://127.0.0.1:8899";
const retiredCookie = "__Host-montreal_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict";
const retiredCsp = "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'";

async function request(pathname, options = {}) {
  return fetch(new URL(pathname, baseUrl), { redirect: "manual", ...options });
}

for (const pathname of ["/", "/resume"]) {
  const response = await request(pathname);
  assert.equal(response.status, 200, `${pathname} should remain public`);
  assert.match(response.headers.get("content-type") ?? "", /text\/html/u);
  assert.match(await response.text(), /Tyler Bustard/u);
}

const publicAsset = await request("/Tyler-Bustard-Resume.pdf");
assert.equal(publicAsset.status, 200);
assert.match(publicAsset.headers.get("content-type") ?? "", /application\/pdf/u);

const retiredGetPaths = [
  "/.well-known/tyler-private-release.json",
  "/private.html",
  "/private.html/child",
  "/sign-in",
  "/sign-in/return",
  "/living",
  "/living/montreal",
  "/living/toronto",
  "/dashboard/montreal",
  "/dashboard/montreal/child",
  "/api/private",
  "/api/private/session",
  "/api/private/montreal/listings",
  "/api/private/montreal/outreach/pending",
  "/api/private/toronto/reference",
  "/api/private/unknown",
  "/.netlify/functions",
  "/.netlify/functions/montreal-move",
  "/.netlify/functions/montreal-move-decision",
  "/.netlify/functions/montreal-move-decision-clear",
  "/.netlify/functions/unknown",
];
for (const pathname of retiredGetPaths) {
  const response = await request(pathname);
  assert.equal(response.status, 404, `${pathname} must be retired`);
  assert.equal(response.headers.get("location"), null);
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(response.headers.get("content-security-policy"), retiredCsp);
  assert.equal(response.headers.get("set-cookie"), retiredCookie);
  assert.equal(await response.text(), "Not found\n");
}

const machineRequests = [
  ["/api/private/montreal/move", { method: "GET" }],
  ["/api/private/montreal/move", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Montreal-Ledger-Version": "a".repeat(64) },
    body: "{}",
  }],
  ["/api/private/montreal/move-decision", { method: "GET" }],
  ["/api/private/montreal/move-decision/clear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      decisions: [{
        propertyId: "synthetic-property",
        action: "deny",
        basisStatus: "new-candidate",
        decidedAt: "2026-08-16T12:00:00.000Z",
      }],
    }),
  }],
];
for (const [pathname, options] of machineRequests) {
  const response = await request(pathname, options);
  assert.equal(response.status, 401, `${options.method} ${pathname} must reach HMAC authentication`);
  assert.equal(response.headers.get("location"), null);
  assert.equal(response.headers.get("set-cookie"), null);
  assert.match(response.headers.get("content-type") ?? "", /application\/json/u);
}

const allowedMethods = new Map([
  ["/api/private/montreal/move", new Set(["GET", "POST"])],
  ["/api/private/montreal/move-decision", new Set(["GET"])],
  ["/api/private/montreal/move-decision/clear", new Set(["POST"])],
]);
for (const [pathname, methods] of allowedMethods) {
  for (const method of ["GET", "POST", "HEAD", "OPTIONS", "PUT", "PATCH", "DELETE"]) {
    if (methods.has(method)) continue;
    const response = await request(pathname, { method });
    assert.equal(response.status, 404, `${method} ${pathname} must fail closed at the edge`);
    assert.equal(response.headers.get("location"), null);
    assert.equal(response.headers.get("content-security-policy"), retiredCsp);
    assert.equal(response.headers.get("set-cookie"), retiredCookie);
    if (method !== "HEAD") assert.equal(await response.text(), "Not found\n");
  }
}

const removedChunk = await request("/assets/private-ctnlsmw_.js");
assert.ok([200, 404].includes(removedChunk.status));
assert.equal(removedChunk.headers.get("location"), null);
assert.doesNotMatch(removedChunk.headers.get("content-type") ?? "", /(?:java|ecma)script/u);
assert.doesNotMatch(
  await removedChunk.text(),
  /\/api\/private|\/living(?:[/?#"']|$)|__Host-montreal_session|PrivateApp|tyler-private-release/u,
);

process.stdout.write("Netlify Dev smoke passed: public pages/assets, retired surfaces, machine authentication, method matrix, aliases, and removed-chunk content are correct.\n");
