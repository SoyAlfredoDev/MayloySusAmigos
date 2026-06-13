export type ActionResult =
  | { ok: true; message?: string; itemCount?: number }
  | { ok: false; error: string };
