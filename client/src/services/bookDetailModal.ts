import api from "./api";

export interface LoanBackend {
  id: string;
  nome_cliente: string;
  email_cliente: string;
  data_locacao: string;
  data_prevista_devolucao: string;
  status: "Em_andamento" | "Em andamento" | "Devolvido" | "Atrasado";
}

export interface BookDetails {
  titulo: string;
  autor: string;
  isbn: string;
  editora: string;
  ano: number;
  categoria: string;
  quantidade_total: number;
  quantidade_disponivel: number;
  emprestimos: LoanBackend[];
}

export async function getBookDetails(id: string): Promise<BookDetails> {
  const response = await api.get(`/livros/${id}`);
  return response.data;
}

export async function sendLoanReminder(emprestimoId: string): Promise<void> {
  await api.post(`/emprestimos/${emprestimoId}/lembrete`);
}

export async function returnBookLoan(emprestimoId: string): Promise<void> {
  await api.put(`/emprestimos/${emprestimoId}/devolver`);
}
