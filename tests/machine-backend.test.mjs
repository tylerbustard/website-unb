import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getStore } from "@netlify/blobs";

import { LOCAL_STORE_NAME, PREVIEW_STORE_NAME, STORE_NAME } from "../netlify/functions/_lib/constants.mjs";
import { unauthorized } from "../netlify/functions/_lib/errors.mjs";
import { sha256Hex } from "../netlify/functions/_lib/crypto.mjs";
import {
  requireMachineSignature,
  signMachineRequest,
} from "../netlify/functions/_lib/machine-auth.mjs";
import {
  clearMoveDecisions,
  getMoveDecisions,
} from "../netlify/functions/_lib/move-decision-queue.mjs";
import {
  getMoveLedgerSnapshot,
  montrealStoreName,
  moveLedgerReplacementIssue,
  replaceMoveLedger,
  storageInternals,
} from "../netlify/functions/_lib/storage.mjs";
import {
  config as moveConfig,
  handleMontrealMoveRequest,
} from "../netlify/functions/montreal-move.mjs";
import {
  config as decisionConfig,
  handleMontrealMoveDecision,
} from "../netlify/functions/montreal-move-decision.mjs";
import {
  config as clearConfig,
  handleClearMontrealMoveDecisions,
} from "../netlify/functions/montreal-move-decision-clear.mjs";

const version = "a".repeat(64);

class MemoryStore {
  constructor() {
    this.values = new Map();
    this.etags = new Map();
    this.nextEtag = 1;
  }

  async get(key) {
    const value = this.values.get(key);
    return value === undefined ? null : structuredClone(value);
  }

  async getWithMetadata(key) {
    const value = this.values.get(key);
    if (value === undefined) return null;
    return {
      data: structuredClone(value),
      etag: this.etags.get(key),
      metadata: {},
    };
  }

  async set(key, value, options = {}) {
    const exists = this.values.has(key);
    const currentEtag = this.etags.get(key);
    if (options.onlyIfNew && exists) return { modified: false };
    if (options.onlyIfMatch !== undefined && options.onlyIfMatch !== currentEtag) {
      return { modified: false };
    }

    const etag = `etag-${this.nextEtag}`;
    this.nextEtag += 1;
    let stored = value;
    if (typeof value === "string") {
      try {
        stored = JSON.parse(value);
      } catch {
        // The production store also permits non-JSON strings.
      }
    }
    this.values.set(key, structuredClone(stored));
    this.etags.set(key, etag);
    return { modified: true, etag };
  }
}

test("move GET always passes through machine authentication", async () => {
  let authentication;
  const response = await handleMontrealMoveRequest(
    new Request("https://tylerbustard.ca/api/private/montreal/move", {
      headers: { Cookie: "__Host-montreal_session=retired" },
    }),
    {
      store: {},
      requireMachineSignature: async (_request, _store, options) => {
        authentication = options;
      },
      getMoveLedgerSnapshot: async () => ({
        ledger: { version: 1, properties: [] },
        version,
        etag: "etag-1",
      }),
    },
  );

  assert.equal(response.status, 200);
  assert.equal(authentication.publicPathname, "/api/private/montreal/move");
  assert.equal(authentication.rawBody.byteLength, 0);
  assert.equal(response.headers.get("x-montreal-ledger-version"), version);
});

test("a retired browser cookie cannot bypass machine authentication", async () => {
  await assert.rejects(
    handleMontrealMoveRequest(
      new Request("https://tylerbustard.ca/api/private/montreal/move", {
        headers: { Cookie: "__Host-montreal_session=retired" },
      }),
      {
        store: {},
        requireMachineSignature: async () => {
          throw unauthorized();
        },
      },
    ),
    (error) => error?.status === 401 && error?.code === "UNAUTHORIZED",
  );
});

