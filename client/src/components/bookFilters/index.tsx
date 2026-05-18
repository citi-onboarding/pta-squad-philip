"use client";

import { useState } from "react";
import { Filter } from "lucide-react";

type BookFiltersProps = {
  search: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

export default function BookFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}: BookFiltersProps) {
  const [openFilters, setOpenFilters] = useState(false);

  return (
    <div className="mt-6 rounded-[8px] border border-[#E4E4E7] bg-white px-4 py-5 shadow-[0px_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex gap-4">
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por título ou autor..."
          className="
            h-[42px]
            w-full
            rounded-[6px]
            border
            border-[#E4E4E7]
            bg-white
            px-4
            text-sm
            text-[#717182]
            outline-none
          "
        />

        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="
            hidden
            md:block
            h-[42px]
            w-[160px]
            rounded-[6px]
            border
            border-[#E4E4E7]
            bg-white
            px-4
            text-sm
            text-[#717182]
            outline-none
          "
        >
          <option value="">Todas</option>
          <option value="Romance">Romance</option>
          <option value="Tecnologia">Tecnologia</option>
          <option value="Historia">História</option>
          <option value="Ciencias">Ciências</option>
          <option value="Infantil">Infantil</option>
        </select>

        {/* Botão mobile */}
        <button
          onClick={() => setOpenFilters(!openFilters)}
          className="
            flex
            md:hidden
            h-[42px]
            w-[42px]
            items-center
            justify-center
            rounded-[6px]
            border
            border-[#E4E4E7]
            bg-white
            shrink-0
          "
        >
          <Filter size={18} className="text-[#717182]" />
        </button>
      </div>

      {/* Menu mobile */}
      {openFilters && (
        <div className="mt-4 md:hidden">
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="
              h-[42px]
              w-full
              rounded-[6px]
              border
              border-[#E4E4E7]
              bg-white
              px-4
              text-sm
              text-[#717182]
              outline-none
            "
          >
            <option value="">Todas</option>
            <option value="Romance">Romance</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Historia">História</option>
            <option value="Ciencias">Ciências</option>
            <option value="Infantil">Infantil</option>
          </select>
        </div>
      )}
    </div>
  );
}