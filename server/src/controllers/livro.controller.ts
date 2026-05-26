import { Request, Response } from "express";
import { CreateBookService } from "src/services/book/createBookService";
import { DeleteBookService } from "src/services/book/deleteBookSevice";
import { AppError } from "../errors/AppError";
import { GetByIdBookService } from "src/services/book/getBookByIdService";
import { GetAllBooksService } from "src/services/book/getAllBooksService";

class LivroController {
  /**
   * Creates a new book from the request body.
   * Validates required fields and ISBN format before saving it.
   */
  create = async (request: Request, response: Response) => {
    try {
      const createBookService = new CreateBookService();
      const livro = await createBookService.execute(request.body);

      return response.status(201).send(livro);
      
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).send({message: error.message});
      }
      console.error(error);
      return response.status(500).send({message: "Erro interno ao cadastrar livro."});
    }
  }

  /**
   * Lists books using filters.
   * Supported filters: title and author.
   */  
  getAll = async (request: Request, response: Response) => {
    try {
      const getAllBooksService = new GetAllBooksService();

      const livros = await getAllBooksService.execute({
        titulo: request.query.titulo
          ? String(request.query.titulo)
          : undefined,
        categoria: request.query.categoria as Categoria | undefined,
      });

      return response.status(200).send(livros);
    } catch (error) {
      console.error(error);

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

      const getByIdService = new GetByIdBookService();
      const livro = await getByIdService.execute(id)

      return response.status(200).send(livro);
      
    } catch (error) {
      if (error instanceof AppError){
        return response.status(error.statusCode).send({message: error.message,});
      }
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

      const deleteBookService = new DeleteBookService();
      await deleteBookService.execute(id)

      return response.status(200).send({
        message: "Livro excluído com sucesso.",
      });
    } catch (error) {
      // Logs unexpected errors and returns a generic server response.
      console.error(error);
      if (error instanceof AppError) {
        return response.status(error.statusCode).send({message: error.message,});
      }

      console.error(error);
      return response.status(500).send({message: "Erro interno ao deletar o livro."});
    }
  };
}

export default LivroController;