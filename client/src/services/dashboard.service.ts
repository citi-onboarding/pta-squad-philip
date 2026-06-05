import api from "./api";

export interface DashboardLoan {
  id: string;
  nome_cliente: string;
  data_locacao: string;
  data_prevista_devolucao: string;
  status: string;
  livro: {
    titulo: string;
  };
}

export interface BooksByCategory {
  categoria: string;
  quantidade: number;
}

export interface MostBorrowedBook {
  titulo: string;
  quantidade: number;
}

export interface LoansByCategory {
  categoria: string;
  quantidade: number;
}

export interface DashboardData {
  totalLivros: number;
  emprestimosAtivos: number;
  livrosAtrasados: number;
  livrosPorCategoria: BooksByCategory[];
  livrosMaisEmprestados: MostBorrowedBook[];
  emprestimosPorCategoria: LoansByCategory[];
  ultimosEmprestimos: DashboardLoan[];
}

export const getDashboard = async (): Promise<DashboardData> => {
  const { data } = await api.get("/dashboard");

  return data;
};
