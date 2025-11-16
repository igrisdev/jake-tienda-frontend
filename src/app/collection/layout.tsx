import { Header } from "@/components/collection/header";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="mx-auto flex max-w-9xl flex-col gap-8 px-4 pt-6 pb-4 text-black md:flex-row">
        {children}
      </div>
    </>
  );
}
