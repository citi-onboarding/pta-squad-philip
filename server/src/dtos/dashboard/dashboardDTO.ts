import { Emprestimo, Livro, Categoria } from "../../../generated/prisma";

export interface LivrosPorCategoriaDTO {
  categoria: Categoria;
  quantidade: number;
}

export interface LivrosMaisEmprestadosDTO {
  titulo: string;
  quantidade: number;
}

export interface EmprestimosPorCategoriaDTO {
  categoria: Categoria;
  quantidade: number;
}

export interface UltimoEmprestimoDTO extends Emprestimo {
  livro: Livro;
}

export interface DashboardDTO {
  totalLivros: number;
  emprestimosAtivos: number;
  livrosAtrasados: number;
  livrosPorCategoria: LivrosPorCategoriaDTO[];
  livrosMaisEmprestados: LivrosMaisEmprestadosDTO[];
  emprestimosPorCategoria: EmprestimosPorCategoriaDTO[];
  ultimosEmprestimos: UltimoEmprestimoDTO[];
}

export interface LivrosPorCategoriaRawDTO {
  categoria: Categoria;
  _sum: {
    quantidade_total: number | null;
  };
}
