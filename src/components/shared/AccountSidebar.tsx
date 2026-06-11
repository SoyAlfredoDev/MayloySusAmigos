import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";

export function AccountSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <Card className="sticky top-24 space-y-1 p-4">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-light">
          Mi cuenta
        </p>
        {siteConfig.nav.account.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-milo-50 hover:text-milo-700"
          >
            {item.label}
          </Link>
        ))}
      </Card>
    </aside>
  );
}
