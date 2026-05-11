import { Request, Response } from "express";
import { Citi, Crud } from "../global";

/**
 * Controller responsável por gerenciar o acervo de livros.
 *
 * Aqui você vai implementar:
 * - Cadastro de novo livro (com validação de campos obrigatórios e ISBN)
 * - Listagem de livros (com filtros por título, autor e categoria)
 * - Busca de livro por ID (usado no modal de detalhes)
 * - Exclusão de livro do acervo
 * - Dados do dashboard (total de livros, livros por categoria)
 *
 * Lembre-se: não existe edição de livro (RN04).
 * Em caso de erro no cadastro, o livro deve ser excluído e cadastrado novamente.
 */
