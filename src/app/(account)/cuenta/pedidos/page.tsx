import { AccountPageHeader } from "@/components/account";

export const metadata = { title: "Mis Pedidos" };

export default function OrdersPage() {
  return (
    <AccountPageHeader
      title="Mis pedidos"
      description="Historial de compras (Fase 2)"
    />
  );
}
