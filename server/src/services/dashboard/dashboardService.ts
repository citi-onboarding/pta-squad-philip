import { Categoria } from "../../../generated/prisma";
import { DashboardRepository } from "../../repositories/dashboardRepository";
import { DashboardDTO } from "../../dtos/dashboard/dashboardDTO";

export class GetDashboardService {
  async execute(): Promise<DashboardDTO> {
    const [
      emprestimosAtivos,
      livrosAtrasados,
      livrosPorCategoriaRaw,
      ultimosEmprestimos,
      totalLivrosAgg,
      emprestimosComLivros,
    ] = await Promise.all([
      DashboardRepository.countActiveLoans(),
      DashboardRepository.countLateLoans(),
      DashboardRepository.getBooksByCategory(),
      DashboardRepository.getLastLoans(),
      DashboardRepository.getTotalBooks(),
      DashboardRepository.getLoansWithBooksForCharts(),
    ]);

    const totalLivros = totalLivrosAgg._sum.quantidade_total ?? 0;

    const livrosPorCategoria = livrosPorCategoriaRaw.map((item) => ({
      categoria: item.categoria,
      quantidade: item._sum.quantidade_total ?? 0,
    }));

    const livrosMaisEmprestados = Object.values(
      emprestimosComLivros.reduce(
        (acc, emprestimo) => {
          const titulo = emprestimo.livro.titulo;

          acc[titulo] = {
            titulo,
            quantidade: (acc[titulo]?.quantidade ?? 0) + 1,
          };

          return acc;
        },
        {} as Record<string, { titulo: string; quantidade: number }>,
      ),
    )
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    const emprestimosPorCategoriaMap = emprestimosComLivros.reduce(
      (acc, emprestimo) => {
        const categoria = emprestimo.livro.categoria;

        acc[categoria] = {
          categoria,
          quantidade: (acc[categoria]?.quantidade ?? 0) + 1,
        };

        return acc;
      },
      {} as Record<
        Categoria,
        {
          categoria: Categoria;
          quantidade: number;
        }
      >,
    );

    const todasCategorias: Categoria[] = [
      "Romance",
      "Tecnologia",
      "Historia",
      "Ciencias",
      "Infantil",
    ];

    const emprestimosPorCategoria = todasCategorias.map((categoria) => ({
      categoria,
      quantidade: emprestimosPorCategoriaMap[categoria]?.quantidade ?? 0,
    }));

    return {
      totalLivros,
      emprestimosAtivos,
      livrosAtrasados,
      livrosPorCategoria,
      livrosMaisEmprestados,
      emprestimosPorCategoria,
      ultimosEmprestimos,
    };
  }
}
