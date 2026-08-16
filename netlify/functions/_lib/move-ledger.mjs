import { z } from "zod";
import { getDomain } from "tldts";
import {
  MAX_ALL_IN_MONTHLY_BY_BEDROOM,
  MAX_TRANSIT_MINUTES,
  MOVE_IN_EARLIEST,
  MOVE_IN_LATEST,
} from "./constants.mjs";
import { badRequest } from "./errors.mjs";
import { isPotentiallyPublicHttpsUrl } from "./media.mjs";
import { sha256Hex } from "./crypto.mjs";

// Netlify's buffered function payload limit is 6 MiB. Keep 2 MiB of transport
// headroom while allowing the 150-row target to carry all three proof bundles.
export const MOVE_LEDGER_MAX_BYTES = 4 * 1024 * 1024;
export const MOVE_PROPERTY_MEDIA_LIMIT = 8;
export const MOVE_LEDGER_VERSION_HEADER = "X-Montreal-Ledger-Version";

const MONTREAL_MOVE_BOUNDS = Object.freeze({
  minLatitude: 45.40,
  maxLatitude: 45.61,
  minLongitude: -73.75,
  maxLongitude: -73.45,
});

const MOVE_ALL_IN_CAP_BY_CATEGORY = Object.freeze({
  studio: MAX_ALL_IN_MONTHLY_BY_BEDROOM[0],
  one_bedroom: MAX_ALL_IN_MONTHLY_BY_BEDROOM[1],
  two_bedroom: MAX_ALL_IN_MONTHLY_BY_BEDROOM[2],
  roommate: MAX_ALL_IN_MONTHLY_BY_BEDROOM[0],
});
const MOVE_PRIVATE_CATEGORIES = new Set(["studio", "one_bedroom", "two_bedroom"]);
const NON_EXACT_UNIT_ID = /^(?:unknown|tbd|tbc|n\/?a|not available|not provided|pending|unit (?:unknown|tbd|tbc)|to be (?:confirmed|determined))$/iu;

const nonEmptyText = (max) => z
  .string()
  .min(1)
  .max(max)
  .refine((value) => value.trim().length > 0, "Non-empty text required");

function isLocalMinute(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/u.exec(value);
  if (!match) return false;
  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (hour > 23 || minute > 59) return false;
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

const LocalMinuteSchema = z.string().refine(isLocalMinute, "Valid local date and minute required");

function isCalendarDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

const CalendarDateSchema = z.string().refine(isCalendarDate, "Valid calendar date required");

const HttpsUrlSchema = z.string().url().max(2_048).refine(
  isPotentiallyPublicHttpsUrl,
  "Public credential-free HTTPS URL required",
);

const CoordinatesSchema = z
  .object({
    latitude: z.number().finite().min(MONTREAL_MOVE_BOUNDS.minLatitude).max(MONTREAL_MOVE_BOUNDS.maxLatitude),
    longitude: z.number().finite().min(MONTREAL_MOVE_BOUNDS.minLongitude).max(MONTREAL_MOVE_BOUNDS.maxLongitude),
  })
  .strict();

export const MoveCommuteSchema = z
  .object({
    walk_min: z.number().int().min(3).max(120),
    drive_min: z.number().int().min(2).max(45),
    transit_min: z.number().int().min(10).max(45).nullable(),
    distance_km: z.number().finite().nonnegative(),
    destination: z.literal("bronfman"),
    computed_at: z.string().datetime({ offset: true }),
    method: nonEmptyText(500).refine(
      (value) => /estimate/iu.test(value),
      "Commute method must identify the estimate",
    ),
  })
  .strict()
  .superRefine((commute, context) => {
    const walkingIsPreferred = commute.walk_min <= 18;
    if (walkingIsPreferred !== (commute.transit_min === null)) {
      context.addIssue({
        code: "custom",
        path: ["transit_min"],
        message: walkingIsPreferred
          ? "Transit must be omitted for walks of 18 minutes or less"
          : "Transit estimate required for walks longer than 18 minutes",
      });
    }
  });

const AppointmentSchema = z
  .object({
    when: LocalMinuteSchema,
    what: nonEmptyText(1_000),
  })
  .strict();

const TimelineEntrySchema = z
  .object({
    ts: LocalMinuteSchema,
    dir: z.enum(["in", "out"]),
    note: nonEmptyText(2_000),
  })
  .strict();

export const MovePropertyIdSchema = z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/u);
export const MoveStatusSchema = z.string().regex(/^[a-z][a-z0-9-]{0,63}$/u);

export const MoveMediaSchema = z
  .object({
    id: MovePropertyIdSchema,
    type: z.enum(["photo", "video", "virtual_tour", "floor_plan"]),
    source: z.enum(["remote", "blob"]),
    url: HttpsUrlSchema,
    thumbnailUrl: HttpsUrlSchema.optional(),
    alt: nonEmptyText(1_000),
    provider: nonEmptyText(300),
    position: z.number().int().min(0).max(499),
  })
  .strict();

export const MoveLeaseSchema = z
  .object({
    term_months: z.number().int().min(1).max(120).nullable(),
    unfurnished: z.boolean().nullable(),
    promo: nonEmptyText(2_000).nullable(),
    available_on: CalendarDateSchema.nullable(),
  })
  .strict();

