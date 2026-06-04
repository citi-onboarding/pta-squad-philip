"use client";

import { useState } from "react";
import { useBooks } from "@/hooks/useBooks";
import { createLoan } from "@/services/loans.service";
import { BookCard } from "@/components/bookCard";
import BookFilters from "@/components/bookFilters";
import { BookDetailModal } from "@/components/BookDetailModal/BookDetailModal";
import { LoanModal } from "@/components/loanModal";
import { Book } from "@/@types/book";

const capas: Record<string, string> = {
  Romance: "/Capas de Livros/Romance.png",
  Tecnologia: "/Capas de Livros/Tecnologia.png",
  História: "/Capas de Livros/Historia.png",
  Ciências: "/Capas de Livros/Ciencias.png",
  Infantil: "/Capas de Livros/Infantil.png",
};

export default function LivrosPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [bookDetailId, setBookDetailId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);
  const [loanBook, setLoanBook] = useState<Book | null>(null);
  const [loanError, setLoanError] = useState<string | null>(null);

  const { books, fetchBooks, removeBook } = useBooks({ search, category })

  const handleConfirmarEmprestimo = async (data: {
    clientName: string;
    clientEmail: string;
    expectedReturnDate: string;
    loanDate: string;
  }) => {
    if (!loanBook) return;

    try {
      setLoanError(null);

      const dataObjeto = new Date(`${data.expectedReturnDate}T12:00:00`);

      await createLoan({
        livro_id: String(loanBook.id),
        nome_cliente: data.clientName,
        email_cliente: data.clientEmail,
        data_prevista_devolucao: dataObjeto.toLocaleDateString("sv-SE"),
        data_locacao: new Date(`${data.loanDate}T12:00:00`).toISOString(),
      });

      setLoanOpen(false);
      setLoanBook(null);
      fetchBooks();
    } catch (error: any) {
      console.error("Erro ao criar empréstimo.", error);

      if (error.response?.data) {
        const mensagem = String(error.response.data.message || "Erro ao realizar empréstimo.").toLowerCase();

        if (mensagem.includes("indisponível") || mensagem.includes("indisponivel") || mensagem.includes("estoque")) {
          setLoanError("Livro indisponível para empréstimo");
          return;
        }

        setLoanError(error.response.data.message);
      } else {
        setLoanError("Erro ao realizar o empréstimo, tente novamente.");
      }
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;
    try {
      await removeBook(selectedBook.id);
      setSelectedBook(null);
      setDeleteError("");
    } catch {
      setDeleteError("Não foi possível excluir o livro. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <div className="w-full max-w-[1100px] mx-auto px-[24px] pb-4">
        <div className="pt-4">
          <h1 className="font-medium text-[24px]">Livros</h1>
          <p className="text-[#717182] text-[16px]">Gerencie o acervo da biblioteca</p>
        </div>

        <BookFilters
          search={search}
          category={category}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {books.map((book) => (
            <BookCard
              key={book.id}
              title={book.titulo}
              author={book.autor}
              category={book.categoria}
              imageUrl={capas[book.categoria]}
              availableQuantity={book.quantidade_disponivel}
              onView={() => {
                setBookDetailId(book.id);
                setIsDetailModalOpen(true);
              }}
              onBorrow={() => {
                setLoanBook(book);
                setLoanOpen(true);
                setLoanError(null);
              }}
              onDelete={() => setSelectedBook(book)}
            />
          ))}
        </div>
      </div>

      <LoanModal
        open={loanOpen}
        onOpenChange={(isOpen) => {
          setLoanOpen(isOpen);
          if (!isOpen) {
            setLoanError(null);
            setLoanBook(null);
          }
        }}
        bookTitle={loanBook?.titulo ?? ""}
        apiError={loanError}
        onConfirm={handleConfirmarEmprestimo}
      />

      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Excluir livro</h2>
            <p className="mt-2 text-sm text-[#717182]">
              Tem certeza que deseja excluir o livro{" "}
              <strong>{selectedBook.titulo}</strong>?
            </p>
            {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setSelectedBook(null); setDeleteError(""); }}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteBook}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <BookDetailModal
        id={bookDetailId || ""}
        isOpen={isDetailModalOpen}
        onClose={() => { setIsDetailModalOpen(false); setBookDetailId(null); }}
        onReturnSuccess={fetchBooks}
      />
    </div>
  );
}