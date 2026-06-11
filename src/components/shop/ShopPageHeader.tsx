import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ShopPageHeader() {
  return (
    <SectionHeader
      badge={<Badge>Powered by Medusa</Badge>}
      title="Pet Shop"
      description="Alimentos, accesorios y productos de salud e higiene para tu mascota."
      action={
        <Button
          variant="cta"
          size="sm"
          href={
            process.env.NEXT_PUBLIC_MEDUSA_STOREFRONT_URL ??
            "http://localhost:8000/cl"
          }
          external
        >
          Ir al checkout Medusa →
        </Button>
      }
    />
  );
}
