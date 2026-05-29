import { Request, Response, NextFunction } from "express";
import { EmprestimoService } from "../services/loan/loanService";

class EmprestimoController {
  constructor(private readonly emprestimoService = new EmprestimoService()) {}

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const novoEmprestimo = await this.emprestimoService.create(request.body);

      return response.status(201).send(novoEmprestimo);
    } catch (error) {
      next(error);
    }
  };

  delete = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const result = await this.emprestimoService.delete(id);

      return response.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const emprestimos = await this.emprestimoService.getAll();

      return response.status(200).send(emprestimos);
    } catch (error) {
      next(error);
    }
  };

  getByClienteNome = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { nome } = request.query;

      const emprestimos = await this.emprestimoService.getByClienteNome(
        String(nome)
      );

      return response.status(200).send(emprestimos);
    } catch (error) {
      next(error);
    }
  };

  sendReminder = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = request.params;

      const result = await this.emprestimoService.sendReminder(id);

      return response.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  returnBook = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = request.params;

      const result = await this.emprestimoService.returnBook(id);

      return response.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}

export default new EmprestimoController();