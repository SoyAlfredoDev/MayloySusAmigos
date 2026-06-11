import { MedusaContainer } from "@medusajs/framework";
import { ProductStatus } from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type SeedDeps = {
  shippingProfileId: string;
  salesChannelId: string;
};

const CATEGORIES = [
  {
    name: "Alimentos",
    description:
      "Alimentos secos, húmedos y snacks para perros y gatos de todas las edades.",
  },
  {
    name: "Accesorios",
    description:
      "Collares, camas, juguetes y todo lo que tu mascota necesita en el día a día.",
  },
  {
    name: "Salud y Higiene",
    description:
      "Shampoos, vitaminas, antipulgas y productos de cuidado veterinario.",
  },
] as const;

function buildProduct(
  categoryId: string,
  deps: SeedDeps,
  product: {
    title: string;
    handle: string;
    description: string;
    sku: string;
    price: number;
    imageSeed: string;
    weight?: number;
  },
) {
  return {
    title: product.title,
    handle: product.handle,
    description: product.description,
    category_ids: [categoryId],
    weight: product.weight ?? 500,
    status: ProductStatus.PUBLISHED,
    shipping_profile_id: deps.shippingProfileId,
    images: [
      {
        url: `https://picsum.photos/seed/${product.imageSeed}/600/600`,
      },
    ],
    variants: [
      {
        title: "Estándar",
        sku: product.sku,
        prices: [
          {
            amount: product.price,
            currency_code: "clp",
          },
        ],
      },
    ],
    sales_channels: [{ id: deps.salesChannelId }],
  };
}

export async function seedPetCatalog(
  container: MedusaContainer,
  deps: SeedDeps,
) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  logger.info("Seeding pet shop categories and products...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container,
  ).run({
    input: {
      product_categories: CATEGORIES.map((cat) => ({
        name: cat.name,
        description: cat.description,
        is_active: true,
      })),
    },
  });

  const cat = (name: (typeof CATEGORIES)[number]["name"]) =>
    categoryResult.find((c) => c.name === name)!.id;

  const productDefs = [
    buildProduct(cat("Alimentos"), deps, {
      title: "Royal Canin Adulto 15 kg",
      handle: "royal-canin-adulto-15kg",
      description:
        "Alimento seco premium para perros adultos. Fórmula balanceada con proteínas de alta digestibilidad y nutrientes para articulaciones.",
      sku: "ALI-RC-15",
      price: 45990,
      imageSeed: "royal-canin-adulto",
      weight: 15000,
    }),
    buildProduct(cat("Alimentos"), deps, {
      title: "Pro Plan Cachorro Pollo 3 kg",
      handle: "pro-plan-cachorro-pollo-3kg",
      description:
        "Nutrición especializada para cachorros. Con pollo como primer ingrediente y DHA para el desarrollo cerebral.",
      sku: "ALI-PP-3",
      price: 18990,
      imageSeed: "pro-plan-cachorro",
      weight: 3000,
    }),
    buildProduct(cat("Alimentos"), deps, {
      title: "Snack Dental Perro 500 g",
      handle: "snack-dental-perro-500g",
      description:
        "Premio masticable que ayuda a reducir la placa dental. Sabor a pollo, ideal como recompensa diaria.",
      sku: "ALI-SD-500",
      price: 8990,
      imageSeed: "snack-dental-perro",
      weight: 500,
    }),
    buildProduct(cat("Accesorios"), deps, {
      title: "Collar Ajustable Nylon",
      handle: "collar-ajustable-nylon",
      description:
        "Collar resistente de nylon con hebilla de seguridad. Disponible en varios colores, ajustable de 25 a 45 cm.",
      sku: "ACC-COL-01",
      price: 6990,
      imageSeed: "collar-nylon",
      weight: 80,
    }),
    buildProduct(cat("Accesorios"), deps, {
      title: "Cama Ortopédica Mediana",
      handle: "cama-ortopedica-mediana",
      description:
        "Cama con espuma viscoelástica para perros medianos (hasta 25 kg). Funda lavable y base antideslizante.",
      sku: "ACC-CAM-M",
      price: 34990,
      imageSeed: "cama-ortopedica",
      weight: 2500,
    }),
    buildProduct(cat("Accesorios"), deps, {
      title: "Pelota Interactiva con Sonido",
      handle: "pelota-interactiva-sonido",
      description:
        "Juguete que emite sonidos al moverse, estimula el instinto de caza y mantiene activa a tu mascota.",
      sku: "ACC-PEL-01",
      price: 9990,
      imageSeed: "pelota-interactiva",
      weight: 150,
    }),
    buildProduct(cat("Salud y Higiene"), deps, {
      title: "Shampoo Hipoalergénico 500 ml",
      handle: "shampoo-hipoalergenico-500ml",
      description:
        "Fórmula suave sin parabenos para pieles sensibles. Deja el pelaje brillante y con aroma fresco.",
      sku: "SAL-SHAM-500",
      price: 12990,
      imageSeed: "shampoo-hipoalergenico",
      weight: 500,
    }),
    buildProduct(cat("Salud y Higiene"), deps, {
      title: "Multivitaminas Mascota 60 comprimidos",
      handle: "multivitaminas-mascota-60",
      description:
        "Suplemento diario con vitaminas A, D, E y minerales esenciales. Refuerza el sistema inmune y la vitalidad.",
      sku: "SAL-VIT-60",
      price: 15990,
      imageSeed: "multivitaminas-mascota",
      weight: 120,
    }),
    buildProduct(cat("Salud y Higiene"), deps, {
      title: "Antipulgas Pipeta 3 unidades",
      handle: "antipulgas-pipeta-3",
      description:
        "Tratamiento tópico de amplio espectro contra pulgas y garrapatas. Protección hasta 30 días por aplicación.",
      sku: "SAL-AP-3",
      price: 11990,
      imageSeed: "antipulgas-pipeta",
      weight: 50,
    }),
  ];

  await createProductsWorkflow(container).run({
    input: {
      products: productDefs,
    },
  });

  logger.info("Finished seeding pet shop products.");
}