export const MoveInclusionSchema = z
  .object({
    label: nonEmptyText(300),
    category: z.enum(["utility", "appliance", "amenity", "parking", "service", "policy"]),
    state: z.enum(["included", "excluded", "extra", "unknown"]),
    detail: nonEmptyText(1_000).nullable(),
    amount_monthly: z.number().finite().nonnegative().max(100_000).nullable(),
  })
  .strict();

const CANONICAL_ROUTE_ANCHORS = Object.freeze([
  Object.freeze({
    id: "bronfman",
    name: "McGill Desautels — Samuel Bronfman Building",
    address: "1001 Sherbrooke St W, Montreal, QC H3A 1G5",
    latitude: 45.5049,
    longitude: -73.5779,
  }),
  Object.freeze({
    id: "armstrong",
    name: "McGill MBA & Masters Office — Donald E. Armstrong Building",
    address: "3420 McTavish St, Montreal, QC H3A 3L1",
    latitude: 45.5039,
    longitude: -73.5766,
  }),
]);

const MoveReferenceWalkRouteFields = {
  duration_min: z.number().int().min(1).max(1_440),
  distance_km: z.number().finite().nonnegative().max(1_000),
};

const MoveReferenceWalkRouteSchema = z.discriminatedUnion("anchor_id", [
  z.object({
    anchor_id: z.literal(CANONICAL_ROUTE_ANCHORS[0].id),
    anchor_name: z.literal(CANONICAL_ROUTE_ANCHORS[0].name),
    destination_address: z.literal(CANONICAL_ROUTE_ANCHORS[0].address),
    ...MoveReferenceWalkRouteFields,
  }).strict(),
  z.object({
    anchor_id: z.literal(CANONICAL_ROUTE_ANCHORS[1].id),
    anchor_name: z.literal(CANONICAL_ROUTE_ANCHORS[1].name),
    destination_address: z.literal(CANONICAL_ROUTE_ANCHORS[1].address),
    ...MoveReferenceWalkRouteFields,
  }).strict(),
]);

export const MoveReferenceWalkingSchema = z
  .object({
    origin: z
      .object({
        address: nonEmptyText(500),
        latitude: z.number().finite().min(MONTREAL_MOVE_BOUNDS.minLatitude).max(MONTREAL_MOVE_BOUNDS.maxLatitude),
        longitude: z.number().finite().min(MONTREAL_MOVE_BOUNDS.minLongitude).max(MONTREAL_MOVE_BOUNDS.maxLongitude),
        precision: nonEmptyText(100),
        coordinate_source: nonEmptyText(200),
        coordinate_provider: nonEmptyText(300).nullable(),
        warnings: z.array(nonEmptyText(1_000)).max(20),
      })
      .strict(),
    provider: z.literal("routing.openstreetmap.de"),
    computed_at: z.string().datetime({ offset: true }),
    method: nonEmptyText(500).refine(
      (value) => /estimate/iu.test(value),
      "Reference walking method must identify the estimate",
    ),
    routes: z.array(MoveReferenceWalkRouteSchema).length(2),
  })
  .strict()
  .superRefine((walking, context) => {
    const anchors = new Set(walking.routes.map((route) => route.anchor_id));
    if (anchors.size !== 2 || !anchors.has("bronfman") || !anchors.has("armstrong")) {
      context.addIssue({
        code: "custom",
        path: ["routes"],
        message: "Reference walking estimate must contain both canonical McGill anchors",
      });
    }
  });

const MoveReferenceLeaseSchema = z
  .object({
    term_months: z.number().int().min(1).max(120).nullable(),
    furnishing: z.enum(["furnished", "semi_furnished", "unfurnished"]).nullable(),
    promotion: nonEmptyText(2_000).nullable(),
  })
  .strict();

const MoveCensusReferenceSnapshotSchema = z
  .object({
    kind: z.literal("census_source"),
    reviewed_on: CalendarDateSchema,
    description: nonEmptyText(3_000),
    unit: nonEmptyText(1_000),
    availability: nonEmptyText(1_000),
    advertised_rent_monthly: z.number().finite().nonnegative().max(100_000).nullable(),
    effective_rent_monthly: z.number().finite().nonnegative().max(100_000).nullable(),
    source_name: nonEmptyText(300),
    source_state: z.literal("live-page"),
    source_url: HttpsUrlSchema,
    compromise_level: z.enum(["C1", "C2", "C3", "C4", "C5"]),
    compromise_tags: z.array(nonEmptyText(300)).min(1).max(50),
    lease: MoveReferenceLeaseSchema,
    inclusions: z.array(MoveInclusionSchema).max(40),
    walking: MoveReferenceWalkingSchema,
  })
  .strict();

const MoveHistoricalReferenceSnapshotSchema = z
  .object({
    kind: z.literal("historical_record"),
    reviewed_on: CalendarDateSchema,
    description: nonEmptyText(3_000),
    record_note: nonEmptyText(3_000),
    source_url: HttpsUrlSchema.nullable(),
    walking: MoveReferenceWalkingSchema,
  })
  .strict();

export const MoveReferenceSnapshotSchema = z.discriminatedUnion("kind", [
  MoveCensusReferenceSnapshotSchema,
  MoveHistoricalReferenceSnapshotSchema,
]);

const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const SourceProofDomainSchema = z.string().min(1).max(253).regex(/^[a-z0-9.-]+$/u);

function canonicalPublicUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !isPotentiallyPublicHttpsUrl(value)) return "";
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    if (url.port === "443") url.port = "";
    url.pathname = url.pathname.replace(/\/{2,}/gu, "/").replace(/\/+$/u, "") || "/";
    for (const key of [...url.searchParams.keys()]) {
      const folded = key.toLowerCase();
      if (folded === "fbclid" || folded === "gclid" || folded.startsWith("utm_")) {
        url.searchParams.delete(key);
      }
    }
    url.searchParams.sort();
    return url.toString();
  } catch {
    return "";
  }
}

export const MoveSourceProofSchema = z
  .object({
    version: z.literal(1),
    method: z.literal("scheduled-hunt-pinned-public-refetch-v1"),
    requested_url: HttpsUrlSchema,
    final_url: HttpsUrlSchema,
    content_sha256: Sha256Schema,
    refetched_at: z.string().datetime({ offset: true }),
    confirmed_facts: z
      .object({
        live: z.literal(true),
        civic_address: nonEmptyText(500),
        category: z.enum(["studio", "one_bedroom", "two_bedroom", "roommate"]),
        unit_id: nonEmptyText(500),
        occupancy: z.enum(["private_unit", "shared"]),
        unit_form: z.enum(["above_grade", "basement", "unknown"]),
        lease_type: z.enum(["standard", "sublet", "lease_transfer", "unknown"]),
        contractual_rent_monthly: z.number().finite().positive().max(100_000),
        mandatory_fees_monthly: z.number().finite().nonnegative().max(100_000),
        tenant_utilities_monthly: z.number().finite().nonnegative().max(100_000),
        promotion_discount_monthly: z.number().finite().nonnegative().max(100_000),
        effective_all_in_monthly: z.number().finite().nonnegative().max(100_000),
        availability_date: CalendarDateSchema,
        fridge_included: z.literal(true),
        stove_included: z.literal(true),
        photo_url: HttpsUrlSchema,
      })
      .strict(),
    verified_review_sources: z
      .array(z
        .object({
          url: HttpsUrlSchema,
          domain: SourceProofDomainSchema,
          final_url: HttpsUrlSchema,
          content_sha256: Sha256Schema,
          property_identity_confirmed: z.literal(true),
          reputation_evidence_confirmed: z.literal(true),
        })
        .strict())
      .min(2)
      .max(10),
  })
  .strict()
  .superRefine((proof, context) => {
    const requestedUrls = proof.verified_review_sources.map((row) => canonicalPublicUrl(row.url));
    const finalUrls = proof.verified_review_sources.map((row) => canonicalPublicUrl(row.final_url));
    const requestedDomains = new Set(proof.verified_review_sources.map((row) => registrableDomain(row.url)));
    const finalDomains = new Set(proof.verified_review_sources.map((row) => registrableDomain(row.final_url)));
    if (
      requestedUrls.some((url) => !url)
      || new Set(requestedUrls).size < 2
      || requestedDomains.has("")
      || requestedDomains.size < 2
    ) {
      context.addIssue({
        code: "custom",
        path: ["verified_review_sources"],
        message: "Review attestations require two independent requested sources",
      });
    }
    if (
      finalUrls.some((url) => !url)
      || new Set(finalUrls).size < 2
      || finalDomains.has("")
      || finalDomains.size < 2
    ) {
      context.addIssue({
        code: "custom",
        path: ["verified_review_sources"],
        message: "Review attestations require two independent canonical final sources",
      });
    }
    proof.verified_review_sources.forEach((row, index) => {
      if (row.domain !== registrableDomain(row.final_url)) {
        context.addIssue({
          code: "custom",
          path: ["verified_review_sources", index, "domain"],
          message: "Review domain must be derived from the canonical final URL",
        });
      }
    });
  });

function routeSourceMatches(value, originAddress, anchorAddress, mode) {
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && url.hostname === "www.google.com"
      && url.pathname === "/maps/dir/"
      && url.searchParams.get("api") === "1"
      && url.searchParams.get("origin") === originAddress
      && url.searchParams.get("destination") === anchorAddress
      && url.searchParams.get("travelmode") === (mode === "walk" ? "walking" : "transit");
  } catch {
    return false;
  }
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function routeRequestSha256(proof, anchor, mode) {
  const payload = {
    origin: {
      location: {
        latLng: {
          latitude: proof.origin.latitude,
          longitude: proof.origin.longitude,
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: anchor.latitude,
          longitude: anchor.longitude,
        },
      },
    },
    travelMode: mode === "transit" ? "TRANSIT" : "WALK",
    computeAlternativeRoutes: false,
    languageCode: "en-CA",
    units: "METRIC",
  };
  if (mode === "transit") {
    payload.departureTime = new Date(Date.parse(proof.verified_at) + 5 * 60 * 1_000)
      .toISOString()
      .replace(".000Z", "Z");
  }
  return sha256Hex(canonicalJson(payload));
}

const MoveRouteOriginSchema = z.object({
  address: nonEmptyText(500),
  latitude: z.number().finite().min(MONTREAL_MOVE_BOUNDS.minLatitude).max(MONTREAL_MOVE_BOUNDS.maxLatitude),
  longitude: z.number().finite().min(MONTREAL_MOVE_BOUNDS.minLongitude).max(MONTREAL_MOVE_BOUNDS.maxLongitude),
  fingerprint: Sha256Schema,
}).strict();

