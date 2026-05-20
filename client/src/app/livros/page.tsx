"use client";

import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { BookCard } from "@/components/bookCard";
import BookFilters from "@/components/bookFilters";
import { LoanModal } from "@/components/loanModal";

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
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null);
  const [deleteError, setDeleteError] = useState("");

  // Estados do LoanModal
  const [loanOpen, setLoanOpen] = useState(false);
  const [livroEmprestimo, setLivroEmprestimo] = useState<Livro | null>(null);

  const buscarLivros = async () => {
    const params: Record<string, string> = {};
    if (search) params.titulo = search;
    if (category) params.categoria = category;

    const response = await axios.get("http://localhost:3001/livros", { params });
    setLivros(Array.isArray(response.data) ? response.data : []);
  };

  const deletarLivro = async () => {
    if (!livroSelecionado) return;

    try {
      await axios.delete(`http://localhost:3001/livros/${livroSelecionado.id}`);
      setLivros((livrosAtuais) =>
        livrosAtuais.filter((livro) => livro.id !== livroSelecionado.id)
      );
      setLivroSelecionado(null);
      setDeleteError("");
    } catch (error) {
      setDeleteError("Não foi possível excluir o livro. Tente novamente.");
    }
  };

  useEffect(() => {
    buscarLivros();
  }, [search, category]);

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <div className="w-full max-w-[1100px] mx-auto px-[24px] pb-4">
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
              onBorrow={() => {
                setLivroEmprestimo(livro);
                setLoanOpen(true);
              }}
              onDelete={() => setLivroSelecionado(livro)}
            />
          ))}
        </div>
      </div>

      <LoanModal
        open={loanOpen}
        onOpenChange={setLoanOpen}
        bookTitle={livroEmprestimo?.titulo ?? ""}
      />

      {livroSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Excluir livro</h2>
            <p className="mt-2 text-sm text-[#717182]">
              Tem certeza que deseja excluir o livro{" "}
              <strong>{livroSelecionado.titulo}</strong>?
            </p>
            {deleteError && (
              <p className="mt-3 text-sm text-red-600">{deleteError}</p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setLivroSelecionado(null);
                  setDeleteError("");
                }}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={deletarLivro}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}