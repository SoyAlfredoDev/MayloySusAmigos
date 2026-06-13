import "dotenv/config";
import { PrismaClient, PetTypeFilter } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { getPooledDatabaseUrl } from "../src/lib/env/database";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: getPooledDatabaseUrl() }),
});

const categories = [
  {
    name: "Alimentos",
    description: "Alimento seco, húmedo y snacks para perros y gatos.",
    petType: "ALL" as PetTypeFilter,
    sortOrder: 1,
  },
  {
    name: "Accesorios",
    description: "Collares, correas, camas y juguetes.",
    petType: "ALL" as PetTypeFilter,
    sortOrder: 2,
  },
  {
    name: "Salud e higiene",
    description: "Shampoo, antiparasitarios y cuidado dental.",
    petType: "ALL" as PetTypeFilter,
    sortOrder: 3,
  },
];

const products = [
  {
    name: "Alimento Premium Perro Adulto 15kg",
    category: "alimentos",
    price: 45990,
    stock: 24,
    petType: "DOG" as PetTypeFilter,
    shortDescription: "Nutrición balanceada para perros adultos.",
    isFeatured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Alimento Gato Indoor 7kg",
    category: "alimentos",
    price: 32990,
    stock: 18,
    petType: "CAT" as PetTypeFilter,
    shortDescription: "Control de bolas de pelo, uso indoor.",
    isFeatured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1611003229186-80e40cd4f155?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Snack Dental Perro (pack x6)",
    category: "alimentos",
    price: 8990,
    stock: 40,
    petType: "DOG" as PetTypeFilter,
    shortDescription: "Ayuda a la higiene dental.",
    isFeatured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Correa Ajustable Nylon",
    category: "accesorios",
    price: 12990,
    stock: 30,
    petType: "ALL" as PetTypeFilter,
    shortDescription: "Resistente y cómoda para paseos diarios.",
    isFeatured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1608091988185-99807140162e?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Cama Ortopédica Mediana",
    category: "accesorios",
    price: 38990,
    stock: 10,
    petType: "DOG" as PetTypeFilter,
    shortDescription: "Espuma viscoelástica, funda lavable.",
    isFeatured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Juguete Mordedor Goma",
    category: "accesorios",
    price: 6990,
    stock: 50,
    petType: "DOG" as PetTypeFilter,
    shortDescription: "Estimula el juego y reduce ansiedad.",
    isFeatured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Shampoo Hipoalergénico 500ml",
    category: "salud-e-higiene",
    price: 9990,
    stock: 35,
    petType: "ALL" as PetTypeFilter,
    shortDescription: "Piel sensible, pH neutro.",
    isFeatured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1516734215736-a5f897f6117e?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Pipeta Antipulgas (perro 10-20kg)",
    category: "salud-e-higiene",
    price: 14990,
    stock: 22,
    petType: "DOG" as PetTypeFilter,
    shortDescription: "Protección mensual contra pulgas y garrapatas.",
    isFeatured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1450778867180-41d860edf686?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Cepillo Dental + Pasta Kit",
    category: "salud-e-higiene",
    price: 7990,
    stock: 28,
    petType: "ALL" as PetTypeFilter,
    shortDescription: "Kit completo para higiene bucal.",
    isFeatured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop&q=80",
  },
];