const MoveRouteAnchorSchema = z.object({
  id: z.enum(["bronfman", "armstrong"]),
  name: nonEmptyText(300),
  address: nonEmptyText(500),
  latitude: z.number().finite().min(-90).max(90),
  longitude: z.number().finite().min(-180).max(180),
}).strict();

const MoveAttestedRouteSchema = z.object({
  anchor_id: z.enum(["bronfman", "armstrong"]),
  anchor_address: nonEmptyText(500),
  mode: z.enum(["transit", "walk"]),
  minutes: z.number().int().min(0).max(1_440),
  distance_meters: z.number().int().min(0).max(10_000_000),
  provider: z.literal("google-routes-api-v2"),
  request_sha256: Sha256Schema,
  response_at: z.string().datetime({ offset: true }),
  source_url: HttpsUrlSchema,
}).strict();

export const MoveRouteProofSchema = z.object({
  version: z.literal(1),
  method: z.literal("credentialed-google-routes-v2-bound-origin-v1"),
  provider: z.literal("google-routes-api-v2"),
  origin: MoveRouteOriginSchema,
  anchors: z.array(MoveRouteAnchorSchema).length(2),
  verified_at: z.string().datetime({ offset: true }),
  routes: z.array(MoveAttestedRouteSchema).length(4),
}).strict().superRefine((proof, context) => {
  if (JSON.stringify(proof.anchors) !== JSON.stringify(CANONICAL_ROUTE_ANCHORS)) {
    context.addIssue({ code: "custom", path: ["anchors"], message: "Route proof must use both canonical McGill anchors" });
  }
  const keys = new Set();
  const anchors = new Map(CANONICAL_ROUTE_ANCHORS.map((anchor) => [anchor.id, anchor]));
  proof.routes.forEach((route, index) => {
    const key = `${route.anchor_id}:${route.mode}`;
    keys.add(key);
    const anchor = anchors.get(route.anchor_id);
    if (
      !anchor
      || route.anchor_address !== anchor.address
      || route.response_at !== proof.verified_at
      || !routeSourceMatches(route.source_url, proof.origin.address, anchor.address, route.mode)
      || route.request_sha256 !== routeRequestSha256(proof, anchor, route.mode)
    ) {
      context.addIssue({ code: "custom", path: ["routes", index], message: "Route row is not bound to its exact origin, anchor, mode, and response" });
    }
    if (route.mode === "transit" && route.minutes > 30) {
      context.addIssue({ code: "custom", path: ["routes", index, "minutes"], message: "Transit route exceeds the 30-minute limit" });
    }
  });
  const expected = ["bronfman:transit", "bronfman:walk", "armstrong:transit", "armstrong:walk"];
  if (keys.size !== 4 || expected.some((key) => !keys.has(key))) {
    context.addIssue({ code: "custom", path: ["routes"], message: "Route proof must contain one transit and walk route to each anchor" });
  }
});

const NEIGHBOURHOOD_AUTHORITATIVE_HOSTS = Object.freeze([
  "montreal.ca",
  "stm.info",
  "spvm.qc.ca",
  "mcgill.ca",
  "uqam.ca",
  "quebec.ca",
]);

function registrableDomain(value) {
  try {
    const hostname = new URL(value).hostname.toLowerCase().replace(/\.$/u, "");
    return getDomain(hostname, { allowPrivateDomains: false }) ?? hostname;
  } catch {
    return "";
  }
}

function neighbourhoodSourceIsAuthoritative(value) {
  try {
    const hostname = new URL(value).hostname.toLowerCase().replace(/\.$/u, "");
    return NEIGHBOURHOOD_AUTHORITATIVE_HOSTS.some(
      (base) => hostname === base || hostname.endsWith(`.${base}`),
    );
  } catch {
    return false;
  }
}

function canonicalNeighbourhoodSummary(name, claims) {
  const parts = claims.map((claim) => `${claim.trim().replace(/[ .!?;:]+$/u, "")}.`);
  return `${name.trim()} — ${parts.join(" ")}`;
}

const MoveNeighbourhoodSourceSchema = z.object({
  requested_url: HttpsUrlSchema,
  final_url: HttpsUrlSchema,
  domain: SourceProofDomainSchema,
  content_sha256: Sha256Schema,
  refetched_at: z.string().datetime({ offset: true }),
  authoritative: z.boolean(),
  address_confirmed: z.boolean(),
  neighbourhood_confirmed: z.literal(true),
  supported_claim_indexes: z.array(z.number().int().min(0).max(7)).min(1).max(8),
}).strict();

