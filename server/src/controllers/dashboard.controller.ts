import { Request, Response } from 'express';
import prisma from '@database';

class DashboardController {
    get = async (req: Request, res: Response) => {
        try {
            const [emprestimosAtivos, livrosAtrasados, livrosPorCategoriaRaw, ultimosEmprestimos] = await Promise.all([
                prisma.emprestimo.count({where: {status:'Em_andamento'}}),
                prisma.emprestimo.count({where: {status: 'Atrasado'}}),
                prisma.livro.groupBy({by:['categoria'], _sum:{quantidade_total:true}}),
                prisma.emprestimo.findMany({
                    take: 5,
                    orderBy: {data_locacao: 'desc'},
                    include: {livro :true},
                })
            ])
            const totalLivrosAgg = await prisma.livro.aggregate({_sum: {quantidade_total:true}})
            const totalLivros = totalLivrosAgg._sum.quantidade_total ?? 0

            const livrosPorCategoria = livrosPorCategoriaRaw.map((item) => ({
                categoria: item.categoria,
                quantidade: item._sum.quantidade_total ?? 0,
            }))
            return res.status(200).json({
                totalLivros,
                emprestimosAtivos,
                livrosAtrasados,
                livrosPorCategoria,
                ultimosEmprestimos
            });
        }
        catch (error){
            console.log(error);
            return res.status(500).json({message: 'Erro ao obter dados do dashboard', error})
        }
    }
}

export default DashboardController;