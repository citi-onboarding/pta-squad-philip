import api from "./api";

export interface DashboardLoan {
  id: string;
  nome_cliente: string;
  data_locacao: string;
  data_prevista_devolucao: string;
  status: string;
  livro: { titulo: string };
}

export interface DashboardData {
    totalLivros:number
    emprestimosAtivos: number
    livrosAtrasados: number
    livrosPorCategoria: {categoria:string; quantidade: number}[]   
    ultimosEmprestimos: DashboardLoan[]
}

export const getDashboard = async (): Promise<DashboardData> => {
    const {data} = await api.get('/dashboard')
    return data
}