export const MoveNeighbourhoodProofSchema = z.object({
  version: z.literal(1),
  method: z.literal("scheduled-hunt-pinned-neighbourhood-refetch-v1"),
  refetched_at: z.string().datetime({ offset: true }),
  candidate_binding_sha256: Sha256Schema,
  neighbourhood_name: nonEmptyText(200),
  summary: nonEmptyText(3_000),
  summary_sha256: Sha256Schema,
  claims: z.array(nonEmptyText(300)).min(2).max(8),
  claims_sha256: Sha256Schema,
  source_urls: z.array(HttpsUrlSchema).min(2).max(6),
  sources: z.array(MoveNeighbourhoodSourceSchema).min(2).max(6),
}).strict().superRefine((proof, context) => {
  if (new Set(proof.claims).size !== proof.claims.length) {
    context.addIssue({ code: "custom", path: ["claims"], message: "Neighbourhood claims must be unique" });
  }
  if (new Set(proof.source_urls).size !== proof.source_urls.length) {
    context.addIssue({ code: "custom", path: ["source_urls"], message: "Neighbourhood source URLs must be unique" });
  }
  if (proof.summary !== canonicalNeighbourhoodSummary(proof.neighbourhood_name, proof.claims)) {
    context.addIssue({ code: "custom", path: ["summary"], message: "Neighbourhood summary must be derived from its claims" });
  }
  if (proof.summary_sha256 !== sha256Hex(proof.summary)) {
    context.addIssue({ code: "custom", path: ["summary_sha256"], message: "Neighbourhood summary hash is invalid" });
  }
  if (proof.claims_sha256 !== sha256Hex(JSON.stringify(proof.claims))) {
    context.addIssue({ code: "custom", path: ["claims_sha256"], message: "Neighbourhood claims hash is invalid" });
  }
  if (
    proof.sources.length !== proof.source_urls.length
    || JSON.stringify(proof.sources.map((row) => row.requested_url)) !== JSON.stringify(proof.source_urls)
  ) {
    context.addIssue({ code: "custom", path: ["sources"], message: "Neighbourhood proof rows must match requested sources" });
  }
  const requestedDomains = new Set(proof.source_urls.map(registrableDomain).filter(Boolean));
  const finalDomains = new Set();
  const finalUrls = new Set();
  const covered = new Set();
  let authoritative = false;
  let addressConfirmed = false;
  proof.sources.forEach((row, index) => {
    const domain = registrableDomain(row.final_url);
    const expectedAuthority = neighbourhoodSourceIsAuthoritative(row.final_url);
    finalDomains.add(domain);
    finalUrls.add(row.final_url);
    row.supported_claim_indexes.forEach((claimIndex) => covered.add(claimIndex));
    authoritative ||= expectedAuthority;
    addressConfirmed ||= row.address_confirmed;
    if (
      !domain
      || row.domain !== domain
      || row.authoritative !== expectedAuthority
      || row.refetched_at !== proof.refetched_at
      || new Set(row.supported_claim_indexes).size !== row.supported_claim_indexes.length
      || row.supported_claim_indexes.some((claimIndex) => claimIndex >= proof.claims.length)
    ) {
      context.addIssue({ code: "custom", path: ["sources", index], message: "Neighbourhood source row is not content-bound" });
    }
  });
  if (requestedDomains.size < 2 || finalDomains.size < 2 || finalUrls.size !== proof.sources.length) {
    context.addIssue({ code: "custom", path: ["sources"], message: "Neighbourhood proof needs distinct requested and final source domains" });
  }
  if (!authoritative) {
    context.addIssue({ code: "custom", path: ["sources"], message: "Neighbourhood proof needs an authoritative source" });
  }
  if (!addressConfirmed) {
    context.addIssue({ code: "custom", path: ["sources"], message: "Neighbourhood proof must bind the exact civic address" });
  }
  if (proof.claims.some((_claim, index) => !covered.has(index))) {
    context.addIssue({ code: "custom", path: ["sources"], message: "Every neighbourhood claim needs source support" });
  }
});

