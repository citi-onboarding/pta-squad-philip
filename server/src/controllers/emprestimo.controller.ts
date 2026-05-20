import { Request, Response } from "express";
import { Citi, Crud } from "../global";
import prisma from "@database";

class EmprestimoController implements Crud {
  constructor(private readonly citi = new Citi("Emprestimo")) {}

/**
   * Creates a new book loan record from the request body.
   * Validates required fields, checks book availability, and updates the stock.
   */

/**  Swapped the order from async create to create = async to guarantee "this" scope
 *   and avoid silent bugs.
 */
create = async (request: Request, response: Response) => {
  // Added try/catch block to isolate errors and prevent the server from crashing
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
      data_prevista_devolucao
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

    // Decrements the available stock count of the borrowed book by 1
    await prisma.livro.update({
      where: { id: livro_id },
      data: { quantidade_disponivel: livro.quantidade_disponivel - 1 },
    });

    // Saves the new loan record into the database with initial active status.
    // Now uses prisma for strong typing
    const novoEmprestimo = await prisma.emprestimo.create({
      data: {
        livro_id,
        nome_cliente,
        email_cliente,
        data_locacao: new Date(data_locacao), // Strings into new Date () so the database reads them formatted as actual date types.
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
// Swapped the order just like in 'create'
delete = async (request: Request, response: Response) => {
    const { id } = request.params;

    // Finds the target loan record to check its existence and linked book.
    const emprestimo = await prisma.emprestimo.findUnique({
      where: { id }
    });

    if ( !emprestimo ) {
        return response.status(404).send({message: "Empréstimo não encontrado." })
    }

    // Increments the available stock count of the returned book by 1.
    await prisma.livro.update({
      where: { id: emprestimo.livro_id },
      data: { quantidade_disponivel: { increment: 1 } }
    });

    // Removes the loan record from the database.
    await this.citi.deleteValue(id);

    return response.status(200).send({message: "Empréstimo deletado com sucesso." })

}

/**
   * Lists all loans and calculates their real-time delay status.
   */
// Swapped the order just like in 'create' and 'delete'
getAll = async (request: Request, response: Response) => {

    // Retrieves all records from the loan table.
    const emprestimos = await prisma.emprestimo.findMany();

    const hoje = new Date();

    // Updates the status to "Atrasado" if the current date is past the expected return deadline.
    const emprestimosAtualizados = emprestimos.map(emp => ({
      ...emp,
      status: emp.status !== "Devolvido" && hoje > new Date(emp.data_prevista_devolucao)
        ? "Atrasado"
        : emp.status
    }));

    return response.status(200).send(emprestimosAtualizados)

}

/**
   * Retrieves loan records filtered by the client's name.
   * Includes the related book model details in the response.
   */
// Swapped the order like 'create', 'delete' and 'getAll' 
getByClienteNome = async (request: Request, response: Response) => {
  // Added try/catch block to isolate errors and prevent the server from crashing
    try {
      const { nome } = request.query;

      const emprestimos = await prisma.emprestimo.findMany({
        where: {
          nome_cliente: {
            contains: String(nome),
            mode: "insensitive",
          },
        },
        include: { livro: true },
      });

      // Captures the exact moment/date when the search request happens.
      const hoje = new Date();

      /** Maps through the results to update and refresh loan statuses in real-time 
       * whenever someone looks up a client.
      */
      const emprestimosAtualizados = emprestimos.map((emp) => ({
        ...emp,
        status:
          emp.status !== "Devolvido" && hoje > new Date(emp.data_prevista_devolucao)
            ? "Atrasado"
            : emp.status,
      }));

      return response.status(200).send(emprestimosAtualizados);
    } catch (error) {
      // Catch block handling to print the error trace and respond with a generic 500 code.
      console.error(error);
      return response.status(500).send({ message: "Erro interno ao buscar." });
    }
  };

}

export default new EmprestimoController();