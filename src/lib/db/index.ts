import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { getPooledDatabaseUrl } from "@/lib/env/database";

/** Bump when el schema Prisma cambia para invalidar el singleton en dev. */
const PRISMA_SCHEMA_VERSION = "20250613150000_pet_memberships_auth";

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

if (
  process.env.NODE_ENV !== "production" &&
  globalForPrisma.prismaSchemaVersion !== PRISMA_SCHEMA_VERSION
) {
  void globalForPrisma.prisma?.$disconnect();
  globalForPrisma.prisma = undefined;
  globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
