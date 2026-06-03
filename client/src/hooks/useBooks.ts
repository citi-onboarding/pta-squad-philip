import { useState, useEffect } from "react";
import { getBooks, deleteBook } from "@/services/books.service";
import { Book } from "@/@types/book";

interface UseBooksParams {
  search?: string;
  category?: string;
}
export const useBooks = ({ search, category }: UseBooksParams) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.titulo = search;
      if (category) params.categoria = category;

      const data = await getBooks(params);
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeBook = async (id: string) => {
    await deleteBook(id)
    setBooks((current) => current.filter((book) => book.id !== id))
  }

  useEffect(() => {
    fetchBooks()
  }, [search, category])

  return { books, loading, fetchBooks, removeBook }
}