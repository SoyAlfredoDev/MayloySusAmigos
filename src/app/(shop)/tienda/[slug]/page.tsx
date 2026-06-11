import { PageContainer } from "@/components/shared/PageContainer";
import { ProductDetail } from "@/components/shop";
import { getRegionByCountry, medusa } from "@/lib/medusa/sdk";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " "),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    notFound();
  }

  const region = await getRegionByCountry(
    process.env.NEXT_PUBLIC_MEDUSA_REGION ?? "cl",
  );

  let product;
  try {
    const result = await medusa.store.product.list({
      handle: slug,
      region_id: region?.id,
      fields: "*variants.calculated_price,+metadata",
    });
    product = result.products[0];
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <PageContainer>
      <ProductDetail product={product} />
    </PageContainer>
  );
}
