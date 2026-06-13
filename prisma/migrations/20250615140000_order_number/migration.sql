-- Número de pedido legible para cliente y admin
ALTER TABLE "orders" ADD COLUMN "orderNumber" TEXT;

WITH numbered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) AS rn
  FROM "orders"
)
UPDATE "orders" AS o
SET "orderNumber" = 'ML-' || LPAD(n.rn::text, 6, '0')
FROM numbered AS n
WHERE o.id = n.id;

ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET NOT NULL;
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");
