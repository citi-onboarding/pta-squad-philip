import { Request, Response } from "express";
import prisma from "@database";
import { Citi, Crud } from "../global";

class LivroController implements Crud {
  constructor(private readonly citi = new Citi("Livro")) {}

  create = async (request: Request, response: Response) => {
    try {
      const {
        titulo,
        autor,
        isbn,
        editora,
        ano,
        quantidade_total,
        categoria,
      } = request.body;

      // Validates required fields before creating the book
      const valuesAreUndefined = this.citi.areValuesUndefined(
        titulo,
        autor,
        isbn,
        editora,
        ano,
        quantidade_total,
        categoria
      );

      if (valuesAreUndefined) {
        return response.status(400).send({
          message: "Todos os campos são obrigatórios.",
        });
      }
      // ISBN must contain either 10 or 13 numeric digits
      const isbnDigitsLength = String(isbn).replace(/\D/g, "").length;

      if (isbnDigitsLength !== 10 && isbnDigitsLength !== 13) {
        return response.status(400).send({
          message: "O ISBN deve possuir 10 ou 13 dígitos numéricos.",
        });
      }

      const livroData = {
          titulo,
          autor,
          isbn,
          editora,
          ano,
          quantidade_total,
          quantidade_disponivel: quantidade_total,
          categoria,
      };

    const { httpStatus, message } = await this.citi.insertIntoDatabase(livroData);

      return response.status(httpStatus).send({ message });
    } catch (error) {
      // Logs unexpected server errors for debugging
      console.error(error);

      return response.status(500).send({
        message: "Erro interno ao cadastrar livro.",
      });
    }
  };

  getAll = async (request: Request, response: Response) => {
    try {
      const { titulo, autor, categoria } = request.query;

      const livros = await prisma.livro.findMany({
        // Applies filters only when query parameters are provided
        where: {
          // Performs case-insensitive search by title
          titulo: titulo
            ? { contains: String(titulo), mode: "insensitive" }
            : undefined,

          // Performs case-insensitive search by author
          autor: autor
            ? { contains: String(autor), mode: "insensitive" }
            : undefined,
          categoria: categoria ? String(categoria) : undefined,
        },
      });

      return response.status(200).send(livros);
    } catch (error) {
      console.error(error);

      return response.status(500).send({
        message: "Erro interno ao listar livros.",
      });
    }
  };

  getById = async (request: Request, response: Response) => {
    try {
      const { id } = request.params;

      const livro = await prisma.livro.findFirst({
        where: { id },
        // Includes loan history in the book details response
        include: { emprestimos: true },
      });

      if (!livro) {
        return response.status(404).send({
          message: "Livro não encontrado.",
        });
      }

      return response.status(200).send(livro);
    } catch (error) {
      console.error(error);

      return response.status(500).send({
        message: "Erro interno ao buscar livro.",
      });
    }
  };

  delete = async (request: Request, response: Response) => {
    try {
      const { id } = request.params;

      const { httpStatus, messageFromDelete } = await this.citi.deleteValue(id);

      return response.status(httpStatus).send({
        message: messageFromDelete,
      });
    } catch (error) {
      console.error(error);

      return response.status(500).send({
        message: "Erro interno ao excluir livro.",
      });
    }
  };
}

export default LivroController;