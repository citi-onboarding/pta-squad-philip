"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, BookOpen, Plus } from "lucide-react";
import { Button } from "../ui/button/button";
import { usePathname } from "next/navigation";
import logoCiti from "@/assets/icons/logoCiti_semfundo 1.png";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">
      <div className="flex items-center gap-4">
        <Image
          src={logoCiti}
          alt="Logo do Citi"
          className="h-8 w-auto object-contain"
        />
        <h1 className="text-xl font-medium text-gray-800">
          Biblioteca Escolar
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/">
          <Button
            text="Dashboard"
            icon={<Home size={20} />}
            iconPosition="left"
            variantColor={
              pathname === "/"
                ? "bg-[#E6F9F0] text-[#00C389]"
                : "bg-transparent text-gray-800 hover:bg-gray-50"
            }
            customSize="w-fit"
          />
        </Link>

        <Link href="/livros">
          <Button
            text="Livros"
            icon={<BookOpen size={20} />}
            iconPosition="left"
            variantColor={
              pathname === "/livros"
                ? "bg-[#E6F9F0] text-[#00C389]"
                : "bg-transparent text-gray-800 hover:bg-gray-50"
            }
            customSize="w-fit"
          />
        </Link>

        <Button
          text="Novo Livro"
          icon={<Plus size={20} />}
          iconPosition="left"
          variantColor="bg-[#00C389] text-white"
          customSize="w-fit"
          onClick={() => console.log("Funcionando!")}
        />
      </div>
    </header>
  );
}
