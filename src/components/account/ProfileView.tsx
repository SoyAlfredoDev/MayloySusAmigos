import Link from "next/link";
import { logoutUser } from "@/actions/auth/login";
import { ProfileAvatar } from "@/components/account/ProfileAvatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";
import type { UserProfile } from "@/lib/account/queries";

function getInitials(name: string, lastName: string | null): string {
  const first = name.trim().charAt(0).toUpperCase();
  const last = lastName?.trim().charAt(0).toUpperCase() ?? "";
  return `${first}${last}` || "?";
}

function formatMemberSince(date: Date): string {
  return new Intl.DateTimeFormat(siteConfig.locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

const quickLinks = [
  {
    label: "Mis mascotas",
    href: "/cuenta/mascotas",
    description: "Registra y comparte el cuidado de tus mascotas.",
    accent: "bg-milo-100 text-milo-800",
    icon: "M",
  },
  {
    label: "Mis citas",
    href: "/cuenta/citas",
    description: "Veterinaria y peluquería.",
    accent: "bg-clinical-100 text-clinical-600",
    icon: "C",
  },
  {
    label: "Mis pedidos",
    href: "/cuenta/pedidos",
    description: "Compras del pet shop.",
    accent: "bg-ink/5 text-ink",
    icon: "P",
  },
] as const;

export function ProfileView({ profile }: { profile: UserProfile }) {
  const fullName = [profile.name, profile.lastName].filter(Boolean).join(" ");
  const initials = getInitials(profile.name, profile.lastName);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-milo border-2 border-ink/10 bg-surface shadow-card">
        <div className="relative bg-gradient-to-br from-milo-700 via-milo-600 to-milo-500 bg-paw-pattern px-6 pb-20 pt-8 md:px-8 md:pb-24">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-milo-800/30 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-4 left-1/4 h-32 w-32 rounded-full bg-white/5 blur-xl"
            aria-hidden
          />

          <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:gap-8 md:text-left">
            <ProfileAvatar
              avatarUrl={profile.avatarUrl}
              fullName={fullName}
              initials={initials}
            />

            <div className="min-w-0 flex-1 text-white">
              <span className="inline-flex items-center rounded-pill border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-milo-50 backdrop-blur-sm">
                Tutor responsable
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">
                {fullName}
              </h1>
              <p className="mt-1 truncate text-milo-50">{profile.email}</p>
              {profile.phone && (
                <p className="mt-0.5 text-sm text-milo-100">{profile.phone}</p>
              )}
            </div>
          </div>
        </div>

        <div className="relative -mt-12 grid gap-3 px-6 pb-6 sm:grid-cols-2 md:grid-cols-4 md:gap-4 md:px-8">
          <StatCard
            label="Mascotas"
            value={profile.petsCount}
            href="/cuenta/mascotas"
          />
          <StatCard
            label="Citas"
            value={profile.appointmentsCount}
            href="/cuenta/citas"
          />
          <StatCard
            label="Pedidos"
            value={profile.ordersCount}
            href="/cuenta/pedidos"
          />
          <StatCard
            label="Miembro desde"
            value={formatMemberSince(profile.createdAt)}
            compact
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-ink">Datos de cuenta</h2>
          <dl className="mt-4 divide-y divide-surface-border">
            <InfoRow label="Nombre" value={fullName} />
            <InfoRow label="Correo" value={profile.email} />
            <InfoRow label="Teléfono" value={profile.phone ?? "Sin registrar"} />
            <InfoRow
              label="Comunicaciones"
              value={
                profile.marketingConsent
                  ? "Novedades y promociones activas"
                  : "Solo comunicaciones del servicio"
              }
            />
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-ink">Accesos rápidos</h2>
          <ul className="mt-4 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-start gap-3 rounded-xl border border-surface-border bg-surface-soft px-4 py-3 transition-all hover:border-milo-300 hover:bg-milo-50 hover:shadow-sm"
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${link.accent}`}
                    aria-hidden
                  >
                    {link.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="font-semibold text-ink group-hover:text-milo-700">
                      {link.label}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-muted">
                      {link.description}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Button href="/veterinaria" variant="primary">
          Agendar veterinaria
        </Button>
        <Button href="/peluqueria" variant="ghost">
          Reservar peluquería
        </Button>
      </section>

      <form action={logoutUser} className="border-t border-surface-border pt-4">
        <Button type="submit" variant="ghost" size="sm">
          Cerrar sesión
        </Button>
      </form>
    </div>
  );
}

function StatCard({
  label,
  value,
  compact = false,
  href,
}: {
  label: string;
  value: string | number;
  compact?: boolean;
  href?: string;
}) {
  const content = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-light">
        {label}
      </p>
      <p
        className={
          compact
            ? "mt-1 text-base font-bold capitalize text-ink"
            : "mt-1 text-2xl font-bold text-milo-700"
        }
      >
        {value}
      </p>
    </>
  );

  const className =
    "rounded-xl border-2 border-ink/10 bg-surface px-4 py-3 shadow-sm transition-colors hover:border-milo-300 hover:bg-milo-50/50";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}
