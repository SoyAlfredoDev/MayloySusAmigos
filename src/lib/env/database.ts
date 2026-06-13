/**
 * Resuelve URLs de Neon desde variables estándar o con prefijo Vercel.
 * En Vercel Storage → Neon, usa Custom Prefix: MAILO
 */
const VERCEL_PREFIX = "MAILO";

function prefixed(key: string): string | undefined {
  return process.env[`${VERCEL_PREFIX}_${key}`];
}

export function getPooledDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL ??
    prefixed("POSTGRES_URL") ??
    prefixed("POSTGRES_PRISMA_URL") ??
    prefixed("URL");

  if (!url) {
    throw new Error(
      `Falta DATABASE_URL o ${VERCEL_PREFIX}_POSTGRES_URL (Neon / Vercel Storage)`,
    );
  }

  // Ayuda en cold starts de Neon en serverless (Vercel)
  if (!url.includes("connect_timeout=")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}connect_timeout=15`;
  }

  return url;
}

/** Conexión directa (sin pooler) — migraciones Prisma */
export function getDirectDatabaseUrl(): string {
  return (
    process.env.DIRECT_URL ??
    prefixed("POSTGRES_URL_NON_POOLING") ??
    prefixed("URL_NON_POOLING") ??
    getPooledDatabaseUrl()
  );
}
