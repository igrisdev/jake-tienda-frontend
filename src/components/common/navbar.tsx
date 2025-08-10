import Link from "next/link";
import Image from "next/image";

import Logo from "@/assets/logo/image.png";
import { ChevronDown } from "lucide-react";

import { brandDropdown } from "@/service/api/brand";
import { IDropDownMenu } from "@/types/navbar";
import { categoryDropdown } from "@/service/api/category";
import { MobileMenu } from "./movil-menu-drawer";
import { ShoppingCartDrawer } from "./shopping-cart-drawer";
import { SearchProducts } from "./search-products";

export interface IRoutes {
  name: string;
  href: string;
  dropdown?: IDropDownMenu[];
}

export const Navbar = async () => {
  const [categories, brands] = await Promise.allSettled([
    categoryDropdown(),
    brandDropdown(),
  ]);

  const routes: IRoutes[] = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/products" },
    {
      name: "Categorías",
      href: "/categories?category=",
      dropdown: categories.status === "fulfilled" ? categories.value : [],
    },
    {
      name: "Marcas",
      href: "/brands?brand=",
      dropdown: brands.status === "fulfilled" ? brands.value : [],
    },
    { name: "Crédito", href: "/credit" },
    { name: "Sobre Nosotros", href: "/about-us" },
  ];

  return (
    <>
      {/* Desktop */}
      <nav className="max-w-8xl fixed top-0 left-1/2 z-50 hidden h-[100px] w-full -translate-x-1/2 transform gap-4 border-b border-transparent bg-transparent px-4 pt-2 backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-gray-300 hover:bg-white/95 sm:flex">
        <section className="flex items-center">
          <Link href="/">
            <Image
              src={Logo ?? "/not-found.png"}
              alt="logo"
              width={100}
              height={50}
            />
          </Link>
        </section>

        <section className="grid flex-1 gap-4 md:px-5 lg:px-10 xl:px-20">
          <SearchProducts />

          <ul className="flex h-full text-sm lg:text-base">
            {routes.map((route) => {
              if (route.dropdown) {
                return (
                  <DropdownMenu
                    name={route.name}
                    drop={route.dropdown}
                    url={route.href}
                    key={route.name}
                  />
                );
              }

              return (
                <li key={route.name} className="h-full pr-6">
                  <Link href={route.href} className="h-full whitespace-nowrap">
                    {route.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="h-[44px] w-[48px]">
          <ShoppingCartDrawer />
        </section>
      </nav>

      {/* Mobile */}
      <nav className="fixed top-0 left-1/2 z-50 flex w-full -translate-x-1/2 transform flex-col gap-4 border-b border-gray-400 bg-white p-2 py-2 sm:hidden">
        <section className="flex items-center justify-between">
          <div>
            <MobileMenu routes={routes} />
          </div>

          <Link href="/">
            <Image
              src={Logo ?? "/not-found.png"}
              alt="logo"
              width={70}
              height={40}
            />
          </Link>

          <div className="h-[44px] w-[48px]">
            <ShoppingCartDrawer />
          </div>
        </section>

        <section className="px-2">
          <SearchProducts />
        </section>
      </nav>
    </>
  );
};

interface DropdownMenuProps {
  name: string;
  drop: IDropDownMenu[];
  url: string;
}

const DropdownMenu = ({ name, drop, url }: DropdownMenuProps) => (
  <li className="group">
    <span className="flex cursor-default items-center gap-1 pr-6 group-hover:text-blue-800">
      {name} <ChevronDown size={14} />
    </span>
    <div className="animate-fade-up animate-once animate-duration-100 animate-ease-out absolute top-full right-0 left-0 z-20 hidden w-full border-t border-b border-gray-300 bg-blue-50 pb-8 shadow-2xl group-hover:block">
      <h2 className="border-b border-gray-300 px-10 py-8 text-2xl font-medium md:px-20 lg:px-40">
        {name}
      </h2>

      <ul className="flex flex-wrap gap-4 px-10 py-4 md:px-20 lg:px-40">
        {drop.map((item) => (
          <li key={item.id}>
            <Link
              href={`${url}${item.name}`}
              className="block w-full px-5 py-2 hover:bg-blue-200"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </li>
);
