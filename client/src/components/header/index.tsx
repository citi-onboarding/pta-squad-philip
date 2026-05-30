"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Plus, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCiti from "@/assets/icons/logoCiti_semfundo 1.png";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="relative w-full bg-white border-b-[0.83px] border-gray-200 z-50">
      <div className="flex items-center justify-between w-full h-[73px] px-6 md:px-10 lg:px-[100px] xl:px-[150px]">
        <div className="flex items-center gap-3 md:gap-4 h-full">
          <Image
            src={logoCiti}
            alt="Logo do Citi"
            className="h-8 w-auto object-contain"
          />
          <h1 className="text-xl font-medium text-gray-800">
            Biblioteca Escolar
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-6 h-[40px]">
          <Link href="/">
            <Button
              text="Dashboard"
              icon={<Home size={18} />}
              iconPosition="left"
              variantColor={
                pathname === "/"
                  ? "bg-[#E6F9F0] text-[#00C389]"
                  : "bg-transparent text-gray-800 hover:bg-gray-50"
              }
              customSize="w-fit h-[40px]"
              className="whitespace-nowrap text-sm md:text-base"
            />
          </Link>

          <Link href="/livros">
            <Button
              text="Livros"
              icon={<BookOpen size={18} />}
              iconPosition="left"
              variantColor={
                pathname === "/livros"
                  ? "bg-[#E6F9F0] text-[#00C389]"
                  : "bg-transparent text-gray-800 hover:bg-gray-50"
              }
              customSize="w-fit h-[40px]"
              className="whitespace-nowrap text-sm md:text-base"
            />
          </Link>

          <Link href="/livros/novo">
            <Button
              text="Novo Livro"
              icon={<Plus size={18} />}
              iconPosition="left"
              variantColor="bg-[#00C389] text-white"
              customSize="w-fit h-[40px]"
              className="whitespace-nowrap text-sm md:text-base"
            />
          </Link>
        </div>

        <div className="flex md:hidden items-center relative">
          <button onClick={toggleMenu} className="p-2 text-gray-800">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {isMenuOpen && (
            <div className="absolute top-[50px] right-0 w-48 bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col p-3 gap-2 z-50">
              <Link href="/" onClick={toggleMenu}>
                <Button
                  text="Dashboard"
                  icon={<Home size={18} />}
                  iconPosition="left"
                  variantColor={
                    pathname === "/"
                      ? "bg-[#E6F9F0] text-[#00C389]"
                      : "bg-transparent text-gray-800 hover:bg-gray-50"
                  }
                  customSize="w-full h-[40px]"
                />
              </Link>

              <Link href="/livros" onClick={toggleMenu}>
                <Button
                  text="Livros"
                  icon={<BookOpen size={18} />}
                  iconPosition="left"
                  variantColor={
                    pathname === "/livros"
                      ? "bg-[#E6F9F0] text-[#00C389]"
                      : "bg-transparent text-gray-800 hover:bg-gray-50"
                  }
                  customSize="w-full h-[40px]"
                />
              </Link>

              <div className="h-[1px] w-full bg-gray-100 my-1" />
              <Link href="/livros/novo" onClick={toggleMenu}>
                <Button
                  text="Novo Livro"
                  icon={<Plus size={18} />}
                  iconPosition="left"
                  variantColor="bg-[#00C389] text-white"
                  customSize="w-full h-[40px]"
                  onClick={() => {
                    console.log("Funcionando!");
                  }}
                />
                </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
