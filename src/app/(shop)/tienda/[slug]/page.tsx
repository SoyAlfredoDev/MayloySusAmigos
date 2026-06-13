import { PageContainer } from "@/components/shared/PageContainer";
import { ProductDetail, ShopPageHeader } from "@/components/shop";
import { EmptyState } from "@/components/ui/EmptyState";
import { getProductBySlug } from "@/lib/shop/queries";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.title ?? slug.replace(/-/g, " "),
    description: product?.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <PageContainer>
      <ShopPageHeader />
      <ProductDetail product={product} />
    </PageContainer>
  );
}
