import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Products API — disponible en Fase 2" },
    { status: 501 },
  );
}
