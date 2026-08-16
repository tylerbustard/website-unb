import { getStore } from "@netlify/blobs";
import { LOCAL_STORE_NAME, PREVIEW_STORE_NAME, STORE_NAME } from "./constants.mjs";
import { badRequest, serviceUnavailable } from "./errors.mjs";
import { sha256Hex } from "./crypto.mjs";
import { movePropertyHardEligibilityIssue } from "./move-ledger.mjs";

const MOVE_LEDGER_KEY = "move-ledger/current";
const MOVE_TERMINAL_STATUSES = new Set(["lost", "declined", "closed", "dismissed", "dropped"]);
const MOVE_NON_INVENTORY_STATUSES = new Set([
  ...MOVE_TERMINAL_STATUSES,
  "reschedule-pending",
  "census-reference",
  "census-awaiting-tyler",
  "census-awaiting-reply",
  "census-declined",
  "census-not-viewable",
  "census-reschedule-pending",
  "census-human-managed",
  "historical-awaiting-tyler",
  "historical-awaiting-reply",
  "historical-declined",
  "historical-reference",
  "historical-reschedule-pending",
  "historical-human-managed",
]);
const MOVE_NON_INVENTORY_MUTABLE_FIELDS = new Set([
  "status",
  "next_action",
  "timeline",
  "appointments",
  "reference_snapshot",
]);

export function montrealStoreName(environment = process.env) {
  const configured = String(environment.MONTREAL_BLOB_STORE_NAME ?? "").trim();
  const role = String(environment.MONTREAL_DEPLOY_ROLE ?? "").trim();
  const isNetlifyDev = environment.NETLIFY_DEV === "true";
  const hasRemoteBlobContext = Boolean(
    environment.SITE_ID
      || environment.NETLIFY_BLOBS_CONTEXT
      || globalThis.netlifyBlobsContext,
  );
  const hasValidLocalBinding = (!configured && !role)
    || (configured === LOCAL_STORE_NAME && role === "local");

  if (isNetlifyDev) {
    if (hasValidLocalBinding) return LOCAL_STORE_NAME;
    throw serviceUnavailable();
  }

  if (!hasRemoteBlobContext) {
    if (hasValidLocalBinding) return LOCAL_STORE_NAME;
    throw serviceUnavailable();
  }

  const expected = role === "production"
    ? STORE_NAME
    : role === "preview"
      ? PREVIEW_STORE_NAME
      : undefined;
  if (!expected || configured !== expected) throw serviceUnavailable();
  return expected;
}

export function getMontrealStore() {
  return getStore({ name: montrealStoreName(), consistency: "strong" });
}

async function getJson(store, key) {
  return (await store.get(key, { type: "json", consistency: "strong" })) ?? undefined;
}

async function getJsonWithMetadata(store, key) {
  if (typeof store.getWithMetadata !== "function") {
    const data = await getJson(store, key);
    return data === undefined ? undefined : { data, etag: undefined, metadata: {} };
  }
  return (await store.getWithMetadata(key, { type: "json", consistency: "strong" })) ?? undefined;
}

async function setJson(store, key, value, options) {
  // Conditional JSON writes are serialized explicitly because the SDK's
  // setJSON helper does not preserve all conditional options.
  const serialized = JSON.stringify(value);
  if (serialized === undefined) throw serviceUnavailable();
  const result = await store.set(key, serialized, options);
  const isConditional = Boolean(options?.onlyIfMatch || options?.onlyIfNew);
  if (isConditional && typeof result?.modified !== "boolean") throw serviceUnavailable();

  if (isConditional && result.modified === true) {
    if (!result.etag) throw serviceUnavailable();
    let readback;
    try {
      readback = await getJsonWithMetadata(store, key);
    } catch {
      throw serviceUnavailable();
    }
    if (
      !readback
      || readback.etag !== result.etag
      || JSON.stringify(readback.data) !== serialized
    ) {
      throw serviceUnavailable();
    }
  }

  if (isConditional) return result;
  return result && typeof result.modified === "boolean" ? result : { modified: true, etag: undefined };
}

export async function getMoveLedgerSnapshot(store) {
  const stored = await getJsonWithMetadata(store, MOVE_LEDGER_KEY);
  if (stored === undefined || !stored.etag) throw serviceUnavailable();
  return {
    ledger: stored.data,
    version: sha256Hex(JSON.stringify(stored.data)),
    etag: stored.etag,
  };
}

