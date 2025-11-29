"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Drawer } from "./drawer"; // Usa el componente de cajón
import {
  Menu as MenuIcon,
  X,
  Home,
  PackageSearch,
  Grid2X2,
  BadgeCheck,
  CreditCard,
  Info,
  ChevronDown,
} from "lucide-react";
import { useDrawer } from "@/hooks/useDrawer";
import { Menu } from "@/lib/shopify/types";

type ExpandState = Record<string, boolean>;

export const MobileMenu = ({ routes }: { routes: Menu[] }) => {
  const { open, setOpen, drawerRef, toggleDrawer } = useDrawer();

  const [expand, setExpand] = useState<ExpandState>({});

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setOpen]);

  const toggle = (key: string) =>
    setExpand((prev) => ({ ...prev, [key]: !prev[key] }));

  const iconFor = (label: string) => {
    const name = label.toLowerCase();
    if (name.includes("inicio")) return <Home size={18} />;
    if (name.includes("producto")) return <PackageSearch size={18} />;
    if (name.includes("categorías") || name.includes("categorias"))
      return <Grid2X2 size={18} />;
    if (name.includes("marca")) return <BadgeCheck size={18} />;
    if (name.includes("crédito") || name.includes("credito"))
      return <CreditCard size={18} />;
    if (name.includes("sobre") || name.includes("acerca"))
      return <Info size={18} />;
    return <PackageSearch size={18} />;
  };

  return (
    <>
      <button
        onClick={toggleDrawer}
        className="cursor-pointer p-2 sm:hidden"
        aria-label="Abrir menú"
      >
        <MenuIcon />
      </button>

      <Drawer open={open} onClose={() => setOpen(false)} ref={drawerRef}>
        <div className="mb-2 flex justify-end">
          <button onClick={() => setOpen(false)} aria-label="Cerrar menú">
            <X />
          </button>
        </div>

        <nav className="flex flex-col">
          {routes.map((route) => {
            const hasChildren =
              Array.isArray(route.children) && route.children.length > 0;

            if (!hasChildren) {
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-blue-700">{iconFor(route.title)}</span>
                  <span>{route.title}</span>
                </Link>
              );
            }

            const isOpen = !!expand[route.title];

            return (
              <div key={route.title} className="flex flex-col">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm hover:bg-blue-50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle(route.title);
                  }}
                  aria-expanded={isOpen}
                  aria-controls={`section-${route.title}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-blue-700">
                      {iconFor(route.title)}
                    </span>
                    <span>{route.title}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={`section-${route.title}`}
                  className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="ml-9 max-h-72 overflow-auto border-l border-blue-100 pl-3">
                    {route.children!.map((item) => {
                      const hasChildren =
                        Array.isArray(item.children) &&
                        item.children.length > 0;

                      if (hasChildren) {
                        return (
                          <li key={item.title}>
                            <Link
                              href={
                                item.path +
                                "?title=Categoría" +
                                "&collection=" +
                                item.title
                              }
                              className="block rounded-md px-2 py-2 text-sm hover:bg-blue-50"
                              onClick={() => setOpen(false)}
                            >
                              {item.title}
                            </Link>
                            <ul className="ml-4 max-h-72 overflow-auto border-l border-blue-100 pl-2">
                              {item.children!.map((item) => (
                                <Link
                                  key={item.title}
                                  href={
                                    item.path +
                                    "?title=Subcategoría" +
                                    "&collection=" +
                                    item.title
                                  }
                                  className="block rounded-md px-2 py-2 text-sm hover:bg-blue-50"
                                  onClick={() => setOpen(false)}
                                >
                                  {item.title}
                                </Link>
                              ))}
                            </ul>
                          </li>
                        );
                      }

                      return (
                        <li key={item.title}>
                          <Link
                            href={
                              item.path +
                              "?title=Categoría" +
                              "&collection=" +
                              item.title
                            }
                            className="block rounded-md px-2 py-2 text-sm hover:bg-blue-50"
                            onClick={() => setOpen(false)}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>
      </Drawer>
    </>
  );
};
