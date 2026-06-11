import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-ink/10 bg-milo-800 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="text-lg font-bold">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-milo-100">{siteConfig.description}</p>
        </div>

        <div>
          <p className="font-semibold">Servicios</p>
          <ul className="mt-3 space-y-2 text-sm text-milo-100">
            {siteConfig.nav.main.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-milo-100">
            <li>{siteConfig.contact.email}</li>
            <li>{siteConfig.contact.phone}</li>
            <li>{siteConfig.contact.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-milo-700 py-4 text-center text-xs text-milo-200">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
          reservados.
        </p>
        <Link
          href={siteConfig.admin.href}
          className="mt-2 inline-block text-milo-300 hover:text-white"
        >
          {siteConfig.admin.label}
        </Link>
      </div>
    </footer>
  );
}
