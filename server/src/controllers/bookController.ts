import { Request, Response, NextFunction } from "express";
import { CreateBookService } from "../services/book/createBookService";
import { DeleteBookService } from "../services/book/deleteBookService";
import { GetByIdBookService } from "../services/book/getBookByIdService";
import { GetAllBooksService } from "../services/book/getAllBooksService";

class LivroController {

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const createBookService = new CreateBookService();
      const livro = await createBookService.execute(request.body);

      return response.status(201).send(livro);
      
    } catch (error) {
        next(error);
      }
  }
 
  getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const getAllBooksService = new GetAllBooksService();

      const livros = await getAllBooksService.execute({
        titulo: request.query.titulo
          ? String(request.query.titulo)
          : undefined,

        categoria: request.query.categoria
          ? String(request.query.categoria)
          : undefined,
      });

      return response.status(200).send(livros);
    } catch (error) {
        next(error);
      }
  };

  getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const getByIdService = new GetByIdBookService();
      const livro = await getByIdService.execute(id)

      return response.status(200).send(livro);
      
    } catch (error) {
        next(error);
      }
  };

  delete = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const deleteBookService = new DeleteBookService();
      await deleteBookService.execute(id)

      return response.status(200).send({
        message: "Livro excluído com sucesso.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LivroController;