test("move-decision is a machine-authenticated GET-only endpoint", async () => {
  const rejected = await handleMontrealMoveDecision(
    new Request("https://tylerbustard.ca/api/private/montreal/move-decision", {
      method: "POST",
      headers: { Cookie: "__Host-montreal_session=retired" },
    }),
  );
  assert.equal(rejected.status, 405);
  assert.equal(rejected.headers.get("allow"), "GET");

  let authenticated = false;
  const accepted = await handleMontrealMoveDecision(
    new Request("https://tylerbustard.ca/api/private/montreal/move-decision"),
    {
      store: {},
      requireMachineSignature: async () => {
        authenticated = true;
      },
      getMoveDecisions: async () => ({ decisions: [] }),
    },
  );
  assert.equal(accepted.status, 200);
  assert.equal(authenticated, true);
});

test("move-decision-clear requires the machine signature before mutation", async () => {
  const decision = {
    propertyId: "synthetic-property",
    action: "deny",
    basisStatus: "new-candidate",
    decidedAt: "2026-08-16T12:00:00.000Z",
  };
  let authenticated = false;
  let cleared;
  const response = await handleClearMontrealMoveDecisions(
    new Request("https://tylerbustard.ca/api/private/montreal/move-decision/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decisions: [decision] }),
    }),
    {
      store: {},
      requireMachineSignature: async () => {
        authenticated = true;
      },
      clearMoveDecisions: async (_store, decisions) => {
        cleared = decisions;
        return { cleared: [decision.propertyId], decisions: [] };
      },
    },
  );

  assert.equal(response.status, 200);
  assert.equal(authenticated, true);
  assert.deepEqual(cleared, [decision]);
});

test("a missing Blob ledger fails closed with 503", async () => {
  await assert.rejects(
    getMoveLedgerSnapshot({
      getWithMetadata: async () => null,
    }),
    (error) => error?.status === 503 && error?.code === "SERVICE_UNAVAILABLE",
  );
});

