import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { getPooledDatabaseUrl } from "@/lib/env/database";

/**
 * Bump when el schema Prisma cambia para invalidar el singleton en dev.
 * Tras cambiar esto: `rm -rf .next && npx prisma generate` y reiniciar `npm run dev`.
 */
const PRISMA_SCHEMA_VERSION = "20250615140000_order_number";

function createPrismaClient() {
  const connectionString = getPooledDatabaseUrl();
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchemaVersion?: string;
};

function getPrismaClient(): PrismaClient {
  if (
    process.env.NODE_ENV !== "production" &&
    globalForPrisma.prismaSchemaVersion !== PRISMA_SCHEMA_VERSION
  ) {
    void globalForPrisma.prisma?.$disconnect();
    globalForPrisma.prisma = undefined;
    globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
    }
  }

  return globalForPrisma.prisma;
}

/** Proxy evita que Turbopack/HMR retenga un PrismaClient viejo en `export const db`. */
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});
