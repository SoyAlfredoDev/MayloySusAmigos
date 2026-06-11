import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import { createInventoryLevelsWorkflow } from "@medusajs/medusa/core-flows";
import { seedPetCatalog } from "../data/pet-catalog-seed";

/**
 * Ejecutar con: npx medusa exec ./src/scripts/seed-pet-catalog.ts
 * Útil cuando la base ya tiene datos y quieres cargar el catálogo pet shop.
 */
export default async function seedPetCatalogScript({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);

  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  const shippingProfile = shippingProfiles[0];
  if (!shippingProfile) {
    throw new Error("No default shipping profile found. Run medusa:setup first.");
  }

  const [defaultSalesChannel] =
    await salesChannelModuleService.listSalesChannels({ name: "Default Sales Channel" });
  if (!defaultSalesChannel) {
    throw new Error("Default sales channel not found. Run medusa:setup first.");
  }

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  });
  const stockLocation = stockLocations[0];
  if (!stockLocation) {
    throw new Error("Stock location not found. Run medusa:setup first.");
  }

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  });

  if (existingCategories.length > 0) {
    logger.warn(
      `Ya existen ${existingCategories.length} categorías. Si quieres reemplazar el catálogo, elimina productos y categorías desde el Admin o resetea la base de datos.`,
    );
  }

  await seedPetCatalog(container, {
    shippingProfileId: shippingProfile.id,
    salesChannelId: defaultSalesChannel.id,
  });

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 100,
        inventory_item_id: item.id,
      })),
    },
  });

  logger.info("Inventory levels updated for pet catalog.");
}
