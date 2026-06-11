import { PageContainer } from "@/components/shared/PageContainer";
import { SiteShell } from "@/components/shared/SiteShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { adminConfig } from "@/config/admin";

export const metadata = {
  title: "Panel Administrativo",
  description: "Gestión de productos, inventario y pedidos de la tienda Mailo.",
};

const adminSteps = [
  {
    title: "Ver y buscar productos",
    desc: "Catálogo completo con filtros, variantes y stock.",
  },
  {
    title: "Crear y editar",
    desc: "Título, descripción, imágenes, precios en CLP y categorías.",
  },
  {
    title: "Publicar en la tienda",
    desc: 'Estado "Published" + Sales Channel activo = visible en /tienda.',
  },
  {
    title: "Gestionar pedidos",
    desc: "Seguimiento de compras, envíos y pagos.",
  },
];

export default function AdminBridgePage() {
  return (
    <SiteShell variant="shop">
      <PageContainer size="narrow" className="py-16">
        <Badge>Medusa Admin</Badge>
        <h1 className="section-title mt-4">Panel Administrativo</h1>
        <p className="mt-3 text-ink-muted">
          La gestión de productos se realiza en Medusa Admin, el panel
          profesional incluido con el motor de e-commerce. Desde ahí puedes
          crear, editar y publicar productos que aparecen automáticamente en la
          tienda.
        </p>

        <div className="mt-8">
          <Button variant="cta" href={adminConfig.medusaAdminUrl} external>
            Abrir Medusa Admin →
          </Button>
        </div>

        <Card className="mt-8 bg-milo-50">
          <p className="text-sm font-semibold text-milo-800">Acceso local</p>
          <p className="mt-2 text-sm text-ink-muted">
            URL:{" "}
            <code className="rounded bg-surface px-1">
              {adminConfig.medusaAdminUrl}
            </code>
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Usuario por defecto:{" "}
            <code className="rounded bg-surface px-1">
              {adminConfig.defaultAdminEmail}
            </code>
          </p>
          <p className="mt-3 text-xs text-ink-light">
            Primera vez: ejecuta{" "}
            <code className="rounded bg-surface px-1">npm run medusa:setup</code>
          </p>
        </Card>

        <div className="mt-10 space-y-4">
          <h2 className="text-lg font-bold text-ink">Qué puedes hacer</h2>
          {adminSteps.map((step, i) => (
            <Card key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-milo-500 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{step.title}</p>
                <p className="text-sm text-ink-muted">{step.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-sm text-ink-light">
          Guía completa en{" "}
          <strong>docs/ADMIN_PANEL.md</strong>
        </p>
      </PageContainer>
    </SiteShell>
  );
}
