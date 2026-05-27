import prisma from "../database";
import { Categoria } from "../../generated/prisma";
import { LivrosPorCategoriaRawDTO } from "../dtos/dashboard/dashboardDTO";

export const DashboardRepository = {
  countActiveLoans: async (): Promise<number> => {
    return prisma.emprestimo.count({
      where: { status: "Em_andamento" },
    });
  },

  countLateLoans: async (): Promise<number> => {
    return prisma.emprestimo.count({
      where: { status: "Atrasado" },
    });
  },

  getBooksByCategory: async (): Promise<LivrosPorCategoriaRawDTO[]> => {
    return prisma.livro.groupBy({
      by: ["categoria"],
      _sum: { quantidade_total: true },
    });
  },

  getLastLoans: async () => {
    return prisma.emprestimo.findMany({
      take: 5,
      orderBy: { data_locacao: "desc" },
      include: { livro: true },
    });
  },

  getTotalBooks: async () => {
    return prisma.livro.aggregate({
      _sum: { quantidade_total: true },
    });
  },
};