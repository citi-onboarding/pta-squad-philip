import { enviarConfirmacaoDevolucao, enviarLembrete } from "../emailServices";
import { CreateLoanDTO } from "../../dtos/loan/createLoanDTO";
import { EmprestimoRepository } from "../../repositories/loanRepository";
import { NotFoundError } from "../../errors/notFoundError";
import { ValidationError } from "../../errors/validationError";
import { atualizarEmprestimosAtrasados } from "./loanHelpers";

export class EmprestimoService {
  async create(data: CreateLoanDTO) {
    const {
      livro_id,
      nome_cliente,
      email_cliente,
      data_locacao,
      data_prevista_devolucao,
    } = data;

    const requiredFields = [
          livro_id,
          nome_cliente,
          email_cliente,
          data_locacao,
          data_prevista_devolucao,
        ];

    if (requiredFields.some((field) => !field)) {
      throw new ValidationError("Todos os campos precisam ser preenchidos.");
    }

    const dataLocacao = new Date(data_locacao);
    const dataPrevistaDevolucao = new Date(data_prevista_devolucao);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataLocacao > dataPrevistaDevolucao) {
      throw new ValidationError("A data de locação não pode ser posterior à data prevista de devolução.");
    }

    const limiteMaximo = new Date(dataLocacao);
    limiteMaximo.setDate(limiteMaximo.getDate() + 45);

    if (dataPrevistaDevolucao > limiteMaximo) {
      throw new ValidationError("O prazo máximo de empréstimo é de 45 dias. Para períodos maiores, é necessário renovar o empréstimo.");
    }

    const livro = await EmprestimoRepository.findBookById(livro_id);

    if (!livro || livro.quantidade_disponivel <= 0) {
      throw new ValidationError("Livro não encontrado no estoque.");
    }

    await EmprestimoRepository.decreaseBookAvailability(
      livro_id,
      livro.quantidade_disponivel
    );

    return EmprestimoRepository.create({
      livro_id,
      nome_cliente,
      email_cliente,
      data_locacao: new Date(data_locacao),
      data_prevista_devolucao: new Date(data_prevista_devolucao),
    });
  }

  async delete(id: string) {
    const emprestimo = await EmprestimoRepository.getById(id);

    if (!emprestimo) {
      throw new NotFoundError("Empréstimo não encontrado.");
    }


    if (emprestimo.status === "Em_andamento" || emprestimo.status === "Atrasado") {
      await EmprestimoRepository.increaseBookAvailability(emprestimo.livro_id);
    }

    await EmprestimoRepository.delete(id);

    return { message: "Empréstimo deletado com sucesso." };
  }

  async getAll() {
    await atualizarEmprestimosAtrasados();

    return EmprestimoRepository.getAll();
  }

  async getByClienteNome(nome: string) {
    await atualizarEmprestimosAtrasados();

    return EmprestimoRepository.getByClienteNome(nome);
  }

  async sendReminder(id: string) {
    await atualizarEmprestimosAtrasados();

    const emprestimo = await EmprestimoRepository.getByIdWithBook(id);

    if (!emprestimo) {
      throw new NotFoundError("Empréstimo não encontrado.");
    }

    if (emprestimo.status !== "Atrasado") {
      throw new ValidationError(
        "Só é possível enviar lembrete para empréstimos atrasados."
      );
    }

    await enviarLembrete({
      emailCliente: emprestimo.email_cliente,
      nomeCliente: emprestimo.nome_cliente,
      tituloLivro: emprestimo.livro.titulo,
      dataPrevista: emprestimo.data_prevista_devolucao,
    });

    return { message: "Lembrete enviado com sucesso." };
  }

  async returnBook(id: string) {
    await atualizarEmprestimosAtrasados();

    const emprestimo = await EmprestimoRepository.getByIdWithBook(id);

    if (!emprestimo) {
      throw new NotFoundError("Empréstimo não encontrado.");
    }

    if (
      emprestimo.status !== "Em_andamento" &&
      emprestimo.status !== "Atrasado"
    ) {
      throw new ValidationError("Esse empréstimo não pode ser devolvido.");
    }

    const emprestimoAtualizado = await EmprestimoRepository.returnBook(
      id,
      emprestimo.livro_id
    );

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

    return {
      message: "Livro devolvido com sucesso.",
      emprestimo: emprestimoAtualizado,
    };
  }
}
