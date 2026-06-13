-- PetMembership: relación muchos-a-muchos usuario ↔ mascota
-- Migra datos existentes de pets.user_id antes de eliminar la columna.

CREATE TYPE "PetMembershipRole" AS ENUM ('OWNER', 'CAREGIVER');

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "privacyConsentAt" TIMESTAMP(3);

CREATE TABLE "pet_memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "role" "PetMembershipRole" NOT NULL DEFAULT 'OWNER',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pet_memberships_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pet_memberships_userId_petId_key" ON "pet_memberships"("userId", "petId");
CREATE INDEX "pet_memberships_petId_idx" ON "pet_memberships"("petId");

ALTER TABLE "pets" ADD COLUMN IF NOT EXISTS "createdById" TEXT;

INSERT INTO "pet_memberships" ("id", "userId", "petId", "role", "isPrimary", "createdAt")
SELECT
    'pm_' || "id",
    "userId",
    "id",
    'OWNER'::"PetMembershipRole",
    true,
    "createdAt"
FROM "pets"
WHERE "userId" IS NOT NULL
ON CONFLICT DO NOTHING;

UPDATE "pets" SET "createdById" = "userId" WHERE "userId" IS NOT NULL AND "createdById" IS NULL;

ALTER TABLE "pets" DROP CONSTRAINT IF EXISTS "pets_userId_fkey";
DROP INDEX IF EXISTS "pets_userId_isActive_idx";
ALTER TABLE "pets" DROP COLUMN IF EXISTS "userId";

CREATE INDEX IF NOT EXISTS "pets_isActive_idx" ON "pets"("isActive");

ALTER TABLE "pet_memberships" ADD CONSTRAINT "pet_memberships_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "pet_memberships" ADD CONSTRAINT "pet_memberships_petId_fkey"
    FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "pets" ADD CONSTRAINT "pets_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
