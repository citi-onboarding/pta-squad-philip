import api from "./api";
import { Loan } from "@/@types/loan";

export interface CreateLoanPayload {
  livro_id: string;
  nome_cliente: string;
  email_cliente: string;
  data_locacao: string;
  data_prevista_devolucao: string;
}

export const createLoan = async (payload: CreateLoanPayload): Promise<Loan> => {
  const { data } = await api.post("/emprestimos", payload);
  return data;
};

export const sendLoanReminder = async (loanId: string): Promise<void> => {
  await api.post(`/emprestimos/${loanId}/lembrete`);
};

export const returnLoan = async (loanId: string): Promise<void> => {
  await api.put(`/emprestimos/${loanId}/devolver`);
};
