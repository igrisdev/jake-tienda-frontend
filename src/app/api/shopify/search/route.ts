import { searchProducts } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  try {
    const { products, filters } = await searchProducts({ query, first: 20 });

    return NextResponse.json({ products, filters });
  } catch (error) {
    return new NextResponse("Server Error", { status: 500 });
  }
}
