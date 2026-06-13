export type AuthActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string };
