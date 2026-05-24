import { Request, Response } from 'express';
import prisma from '@database';

class DashboardController {
    get = async (req: Request, res: Response) => {
        try {
            const [totalLivros, emprestimosAtivos, livrosAtrasados, livrosPorCategoriaRaw, ultimosEmprestimos] = await Promise.all([
                prisma.livro.count(),
                prisma.emprestimo.count({where: {status:'Em_andamento'}}),
                prisma.emprestimo.count({where: {status: 'Atrasado'}}),
                prisma.livro.groupBy({by:['categoria'], _count:{id:true}}),
                prisma.emprestimo.findMany({
                    take: 5,
                    orderBy: {data_locacao: 'desc'},
                    include: {livro :true},
                })
            ])
            const livrosPorCategoria = livrosPorCategoriaRaw.map((item) => ({
                categoria: item.categoria,
                quantidade: item._count.id,
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