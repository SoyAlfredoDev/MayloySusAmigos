"use client";

import { useState } from "react";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminSalesTable } from "@/components/admin/shop/AdminSalesTable";
import { CategoryManager } from "@/components/admin/shop/CategoryManager";
import { ProductEditForm } from "@/components/admin/shop/ProductEditForm";
import { ProductForm } from "@/components/admin/shop/ProductForm";
import { ProductTable } from "@/components/admin/shop/ProductTable";
import { ShopAdminToolbar } from "@/components/admin/shop/ShopAdminToolbar";
import type { AdminOrderRow } from "@/lib/admin/shop/queries";
import type { AdminCategoryRow, AdminProductRow } from "@/lib/shop/mappers";
import { Card } from "@/components/ui/Card";

type Modal = "product" | "categories" | "edit" | null;

type ShopTiendaShellProps =
  | {
      active: "ventas";
      categories: AdminCategoryRow[];
      orders: AdminOrderRow[];
    }
  | {
      active: "productos";
      categories: AdminCategoryRow[];
      products: AdminProductRow[];
    };

export function ShopTiendaShell(props: ShopTiendaShellProps) {
  const { active, categories } = props;
  const [modal, setModal] = useState<Modal>(null);
  const [editingProduct, setEditingProduct] = useState<AdminProductRow | null>(
    null,
  );

  const closeModal = () => {
    setModal(null);
    setEditingProduct(null);
  };

  const openEdit = (product: AdminProductRow) => {
    setEditingProduct(product);
    setModal("edit");
  };

  return (
    <>
      <ShopAdminToolbar
        active={active}
        onNewProduct={() => setModal("product")}
        onCategories={() => setModal("categories")}
      />

      <Card className="mt-6 bg-surface p-0">
        {active === "ventas" ? (
          <AdminSalesTable orders={props.orders} embedded />
        ) : (
          <ProductTable products={props.products} onEdit={openEdit} />
        )}
      </Card>

      <AdminModal
        open={modal === "product"}
        title="Nuevo producto"
        onClose={closeModal}
        size="lg"
      >
        <ProductForm categories={categories} onSuccess={closeModal} />
      </AdminModal>

      <AdminModal
        open={modal === "categories"}
        title="Categorías"
        onClose={closeModal}
        size="lg"
      >
        <CategoryManager categories={categories} />
      </AdminModal>

      <AdminModal
        open={modal === "edit" && editingProduct !== null}
        title="Editar producto"
        onClose={closeModal}
        size="lg"
      >
        {editingProduct && (
          <ProductEditForm
            product={editingProduct}
            categories={categories}
          />
        )}
      </AdminModal>
    </>
  );
}
