export type { ActionResult } from "@/actions/shop/types";

export type BookingActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string };
