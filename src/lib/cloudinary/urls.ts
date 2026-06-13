const CLOUDINARY_HOST = "res.cloudinary.com";

export function parseCloudinaryUrls(value: FormDataEntryValue | null): string[] {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  return raw
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => isValidCloudinaryUrl(url));
}

export function isValidCloudinaryUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === CLOUDINARY_HOST &&
      parsed.pathname.length > 1
    );
  } catch {
    return false;
  }
}
