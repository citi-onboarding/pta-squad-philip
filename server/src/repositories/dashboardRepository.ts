import prisma from "../database";

export const DashboardRepository = {
  countActiveLoans: async (): Promise<number> => {
    return prisma.emprestimo.count({
      where: {
        status: {
          in: ["Em_andamento", "Atrasado"],
        },
      },
    });
  },

  countLateLoans: async (): Promise<number> => {
    return prisma.emprestimo.count({
      where: { status: "Atrasado" },
    });
  },

  getBooksByCategory: async () => {
    return prisma.livro.groupBy({
      by: ["categoria"],
      _sum: {
        quantidade_total: true,
      },
    });
  },

  getLastLoans: async () => {
    return prisma.emprestimo.findMany({
      take: 5,
      orderBy: [
        {
          data_locacao: "desc",
        },
        {
          id: "desc",
        },
      ],
      include: {
        livro: true,
      },
    });
  },

  getTotalBooks: async () => {
    return prisma.livro.aggregate({
      _sum: {
        quantidade_total: true,
      },
    });
  },

  getLoansWithBooksForCharts: async () => {
    return prisma.emprestimo.findMany({
      select: {
        livro: {
          select: {
            titulo: true,
            categoria: true,
          },
        },
      },
    });
  },
};
