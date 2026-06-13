import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink/10 bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-6">
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <Link
            href="/admin/tienda"
            className="shrink-0"
            aria-label="Panel administrativo"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteConfig.logo.src}
              alt=""
              width={74}
              height={100}
              className="block h-10 w-auto object-contain md:h-12"
              decoding="async"
            />
          </Link>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-bold text-milo-700">Panel Admin</p>
            <p className="truncate text-xs text-ink-muted">{siteConfig.name}</p>
          </div>
        </div>

        <AdminNav />

        <Button
          variant="ghost"
          size="sm"
          href="/"
          className="shrink-0"
        >
          ← Volver
        </Button>
      </div>
    </header>
  );
}
