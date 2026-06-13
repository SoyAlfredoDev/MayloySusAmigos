import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPooledDatabaseUrl } from "@/lib/env/database";

export const dynamic = "force-dynamic";

/** Diagnóstico rápido de conexión Neon en producción */
export async function GET() {
  try {
    const host =
      getPooledDatabaseUrl().match(/@([^/]+)/)?.[1] ?? "unknown";
    const [products, categories] = await Promise.all([
      db.product.count({ where: { isActive: true } }),
      db.category.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({
      ok: true,
      host,
      products,
      categories,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