async function main() {
  console.log("🌱 Seed Mailo — categorías y productos...");

  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const slug = slugify(cat.name);
    const record = await prisma.category.upsert({
      where: { slug },
      update: {
        name: cat.name,
        description: cat.description,
        petType: cat.petType,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug,
        description: cat.description,
        petType: cat.petType,
        sortOrder: cat.sortOrder,
      },
    });
    categoryMap.set(slug, record.id);
    console.log(`  ✓ Categoría: ${record.name}`);
  }

  for (const item of products) {
    const slug = slugify(item.name);
    const sku = slugify(item.name).toUpperCase().replace(/-/g, "").slice(0, 16);
    const categoryId = categoryMap.get(item.category) ?? null;

    await prisma.product.upsert({
      where: { slug },
      update: {
        name: item.name,
        price: item.price,
        stock: item.stock,
        petType: item.petType,
        shortDescription: item.shortDescription,
        categoryId,
        isFeatured: item.isFeatured,
        isActive: true,
        imageUrls: [item.imageUrl],
      },
      create: {
        name: item.name,
        slug,
        sku,
        price: item.price,
        stock: item.stock,
        petType: item.petType,
        shortDescription: item.shortDescription,
        categoryId,
        isFeatured: item.isFeatured,
        isActive: true,
        imageUrls: [item.imageUrl],
        tags: [],
      },
    });
    console.log(`  ✓ Producto: ${item.name}`);
  }

  console.log("✅ Seed completado (tienda).");

  console.log("🌱 Seed Mailo — servicios y agendamiento...");

  const specialtyGeneral = await prisma.specialty.upsert({
    where: { slug: "medicina-general" },
    update: { name: "Medicina general", module: "VETERINARY" },
    create: {
      name: "Medicina general",
      slug: "medicina-general",
      description: "Consultas de rutina, controles y vacunas.",
      module: "VETERINARY",
    },
  });

  const specialtyDerma = await prisma.specialty.upsert({
    where: { slug: "dermatologia" },
    update: { name: "Dermatología", module: "VETERINARY" },
    create: {
      name: "Dermatología",
      slug: "dermatologia",
      description: "Alergias, piel y oídos.",
      module: "VETERINARY",
    },
  });

  const vetConsulta = await prisma.service.upsert({
    where: { slug: "consulta-general" },
    update: {
      name: "Consulta general",
      module: "VETERINARY",
      durationMinutes: 30,
      price: 25000,
      specialtyId: specialtyGeneral.id,
      isActive: true,
    },
    create: {
      name: "Consulta general",
      slug: "consulta-general",
      description: "Revisión clínica completa.",
      module: "VETERINARY",
      durationMinutes: 30,
      price: 25000,
      specialtyId: specialtyGeneral.id,
    },
  });

  await prisma.service.upsert({
    where: { slug: "vacunacion" },
    update: {
      name: "Vacunación",
      module: "VETERINARY",
      durationMinutes: 20,
      price: 18000,
      specialtyId: specialtyGeneral.id,
      isActive: true,
    },
    create: {
      name: "Vacunación",
      slug: "vacunacion",
      description: "Aplicación de vacunas según calendario.",
      module: "VETERINARY",
      durationMinutes: 20,
      price: 18000,
      specialtyId: specialtyGeneral.id,
    },
  });

  await prisma.service.upsert({
    where: { slug: "consulta-dermatologica" },
    update: {
      name: "Consulta dermatológica",
      module: "VETERINARY",
      durationMinutes: 40,
      price: 35000,
      specialtyId: specialtyDerma.id,
      isActive: true,
    },
    create: {
      name: "Consulta dermatológica",
      slug: "consulta-dermatologica",
      description: "Evaluación de piel, pelo y oídos.",
      module: "VETERINARY",
      durationMinutes: 40,
      price: 35000,
      specialtyId: specialtyDerma.id,
    },
  });

  const groomingServices = [
    {
      slug: "bano",
      name: "Baño",
      description: "Baño con shampoo hipoalergénico y secado.",
      durationMinutes: 45,
      price: 18000,
    },
    {
      slug: "corte",
      name: "Corte de pelo",
      description: "Corte según raza o preferencia del dueño.",
      durationMinutes: 60,
      price: 22000,
    },
    {
      slug: "bano-corte",
      name: "Baño + Corte",
      description: "Servicio completo de estética.",
      durationMinutes: 90,
      price: 35000,
    },
  ];

  for (const item of groomingServices) {
    await prisma.service.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        module: "GROOMING",
        durationMinutes: item.durationMinutes,
        price: item.price,
        isActive: true,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        module: "GROOMING",
        durationMinutes: item.durationMinutes,
        price: item.price,
      },
    });
    console.log(`  ✓ Servicio peluquería: ${item.name}`);
  }

  const vetDrMailo = await prisma.professional.upsert({
    where: { email: "vet.mailo@mailoyusamigos.cl" },
    update: {
      name: "Dr. Mailo",
      module: "VETERINARY",
      isActive: true,
    },
    create: {
      name: "Dr. Mailo",
      email: "vet.mailo@mailoyusamigos.cl",
      module: "VETERINARY",
      bio: "Médico veterinario — medicina general y preventiva.",
    },
  });

  const vetDrLuna = await prisma.professional.upsert({
    where: { email: "derma.luna@mailoyusamigos.cl" },
    update: {
      name: "Dra. Luna",
      module: "VETERINARY",
      isActive: true,
    },
    create: {
      name: "Dra. Luna",
      email: "derma.luna@mailoyusamigos.cl",
      module: "VETERINARY",
      bio: "Especialista en dermatología veterinaria.",
    },
  });

  const groomerCoco = await prisma.professional.upsert({
    where: { email: "coco@mailoyusamigos.cl" },
    update: {
      name: "Coco",
      module: "GROOMING",
      isActive: true,
    },
    create: {
      name: "Coco",
      email: "coco@mailoyusamigos.cl",
      module: "GROOMING",
      bio: "Peluquero canino con 8 años de experiencia.",
    },
  });

  const groomerMila = await prisma.professional.upsert({
    where: { email: "mila@mailoyusamigos.cl" },
    update: {
      name: "Mila",
      module: "GROOMING",
      isActive: true,
    },
    create: {
      name: "Mila",
      email: "mila@mailoyusamigos.cl",
      module: "GROOMING",
      bio: "Especialista en razas de pelo largo.",
    },
  });

  await prisma.professionalSpecialty.upsert({
    where: {
      professionalId_specialtyId: {
        professionalId: vetDrMailo.id,
        specialtyId: specialtyGeneral.id,
      },
    },
    update: {},
    create: {
      professionalId: vetDrMailo.id,
      specialtyId: specialtyGeneral.id,
    },
  });

  await prisma.professionalSpecialty.upsert({
    where: {
      professionalId_specialtyId: {
        professionalId: vetDrLuna.id,
        specialtyId: specialtyDerma.id,
      },
    },
    update: {},
    create: {
      professionalId: vetDrLuna.id,
      specialtyId: specialtyDerma.id,
    },
  });

  const professionals = [vetDrMailo, vetDrLuna, groomerCoco, groomerMila];
  const workDays = [1, 2, 3, 4, 5];

  for (const pro of professionals) {
    for (const dayOfWeek of workDays) {
      await prisma.schedule.upsert({
        where: {
          professionalId_dayOfWeek_startTime: {
            professionalId: pro.id,
            dayOfWeek,
            startTime: "09:00",
          },
        },
        update: {
          endTime: "18:00",
          slotMinutes: 30,
        },
        create: {
          professionalId: pro.id,
          dayOfWeek,
          startTime: "09:00",
          endTime: "18:00",
          slotMinutes: 30,
        },
      });
    }
    console.log(`  ✓ Horarios: ${pro.name}`);
  }

  console.log(`  ✓ Servicio vet: ${vetConsulta.name}`);
  console.log("✅ Seed agendamiento completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
