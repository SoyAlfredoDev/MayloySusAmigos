import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Appointments API — disponible en Fase 1" },
    { status: 501 },
  );
}
