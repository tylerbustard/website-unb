import { badRequest } from "./_lib/errors.mjs";
import { methodNotAllowed, readJson } from "./_lib/http.mjs";
import { requireMachineSignature } from "./_lib/machine-auth.mjs";
import {
  ClearMoveDecisionsInputSchema,
  clearMoveDecisions,
} from "./_lib/move-decision-queue.mjs";
import { jsonResponse, withErrorBoundary } from "./_lib/response.mjs";
import { getMontrealStore } from "./_lib/storage.mjs";

const PUBLIC_PATH = "/api/private/montreal/move-decision/clear";
const MAX_BODY_BYTES = 64 * 1024;

export async function handleClearMontrealMoveDecisions(request, dependencies = {}) {
  if (request.method !== "POST") return methodNotAllowed(["POST"]);
  const { value, raw } = await readJson(request, MAX_BODY_BYTES);
  const store = dependencies.store ?? getMontrealStore();
  await (dependencies.requireMachineSignature ?? requireMachineSignature)(request, store, {
    publicPathname: PUBLIC_PATH,
    rawBody: raw,
  });
  const parsed = ClearMoveDecisionsInputSchema.safeParse(value);
  if (!parsed.success) throw badRequest("Request did not match the move decision clear schema");
  const result = await (dependencies.clearMoveDecisions ?? clearMoveDecisions)(
    store,
    parsed.data.decisions,
  );
  return jsonResponse({ accepted: true, ...result });
}

export default withErrorBoundary((request) => handleClearMontrealMoveDecisions(request));

export const config = {
  path: "/api/private/montreal/move-decision/clear",
  method: "POST",
};
