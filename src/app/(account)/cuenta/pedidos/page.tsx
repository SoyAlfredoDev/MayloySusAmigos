import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth/session";
import { fetchUserOrders } from "@/actions/shop/orders";
import { AccountPageHeader, OrdersList } from "@/components/account";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mis Pedidos" };

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ nuevo?: string }>;
}) {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/cuenta/ingresar?callbackUrl=/cuenta/pedidos");
  }

  const { nuevo } = await searchParams;
  const orders = await fetchUserOrders();

  return (
    <div>
      <AccountPageHeader
        title="Mis pedidos"
        description="Historial de compras del pet shop. También puedes revisar tus citas y mascotas desde el menú de cuenta."
      />
      <OrdersList orders={orders} newOrderId={nuevo} />
    </div>
  );
}
