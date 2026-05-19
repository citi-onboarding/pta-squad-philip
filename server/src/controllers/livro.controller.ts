import { Request, Response } from "express";
import prisma from "@database";
import { Citi, Crud } from "../global";

class LivroController implements Crud {
  constructor(private readonly citi = new Citi("Livro")) {}

  /**
   * Creates a new book from the request body.
   * Validates required fields and ISBN format before saving it.
   */
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

      // Checks whether any required book field was not provided.
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
      // Normalizes the ISBN by counting only numeric digits.
      const isbnDigitsLength = String(isbn).replace(/\D/g, "").length;

      if (isbnDigitsLength !== 10 && isbnDigitsLength !== 13) {
        return response.status(400).send({
          message: "O ISBN deve possuir 10 ou 13 dígitos numéricos.",
        });
      }

      // Sets the initial available quantity based on the total quantity.
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
      // Logs unexpected errors and returns a generic server response.
      console.error(error);

      return response.status(500).send({
        message: "Erro interno ao cadastrar livro.",
      });
    }
  };

  /**
   * Lists books using filters.
   * Supported filters: title and author.
   */  
    getAll = async (request: Request, response: Response) => {
        try {
          // Retrieves optional query filters from request params
          const { titulo, categoria } = request.query;
          
          // Applies category filter only when provided
          const whereCondition: any = {
            categoria: categoria ? String(categoria) : undefined,
          };

          // Applies category filter only when provided
          if (titulo) {
            whereCondition.OR = [
              { titulo: { contains: String(titulo), mode: "insensitive" } },
              { autor: { contains: String(titulo), mode: "insensitive" } },
            ];
          }

          // Returns all books matching the applied filters
          const livros = await prisma.livro.findMany({
            where: whereCondition,
          });

          return response.status(200).send(livros);
        } catch (error) {
          console.error(error);

          // Handles unexpected internal server errors
          return response.status(500).send({
            message: "Erro interno ao listar livros.",
          });
        }
      };

  /**
   * Retrieves a single book by its route parameter ID.
   * Includes the related loan history in the response.
   */
  getById = async (request: Request, response: Response) => {
    try {
      // The book ID is received through route parameters.
      const { id } = request.params;

      const livro = await prisma.livro.findFirst({
        where: { id },
        include: { emprestimos: true },
      });

      if (!livro) {
        return response.status(404).send({
          message: "Livro não encontrado.",
        });
      }

      return response.status(200).send(livro);
    } catch (error) {
      // Logs unexpected errors and returns a generic server response.
      console.error(error);

      return response.status(500).send({
        message: "Erro interno ao buscar livro.",
      });
    }
  };

  /**
   * Deletes a book using the ID received from route parameters.
   */
  delete = async (request: Request, response: Response) => {
    try {
      // The book ID is received through route parameters.
      const { id } = request.params;

      const { httpStatus, messageFromDelete } = await this.citi.deleteValue(id);

      return response.status(httpStatus).send({
        message: messageFromDelete,
      });
    } catch (error) {
      // Logs unexpected errors and returns a generic server response.
      console.error(error);

      return response.status(500).send({
        message: "Erro interno ao excluir livro.",
      });
    }
  };
}

export default LivroController;