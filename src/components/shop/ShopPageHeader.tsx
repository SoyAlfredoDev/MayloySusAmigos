import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ShopPageHeader() {
  return (
    <SectionHeader
      badge={<Badge>Pet Shop</Badge>}
      title="Pet Shop"
      description="Alimentos, accesorios y productos de salud e higiene para tu mascota."
    />
  );
}