export const MoveVerificationSchema = z
  .object({
    checked_at: z.string().datetime({ offset: true }),
    source_proof: MoveSourceProofSchema.optional(),
    route_proof: MoveRouteProofSchema.optional(),
    neighbourhood_proof: MoveNeighbourhoodProofSchema.optional(),
    unit_id: nonEmptyText(500),
    target_move_in: CalendarDateSchema,
    availability_status: z.enum(["compatible", "incompatible", "unknown"]),
    availability_evidence: nonEmptyText(1_000),
    occupancy: z.enum(["private_unit", "shared", "unknown"]),
    unit_form: z.enum(["above_grade", "basement", "unknown"]),
    lease_type: z.enum(["standard", "sublet", "lease_transfer", "unknown"]),
    description: nonEmptyText(3_000),
    contractual_rent_monthly: z.number().finite().positive().max(100_000),
    mandatory_fees_monthly: z.number().finite().nonnegative().max(100_000),
    tenant_utilities_monthly: z.number().finite().nonnegative().max(100_000),
    promotion_discount_monthly: z.number().finite().nonnegative().max(100_000),
    effective_all_in_monthly: z.number().finite().nonnegative().max(100_000),
    price_evidence: nonEmptyText(3_000),
    appliances_evidence: nonEmptyText(1_000),
    reviews_verdict: z.enum(["ok", "caution", "bad", "unknown"]),
    review_summary: nonEmptyText(3_000),
    review_sources: z.array(HttpsUrlSchema).max(10),
    neighbourhood_name: nonEmptyText(200).optional(),
    neighbourhood_claims: z.array(nonEmptyText(300)).min(2).max(8).optional(),
    neighbourhood_sources: z.array(HttpsUrlSchema).min(2).max(6).optional(),
    neighbourhood_summary: nonEmptyText(3_000),
    contact_route: z.enum(["direct", "source_form", "source_only", "unavailable"]),
    bronfman_transit_min: z.number().int().min(1).max(180).nullable(),
    armstrong_transit_min: z.number().int().min(1).max(180).nullable(),
    worst_anchor_walk_min: z.number().int().min(1).max(1_440).nullable(),
    route_evidence: nonEmptyText(3_000),
  })
  .strict()
  .superRefine((verification, context) => {
    const expected = verification.contractual_rent_monthly
      + verification.mandatory_fees_monthly
      + verification.tenant_utilities_monthly
      - verification.promotion_discount_monthly;
    if (Math.abs(expected - verification.effective_all_in_monthly) > 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["effective_all_in_monthly"],
        message: "Effective all-in price must reconcile to rent, mandatory fees, tenant utilities, and promotion discount",
      });
    }
    const proof = verification.source_proof;
    if (proof) {
      const facts = proof.confirmed_facts;
      const expectedFacts = {
        unit_id: verification.unit_id,
        occupancy: verification.occupancy,
        unit_form: verification.unit_form,
        lease_type: verification.lease_type,
        contractual_rent_monthly: verification.contractual_rent_monthly,
        mandatory_fees_monthly: verification.mandatory_fees_monthly,
        tenant_utilities_monthly: verification.tenant_utilities_monthly,
        promotion_discount_monthly: verification.promotion_discount_monthly,
        effective_all_in_monthly: verification.effective_all_in_monthly,
      };
      for (const [key, value] of Object.entries(expectedFacts)) {
        if (facts[key] !== value) {
          context.addIssue({ code: "custom", path: ["source_proof", "confirmed_facts", key], message: "Source proof fact must match verification" });
        }
      }
      if (proof.refetched_at !== verification.checked_at) {
        context.addIssue({ code: "custom", path: ["source_proof"], message: "Source proof timestamp must match verification" });
      }
      if (JSON.stringify(proof.verified_review_sources.map((row) => row.url)) !== JSON.stringify(verification.review_sources)) {
        context.addIssue({ code: "custom", path: ["source_proof", "verified_review_sources"], message: "Source proof reviews must match verification sources" });
      }
    }
    const routeProof = verification.route_proof;
    if (routeProof) {
      if (routeProof.verified_at !== verification.checked_at) {
        context.addIssue({ code: "custom", path: ["route_proof"], message: "Route proof timestamp must match verification" });
      }
      const routes = new Map(routeProof.routes.map((route) => [`${route.anchor_id}:${route.mode}`, route]));
      const bronfmanTransit = routes.get("bronfman:transit")?.minutes;
      const armstrongTransit = routes.get("armstrong:transit")?.minutes;
      const walkValues = [routes.get("bronfman:walk")?.minutes, routes.get("armstrong:walk")?.minutes];
      const worstWalk = walkValues.every(Number.isInteger) ? Math.max(...walkValues) : undefined;
      if (
        verification.bronfman_transit_min !== bronfmanTransit
        || verification.armstrong_transit_min !== armstrongTransit
        || verification.worst_anchor_walk_min !== worstWalk
      ) {
        context.addIssue({ code: "custom", path: ["route_proof"], message: "Displayed route minutes must be derived from the route proof" });
      }
      const expectedEvidence = `Credentialed Google Routes API v2 response ${routeProof.verified_at}: Bronfman transit ${bronfmanTransit} min / walk ${routes.get("bronfman:walk")?.minutes} min; Armstrong transit ${armstrongTransit} min / walk ${routes.get("armstrong:walk")?.minutes} min.`;
      if (verification.route_evidence !== expectedEvidence) {
        context.addIssue({ code: "custom", path: ["route_evidence"], message: "Route evidence summary must be derived from the route proof" });
      }
    }
    const neighbourhoodProof = verification.neighbourhood_proof;
    if (neighbourhoodProof) {
      if (
        !verification.neighbourhood_name
        || !verification.neighbourhood_claims
        || !verification.neighbourhood_sources
        || neighbourhoodProof.neighbourhood_name !== verification.neighbourhood_name
        || neighbourhoodProof.summary !== verification.neighbourhood_summary
        || JSON.stringify(neighbourhoodProof.claims) !== JSON.stringify(verification.neighbourhood_claims)
        || JSON.stringify(neighbourhoodProof.source_urls) !== JSON.stringify(verification.neighbourhood_sources)
      ) {
        context.addIssue({ code: "custom", path: ["neighbourhood_proof"], message: "Neighbourhood proof must match displayed evidence" });
      }
      if (neighbourhoodProof.refetched_at !== verification.checked_at) {
        context.addIssue({ code: "custom", path: ["neighbourhood_proof"], message: "Neighbourhood proof timestamp must match verification" });
      }
    }
  });

function normalizedCivicAddress(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, " ")
    .trim();
}

const ContactSchema = z
  .object({
    name: z.string().max(120).nullable(),
    email: z.string().max(254).nullable(),
    phone: z.string().max(32).nullable(),
  })
  .strict()
  .refine(
    (contact) => contact.email !== null || contact.phone !== null,
    "Contact email or phone required",
  );