function moveEvidenceProjection(property) {
  return Object.fromEntries(
    Object.entries(property).filter(([key]) => !MOVE_NON_INVENTORY_MUTABLE_FIELDS.has(key)),
  );
}

function freshMoveProof(value, nowMs) {
  const checkedMs = Date.parse(value ?? "");
  return Number.isFinite(checkedMs)
    && checkedMs - nowMs <= 5 * 60 * 1_000
    && nowMs - checkedMs <= 24 * 60 * 60 * 1_000;
}

function completeMoveProofIssue(property, nowMs) {
  const verification = property?.verification;
  if (!verification?.source_proof) return "current independent source proof is required";
  if (!verification?.route_proof) return "current credentialed route proof is required";
  if (!verification?.neighbourhood_proof) return "current independent neighbourhood proof is required";
  if (!freshMoveProof(verification.source_proof.refetched_at, nowMs)) {
    return "source proof must be checked within 24 hours";
  }
  if (!freshMoveProof(verification.route_proof.verified_at, nowMs)) {
    return "route proof must be checked within 24 hours";
  }
  if (!freshMoveProof(verification.neighbourhood_proof.refetched_at, nowMs)) {
    return "neighbourhood proof must be checked within 24 hours";
  }
  return null;
}

function movePropertyIsPublishable(property) {
  return !MOVE_NON_INVENTORY_STATUSES.has(property.status);
}

function publishableMovePropertyIssue(property, nowMs) {
  return completeMoveProofIssue(property, nowMs)
    ?? movePropertyHardEligibilityIssue(property);
}

export function moveLedgerReplacementIssue(baseline, replacement, options = {}) {
  const nowValue = options.now ?? Date.now();
  const nowMs = nowValue instanceof Date ? nowValue.getTime() : Number(nowValue);
  if (!Number.isFinite(nowMs)) return "replacement validation time is invalid";
  const before = new Map(baseline.properties.map((property) => [property.id, property]));
  const after = new Map(replacement.properties.map((property) => [property.id, property]));
  const removed = [...before.keys()].find((id) => !after.has(id));
  if (removed) return `existing property ${removed} cannot be removed; use a terminal status`;

  for (const property of replacement.properties) {
    const prior = before.get(property.id);
    const publishable = movePropertyIsPublishable(property);
    if (!prior) {
      if (!publishable) continue;
      const eligibilityIssue = publishableMovePropertyIssue(property, nowMs);
      if (eligibilityIssue) return `new property ${property.id}: ${eligibilityIssue}`;
      continue;
    }
    const priorPublishable = movePropertyIsPublishable(prior);
    if (!priorPublishable && publishable) {
      const eligibilityIssue = publishableMovePropertyIssue(property, nowMs);
      if (eligibilityIssue) return `restored property ${property.id}: ${eligibilityIssue}`;
    }
    const evidenceUnchanged = JSON.stringify(moveEvidenceProjection(prior))
      === JSON.stringify(moveEvidenceProjection(property));
    if (evidenceUnchanged) continue;
    if (!publishable) {
      return `non-inventory transition for ${property.id} may not alter evidence-bearing fields`;
    }
    const eligibilityIssue = publishableMovePropertyIssue(property, nowMs);
    if (eligibilityIssue) return `changed active property ${property.id}: ${eligibilityIssue}`;
  }
  return null;
}

export async function replaceMoveLedger(store, ledger, expectedVersion, options = {}) {
  const snapshot = await getMoveLedgerSnapshot(store);
  if (snapshot.version !== expectedVersion) return { modified: false };
  const replacementIssue = moveLedgerReplacementIssue(snapshot.ledger, ledger, options);
  if (replacementIssue) throw badRequest(`Unsafe move-ledger replacement: ${replacementIssue}`);
  const result = await setJson(
    store,
    MOVE_LEDGER_KEY,
    ledger,
    { onlyIfMatch: snapshot.etag },
  );
  if (!result.modified) return { modified: false };
  return {
    modified: true,
    accepted: true,
    generated: ledger.generated,
    propertyCount: ledger.properties.length,
    version: sha256Hex(JSON.stringify(ledger)),
  };
}

export const storageInternals = {
  getJsonWithMetadata,
  setJson,
  moveLedgerKey: MOVE_LEDGER_KEY,
};
