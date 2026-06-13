import type { PetTypeFilter } from "@prisma/client";

export const petTypeOptions = [
  { value: "ALL", label: "Todas" },
  { value: "DOG", label: "Perros" },
  { value: "CAT", label: "Gatos" },
  { value: "BIRD", label: "Aves" },
  { value: "FISH", label: "Peces" },
] as const;

export function parsePetType(value: FormDataEntryValue | null): PetTypeFilter {
  const v = String(value ?? "ALL");
  if (v === "DOG" || v === "CAT" || v === "BIRD" || v === "FISH" || v === "ALL") {
    return v;
  }
  return "ALL";
}

export function parseIntField(
  value: FormDataEntryValue | null,
  fallback = 0,
): number {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export const inputClass =
  "mt-1 w-full rounded-lg border-2 border-ink/10 px-3 py-2 text-sm";
