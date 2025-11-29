"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FiltersSidebar } from "../layout/search/filters-sidebar";

export function MobileFilters() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="flex w-full items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold"
        aria-label="Abrir filtros"
      >
        <Bars3Icon className="h-5 w-5" />
        FILTROS
      </button>

      {isSidebarOpen && (
        <>
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-50 bg-black/50"
            aria-hidden="true"
          />

          <dialog
            className="fixed top-0 left-0 z-50 flex h-full w-4/5 max-w-xs transform flex-col bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out"
            aria-modal="true"
          >
            <div className="flex-1 overflow-y-auto">
              <FiltersSidebar />
            </div>
          </dialog>
        </>
      )}
    </div>
  );
}
