import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CheckoutView } from "@/components/shop/CheckoutView";
import { PageContainer } from "@/components/shared/PageContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCartSummary } from "@/lib/cart/queries";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
  description: "Confirma tu pedido — Mailo y sus Amigos",
};

export default async function CheckoutPage() {
  const cart = await getCartSummary();
  if (cart.items.length === 0) {
    redirect("/tienda/carrito");
  }

  const session = await auth();
  const isLoggedIn = Boolean(session?.user?.id);

  const user = isLoggedIn
    ? await db.user.findUnique({
        where: { id: session!.user!.id, isActive: true },
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
          phone: true,
        },
      })
    : null;

  return (
    <PageContainer size="wide">
      <SectionHeader
        title="Finalizar compra"
        description={
          isLoggedIn
            ? "Tu pedido se guardará automáticamente en tu cuenta."
            : "Inicia sesión o continúa como invitado para registrar tu compra."
        }
      />
      <CheckoutView
        cart={cart}
        user={user}
        isLoggedIn={isLoggedIn}
      />
    </PageContainer>
  );
}