const PropertySchema = z
  .object({
    id: MovePropertyIdSchema,
    name: nonEmptyText(300),
    address: nonEmptyText(500),
    coordinates: CoordinatesSchema,
    units: nonEmptyText(2_000),
    category: nonEmptyText(100),
    tier: z.enum(["A", "B", "C", "X"]),
    tier_reason: nonEmptyText(3_000),
    status: MoveStatusSchema,
    next_action: nonEmptyText(3_000),
    listing_url: HttpsUrlSchema.optional(),
    contact: ContactSchema.optional(),
    commute: MoveCommuteSchema.optional(),
    open_items: z.array(nonEmptyText(500)).max(50).optional(),
    media: z.array(MoveMediaSchema).max(MOVE_PROPERTY_MEDIA_LIMIT).optional(),
    lease: MoveLeaseSchema.optional(),
    inclusions: z.array(MoveInclusionSchema).max(40).optional(),
    verification: MoveVerificationSchema.optional(),
    reference_snapshot: MoveReferenceSnapshotSchema.optional(),
    timeline: z.array(TimelineEntrySchema).max(500),
    appointments: z.array(AppointmentSchema).max(100),
  })
  .strict()
  .superRefine((property, context) => {
    const reference = property.reference_snapshot;
    if (reference) {
      const expectedStatusPrefix = reference.kind === "census_source" ? "census-" : "historical-";
      if (!property.status.startsWith(expectedStatusPrefix)) {
        context.addIssue({ code: "custom", path: ["reference_snapshot", "kind"], message: "Reference snapshot kind must match the non-inventory property status" });
      }
      if (
        reference.walking.origin.address !== property.address
        || reference.walking.origin.latitude !== property.coordinates.latitude
        || reference.walking.origin.longitude !== property.coordinates.longitude
      ) {
        context.addIssue({ code: "custom", path: ["reference_snapshot", "walking", "origin"], message: "Reference walking estimate must bind the displayed property origin" });
      }
      if (reference.kind === "census_source" && reference.source_url !== property.listing_url) {
        context.addIssue({ code: "custom", path: ["reference_snapshot", "source_url"], message: "Census source snapshot must bind the exact listing URL" });
      }
      if (reference.kind === "historical_record" && reference.source_url !== (property.listing_url ?? null)) {
        context.addIssue({ code: "custom", path: ["reference_snapshot", "source_url"], message: "Historical reference snapshot must match the retained listing URL" });
      }
    }
    const proof = property.verification?.source_proof;
    if (proof) {
      if (!property.listing_url || proof.requested_url !== property.listing_url) {
        context.addIssue({ code: "custom", path: ["verification", "source_proof", "requested_url"], message: "Source proof must bind the exact listing URL" });
      }
      if (proof.confirmed_facts.category !== property.category) {
        context.addIssue({ code: "custom", path: ["verification", "source_proof", "confirmed_facts", "category"], message: "Source proof must bind the property category" });
      }
      const propertyAddress = normalizedCivicAddress(property.address);
      const proofAddress = normalizedCivicAddress(proof.confirmed_facts.civic_address);
      if (!propertyAddress.startsWith(proofAddress) && !proofAddress.startsWith(propertyAddress)) {
        context.addIssue({ code: "custom", path: ["verification", "source_proof", "confirmed_facts", "civic_address"], message: "Source proof must bind the property address" });
      }
      if (!property.media?.some((media) => media.type === "photo" && media.url === proof.confirmed_facts.photo_url)) {
        context.addIssue({ code: "custom", path: ["verification", "source_proof", "confirmed_facts", "photo_url"], message: "Source proof must bind a published source photo" });
      }
      if (property.lease?.available_on !== proof.confirmed_facts.availability_date) {
        context.addIssue({ code: "custom", path: ["verification", "source_proof", "confirmed_facts", "availability_date"], message: "Source proof availability must bind the exact lease availability" });
      }
    }
    const routeProof = property.verification?.route_proof;
    if (routeProof) {
      const expectedFingerprint = sha256Hex(JSON.stringify({
        address: property.address,
        latitude: property.coordinates.latitude,
        longitude: property.coordinates.longitude,
      }));
      if (
        routeProof.origin.address !== property.address
        || routeProof.origin.latitude !== property.coordinates.latitude
        || routeProof.origin.longitude !== property.coordinates.longitude
        || routeProof.origin.fingerprint !== expectedFingerprint
      ) {
        context.addIssue({ code: "custom", path: ["verification", "route_proof", "origin"], message: "Route proof must bind the exact property origin" });
      }
    }
    const neighbourhoodProof = property.verification?.neighbourhood_proof;
    if (neighbourhoodProof) {
      const expectedBinding = sha256Hex(canonicalJson({
        address: property.address,
        claims: neighbourhoodProof.claims,
        name: neighbourhoodProof.neighbourhood_name,
        source_urls: neighbourhoodProof.source_urls,
        summary: neighbourhoodProof.summary,
      }));
      if (neighbourhoodProof.candidate_binding_sha256 !== expectedBinding) {
        context.addIssue({ code: "custom", path: ["verification", "neighbourhood_proof", "candidate_binding_sha256"], message: "Neighbourhood proof must bind the exact property address and evidence" });
      }
    }
  });

function exactMoveUnitId(value) {
  const normalized = String(value ?? "").trim();
  return normalized.length > 0 && !NON_EXACT_UNIT_ID.test(normalized);
}

