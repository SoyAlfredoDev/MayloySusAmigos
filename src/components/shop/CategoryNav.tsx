import Link from "next/link";
import clsx from "clsx";
import type { ShopCategory } from "@/types/shop";

export interface CategoryNavProps {
  categories: ShopCategory[];
  activeSlug?: string;
}

export function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  if (categories.length === 0) return null;

  return (
    <nav
      className="mt-8 flex flex-wrap gap-2"
      aria-label="Filtrar por categoría"
    >
      <Link
        href="/tienda"
        className={clsx(
          "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
          !activeSlug
            ? "bg-milo-600 text-white"
            : "bg-milo-50 text-ink hover:bg-milo-100",
        )}
      >
        Todos
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/tienda?categoria=${category.slug}`}
          className={clsx(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            activeSlug === category.slug
              ? "bg-milo-600 text-white"
              : "bg-milo-50 text-ink hover:bg-milo-100",
          )}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
