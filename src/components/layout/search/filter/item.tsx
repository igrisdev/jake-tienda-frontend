"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ListItem, type PathFilterItem } from ".";
import Link from "next/link";
import { createUrl } from "@/lib/utils";
import type { SortFilterItem } from "@/lib/constants";
import clsx from "clsx";

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? "p" : Link;

  newParams.delete("q");
  newParams.delete("sort");
  newParams.delete("brands");
  newParams.delete("category");
  newParams.delete("types");
  newParams.delete("price_min");
  newParams.delete("price_max");
  newParams.delete("page");
  newParams.delete("after");
  newParams.delete("before");

  return (
    <li className="mt-2 flex text-black" key={item.title}>
      <DynamicTag
        href={createUrl(item.path, newParams)}
        className={clsx("w-full text-sm underline-offset-4 hover:underline", {
          "underline underline-offset-4": active,
        })}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

function SortFilterItem({ item }: { item: SortFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("sort") === item.slug;

  const newParams = new URLSearchParams();

  const q = searchParams.get("q");
  const brands = searchParams.getAll("brands");
  const category = searchParams.getAll("category");
  const types = searchParams.getAll("types");
  const priceMin = searchParams.get("price_min");
  const priceMax = searchParams.get("price_max");

  if (q) newParams.set("q", q);
  if (priceMin) newParams.set("price_min", priceMin);
  if (priceMax) newParams.set("price_max", priceMax);

  brands.forEach((brand) => newParams.append("brands", brand));
  category.forEach((cat) => newParams.append("category", cat));
  types.forEach((type) => newParams.append("types", type));

  if (item.slug) {
    newParams.set("sort", item.slug);
  }

  const href = createUrl(pathname, newParams);
  const DynamicTag = active ? "p" : Link;

  return (
    <li className="mt-2 flex text-sm text-black" key={item.title}>
      <DynamicTag
        prefetch={!active ? false : undefined}
        href={href}
        className={clsx("w-full hover:underline hover:underline-offset-4", {
          "underline underline-offset-4": active,
        })}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return "path" in item ? (
    <PathFilterItem item={item} />
  ) : (
    <SortFilterItem item={item} />
  );
}
