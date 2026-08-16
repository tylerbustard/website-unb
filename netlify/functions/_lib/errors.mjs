export class HttpError extends Error {
  constructor(status, code, message, options = {}) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.headers = options.headers ?? {};
  }
}

export function badRequest(message = "Invalid request") {
  return new HttpError(400, "INVALID_REQUEST", message);
}

export function unauthorized(message = "Authentication required") {
  return new HttpError(401, "UNAUTHORIZED", message);
}

export function conflict(message = "Request conflicts with current state") {
  return new HttpError(409, "CONFLICT", message);
}

export function preconditionFailed(message = "The source version is no longer current") {
  return new HttpError(412, "PRECONDITION_FAILED", message);
}

export function preconditionRequired(message = "A source version is required") {
  return new HttpError(428, "PRECONDITION_REQUIRED", message);
}

export function serviceUnavailable() {
  return new HttpError(503, "SERVICE_UNAVAILABLE", "The housing data service is temporarily unavailable");
}
