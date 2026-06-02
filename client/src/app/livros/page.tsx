"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { BookCard } from "@/components/bookCard";
import BookFilters from "@/components/bookFilters";
import { BookDetailModal } from "@/components/BookDetailModal/BookDetailModal";
import { LoanModal } from "@/components/loanModal";
import { createLoan } from "@/services/loanPayload";
import { categoryImageMap } from "@/lib/categoryMap";

interface Livro {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  quantidade_disponivel: number;
}

export default function LivrosPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [livros, setLivros] = useState<Livro[]>([]);
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [bookDetailId, setBookDetailId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Controls whether the loan modal is open or closed
  const [loanOpen, setLoanOpen] = useState(false);

  // Stores the selected book for the loan modal
  const [livroLoan, setBookLoan] = useState<Livro | null>(null);

  // Stores API errors returned while creating a loan
  const [loanError, setLoanError] = useState<string | null>(null);

  // Fetches books from the backend using search and category filters
  const buscarLivros = async () => {
    const params: Record<string, string> = {};

    if (search) {
      params.titulo = search;
    }

    if (category) {
      params.categoria = category;
    }

    const response = await api.get("/livros", {
      params,
    });

    setLivros(Array.isArray(response.data) ? response.data : []);
  };

  // Creates a loan using the data received from the loan modal
  const handleConfirmarEmprestimo = async (data: {
    nome_cliente: string;
    email_cliente: string;
    data_prevista_devolucao: string;
    data_locacao: string;
  }) => {
    if (!livroLoan) return;

    try {
      setLoanError(null);

      const dataString = data.data_prevista_devolucao;

      const dataObjeto = new Date(`${dataString}T12:00:00`);

      await createLoan({
        livro_id: String(livroLoan.id),
        nome_cliente: data.nome_cliente,
        email_cliente: data.email_cliente,
        data_prevista_devolucao: dataObjeto.toISOString(),
        data_locacao: new Date(`${data.data_locacao}T12:00:00`).toISOString(),
      })

      setLoanOpen(false);
      setBookLoan(null);

      buscarLivros();
    } catch (error: any) {
      console.error("Erro ao criar empréstimo.", error);

      if (error.response && error.response.data) {
        const mensagemServidor =
          error.response.data.message || "Erro ao realizar empréstimo.";

        const mensagemNormalizada = String(mensagemServidor).toLowerCase();

        if (
          mensagemNormalizada.includes("indisponível") ||
          mensagemNormalizada.includes("indisponivel") ||
          mensagemNormalizada.includes("estoque")
        ) {
          setLoanError("Livro indisponível para empréstimo");
          return;
        }

        setLoanError(mensagemServidor);
      } else {
        setLoanError("Erro ao realizar o empréstimo, tente novamente.");
      }
    }
  };

  // Deletes the selected book from the backend
  const deletarLivro = async () => {
    if (!livroSelecionado) return;

    try {
      await api.delete(`/livros/${livroSelecionado.id}`);

      setLivros((livrosAtuais) =>
        livrosAtuais.filter((livro) => livro.id !== livroSelecionado.id),
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
              imageUrl={categoryImageMap[livro.categoria]}
              availableQuantity={livro.quantidade_disponivel}
              onView={() => {
                setBookDetailId(livro.id);
                setIsDetailModalOpen(true);
              }}
              onBorrow={() => {
                setBookLoan(livro);
                setLoanOpen(true);
                setLoanError(null);
              }}
              onDelete={() => setLivroSelecionado(livro)}
            />
          ))}
        </div>
      </div>

      {/* MODAL DE EMPRÉSTIMO */}
      <LoanModal
        open={loanOpen}
        onOpenChange={(isOpen) => {
          setLoanOpen(isOpen);

          if (!isOpen) {
            setLoanError(null);
            setBookLoan(null);
          }
        }}
        bookTitle={livroLoan?.titulo ?? ""}
        apiError={loanError}
        onConfirm={handleConfirmarEmprestimo}
      />

      {/* MODAL DE EXCLUSÃO */}
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

      {/* MODAL DE DETALHES */}
      <BookDetailModal
        id={bookDetailId || ""}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setBookDetailId(null);
        }}
        onReturnSuccess={buscarLivros}
      />
    </div>
  );
}
