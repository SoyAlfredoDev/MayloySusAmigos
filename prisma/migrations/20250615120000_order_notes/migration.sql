-- Renombrar notas del pedido: comentarios del cliente + notas internas admin
ALTER TABLE "orders" ADD COLUMN "customerNotes" TEXT;
ALTER TABLE "orders" ADD COLUMN "adminNotes" TEXT;

UPDATE "orders"
SET "adminNotes" = "notes"
WHERE "notes" IS NOT NULL AND "notes" <> '';

ALTER TABLE "orders" DROP COLUMN "notes";
