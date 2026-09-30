/**
 * Parses errors from the IC agent into user-friendly messages.
 * Handles raw rejection objects, serialized JSON bodies, and Error instances.
 */

export type ICErrorKind =
  | "stopped"
  | "not_found"
  | "unauthorized"
  | "invalid_id"
  | "rate_limit"
  | "retryable";

interface ICRejectBody {
  error_code?: string;
  reject_code?: number;
  reject_message?: string;
  status?: string;
}

function extractBody(message: string): ICRejectBody | null {
  try {
    const match = message.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as ICRejectBody;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function isStopped(message: string, body: ICRejectBody | null): boolean {
  // ONLY trigger on the explicit IC0508 error code.
  if (body?.error_code === "IC0508") return true;
  if (/\bIC0508\b/i.test(message)) return true;
  return false;
}

function isNotFound(message: string, body: ICRejectBody | null): boolean {
  const lower = message.toLowerCase();
  if (lower.includes("canister not found") || lower.includes("ic0301"))
    return true;
  if (body?.error_code === "IC0301") return true;
  return false;
}

function isNotAuthorized(message: string, body: ICRejectBody | null): boolean {
  const lower = message.toLowerCase();
  if (
    lower.includes("not authorized") ||
    lower.includes("unauthorized") ||
    lower.includes("access denied") ||
    lower.includes("ic0511")
  )
    return true;
  if (body?.error_code === "IC0511") return true;
  return false;
}

function isInvalidCanisterId(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("invalid canister id") ||
    lower.includes("invalid principal") ||
    lower.includes("malformed canister id")
  );
}

function isRateLimit(message: string): boolean {
  return (
    message.toLowerCase().includes("rate limit") ||
    message.toLowerCase().includes("too many requests")
  );
}

function getRawMessage(err: unknown): string {
  if (!err) return "";
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/**
 * Classifies an IC error into a kind for UI branching.
 * "stopped"      → IC0508 confirmed stopped, no retry
 * "retryable"    → any other error — show retry button
 */
export function classifyICError(err: unknown): ICErrorKind {
  const message = getRawMessage(err);
  const body = extractBody(message);
  if (isStopped(message, body)) return "stopped";
  if (isNotFound(message, body)) return "not_found";
  if (isNotAuthorized(message, body)) return "unauthorized";
  if (isInvalidCanisterId(message)) return "invalid_id";
  if (isRateLimit(message)) return "rate_limit";
  return "retryable";
}

/**
 * Converts a raw IC agent error (or any Error) into a friendly, readable string.
 * Never returns raw JSON, HTTP details, or technical rejection codes.
 */
export function formatICError(err: unknown): string {
  if (!err) return "An unexpected error occurred. Please try again.";

  const message = getRawMessage(err);
  const body = extractBody(message);

  if (isStopped(message, body)) {
    return "This canister is currently stopped. Start it from the NNS canister management UI and try again.";
  }

  if (isNotFound(message, body)) {
    return "Canister not found. Please double-check the canister ID and try again.";
  }

  if (isNotAuthorized(message, body)) {
    return (
      "Not authorized to read this canister. The CycleWatch backend canister is not a controller of your canister. " +
      "To read cycle balances and compute settings, add the backend canister as a controller of your canister. " +
      "You can do this from the NNS canister management UI or by running:\n\n" +
      "dfx canister update-settings --add-controller <BACKEND_CANISTER_ID> <YOUR_CANISTER_ID>"
    );
  }

  if (isInvalidCanisterId(message)) {
    return "Invalid canister ID format. Please enter a valid canister ID (e.g. rrkah-fqaaa-aaaaa-aaaaq-cai).";
  }

  if (isRateLimit(message)) {
    return "Too many requests. Please wait a moment and try again.";
  }

  // Try to extract just the reject_message from raw IC error JSON
  if (body?.reject_message) {
    const clean = body.reject_message.trim();
    return clean || "Connection failed. Please try again.";
  }

  // Strip out any embedded JSON/HTTP blobs — return the plain leading text only
  const stripped = message.replace(/\{[\s\S]*\}/, "").trim();
  const cleaned = stripped || message;

  return cleaned || "Connection failed. Please try again.";
}
