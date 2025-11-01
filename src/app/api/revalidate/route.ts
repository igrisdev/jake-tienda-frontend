import { NextRequest, NextResponse } from "next/server";

// Asumo que tienes tus TAGS definidos en alguna parte
// import { TAGS } from "@/lib/constants";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const topic = req.headers.get("x-shopify-topic") || "unknown";
  const secretFromUrl = req.nextUrl.searchParams.get("secret");
  const secretFromEnv = process.env.SHOPIFY_REVALIDATION_SECRET;

  // --- INICIO DE DEPURACIÓN ---
  console.log("--- INICIANDO PROCESO DE REVALIDACIÓN ---");
  console.log("Tópico recibido de Shopify:", topic);

  // Imprimimos los dos valores que vamos a comparar
  console.log("Secret recibido en la URL:", secretFromUrl);
  console.log("Secret configurado en las variables de entorno:", secretFromEnv);

  // Verifiquemos si la variable de entorno siquiera existe
  if (!secretFromEnv) {
    console.error(
      "¡ERROR CRÍTICO! La variable de entorno SHOPIFY_REVALIDATION_SECRET no está definida en el entorno de la función.",
    );
  }
  // --- FIN DE DEPURACIÓN ---

  if (secretFromUrl !== secretFromEnv) {
    console.error("Los secrets NO coinciden. Abortando revalidación.");
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  // ... (el resto de tu lógica de revalidación sigue aquí)
  console.log("Secrets coinciden. Procediendo con la revalidación...");

  // ... tu código de revalidateTag y revalidatePath ...

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
