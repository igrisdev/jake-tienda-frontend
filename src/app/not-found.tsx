import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-117px)] w-full flex-col items-center justify-center gap-4 sm:h-[calc(100vh-100px)]">
      <h2 className="text-3xl font-bold">
        Lo sentimos, no encontramos esa página.
      </h2>

      <p className="text-lg">Revisa la URL y prueba de nuevo.</p>
      <Link href="/" className="rounded-xs bg-blue-500 px-6 py-2 text-white">
        Volver a la tienda
      </Link>
    </div>
  );
}