test("the real Blob adapter preserves conditional JSON headers and strong readback", async () => {
  const requests = [];
  const store = getStore({
    name: "synthetic-conditional-store",
    siteID: "synthetic-site",
    token: "synthetic-token",
    edgeURL: "https://blobs.example.test",
    uncachedEdgeURL: "https://blobs-strong.example.test",
    fetch: async (url, init) => {
      requests.push({ url, init });
      if (String(init.method).toUpperCase() === "GET") {
        return new Response(JSON.stringify({ version: 2 }), {
          status: 200,
          headers: { "content-type": "application/json", etag: '"etag-after-write"' },
        });
      }
      return new Response(null, {
        status: requests.length === 1 ? 412 : 200,
        headers: { etag: '"etag-after-write"' },
      });
    },
  });

  assert.deepEqual(
    await storageInternals.setJson(store, "synthetic/create", { version: 1 }, { onlyIfNew: true }),
    { modified: false },
  );
  assert.deepEqual(
    await storageInternals.setJson(
      store,
      "synthetic/update",
      { version: 2 },
      { onlyIfMatch: '"etag-before-write"' },
    ),
    { modified: true, etag: '"etag-after-write"' },
  );
  assert.equal(new Headers(requests[0].init.headers).get("if-none-match"), "*");
  assert.equal(new Headers(requests[1].init.headers).get("if-match"), '"etag-before-write"');
  assert.equal(String(requests[2].init.method).toUpperCase(), "GET");
  assert.match(requests[2].url, /^https:\/\/blobs-strong\.example\.test\//u);
});

test("production, preview, Dev, and direct local Blob bindings are isolated", () => {
  assert.equal(montrealStoreName({}), LOCAL_STORE_NAME);
  assert.equal(montrealStoreName({ NETLIFY_DEV: "true", NETLIFY_BLOBS_CONTEXT: "{}" }), LOCAL_STORE_NAME);
  assert.equal(montrealStoreName({
    SITE_ID: "synthetic-site",
    MONTREAL_DEPLOY_ROLE: "production",
    MONTREAL_BLOB_STORE_NAME: STORE_NAME,
  }), STORE_NAME);
  assert.equal(montrealStoreName({
    SITE_ID: "synthetic-site",
    MONTREAL_DEPLOY_ROLE: "preview",
    MONTREAL_BLOB_STORE_NAME: PREVIEW_STORE_NAME,
  }), PREVIEW_STORE_NAME);

  for (const environment of [
    { SITE_ID: "synthetic-site" },
    { SITE_ID: "synthetic-site", MONTREAL_DEPLOY_ROLE: "production", MONTREAL_BLOB_STORE_NAME: PREVIEW_STORE_NAME },
    { SITE_ID: "synthetic-site", MONTREAL_DEPLOY_ROLE: "preview", MONTREAL_BLOB_STORE_NAME: STORE_NAME },
    { NETLIFY_BLOBS_CONTEXT: "{}" },
    { NETLIFY_DEV: "true", SITE_ID: "synthetic-site", MONTREAL_DEPLOY_ROLE: "production", MONTREAL_BLOB_STORE_NAME: STORE_NAME },
  ]) {
    assert.throws(
      () => montrealStoreName(environment),
      (error) => error?.status === 503 && error?.code === "SERVICE_UNAVAILABLE",
    );
  }
});

test("real HMAC verification binds POST body and precondition and rejects replay", async () => {
  const store = new MemoryStore();
  const key = Buffer.alloc(32, 7);
  const timestamp = "1786881600";
  const now = Number(timestamp);
  const nonce = "synthetic-nonce-0001";
  const rawBody = new TextEncoder().encode('{"synthetic":true}');
  const precondition = `"${version}"`;
  const signature = signMachineRequest({
    method: "POST",
    publicPathname: "/api/private/montreal/move",
    timestamp,
    nonce,
    rawBody,
    key,
    precondition,
  });
  const request = new Request("https://tylerbustard.ca/api/private/montreal/move", {
    method: "POST",
    headers: {
      "x-montreal-timestamp": timestamp,
      "x-montreal-nonce": nonce,
      "x-montreal-signature": signature,
    },
    body: rawBody,
  });

  await requireMachineSignature(request.clone(), store, {
    publicPathname: "/api/private/montreal/move",
    rawBody,
    precondition,
    key,
    now,
  });
  await assert.rejects(
    requireMachineSignature(request.clone(), store, {
      publicPathname: "/api/private/montreal/move",
      rawBody,
      precondition,
      key,
      now,
    }),
    (error) => error?.status === 401,
  );

  const tampered = new Request("https://tylerbustard.ca/api/private/montreal/move", {
    method: "POST",
    headers: {
      "x-montreal-timestamp": timestamp,
      "x-montreal-nonce": "synthetic-nonce-0002",
      "x-montreal-signature": signature,
    },
    body: rawBody,
  });
  await assert.rejects(
    requireMachineSignature(tampered, store, {
      publicPathname: "/api/private/montreal/move",
      rawBody,
      precondition: `"${"b".repeat(64)}"`,
      key,
      now,
    }),
    (error) => error?.status === 401,
  );

  const wrongPathNonce = "synthetic-nonce-0003";
  const wrongPathSignature = signMachineRequest({
    method: "POST",
    publicPathname: "/api/private/montreal/move",
    timestamp,
    nonce: wrongPathNonce,
    rawBody,
    key,
    precondition,
  });
  const wrongPath = new Request("https://tylerbustard.ca/api/private/montreal/move/", {
    method: "POST",
    headers: {
      "x-montreal-timestamp": timestamp,
      "x-montreal-nonce": wrongPathNonce,
      "x-montreal-signature": wrongPathSignature,
    },
    body: rawBody,
  });
  await assert.rejects(
    requireMachineSignature(wrongPath, store, {
      publicPathname: "/api/private/montreal/move",
      rawBody,
      precondition,
      key,
      now,
    }),
    (error) => error?.status === 401,
  );
});

test("machine signatures reject timestamps outside the five-minute freshness window", async () => {
  const key = Buffer.alloc(32, 13);
  const now = 1_786_881_600;
  const publicPathname = "/api/private/montreal/move-decision";

  for (const timestampNumber of [now - 301, now + 301]) {
    const timestamp = String(timestampNumber);
    const nonce = `synthetic-freshness-${timestamp}`;
    const rawBody = new Uint8Array();
    const signature = signMachineRequest({
      method: "GET",
      publicPathname,
      timestamp,
      nonce,
      rawBody,
      key,
    });
    const request = new Request(`https://tylerbustard.ca${publicPathname}`, {
      headers: {
        "x-montreal-timestamp": timestamp,
        "x-montreal-nonce": nonce,
        "x-montreal-signature": signature,
      },
    });

    await assert.rejects(
      requireMachineSignature(request, new MemoryStore(), {
        publicPathname,
        rawBody,
        key,
        now,
      }),
      (error) => error?.status === 401 && error?.code === "UNAUTHORIZED",
    );
  }
});

test("concurrent replay claims allow exactly one identical signed request", async () => {
  const store = new MemoryStore();
  const key = Buffer.alloc(32, 17);
  const timestamp = "1786881600";
  const now = Number(timestamp);
  const nonce = "synthetic-concurrent-replay";
  const publicPathname = "/api/private/montreal/move-decision";
  const rawBody = new Uint8Array();
  const signature = signMachineRequest({
    method: "GET",
    publicPathname,
    timestamp,
    nonce,
    rawBody,
    key,
  });
  const request = new Request(`https://tylerbustard.ca${publicPathname}`, {
    headers: {
      "x-montreal-timestamp": timestamp,
      "x-montreal-nonce": nonce,
      "x-montreal-signature": signature,
    },
  });
  const verify = () => requireMachineSignature(request.clone(), store, {
    publicPathname,
    rawBody,
    key,
    now,
  });

  const results = await Promise.allSettled([verify(), verify()]);
  assert.equal(results.filter(({ status }) => status === "fulfilled").length, 1);
  const rejection = results.find(({ status }) => status === "rejected");
  assert.equal(rejection?.reason?.status, 401);
  assert.equal(rejection?.reason?.code, "UNAUTHORIZED");
});

test("signed move POST wires exact raw body and version through schema, HMAC, and CAS", async () => {
  const store = new MemoryStore();
  const key = Buffer.alloc(32, 11);
  const timestamp = "1786881600";
  const now = Number(timestamp);
  const baseline = {
    generated: "2026-08-16T12:00:00.000Z",
    note: "Synthetic terminal reference baseline",
    tiers: {
      A: "Synthetic tier A",
      B: "Synthetic tier B",
      C: "Synthetic tier C",
      X: "Synthetic terminal tier",
    },
    properties: [{
      id: "synthetic-reference",
      name: "Synthetic Reference",
      address: "1000 Synthetic Street, Montreal, QC",
      coordinates: { latitude: 45.5, longitude: -73.6 },
      units: "Synthetic studio",
      category: "studio",
      tier: "X",
      tier_reason: "Synthetic terminal record",
      status: "dismissed",
      next_action: "No action on synthetic record",
      timeline: [],
      appointments: [],
    }],
    toronto_appointments: [],
  };
  const replacement = structuredClone(baseline);
  replacement.generated = "2026-08-16T12:05:00.000Z";
  replacement.note = "Synthetic terminal reference replacement";
  await store.set(storageInternals.moveLedgerKey, JSON.stringify(baseline));
  const baselineVersion = sha256Hex(JSON.stringify(baseline));
  const rawBody = new TextEncoder().encode(JSON.stringify(replacement));
  const nonce = "synthetic-handler-nonce-0001";
  const signature = signMachineRequest({
    method: "POST",
    publicPathname: "/api/private/montreal/move",
    timestamp,
    nonce,
    rawBody,
    key,
    precondition: `"${baselineVersion}"`,
  });
  const makeRequest = () => new Request("https://tylerbustard.ca/api/private/montreal/move", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Montreal-Ledger-Version": baselineVersion,
      "X-Montreal-Timestamp": timestamp,
      "X-Montreal-Nonce": nonce,
      "X-Montreal-Signature": signature,
    },
    body: rawBody,
  });
  const authenticate = (request, activeStore, options) => requireMachineSignature(
    request,
    activeStore,
    { ...options, key, now },
  );

  const response = await handleMontrealMoveRequest(makeRequest(), {
    store,
    requireMachineSignature: authenticate,
    now: new Date(now * 1000),
  });
  assert.equal(response.status, 200);
  const responseBody = await response.json();
  assert.equal(responseBody.accepted, true);
  assert.equal(responseBody.propertyCount, 1);
  assert.equal(responseBody.generated, replacement.generated);
  assert.equal(response.headers.get("x-montreal-ledger-version"), sha256Hex(JSON.stringify(replacement)));
  assert.deepEqual(store.values.get(storageInternals.moveLedgerKey), replacement);

  await assert.rejects(
    handleMontrealMoveRequest(makeRequest(), {
      store,
      requireMachineSignature: authenticate,
      now: new Date(now * 1000),
    }),
    (error) => error?.status === 401,
  );
});

