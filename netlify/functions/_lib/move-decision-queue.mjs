import { z } from "zod";
import { conflict, serviceUnavailable } from "./errors.mjs";
import { MovePropertyIdSchema, MoveStatusSchema } from "./move-ledger.mjs";
import { storageInternals } from "./storage.mjs";

const MOVE_DECISION_QUEUE_KEY = "move-decisions/current";
const MAX_QUEUE_SIZE = 500;
const MAX_CAS_ATTEMPTS = 8;

const MOVE_DECISION_ACTIVE_STATUSES = new Set([
  "awaiting-reply",
  "awaiting-tyler",
  "call-booked",
  "reschedule-pending",
  "viewing-confirmed",
]);
const MOVE_DECISION_TERMINAL_STATUSES = new Set([
  "lost",
  "declined",
  "closed",
  "dismissed",
  "dropped",
]);

function isMoveDecisionBasisAllowed(action, status) {
  if (action === "deny") return status === "new-candidate" || MOVE_DECISION_ACTIVE_STATUSES.has(status);
  return action === "restore" && MOVE_DECISION_TERMINAL_STATUSES.has(status);
}

const MoveDecisionSchema = z
  .object({
    propertyId: MovePropertyIdSchema,
    action: z.enum(["deny", "restore"]),
    basisStatus: MoveStatusSchema,
    decidedAt: z.string().datetime({ offset: true }),
  })
  .strict()
  .superRefine((decision, context) => {
    if (!isMoveDecisionBasisAllowed(decision.action, decision.basisStatus)) {
      context.addIssue({
        code: "custom",
        path: ["basisStatus"],
        message: "Move decision action is not legal for its basis status",
      });
    }
  });

const MoveDecisionQueueSchema = z
  .object({
    version: z.literal(1),
    decisions: z.array(MoveDecisionSchema).max(MAX_QUEUE_SIZE),
  })
  .strict()
  .superRefine((queue, context) => {
    const propertyIds = new Set();
    queue.decisions.forEach((decision, index) => {
      if (propertyIds.has(decision.propertyId)) {
        context.addIssue({
          code: "custom",
          path: ["decisions", index, "propertyId"],
          message: "Move decision property identifiers must be unique",
        });
      }
      propertyIds.add(decision.propertyId);
    });
  });

export const ClearMoveDecisionsInputSchema = z
  .object({
    decisions: z
      .array(MoveDecisionSchema)
      .min(1)
      .max(MAX_QUEUE_SIZE)
      .refine(
        (decisions) => new Set(decisions.map((decision) => decision.propertyId)).size === decisions.length,
        { message: "Property identifiers must be unique" },
      ),
  })
  .strict();

function emptyQueue() {
  return { version: 1, decisions: [] };
}

function parseStoredQueue(value) {
  const parsed = MoveDecisionQueueSchema.safeParse(value);
  if (!parsed.success) throw serviceUnavailable();
  return parsed.data;
}

async function readQueueSnapshot(store) {
  const snapshot = await storageInternals.getJsonWithMetadata(store, MOVE_DECISION_QUEUE_KEY);
  if (!snapshot) return { exists: false, etag: undefined, queue: emptyQueue() };
  if (!snapshot.etag) throw serviceUnavailable();
  return { exists: true, etag: snapshot.etag, queue: parseStoredQueue(snapshot.data) };
}

async function mutateQueue(store, updater) {
  for (let attempt = 0; attempt < MAX_CAS_ATTEMPTS; attempt += 1) {
    const snapshot = await readQueueSnapshot(store);
    const update = updater(snapshot.queue);
    if (update.unchanged) return update.result;

    const queue = parseStoredQueue(update.queue);
    const written = await storageInternals.setJson(
      store,
      MOVE_DECISION_QUEUE_KEY,
      queue,
      snapshot.exists ? { onlyIfMatch: snapshot.etag } : { onlyIfNew: true },
    );
    if (written.modified) return update.result;
  }
  throw conflict("Concurrent move decision update could not be committed; retry safely");
}

export async function getMoveDecisions(store) {
  const { queue } = await readQueueSnapshot(store);
  return { decisions: structuredClone(queue.decisions) };
}

function sameDecision(left, right) {
  return left.propertyId === right.propertyId
    && left.action === right.action
    && left.basisStatus === right.basisStatus
    && left.decidedAt === right.decidedAt;
}

export async function clearMoveDecisions(store, handledDecisions) {
  const handled = new Map(handledDecisions.map((decision) => [decision.propertyId, decision]));
  return mutateQueue(store, (queue) => {
    const cleared = queue.decisions
      .filter((decision) => sameDecision(decision, handled.get(decision.propertyId) ?? {}))
      .map((decision) => decision.propertyId);
    const decisions = queue.decisions.filter(
      (decision) => !sameDecision(decision, handled.get(decision.propertyId) ?? {}),
    );
    if (cleared.length === 0) {
      return {
        unchanged: true,
        result: { cleared, decisions: structuredClone(decisions) },
      };
    }
    return {
      queue: { version: 1, decisions },
      result: { cleared, decisions: structuredClone(decisions) },
    };
  });
}