function includedApplianceFacts(property) {
  let fridge = false;
  let stove = false;
  for (const inclusion of property?.inclusions ?? []) {
    if (inclusion?.category !== "appliance" || inclusion.state !== "included") continue;
    const label = String(inclusion.label ?? "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/gu, "")
      .toLowerCase();
    fridge ||= /\b(?:fridge|refrigerator|refrigerateur)\b/u.test(label);
    stove ||= /\b(?:stove|range|oven|cuisiniere)\b/u.test(label);
  }
  return { fridge, stove };
}

/**
 * Return the first deterministic hard-eligibility failure for a property that is
 * about to enter publishable active inventory. Parsing remains deliberately more
 * permissive so legacy, terminal, and human-managed provenance can still be read.
 */
export function movePropertyHardEligibilityIssue(property) {
  const verification = property?.verification;
  const sourceProof = verification?.source_proof;
  const facts = sourceProof?.confirmed_facts;
  if (!verification || !sourceProof || !facts || facts.live !== true) {
    return "live source-attested exact-unit verification is required";
  }

  const category = property?.category;
  if (!Object.hasOwn(MOVE_ALL_IN_CAP_BY_CATEGORY, category) || facts.category !== category) {
    return "source-attested category must be exactly studio, one_bedroom, two_bedroom, or roommate";
  }
  const allInCap = MOVE_ALL_IN_CAP_BY_CATEGORY[category];
  if (
    !exactMoveUnitId(verification.unit_id)
    || verification.unit_id !== facts.unit_id
  ) {
    return "an exact source-attested unit identifier is required";
  }

  if (verification.availability_status !== "compatible") {
    return "exact-unit availability must be compatible with the move-in window";
  }
  const availability = property?.lease?.available_on;
  if (
    !isCalendarDate(availability)
    || availability !== facts.availability_date
    || availability < MOVE_IN_EARLIEST
    || availability > MOVE_IN_LATEST
  ) {
    return `exact-unit availability must be within ${MOVE_IN_EARLIEST} through ${MOVE_IN_LATEST}`;
  }

  if (MOVE_PRIVATE_CATEGORIES.has(category)) {
    if (verification.occupancy !== "private_unit" || facts.occupancy !== "private_unit") {
      return "private categories require an exact self-contained private unit";
    }
    if (verification.unit_form !== "above_grade" || facts.unit_form !== "above_grade") {
      return "private units must be source-verified as above grade";
    }
    if (verification.lease_type !== "standard" || facts.lease_type !== "standard") {
      return "private units require a standard lease, not a sublet, assignment, or lease transfer";
    }
  } else if (verification.occupancy !== "shared" || facts.occupancy !== "shared") {
    return "roommate inventory requires source-verified shared occupancy";
  }

  const allIn = verification.effective_all_in_monthly;
  if (
    !Number.isFinite(allIn)
    || allIn < 0
    || allIn !== facts.effective_all_in_monthly
    || allIn > allInCap
  ) {
    return `${category} effective all-in monthly cost must not exceed CAD ${allInCap}`;
  }

  const appliances = includedApplianceFacts(property);
  if (
    facts.fridge_included !== true
    || facts.stove_included !== true
    || !appliances.fridge
    || !appliances.stove
  ) {
    return "fridge and stove must both be source-verified as included";
  }

  if (!property.media?.some(
    (media) => media.type === "photo" && media.url === facts.photo_url,
  )) {
    return "a real source photo bound to the exact unit is required";
  }

  const routes = new Map(
    (verification.route_proof?.routes ?? []).map((route) => [
      `${route.anchor_id}:${route.mode}`,
      route,
    ]),
  );
  for (const anchor of ["bronfman", "armstrong"]) {
    const transit = routes.get(`${anchor}:transit`)?.minutes;
    if (!Number.isInteger(transit) || transit < 0 || transit > MAX_TRANSIT_MINUTES) {
      return `transit to both McGill anchors must be present and at most ${MAX_TRANSIT_MINUTES} minutes`;
    }
    const walk = routes.get(`${anchor}:walk`)?.minutes;
    if (!Number.isInteger(walk) || walk < 0) {
      return "measured walking time to both McGill anchors is required";
    }
  }

  if (verification.reviews_verdict === "bad") {
    return "serious bad reviews make the property ineligible";
  }
  return null;
}

export const MoveLedgerSchema = z
  .object({
    generated: z.string().datetime({ offset: true }),
    note: nonEmptyText(3_000),
    tiers: z
      .object({
        A: nonEmptyText(1_000),
        B: nonEmptyText(1_000),
        C: nonEmptyText(1_000),
        X: nonEmptyText(1_000),
      })
      .strict(),
    properties: z.array(PropertySchema).min(1).max(500),
    toronto_appointments: z.array(AppointmentSchema).max(500),
  })
  .strict()
  .superRefine((ledger, context) => {
    const identifiers = new Set();
    ledger.properties.forEach((property, index) => {
      if (identifiers.has(property.id)) {
        context.addIssue({
          code: "custom",
          path: ["properties", index, "id"],
          message: "Property identifiers must be unique",
        });
      }
      identifiers.add(property.id);
    });
  });

export function parseMoveLedger(value) {
  const result = MoveLedgerSchema.safeParse(value);
  if (!result.success) throw badRequest("Request did not match the Montreal move ledger schema");
  return result.data;
}

export const moveLedgerInternals = {
  MONTREAL_MOVE_BOUNDS,
  isCalendarDate,
  isLocalMinute,
};