test("signed decision clear wires exact raw body through HMAC and conditional queue mutation", async () => {
  const store = new MemoryStore();
  const key = Buffer.alloc(32, 13);
  const timestamp = "1786881600";
  const now = Number(timestamp);
  const decision = {
    propertyId: "synthetic-property",
    action: "deny",
    basisStatus: "new-candidate",
    decidedAt: "2026-08-16T12:00:00.000Z",
  };
  await store.set("move-decisions/current", JSON.stringify({ version: 1, decisions: [decision] }));
  const rawBody = new TextEncoder().encode(JSON.stringify({ decisions: [decision] }));
  const nonce = "synthetic-handler-nonce-0002";
  const signature = signMachineRequest({
    method: "POST",
    publicPathname: "/api/private/montreal/move-decision/clear",
    timestamp,
    nonce,
    rawBody,
    key,
  });
  const makeRequest = (signed = true) => new Request(
    "https://tylerbustard.ca/api/private/montreal/move-decision/clear",
    {
      method: "POST",
      headers: signed ? {
        "Content-Type": "application/json",
        "X-Montreal-Timestamp": timestamp,
        "X-Montreal-Nonce": nonce,
        "X-Montreal-Signature": signature,
      } : { "Content-Type": "application/json" },
      body: rawBody,
    },
  );
  const authenticate = (request, activeStore, options) => requireMachineSignature(
    request,
    activeStore,
    { ...options, key, now },
  );

  const unsignedStore = new MemoryStore();
  await unsignedStore.set("move-decisions/current", JSON.stringify({ version: 1, decisions: [decision] }));
  await assert.rejects(
    handleClearMontrealMoveDecisions(makeRequest(false), {
      store: unsignedStore,
      requireMachineSignature: authenticate,
    }),
    (error) => error?.status === 401,
  );
  assert.deepEqual((await getMoveDecisions(unsignedStore)).decisions, [decision]);

  const response = await handleClearMontrealMoveDecisions(makeRequest(), {
    store,
    requireMachineSignature: authenticate,
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    accepted: true,
    cleared: [decision.propertyId],
    decisions: [],
  });
  assert.deepEqual((await getMoveDecisions(store)).decisions, []);

  await assert.rejects(
    handleClearMontrealMoveDecisions(makeRequest(), {
      store,
      requireMachineSignature: authenticate,
    }),
    (error) => error?.status === 401,
  );
});

