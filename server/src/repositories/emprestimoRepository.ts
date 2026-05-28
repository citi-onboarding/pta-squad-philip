import prisma from "../database";
import { Emprestimo, Livro } from "../../generated/prisma";
import { CreateEmprestimoDTO } from "../dtos/loan/createEmprestimoDTO";

type EmprestimoWithLivro = Emprestimo & { livro: Livro };

export const EmprestimoRepository = {
  findBookById: async (livro_id: string): Promise<Livro | null> => {
    return prisma.livro.findFirst({
      where: { id: livro_id },
    });
  },

  decreaseBookAvailability: async (livro_id: string, quantidade_disponivel: number): Promise<Livro> => {
    return prisma.livro.update({
      where: { id: livro_id },
      data: { quantidade_disponivel: quantidade_disponivel - 1 },
    });
  },

  increaseBookAvailability: async (livro_id: string): Promise<Livro> => {
    return prisma.livro.update({
      where: { id: livro_id },
      data: { quantidade_disponivel: { increment: 1 } },
    });
  },

  create: async (data: CreateEmprestimoDTO): Promise<Emprestimo> => {
    return prisma.emprestimo.create({
      data: {
        livro_id: data.livro_id,
        nome_cliente: data.nome_cliente,
        email_cliente: data.email_cliente,
        data_locacao: new Date(data.data_locacao),
        data_prevista_devolucao: new Date(data.data_prevista_devolucao),
        status: "Em_andamento",
      },
    });
  },

  delete: async (id: string): Promise<Emprestimo> => {
    return prisma.emprestimo.delete({
      where: { id },
    });
  },

  getAll: async (): Promise<Emprestimo[]> => {
    return prisma.emprestimo.findMany();
  },

  getById: async (id: string): Promise<Emprestimo | null> => {
    return prisma.emprestimo.findUnique({
      where: { id },
    });
  },

  getByIdWithBook: async (id: string): Promise<EmprestimoWithLivro | null> => {
    return prisma.emprestimo.findUnique({
      where: { id },
      include: { livro: true },
    });
  },

  getByClienteNome: async (nome: string): Promise<EmprestimoWithLivro[]> => {
    return prisma.emprestimo.findMany({
      where: {
        nome_cliente: {
          contains: nome,
          mode: "insensitive",
        },
      },
      include: { livro: true },
    });
  },

  returnBook: async (id: string, livro_id: string): Promise<EmprestimoWithLivro> => {
    const [emprestimoAtualizado] = await prisma.$transaction([
      prisma.emprestimo.update({
        where: { id },
        data: {
          status: "Devolvido",
          data_devolucao_real: new Date(),
        },
        include: { livro: true },
      }),

      prisma.livro.update({
        where: { id: livro_id },
        data: { quantidade_disponivel: { increment: 1 } },
      }),
    ]);

    return emprestimoAtualizado;
  },
};
