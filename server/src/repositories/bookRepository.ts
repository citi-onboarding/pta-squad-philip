import prisma from "../database";
import {Prisma, Categoria, Livro, Emprestimo} from "../../generated/prisma";

export const BookRepository = {
    create: async (data: Prisma.LivroCreateInput): Promise <Livro> => {
        return prisma.livro.create({data});
    },

    delete: async (id: string): Promise <Livro> => {
        return prisma.livro.delete({
            where: {id},
        });
    },

    getById: async (id: string): Promise <Livro & { emprestimos: Emprestimo[] } | null> => {
        return prisma.livro.findUnique({
            where: {id},
            include: {
                emprestimos: true,
            }
        });
    },

    getAll: async (categoria?: Categoria): Promise <Livro[]> => {
        return prisma.livro.findMany({
            where: {categoria},
        });

    }
}  