test("signed decision GET wires its exact path and empty body through HMAC", async () => {
  const store = new MemoryStore();
  const key = Buffer.alloc(32, 17);
  const timestamp = "1786881600";
  const now = Number(timestamp);
  const nonce = "synthetic-handler-nonce-0003";
  const rawBody = new Uint8Array();
  const signature = signMachineRequest({
    method: "GET",
    publicPathname: "/api/private/montreal/move-decision",
    timestamp,
    nonce,
    rawBody,
    key,
  });
  const makeRequest = () => new Request(
    "https://tylerbustard.ca/api/private/montreal/move-decision",
    {
      headers: {
        "X-Montreal-Timestamp": timestamp,
        "X-Montreal-Nonce": nonce,
        "X-Montreal-Signature": signature,
      },
    },
  );
  const authenticate = (request, activeStore, options) => requireMachineSignature(
    request,
    activeStore,
    { ...options, key, now },
  );

  const response = await handleMontrealMoveDecision(makeRequest(), {
    store,
    requireMachineSignature: authenticate,
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { decisions: [] });

  await assert.rejects(
    handleMontrealMoveDecision(makeRequest(), {
      store,
      requireMachineSignature: authenticate,
    }),
    (error) => error?.status === 401,
  );
});

test("move POST fails closed when its ledger precondition is missing or invalid", async () => {
  for (const precondition of [undefined, "not-a-version"]) {
    const headers = { "Content-Type": "application/json" };
    if (precondition !== undefined) headers["X-Montreal-Ledger-Version"] = precondition;
    await assert.rejects(
      handleMontrealMoveRequest(
        new Request("https://tylerbustard.ca/api/private/montreal/move", {
          method: "POST",
          headers,
          body: JSON.stringify({ synthetic: true }),
        }),
        {
          store: {},
          requireMachineSignature: async () => {},
        },
      ),
      (error) => error?.status === 428 && error?.code === "PRECONDITION_REQUIRED",
    );
  }
});

test("ledger replacement uses a version CAS and rejects property removal", async () => {
  const store = new MemoryStore();
  const baseline = {
    generated: "2026-08-16T12:00:00.000Z",
    properties: [{ id: "synthetic-reference", status: "census-reference" }],
  };
  const replacement = structuredClone(baseline);
  replacement.generated = "2026-08-16T12:05:00.000Z";
  await store.set(storageInternals.moveLedgerKey, JSON.stringify(baseline));
  const baselineVersion = sha256Hex(JSON.stringify(baseline));

  const acknowledgement = await replaceMoveLedger(store, replacement, baselineVersion);
  assert.equal(acknowledgement.modified, true);
  assert.deepEqual(store.values.get(storageInternals.moveLedgerKey), replacement);

  const stale = await replaceMoveLedger(store, replacement, baselineVersion);
  assert.equal(stale.modified, false);
  assert.match(
    moveLedgerReplacementIssue(baseline, { ...replacement, properties: [] }),
    /cannot be removed/u,
  );
});

test("decision queue clearing uses exact decision matching and a conditional write", async () => {
  const store = new MemoryStore();
  const queued = {
    propertyId: "synthetic-property",
    action: "deny",
    basisStatus: "new-candidate",
    decidedAt: "2026-08-16T12:00:00.000Z",
  };
  await store.set("move-decisions/current", JSON.stringify({ version: 1, decisions: [queued] }));

  const mismatch = await clearMoveDecisions(store, [{ ...queued, decidedAt: "2026-08-16T12:01:00.000Z" }]);
  assert.deepEqual(mismatch.cleared, []);
  assert.deepEqual((await getMoveDecisions(store)).decisions, [queued]);

  const cleared = await clearMoveDecisions(store, [queued]);
  assert.deepEqual(cleared.cleared, [queued.propertyId]);
  assert.deepEqual((await getMoveDecisions(store)).decisions, []);
});

test("the deployed function route contract contains only machine methods", () => {
  assert.deepEqual(moveConfig, {
    path: "/api/private/montreal/move",
    method: ["GET", "POST"],
  });
  assert.deepEqual(decisionConfig, {
    path: "/api/private/montreal/move-decision",
    method: "GET",
  });
  assert.deepEqual(clearConfig, {
    path: "/api/private/montreal/move-decision/clear",
    method: "POST",
  });
});

test("machine handlers have no session or checked-in data fallback", async () => {
  const files = [
    "netlify/functions/montreal-move.mjs",
    "netlify/functions/montreal-move-decision.mjs",
    "netlify/functions/montreal-move-decision-clear.mjs",
  ];
  const source = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.doesNotMatch(
    source,
    /requireSession|requireCsrf|["']\.\/_lib\/auth\.mjs["']|checkedInLedger|fallbackLedger|_data\//u,
  );
});
