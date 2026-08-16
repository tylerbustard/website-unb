export const MACHINE_CLOCK_SKEW_SECONDS = 5 * 60;
export const MAX_ALL_IN_MONTHLY_BY_BEDROOM = Object.freeze({ 0: 1000, 1: 1000, 2: 2000 });
export const MAX_TRANSIT_MINUTES = 30;
export const MOVE_IN_EARLIEST = "2026-07-22";
export const MOVE_IN_LATEST = "2026-08-01";

// These names are an existing storage contract. Production and preview remain
// isolated, while direct local processes can only reach the local store.
export const STORE_NAME = "montreal-private-v1";
export const PREVIEW_STORE_NAME = "montreal-private-v1-preview";
export const LOCAL_STORE_NAME = "montreal-private-v1-local";

export const MACHINE_RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
};
