"use client";

import { Button } from "@/components/ui/Button";
import {
  AdminToolbar,
  adminToolbarButtonClass,
} from "@/components/admin/AdminToolbar";
import { cn } from "@/lib/utils";

export function ShopAdminToolbar({
  active,
  onNewProduct,
  onCategories,
}: {
  active: "productos" | "ventas";
  onNewProduct: () => void;
  onCategories: () => void;
}) {
  return (
    <AdminToolbar>
      <Button
        type="button"
        variant="cta"
        className={adminToolbarButtonClass}
        onClick={onNewProduct}
      >
        Nuevo producto
      </Button>
      <Button
        type="button"
        variant="primary"
        className={adminToolbarButtonClass}
        onClick={onCategories}
      >
        Categorías
      </Button>
      <Button
        variant={active === "productos" ? "primary" : "ghost"}
        href="/admin/tienda/productos"
        className={cn(
          adminToolbarButtonClass,
          active === "productos" && "pointer-events-none",
        )}
        aria-current={active === "productos" ? "page" : undefined}
      >
        Productos
      </Button>
      <Button
        variant={active === "ventas" ? "primary" : "ghost"}
        href="/admin/tienda"
        className={cn(
          adminToolbarButtonClass,
          active === "ventas" && "pointer-events-none",
        )}
        aria-current={active === "ventas" ? "page" : undefined}
      >
        Ventas
      </Button>
    </AdminToolbar>
  );
}
