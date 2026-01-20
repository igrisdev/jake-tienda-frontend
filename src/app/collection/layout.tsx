import { Header } from "@/components/collection/header";
import { getBannerJBL } from "@/lib/shopify";

export default async function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bannerJBLData = await getBannerJBL();

  return (
    <>
      <Header bannerJBLData={bannerJBLData} />

      <div className="max-w-9xl mx-auto flex flex-col gap-8 px-4 pt-6 pb-4 text-black md:flex-row">
        {children}
      </div>
    </>
  );
}
