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
    ] = await Promise.all([
      DashboardRepository.countActiveLoans(),
      DashboardRepository.countLateLoans(),
      DashboardRepository.getBooksByCategory(),
      DashboardRepository.getLastLoans(),
      DashboardRepository.getTotalBooks(),
    ]);

    const totalLivros = totalLivrosAgg._sum.quantidade_total ?? 0;

    const livrosPorCategoria = livrosPorCategoriaRaw.map((item) => ({
      categoria: item.categoria,
      quantidade: item._sum.quantidade_total ?? 0,
    }));

    return {
      totalLivros,
      emprestimosAtivos,
      livrosAtrasados,
      livrosPorCategoria,
      ultimosEmprestimos,
    };
  }
}