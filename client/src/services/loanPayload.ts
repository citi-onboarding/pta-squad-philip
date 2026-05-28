import api from "./api";

export interface CreateLoanPayload {
  livro_id: string;
  nome_cliente: string;
  email_cliente: string;
  data_locacao: string;
  data_prevista_devolucao: string;
}

export async function createLoan(payload: CreateLoanPayload) {
  const response = await api.post("/emprestimos", payload);
  return response.data;
}
