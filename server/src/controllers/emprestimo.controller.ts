import { Request, Response } from "express";
import { Citi, Crud } from "../global";
import prisma from "@database";
import {
  enviarConfirmacaoDevolucao,
  enviarLembrete,
} from "../services/email.services";
import { atualizarEmprestimosAtrasados } from "src/services/emprestimo.service";

class EmprestimoController implements Crud {
  constructor(private readonly citi = new Citi("Emprestimo")) {}

  /**
   * Creates a new book loan record from the request body.
   * Validates required fields, checks book availability, and updates the stock.
   */

  /**
   * Swapped the order from async create to create = async to guarantee "this" scope
   * and avoid silent bugs.
   */
  create = async (request: Request, response: Response) => {
    // Added try/catch block to isolate errors and prevent the server from crashing.
    try {
      const {
        livro_id,
        nome_cliente,
        email_cliente,
        data_locacao,
        data_prevista_devolucao,
      } = request.body;

      // Checks whether any required loan field was not provided.
      const isAnyFieldUndefined = this.citi.areValuesUndefined(
        livro_id,
        nome_cliente,
        email_cliente,
        data_locacao,
        data_prevista_devolucao,
      );

      if (isAnyFieldUndefined) {
        return response
          .status(400)
          .send({ message: "Todos os campos precisam ser preenchidos." });
      }

      // Verifies if the book exists and has available stock.
      const livro = await prisma.livro.findFirst({
        where: { id: livro_id },
      });

      if (!livro || livro.quantidade_disponivel <= 0) {
        return response
          .status(400)
          .send({ message: "Livro não encontrado no estoque." });
      }

      // Decrements the available stock count of the borrowed book by 1.
      await prisma.livro.update({
        where: { id: livro_id },
        data: { quantidade_disponivel: livro.quantidade_disponivel - 1 },
      });

      // Saves the new loan record into the database with initial active status.
      // Now uses prisma for strong typing.
      const novoEmprestimo = await prisma.emprestimo.create({
        data: {
          livro_id,
          nome_cliente,
          email_cliente,
          data_locacao: new Date(data_locacao),
          data_prevista_devolucao: new Date(data_prevista_devolucao),
          status: "Em_andamento",
        },
      });

      return response.status(201).send(novoEmprestimo);
    } catch (error) {
      // Logs unexpected errors and returns a generic server response.
      console.error(error);

      return response.status(500).send({
        message: "Erro interno ao criar empréstimo.",
      });
    }
  };

  /**
   * Processes a book return or loan removal using the ID received from route parameters.
   * Restores the book stock availability count by incrementing it by 1.
   */
  // Swapped the order just like in 'create'.
  delete = async (request: Request, response: Response) => {
    try {
      const { id } = request.params;

      // Finds the target loan record to check its existence and linked book.
      const emprestimo = await prisma.emprestimo.findUnique({
        where: { id },
      });

      if (!emprestimo) {
        return response
          .status(404)
          .send({ message: "Empréstimo não encontrado." });
      }

      // Increments the available stock count of the returned book by 1.
      await prisma.livro.update({
        where: { id: emprestimo.livro_id },
        data: { quantidade_disponivel: { increment: 1 } },
      });

      // Removes the loan record from the database.
      await this.citi.deleteValue(id);

      return response
        .status(200)
        .send({ message: "Empréstimo deletado com sucesso." });
    } catch (error) {
      console.error(error);

      return response.status(500).send({
        message: "Erro interno ao deletar empréstimo.",
      });
    }
  };

  /**
   * Lists all loans and calculates their real-time delay status.
   */
  // Swapped the order just like in 'create' and 'delete'.
  getAll = async (request: Request, response: Response) => {
    try {
      // Updates overdue loans before returning loan records.
      await atualizarEmprestimosAtrasados();

      const emprestimos = await prisma.emprestimo.findMany();

      return response.status(200).send(emprestimos);
    } catch (error) {
      console.error(error);

      return response.status(500).send({
        message: "Erro interno ao listar empréstimos.",
      });
    }
  };

