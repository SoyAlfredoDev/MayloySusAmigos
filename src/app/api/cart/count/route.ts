import { NextResponse } from "next/server";
import { getCartItemCount } from "@/lib/cart/cookie-cart";

export async function GET() {
  const count = await getCartItemCount();
  return NextResponse.json({ count });
}
