import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Mercado Pago webhook — disponible en Fase 2" },
    { status: 501 },
  );
}
