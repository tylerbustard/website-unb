import { HttpError } from "./errors.mjs";
import { MACHINE_RESPONSE_HEADERS } from "./constants.mjs";

export function jsonResponse(value, status = 200, headers = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      ...MACHINE_RESPONSE_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
      ...headers,
    },
  });
}

export function errorResponse(error) {
  if (error instanceof HttpError) {
    return jsonResponse(
      { error: { code: error.code, message: error.message } },
      error.status,
      error.headers,
    );
  }

  console.error("montreal machine function failed", {
    errorType: error instanceof Error ? error.name : "UnknownError",
  });
  return jsonResponse(
    { error: { code: "INTERNAL_ERROR", message: "The request could not be completed" } },
    500,
  );
}

export function withErrorBoundary(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return errorResponse(error);
    }
  };
}
