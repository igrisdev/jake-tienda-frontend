import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";

export const useSearchProducts = () => {
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [productsSearch, setProductsSearch] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [focus, setFocus] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    if (pathname === "/search") {
      const q = searchParams.get("q") ?? "";
      setSearch(q);
    } else {
      setSearch("");
    }
  }, [pathname, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setProductsSearch([]);
      setSearchAttempted(false);
    }
  };

  const searchProducts = useCallback(async () => {
    if (debouncedSearch.trim().length < 1) {
      setProductsSearch([]);
      setSearchAttempted(false);
      return;
    }

    setLoading(true);
    setSearchAttempted(true);

    try {
      const res = await fetch(
        `/api/shopify/search?q=${encodeURIComponent(debouncedSearch)}`,
      );
      const data = await res.json();

      setProductsSearch(data.products);
    } catch (err) {
      setProductsSearch([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    searchProducts();
  }, [debouncedSearch, searchProducts]);

  const isView = search.trim().length > 0 && focus;

  return {
    handleChange,
    loading,
    isView,
    productsSearch,
    searchAttempted,
    setFocus,
    pathname,
    search,
  };
};