  /**
   * Retrieves loan records filtered by the client's name.
   * Includes the related book model details in the response.
   */
  // Swapped the order like 'create', 'delete' and 'getAll'.
  getByClienteNome = async (request: Request, response: Response) => {
    // Added try/catch block to isolate errors and prevent the server from crashing.
    try {
      const { nome } = request.query;

      // Updates overdue loans before searching by client name.
      await atualizarEmprestimosAtrasados();

      const emprestimos = await prisma.emprestimo.findMany({
        where: {
          nome_cliente: {
            contains: String(nome),
            mode: "insensitive",
          },
        },
        include: { livro: true },
      });

      return response.status(200).send(emprestimos);
    } catch (error) {
      // Catch block handling to print the error trace and respond with a generic 500 code.
      console.error(error);

      return response.status(500).send({
        message: "Erro interno ao buscar.",
      });
    }
  };

  // Sends a manual reminder only for loans already marked as overdue.
  sendReminder = async (request: Request, response: Response) => {
    try {
      const { id } = request.params;

      // Updates overdue loans before validating whether the reminder can be sent.
      await atualizarEmprestimosAtrasados();

      const emprestimo = await prisma.emprestimo.findUnique({
        where: { id },
        include: { livro: true },
      });

      if (!emprestimo) {
        return response
          .status(404)
          .send({ message: "Empréstimo não encontrado." });
      }

      // Business rule: reminders can only be sent for overdue loans.
      if (emprestimo.status !== "Atrasado") {
        return response.status(400).send({
          message: "Só é possível enviar lembrete para empréstimos atrasados.",
        });
      }

      await enviarLembrete({
        emailCliente: emprestimo.email_cliente,
        nomeCliente: emprestimo.nome_cliente,
        tituloLivro: emprestimo.livro.titulo,
        dataPrevista: emprestimo.data_prevista_devolucao,
      });

      return response
        .status(200)
        .send({ message: "Lembrete enviado com sucesso." });
    } catch (error) {
      console.error("Erro real ao enviar lembrete:", error);

      return response
        .status(500)
        .send({ message: "Erro ao enviar lembrete de devolução." });
    }
  };

  // Handles the book return flow and restores the book availability.
  returnBook = async (request: Request, response: Response) => {
    try {
      const { id } = request.params;

      // Updates overdue loans before validating whether the loan can be returned.
      await atualizarEmprestimosAtrasados();

      const emprestimo = await prisma.emprestimo.findUnique({
        where: { id },
        include: { livro: true },
      });

      if (!emprestimo) {
        return response
          .status(404)
          .send({ message: "Empréstimo não encontrado." });
      }

      // Business rule: only active or overdue loans can be returned.
      if (
        emprestimo.status !== "Em_andamento" &&
        emprestimo.status !== "Atrasado"
      ) {
        return response
          .status(400)
          .send({ message: "Esse empréstimo não pode ser devolvido." });
      }

      // Business rule: returning a book must update the loan status and restore book stock together.
      const [emprestimoAtualizado] = await prisma.$transaction([
        prisma.emprestimo.update({
          where: { id },
          data: {
            status: "Devolvido",
            data_devolucao_real: new Date(),
          },
          include: { livro: true },
        }),

        prisma.livro.update({
          where: { id: emprestimo.livro_id },
          data: { quantidade_disponivel: { increment: 1 } },
        }),
      ]);

      try {
        await enviarConfirmacaoDevolucao({
          emailCliente: emprestimo.email_cliente,
          nomeCliente: emprestimo.nome_cliente,
          tituloLivro: emprestimo.livro.titulo,
        });
      } catch (error) {
        // Side effect: email failure should not rollback a successful book return.
        console.error("Erro ao enviar confirmação de devolução:", error);
      }

      return response.status(200).send({
        message: "Livro devolvido com sucesso.",
        emprestimo: emprestimoAtualizado,
      });
    } catch (error) {
      console.error("Erro real ao devolver livro:", error);

      return response.status(500).send({
        message: "Erro ao devolver livro.",
      });
    }
  };
}

export default new EmprestimoController();
