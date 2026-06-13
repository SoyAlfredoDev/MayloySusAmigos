import { LoginForm } from "@/components/auth";
import { PageContainer } from "@/components/shared/PageContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata = { title: "Iniciar sesión" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <PageContainer size="narrow" className="py-12">
      <SectionHeader
        title="Iniciar sesión"
        description="Accede a tus mascotas, citas y pedidos."
      />
      <div className="mt-8">
        <LoginForm callbackUrl={callbackUrl ?? "/cuenta/perfil"} />
      </div>
    </PageContainer>
  );
}
