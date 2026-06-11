import { Alert } from "@/components/ui/Alert";

export type MedusaError = "missing_publishable_key" | "fetch_failed" | null;

export interface MedusaStatusBannerProps {
  error: MedusaError;
}

export function MedusaStatusBanner({ error }: MedusaStatusBannerProps) {
  if (error === "missing_publishable_key") {
    return (
      <Alert title="Configura Medusa para ver productos" variant="warning">
        <p>
          Agrega{" "}
          <code className="rounded bg-surface-muted px-1">
            NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
          </code>{" "}
          y{" "}
          <code className="rounded bg-surface-muted px-1">
            NEXT_PUBLIC_MEDUSA_BACKEND_URL
          </code>{" "}
          en tu archivo <code className="rounded bg-surface-muted px-1">.env</code>.
          Consulta <strong>docs/MEDUSA_CLOUD.md</strong> para la guía completa.
        </p>
      </Alert>
    );
  }

  if (error === "fetch_failed") {
    return (
      <Alert title="No se pudo conectar al backend Medusa" variant="error">
        <p>
          Asegúrate de que el backend esté corriendo en{" "}
          <code className="rounded bg-surface-muted px-1">
            {process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
              "http://localhost:9000"}
          </code>
        </p>
      </Alert>
    );
  }

  return null;
}
