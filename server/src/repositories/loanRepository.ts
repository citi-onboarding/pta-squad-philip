import prisma from "../database";
import { Emprestimo, Livro } from "../../generated/prisma";
import { CreateLoanDTO } from "../dtos/loan/createLoanDTO";

type LoanWithLivro = Emprestimo & { livro: Livro };

type CreateLoanRepositoryData = {
  livro_id: string;
  nome_cliente: string;
  email_cliente: string;
  data_locacao: Date;
  data_prevista_devolucao: Date;
};

export const EmprestimoRepository = {
  findBookById: async (livro_id: string): Promise<Livro | null> => {
    return prisma.livro.findFirst({
      where: { id: livro_id },
    });
  },

  decreaseBookAvailability: async (
    livro_id: string,
    quantidade_disponivel: number,
  ): Promise<Livro> => {
    return prisma.livro.update({
      where: { id: livro_id },
      data: { quantidade_disponivel: quantidade_disponivel - 1 },
    });
  },

  increaseBookAvailability: async (livro_id: string): Promise<Livro> => {
    const livro = await prisma.livro.findUnique({
      where: { id: livro_id },
    });

    if (!livro) {
      throw new Error("Livro não encontrado.");
    }

    const novaQuantidade = Math.min(
      livro.quantidade_disponivel + 1,
      livro.quantidade_total,
    );

    return prisma.livro.update({
      where: { id: livro_id },
      data: { quantidade_disponivel: novaQuantidade },
    });
  },

  create: async (data: CreateLoanRepositoryData): Promise<Emprestimo> => {
    const dataLocacao = new Date(data.data_locacao);
    const agora = new Date();

    dataLocacao.setHours(
      agora.getHours(),
      agora.getMinutes(),
      agora.getSeconds(),
      agora.getMilliseconds(),
    );

    return prisma.emprestimo.create({
      data: {
        livro_id: data.livro_id,
        nome_cliente: data.nome_cliente,
        email_cliente: data.email_cliente,
        data_locacao: dataLocacao,
        data_prevista_devolucao: data.data_prevista_devolucao,
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

  getByIdWithBook: async (id: string): Promise<LoanWithLivro | null> => {
    return prisma.emprestimo.findUnique({
      where: { id },
      include: { livro: true },
    });
  },

  getByClienteNome: async (nome: string): Promise<LoanWithLivro[]> => {
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

  returnBook: async (id: string, livro_id: string): Promise<Emprestimo> => {
    const livro = await prisma.livro.findUnique({
      where: { id: livro_id },
    });

    if (!livro) {
      throw new Error("Livro não encontrado.");
    }

    const novaQuantidade = Math.min(
      livro.quantidade_disponivel + 1,
      livro.quantidade_total,
    );

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
        data: { quantidade_disponivel: novaQuantidade },
      }),
    ]);

    return emprestimoAtualizado;
  },
};
