import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { TAGS } from "@/lib/constants";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // const topic = req.headers.get("x-shopify-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");

  // const collectionWebhooks = [
  //   "collections/create",
  //   "collections/delete",
  //   "collections/update",
  // ];
  // const productWebhooks = [
  //   "products/create",
  //   "products/delete",
  //   "products/update",
  // ];

  // const isCollectionUpdate = collectionWebhooks.includes(topic);
  // const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.");
    return NextResponse.json({ status: 200 });
  }

  // if (!isCollectionUpdate && !isProductUpdate) {
  //   return NextResponse.json({ status: 200 });
  // }

  // if (isCollectionUpdate) {
  //   revalidateTag(TAGS.collections);
  //   revalidatePath("/");
  //   revalidatePath("/search", "layout");
  //   revalidatePath("/search");
  // }

  // if (isProductUpdate) {
  //   revalidateTag(TAGS.products);
  //   revalidateTag(TAGS.collections);
  //   revalidatePath("/");
  //   revalidatePath("/search");
  //   revalidatePath("/search", "layout");
  // }

  revalidateTag(TAGS.products);
  revalidateTag(TAGS.collections);
  revalidatePath("/");
  revalidatePath("/search");
  // revalidatePath("/search", "layout");

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
