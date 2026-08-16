import { methodNotAllowed } from "./_lib/http.mjs";
import { requireMachineSignature } from "./_lib/machine-auth.mjs";
import { getMoveDecisions } from "./_lib/move-decision-queue.mjs";
import { jsonResponse, withErrorBoundary } from "./_lib/response.mjs";
import { getMontrealStore } from "./_lib/storage.mjs";

const PUBLIC_PATH = "/api/private/montreal/move-decision";

export async function handleMontrealMoveDecision(request, dependencies = {}) {
  if (request.method !== "GET") return methodNotAllowed(["GET"]);
  const store = dependencies.store ?? getMontrealStore();
  await (dependencies.requireMachineSignature ?? requireMachineSignature)(request, store, {
    publicPathname: PUBLIC_PATH,
    rawBody: new Uint8Array(),
  });
  return jsonResponse(await (dependencies.getMoveDecisions ?? getMoveDecisions)(store));
}

export default withErrorBoundary((request) => handleMontrealMoveDecision(request));

export const config = {
  path: "/api/private/montreal/move-decision",
  method: "GET",
};
