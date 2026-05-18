"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BookCard } from "@/components/bookCard";
import BookFilters from "@/components/bookFilters";

interface Livro {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  quantidade_disponivel: number;
}

const capas: Record<string, string> = {
  Romance: "/Capas de Livros/Romance.png",
  Tecnologia: "/Capas de Livros/Tecnologia.png",
  Historia: "/Capas de Livros/Historia.png",
  Ciencias: "/Capas de Livros/Ciencias.png",
  Infantil: "/Capas de Livros/Infantil.png",
};

export default function LivrosPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [livros, setLivros] = useState<Livro[]>([]);

  const buscarLivros = async () => {
    const params: Record<string, string> = {};
    if (search) {
      params.titulo = search;
    }

    if (category) {
      params.categoria = category;
    }

    const response = await axios.get("http://localhost:3001/livros", {
      params,
    });

    setLivros(Array.isArray(response.data) ? response.data : []);
  };

  const deletarLivro = async (id: string) => {
    await axios.delete(`http://localhost:3001/livros/${id}`);
    buscarLivros();
  };

  useEffect(() => {
  buscarLivros();},
  [search, category]);

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <div className="w-full max-w-[1100px] mx-auto px-[24px]">
        <div className="pt-4">
          <h1 className="font-medium text-[24px]">Livros</h1>

          <p className="text-[#717182] text-[16px]">
            Gerencie o acervo da biblioteca
          </p>
        </div>

        <BookFilters
          search={search}
          category={category}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {livros.map((livro) => (
            <BookCard
              key={livro.id}
              title={livro.titulo}
              author={livro.autor}
              category={livro.categoria}
              imageUrl={capas[livro.categoria]}
              availableQuantity={livro.quantidade_disponivel}
              onView={() => console.log(livro.id)}
              onBorrow={() => console.log(livro.id)}
              onDelete={() => deletarLivro(livro.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}