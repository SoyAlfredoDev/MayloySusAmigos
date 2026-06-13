import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { AdminClientRow } from "@/lib/admin/clients/queries";
import { siteConfig } from "@/config/site";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(siteConfig.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function fullName(client: AdminClientRow): string {
  return [client.name, client.lastName].filter(Boolean).join(" ");
}

export function AdminClientsTable({ clients }: { clients: AdminClientRow[] }) {
  return (
    <Card className="mt-6 bg-surface p-0">
      <div className="border-b border-ink/10 px-6 py-5">
        <h2 className="text-lg font-bold text-ink">Clientes</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {clients.length} cliente(s) registrados en la plataforma.
        </p>
      </div>

      {clients.length === 0 ? (
        <p className="px-6 py-10 text-sm text-ink-muted">
          Aún no hay clientes registrados.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-surface-soft text-xs font-semibold uppercase tracking-wide text-ink-muted">
                <th className="px-6 py-3">Cliente</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Mascotas</th>
                <th className="px-4 py-3">Pedidos</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-6 py-3">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="transition-colors hover:bg-surface-soft/80"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-ink">{fullName(client)}</p>
                    <p className="text-xs text-ink-muted">{client.email}</p>
                  </td>
                  <td className="px-4 py-4 text-ink-muted">
                    {client.phone ?? "—"}
                  </td>
                  <td className="px-4 py-4">{client.petsCount}</td>
                  <td className="px-4 py-4">{client.ordersCount}</td>
                  <td className="px-4 py-4">
                    {client.isActive ? (
                      <Badge>Activo</Badge>
                    ) : (
                      <span className="text-xs font-semibold text-ink-light">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-ink-muted">
                    {formatDate(client.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
