import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink/10 bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/admin/tienda" className="shrink-0" aria-label="Panel administrativo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteConfig.logo.src}
              alt=""
              width={74}
              height={100}
              className="block h-12 w-auto object-contain"
              decoding="async"
            />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-milo-700">Panel Admin</p>
            <p className="truncate text-xs text-ink-muted">{siteConfig.name}</p>
          </div>
        </div>

        <Button variant="ghost" size="sm" href="/">
          ← Volver al sitio
        </Button>
      </div>
    </header>
  );
}
