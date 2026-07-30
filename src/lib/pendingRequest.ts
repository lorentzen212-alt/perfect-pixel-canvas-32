/**
 * A request can be fully built before the visitor has an account.
 * The finished payload is parked here, the visitor is sent to /auth, and the
 * request is submitted automatically once they are signed in.
 */
import type { NewBookingInput } from "@/lib/bookingsApi";

const KEY = "hgb:pending-request-v1";

export function savePendingRequest(input: NewBookingInput) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(input));
  } catch {
    /* quota — ignore */
  }
}

export function readPendingRequest(): NewBookingInput | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as NewBookingInput) : null;
  } catch {
    return null;
  }
}

export function clearPendingRequest() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
