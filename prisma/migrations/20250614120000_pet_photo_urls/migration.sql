-- Pet photos: single URL -> array of URLs
ALTER TABLE "pets" ADD COLUMN "photoUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "pets"
SET "photoUrls" = ARRAY["photoUrl"]
WHERE "photoUrl" IS NOT NULL AND "photoUrl" <> '';

ALTER TABLE "pets" DROP COLUMN "photoUrl";
