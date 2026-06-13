import { RegisterForm } from "@/components/auth";
import { PageContainer } from "@/components/shared/PageContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata = { title: "Crear cuenta" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <PageContainer size="narrow" className="py-12">
      <SectionHeader
        title="Crear cuenta"
        description="Regístrate para asociar mascotas, pedidos y citas en un solo lugar."
      />
      <div className="mt-8">
        <RegisterForm callbackUrl={callbackUrl ?? "/cuenta/perfil"} />
      </div>
    </PageContainer>
  );
}
