import { AccountSidebar } from "@/components/shared/AccountSidebar";
import { Header } from "@/components/shared/Header";
import { getCartItemCount } from "@/lib/cart/cookie-cart";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cartItemCount = await getCartItemCount();

  return (
    <>
      <Header cartItemCount={cartItemCount} />
      <div className="mx-auto flex max-w-7xl flex-1 gap-8 px-4 py-10 md:px-6">
        <AccountSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}
