import { preconditionFailed, preconditionRequired } from "./_lib/errors.mjs";
import { methodNotAllowed, readJson } from "./_lib/http.mjs";
import { requireMachineSignature } from "./_lib/machine-auth.mjs";
import {
  MOVE_LEDGER_MAX_BYTES,
  MOVE_LEDGER_VERSION_HEADER,
  parseMoveLedger,
} from "./_lib/move-ledger.mjs";
import { jsonResponse, withErrorBoundary } from "./_lib/response.mjs";
import { getMontrealStore, getMoveLedgerSnapshot, replaceMoveLedger } from "./_lib/storage.mjs";

const PUBLIC_PATH = "/api/private/montreal/move";

export async function handleMontrealMoveRequest(request, dependencies = {}) {
  if (request.method === "GET") {
    const store = dependencies.store ?? getMontrealStore();
    await (dependencies.requireMachineSignature ?? requireMachineSignature)(request, store, {
      publicPathname: PUBLIC_PATH,
      rawBody: new Uint8Array(),
    });
    const snapshot = await (dependencies.getMoveLedgerSnapshot ?? getMoveLedgerSnapshot)(store);
    return jsonResponse(snapshot.ledger, 200, {
      ETag: `"${snapshot.version}"`,
      [MOVE_LEDGER_VERSION_HEADER]: snapshot.version,
    });
  }

  if (request.method === "POST") {
    const { value, raw } = await readJson(request, MOVE_LEDGER_MAX_BYTES);
    const store = dependencies.store ?? getMontrealStore();
    const baseVersion = request.headers.get(MOVE_LEDGER_VERSION_HEADER) ?? "";
    const versionMatch = /^([a-f0-9]{64})$/u.exec(baseVersion);
    const canonicalPrecondition = versionMatch ? `"${versionMatch[1]}"` : "";
    await (dependencies.requireMachineSignature ?? requireMachineSignature)(request, store, {
      publicPathname: PUBLIC_PATH,
      rawBody: raw,
      precondition: canonicalPrecondition,
    });
    if (!versionMatch) {
      throw preconditionRequired("A valid move-ledger version header is required");
    }
    const ledger = parseMoveLedger(value);
    const acknowledgement = await (dependencies.replaceMoveLedger ?? replaceMoveLedger)(
      store,
      ledger,
      versionMatch[1],
      { now: dependencies.now },
    );
    if (!acknowledgement.modified) throw preconditionFailed();
    const { modified: _modified, version, ...body } = acknowledgement;
    return jsonResponse(body, 200, {
      ETag: `"${version}"`,
      [MOVE_LEDGER_VERSION_HEADER]: version,
    });
  }

  return methodNotAllowed(["GET", "POST"]);
}

export default withErrorBoundary((request) => handleMontrealMoveRequest(request));

export const config = {
  path: "/api/private/montreal/move",
  method: ["GET", "POST"],
};
