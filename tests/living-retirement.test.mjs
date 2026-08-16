import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import retireLiving, { config } from "../netlify/edge-functions/living-retirement.js";

const retiredPagePaths = [
  "/.well-known/tyler-private-release.json",
  "/private.html",
  "/private.html/child",
  "/sign-in",
  "/sign-in/return",
  "/living",
  "/living/montreal",
  "/living/toronto",
  "/dashboard/montreal",
  "/dashboard/montreal/example",
  "/.netlify/functions",
  "/.netlify/functions/montreal-move",
  "/.netlify/functions/montreal-move-decision",
  "/.netlify/functions/montreal-move-decision-clear",
  "/.netlify/functions/unknown",
];

const retiredApiPaths = [
  "/api/private",
  "/api/private/session",
  "/api/private/montreal/listings",
  "/api/private/montreal/import",
  "/api/private/montreal/media/example/image",
  "/api/private/montreal/move-media/upload",
  "/api/private/montreal/route",
  "/api/private/montreal/outreach/pending",
  "/api/private/montreal/outreach-requests",
  "/api/private/toronto/reference",
  "/api/private/unknown",
  "/api/private/montreal/move/",
  "/api/private/montreal/move-extra",
];

const machinePaths = [
  "/api/private/montreal/move",
  "/api/private/montreal/move-decision",
  "/api/private/montreal/move-decision/clear",
];

async function invoke(pathname, method = "GET") {
  let nextCalls = 0;
  const response = await retireLiving(
    new Request(`https://tylerbustard.ca${pathname}`, { method }),
    {
      next: () => {
        nextCalls += 1;
        return new Response("continued", { status: 202 });
      },
    },
  );
  return { response, nextCalls };
}

for (const pathname of [...retiredPagePaths, ...retiredApiPaths]) {
  test(`retirement edge returns 404 for ${pathname}`, async () => {
    const { response, nextCalls } = await invoke(pathname);
    assert.equal(nextCalls, 0);
    assert.equal(response.status, 404);
    assert.equal(await response.text(), "Not found\n");
    assert.equal(response.headers.get("location"), null);
    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(
      response.headers.get("content-security-policy"),
      "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'",
    );
    assert.equal(response.headers.get("cache-control"), "no-store, max-age=0");
    assert.equal(
      response.headers.get("set-cookie"),
      "__Host-montreal_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict",
    );
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive, nosnippet, noimageindex");
  });
}

const machineMethods = new Map([
  ["/api/private/montreal/move", ["GET", "POST"]],
  ["/api/private/montreal/move-decision", ["GET"]],
  ["/api/private/montreal/move-decision/clear", ["POST"]],
]);

for (const [pathname, methods] of machineMethods) {
  for (const method of methods) test(`retirement edge continues only ${method} ${pathname}`, async () => {
    const { response, nextCalls } = await invoke(`${pathname}?probe=1`, method);
    assert.equal(nextCalls, 1);
    assert.equal(response.status, 202);
    assert.equal(response.headers.get("set-cookie"), null);
  });
}

for (const pathname of machinePaths) {
  for (const method of ["GET", "POST", "HEAD", "OPTIONS", "PUT", "PATCH", "DELETE"]) {
    if (machineMethods.get(pathname).includes(method)) continue;
    test(`retirement edge rejects ${method} ${pathname}`, async () => {
      const { response, nextCalls } = await invoke(pathname, method);
      assert.equal(nextCalls, 0);
      assert.equal(response.status, 404);
      assert.equal(response.headers.get("location"), null);
      assert.equal(response.headers.get("set-cookie"), "__Host-montreal_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict");
    });
  }
}

test("edge manifest declaration covers every retired surface and the private API wildcard", () => {
  assert.deepEqual(config.path, [
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
  ]);
});

test("static redirects preserve forced 404s before the public SPA fallback", async () => {
  const redirects = await readFile("client/public/_redirects", "utf8");
  const fallbackIndex = redirects.indexOf("/*                       /index.html 200");
  const assetFallbackIndex = redirects.indexOf("/assets/*                /404.html 404");
  assert.ok(fallbackIndex > 0);
  assert.ok(assetFallbackIndex > 0 && assetFallbackIndex < fallbackIndex);
  assert.doesNotMatch(redirects.slice(assetFallbackIndex, fallbackIndex), /\/assets\/\*\s+\/404\.html\s+404!/u);
  for (const retiredRoot of [
    "/.well-known/tyler-private-release.json",
    "/sign-in",
    "/living",
    "/private.html",
    "/dashboard/montreal",
    "/api/private/session",
  ]) {
    const index = redirects.indexOf(retiredRoot);
    assert.ok(index >= 0 && index < fallbackIndex, `${retiredRoot} must be retired before the SPA fallback`);
  }
});
