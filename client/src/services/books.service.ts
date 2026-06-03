import api from "./api";
import { Book } from "@/@types/book";
import { Loan } from "@/@types/loan";

export interface BookDetails extends Book {
  emprestimos: Loan[];
}

export interface CreateBookPayload {
  titulo: string;
  autor: string;
  isbn: string;
  editora: string;
  ano: number;
  quantidade_total: number;
  categoria: string;
}

export interface GetBookParams {
  titulo?: string;
  categoria?: string;
}

export const getBooks = async (params?: GetBookParams): Promise<Book[]> => {
  const { data } = await api.get("/livros", { params });
  return data;
};

export const getBookById = async (id: string): Promise<BookDetails> => {
    const {data} = await api.get(`/livros/${id}`)
    return data
}

export const createBook = async (payload: CreateBookPayload): Promise<Book> => {
    const { data } = await api.post('/livros', payload)
    return data
}

export const deleteBook = async (id:string): Promise<void> => {
    await api.delete(`/livros/${id}`)
}

