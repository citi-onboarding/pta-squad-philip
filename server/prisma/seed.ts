import { Categoria, Status } from '../generated/prisma'

import prisma from '@database'

// Helpers for calculating dates relative to the seeding stage
const daysAgo = (dias: number) => new Date(Date.now() - dias * 24 * 60 * 60 * 1000)
const daysFromNow = (dias: number) => new Date(Date.now() + dias * 24 * 60 * 60 * 1000)

async function main() {
    console.log('Iniciando seed...')

    // Cleans the database in the corect order: fist the loan, after the book
    await prisma.emprestimo.deleteMany()
    await prisma.livro.deleteMany()
    console.log('Banco limpo!')

    const [
        senhorDosAneis,
        cleanCode, 
        pequenoPrincipe, 
        sapiens, 
        historiaDoTempo,
        livroEsgotado,
        // Promise.all helps to create all these books at the same time
    ] = await Promise.all([
        // Creates a book for each category
        prisma.livro.create({
            data: {
                titulo: 'O Senhor dos Anéis',
                autor: 'J.R.R. Tolkien',
                isbn: '978-8533613379',
                editora: 'Martins Fontes',
                ano: 2001,
                quantidade_total: 5,
                quantidade_disponivel: 3,
                categoria: Categoria.Romance,
            },
        }),
        prisma.livro.create({
            data: {
                titulo: 'Clean Code',
                autor: 'Robert C. Martin',
                isbn: '978-0132350884',
                editora: 'Prentice Hall',
                ano: 2008,
                quantidade_total: 4,
                quantidade_disponivel: 2,
                categoria: Categoria.Tecnologia,
            },
        }),
        prisma.livro.create({
            data: {
                titulo: 'O Pequeno Príncipe',
                autor: 'Antoine de Saint-Exupéry',
                isbn: '978-8574068008',
                editora: 'Agir',
                ano: 2009,
                quantidade_total: 3,
                quantidade_disponivel: 3,
                categoria: Categoria.Infantil,
            },
        }),
        prisma.livro.create({
            data: {
                titulo: 'Sapiens',
                autor: 'Yuval Noah Harari',
                isbn: '978-8535922035',
                editora: 'Companhia das Letras',
                ano: 2015,
                quantidade_total: 3,
                quantidade_disponivel: 1,
                categoria: Categoria.Historia,
            },
        }),
        prisma.livro.create({
            data: {
                titulo: 'Uma Breve História do Tempo',
                autor: 'Stephen Hawking',
                isbn: '978-8580576481',
                editora: 'Intrínseca',
                ano: 2015,
                quantidade_total: 3,
                quantidade_disponivel: 2,
                categoria: Categoria.Ciencias,
            },
        }),
        prisma.livro.create({
            data: {
                titulo: 'O Poder do Hábito',
                autor: 'Charles Duhigg',
                isbn: '978-8539004119',
                editora: 'Agir',
                ano: 2012,
                quantidade_total: 2,
                quantidade_disponivel: 0, // Out of stock, no copies available
                categoria: Categoria.Tecnologia,
            },
        }),
        prisma.livro.create({
            data: {
                // When there are similar titles by the same author
                titulo: 'Clean Architecture',
                autor: 'Robert C. Martin', 
                isbn: '978-0134494166',
                editora: 'Prentice Hall',
                ano: 2017,
                quantidade_total: 3,
                quantidade_disponivel: 3,
                categoria: Categoria.Tecnologia,
            },
        }),
        prisma.livro.create({
            data: {
                // Same author, but different title names
                titulo: 'O Hobbit',
                autor: 'J.R.R. Tolkien', 
                isbn: '978-8595084742',
                editora: 'HarperCollins',
                ano: 2019,
                quantidade_total: 4,
                quantidade_disponivel: 4,
                categoria: Categoria.Romance,
            },
        }),
    ])
    console.log('Livros criados')

    await Promise.all([
        // Creates all different types of loan at the same time
        // Em andamento — in progress, on schedule and no reminders sent
        prisma.emprestimo.create({
            data: {
                livro_id: senhorDosAneis.id,
                nome_cliente: 'Carlos Silva',
                email_cliente: 'carlos@email.com',
                data_locacao: daysAgo(3),
                data_prevista_devolucao: daysFromNow(11),
                status: Status.Em_andamento,
            },
        }),
        // Em andamento - in progress, due date approaching, but preventive reminder not yet sent
        prisma.emprestimo.create({
            data: {
                livro_id: cleanCode.id,
                nome_cliente: 'Ana Souza',
                email_cliente: 'ana@email.com',
                data_locacao: daysAgo(12),
                data_prevista_devolucao: daysFromNow(1), 
                data_lembrete_preventivo_enviado: null,
                status: Status.Em_andamento,
            },
        }),
        // Em andamento - in progress, but preventive reminder was sent the day before (before the due date)
        prisma.emprestimo.create({
            data: {
                livro_id: sapiens.id,
                nome_cliente: 'Beatriz Mendes',
                email_cliente: 'beatriz@email.com',
                data_locacao: daysAgo(10),
                data_prevista_devolucao: daysFromNow(2),
                data_lembrete_preventivo_enviado: daysAgo(1),
                status: Status.Em_andamento,
            },
        }),
        // Atrasado - no late reminder sent
        prisma.emprestimo.create({
            data: {
                livro_id: historiaDoTempo.id,
                nome_cliente: 'Pedro Lima',
                email_cliente: 'pedro@email.com',
                data_locacao: daysAgo(18),
                data_prevista_devolucao: daysAgo(4), 
                data_lembrete_preventivo_enviado: daysAgo(6),
                data_ultimo_lembrete_atraso: null, 
                status: Status.Atrasado,
            },
        }),
        // Atrasado - multiple late reminder were sent
        prisma.emprestimo.create({
            data: {
                livro_id: cleanCode.id,
                nome_cliente: 'Lucas Ferreira',
                email_cliente: 'lucas@email.com',
                data_locacao: daysAgo(25),
                data_prevista_devolucao: daysAgo(11), 
                data_lembrete_preventivo_enviado: daysAgo(13),
                data_ultimo_lembrete_atraso: daysAgo(1), 
                status: Status.Atrasado,
            },
        }),
        // Devolvido - from the "Em andamento" section, returned before the deadline
        prisma.emprestimo.create({
            data: {
                livro_id: pequenoPrincipe.id,
                nome_cliente: 'Mariana Costa',
                email_cliente: 'mariana@email.com',
                data_locacao: daysAgo(10),
                data_prevista_devolucao: daysAgo(1),
                data_devolucao_real: daysAgo(3), 
                status: Status.Devolvido,
            },
        }),
        // Devolvido - returned exactly at the deadline
        prisma.emprestimo.create({
            data: {
                livro_id: historiaDoTempo.id,
                nome_cliente: 'Roberto Alves',
                email_cliente: 'roberto@email.com',
                data_locacao: daysAgo(14),
                data_prevista_devolucao: daysAgo(0), 
                data_devolucao_real: daysAgo(0),     
                status: Status.Devolvido,
            },
        }),
        // Devolvido - returned after the deadline
        prisma.emprestimo.create({
            data: {
                livro_id: sapiens.id,
                nome_cliente: 'Fernanda Oliveira',
                email_cliente: 'fernanda@email.com',
                data_locacao: daysAgo(20),
                data_prevista_devolucao: daysAgo(6),
                data_devolucao_real: daysAgo(1), 
                data_lembrete_preventivo_enviado: daysAgo(8),
                data_ultimo_lembrete_atraso: daysAgo(3),
                status: Status.Devolvido,
            },
        }),
        // Same client, different loans scenario
        prisma.emprestimo.create({
            data: {
                livro_id: pequenoPrincipe.id,
                nome_cliente: 'Carlos Silva', // same client as scenario 1
                email_cliente: 'carlos@email.com',
                data_locacao: daysAgo(30),
                data_prevista_devolucao: daysAgo(16),
                data_devolucao_real: daysAgo(17),
                status: Status.Devolvido,
            },
        }),
        prisma.emprestimo.create({
            data: {
                livro_id: sapiens.id,
                nome_cliente: 'Carlos Silva', 
                email_cliente: 'carlos@email.com',
                data_locacao: daysAgo(60),
                data_prevista_devolucao: daysAgo(46),
                data_devolucao_real: daysAgo(48),
                status: Status.Devolvido,
            },
        }),
        // Same book borrowed at different times scenario
        prisma.emprestimo.create({
            data: {
                livro_id: senhorDosAneis.id, // same book as scenario 1
                nome_cliente: 'Juliana Ramos',
                email_cliente: 'juliana@email.com',
                data_locacao: daysAgo(40),
                data_prevista_devolucao: daysAgo(26),
                data_devolucao_real: daysAgo(27),
                status: Status.Devolvido,
            },
        }),
        prisma.emprestimo.create({
            data: {
                livro_id: senhorDosAneis.id, 
                nome_cliente: 'Thiago Nascimento',
                email_cliente: 'thiago@email.com',
                data_locacao: daysAgo(70),
                data_prevista_devolucao: daysAgo(56),
                data_devolucao_real: daysAgo(54),
                status: Status.Devolvido,
            },
        }),
    ])
    console.log('Empréstimos criados')
    console.log('Seed concluído! Cenários cobertos:')
    console.log('Livro esgotado')
    console.log('Em andamento — sem lembrete')
    console.log('Em andamento — próximo da data de vencimento, lembrete preventivo pendente')
    console.log('Em andamento — lembrete preventivo já enviado')
    console.log('Atrasado — sem lembrete de atraso')
    console.log('Atrasado — múltiplos lembretes enviados')
    console.log('Devolvido — antes do prazo')
    console.log('Devolvido — no prazo exato')
    console.log('Devolvido — após o prazo')
    console.log('Mesmo cliente com múltiplos empréstimos')
    console.log('Mesmo livro emprestado em momentos diferentes')
    console.log('Títulos similares do mesmo autor')
    console.log('Mesmo autor, títulos distintos')
    console.log('Filtro por categoria')
}
 
main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
 